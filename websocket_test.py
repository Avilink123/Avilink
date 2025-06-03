#!/usr/bin/env python3
import requests
import json
import uuid
import time
from datetime import datetime, timedelta
import random
import os
import asyncio
import websockets
import threading
import sys

# Get the backend URL from the frontend .env file
try:
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                BACKEND_URL = line.strip().split('=')[1].strip('"\'')
                break
except Exception as e:
    print(f"Error reading frontend/.env: {e}")
    BACKEND_URL = "https://9f78ae1e-177b-417a-aef1-b4a3354bc0b7.preview.emergentagent.com"

API_URL = f"{BACKEND_URL}/api"
WS_URL = f"wss://{BACKEND_URL.replace('https://', '')}/ws"

print(f"Testing WebSocket and real-time messaging at: {API_URL}")
print(f"WebSocket URL: {WS_URL}")

# Test results
test_results = {
    "success": 0,
    "failure": 0,
    "tests": []
}

def log_test(name, success, message, response=None):
    """Log test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {name}: {message}")
    
    response_data = None
    if response:
        try:
            if isinstance(response, requests.Response):
                response_data = response.json()
            else:
                response_data = response
        except:
            if isinstance(response, requests.Response):
                response_data = response.text[:100] + "..." if len(response.text) > 100 else response.text
            else:
                response_data = str(response)
    
    test_results["tests"].append({
        "name": name,
        "success": success,
        "message": message,
        "response": response_data,
        "status_code": response.status_code if isinstance(response, requests.Response) else None
    })
    
    if success:
        test_results["success"] += 1
    else:
        test_results["failure"] += 1

# Create test users for different roles
def create_test_users():
    roles = ["aviculteur", "acheteur", "fournisseur"]
    test_users = {}
    
    for role in roles:
        try:
            # Generate unique phone number to avoid conflicts
            phone = f"7{random.randint(1000000, 9999999)}"
            user_data = {
                "nom": f"Test {role.capitalize()}",
                "telephone": phone,
                "role": role,
                "localisation": "Test Location",
                "password": "testpassword123",
                "use_sms": False
            }
            
            response = requests.post(f"{API_URL}/users/register", json=user_data)
            
            if response.status_code == 200 and "id" in response.json():
                log_test(f"User Registration - {role}", True, f"Successfully registered {role}", response)
                
                # Login to get token
                login_data = {
                    "telephone": phone,
                    "password": "testpassword123",
                    "use_sms": False
                }
                
                login_response = requests.post(f"{API_URL}/users/login", json=login_data)
                
                if login_response.status_code == 200 and "token" in login_response.json():
                    log_test(f"User Login - {role}", True, f"Successfully logged in as {role}", login_response)
                    test_users[role] = login_response.json()
                else:
                    log_test(f"User Login - {role}", False, f"Failed to log in as {role}", login_response)
            else:
                log_test(f"User Registration - {role}", False, f"Failed to register {role}", response)
        except Exception as e:
            log_test(f"User Registration - {role}", False, f"Error registering {role}: {str(e)}")
    
    return test_users

# Test creating a conversation between users
def test_create_conversation(sender, recipient):
    try:
        conversation_data = {
            "participant_id": recipient["user"]["id"],
            "initial_message": "Hello, this is a test message for WebSocket testing!"
        }
        
        response = requests.post(f"{API_URL}/conversations?sender_id={sender['token']}", json=conversation_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test("Create Conversation", True, "Successfully created conversation", response)
            return response.json()
        else:
            log_test("Create Conversation", False, "Failed to create conversation", response)
            return None
    except Exception as e:
        log_test("Create Conversation", False, f"Error creating conversation: {str(e)}")
        return None

# Test sending a message
def test_send_message(sender, recipient, conversation_id):
    try:
        message_data = {
            "conversation_id": conversation_id,
            "recipient_id": recipient["user"]["id"],
            "content": f"Test message sent at {datetime.utcnow().isoformat()}"
        }
        
        response = requests.post(f"{API_URL}/messages?sender_id={sender['token']}", json=message_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test("Send Message", True, "Successfully sent message", response)
            return response.json()
        else:
            log_test("Send Message", False, "Failed to send message", response)
            return None
    except Exception as e:
        log_test("Send Message", False, f"Error sending message: {str(e)}")
        return None

# Test retrieving messages from a conversation
def test_get_messages(user, conversation_id):
    try:
        response = requests.get(f"{API_URL}/conversations/{conversation_id}/messages?user_id={user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            log_test("Get Messages", True, f"Successfully retrieved {len(response.json())} messages", response)
            return response.json()
        else:
            log_test("Get Messages", False, "Failed to retrieve messages", response)
            return None
    except Exception as e:
        log_test("Get Messages", False, f"Error retrieving messages: {str(e)}")
        return None

# Test marking messages as read
def test_mark_messages_read(user, conversation_id):
    try:
        response = requests.post(f"{API_URL}/conversations/{conversation_id}/mark-read?user_id={user['token']}")
        
        if response.status_code == 200 and "message" in response.json():
            log_test("Mark Messages Read", True, "Successfully marked messages as read", response)
            return True
        else:
            log_test("Mark Messages Read", False, "Failed to mark messages as read", response)
            return False
    except Exception as e:
        log_test("Mark Messages Read", False, f"Error marking messages as read: {str(e)}")
        return False

# Test user presence
def test_user_presence(user_id):
    try:
        response = requests.get(f"{API_URL}/users/{user_id}/presence")
        
        if response.status_code == 200 and "user_id" in response.json():
            log_test("User Presence", True, f"Successfully retrieved presence for user {user_id}", response)
            return response.json()
        else:
            log_test("User Presence", False, f"Failed to retrieve presence for user {user_id}", response)
            return None
    except Exception as e:
        log_test("User Presence", False, f"Error retrieving presence for user {user_id}: {str(e)}")
        return None

# Test getting online users
def test_online_users():
    try:
        response = requests.get(f"{API_URL}/users/online")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            log_test("Online Users", True, f"Successfully retrieved {len(response.json())} online users", response)
            return response.json()
        else:
            log_test("Online Users", False, "Failed to retrieve online users", response)
            return None
    except Exception as e:
        log_test("Online Users", False, f"Error retrieving online users: {str(e)}")
        return None

# Test WebSocket connection
async def test_websocket_connection(user_id):
    try:
        uri = f"{WS_URL}/{user_id}"
        print(f"Connecting to WebSocket at {uri}")
        
        async with websockets.connect(uri, ping_interval=None, ping_timeout=None) as websocket:
            log_test("WebSocket Connection", True, f"Successfully connected to WebSocket for user {user_id}")
            
            # Send a ping message
            ping_message = json.dumps({"type": "ping"})
            await websocket.send(ping_message)
            print(f"Sent ping message: {ping_message}")
            
            # Wait for pong response
            response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
            response_data = json.loads(response)
            print(f"Received response: {response_data}")
            
            if response_data.get("type") == "pong":
                log_test("WebSocket Ping/Pong", True, "Successfully received pong response", response_data)
            else:
                log_test("WebSocket Ping/Pong", False, f"Unexpected response to ping: {response}", response_data)
            
            # Send a typing indicator
            typing_message = json.dumps({
                "type": "typing",
                "conversation_id": "test_conversation",
                "is_typing": True
            })
            await websocket.send(typing_message)
            print(f"Sent typing indicator: {typing_message}")
            log_test("WebSocket Typing Indicator", True, "Successfully sent typing indicator")
            
            # Keep connection open for a bit to receive any messages
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                print(f"Received message: {response}")
                log_test("WebSocket Received Message", True, f"Received message: {response}", json.loads(response))
            except asyncio.TimeoutError:
                print("No messages received within timeout period")
            
            return True
    except Exception as e:
        log_test("WebSocket Connection", False, f"Error in WebSocket connection: {str(e)}")
        print(f"WebSocket connection error: {str(e)}")
        return False

# Test real-time message delivery
async def test_realtime_messaging(sender, recipient):
    # First create a conversation
    conversation = test_create_conversation(sender, recipient)
    if not conversation:
        return False
    
    # Set up WebSocket listener for recipient
    recipient_ws_task = asyncio.create_task(
        listen_for_messages(recipient["user"]["id"], conversation["id"])
    )
    
    # Wait a moment for the connection to establish
    await asyncio.sleep(2)
    
    # Send a message
    message = test_send_message(sender, recipient, conversation["id"])
    if not message:
        recipient_ws_task.cancel()
        return False
    
    # Wait for the message to be delivered
    try:
        await asyncio.wait_for(recipient_ws_task, timeout=10.0)
    except asyncio.TimeoutError:
        log_test("Real-time Message Delivery", False, "Timed out waiting for message delivery")
        return False
    except Exception as e:
        log_test("Real-time Message Delivery", False, f"Error in real-time message test: {str(e)}")
        return False
    
    return True

async def listen_for_messages(user_id, conversation_id):
    try:
        uri = f"{WS_URL}/{user_id}"
        async with websockets.connect(uri, ping_interval=None, ping_timeout=None) as websocket:
            print(f"Listening for messages on WebSocket for user {user_id}")
            
            while True:
                response = await websocket.recv()
                print(f"Received WebSocket message: {response}")
                data = json.loads(response)
                
                if data.get("type") == "new_message" and data.get("conversation_id") == conversation_id:
                    log_test("Real-time Message Delivery", True, "Successfully received real-time message", data)
                    return True
    except Exception as e:
        log_test("WebSocket Message Listener", False, f"Error in WebSocket listener: {str(e)}")
        raise

# Test order integration with messaging
def test_order_integration(buyer, seller):
    # Create a product for the seller
    try:
        product_data = {
            "titre": "Test Product for Order Integration",
            "description": "Test product for order integration with messaging",
            "type_produit": "volaille_vivante",
            "prix": 1000,
            "unite": "pièce",
            "quantite_disponible": 10,
            "localisation": "Test Location",
            "race_volaille": "Test Race",
            "age_semaines": 10,
            "poids_moyen": 2.5
        }
        
        response = requests.post(f"{API_URL}/products?vendeur_id={seller['token']}", json=product_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test("Create Product for Order", True, "Successfully created product for order", response)
            product = response.json()
        else:
            log_test("Create Product for Order", False, "Failed to create product for order", response)
            return False
    except Exception as e:
        log_test("Create Product for Order", False, f"Error creating product for order: {str(e)}")
        return False
    
    # Create an order
    try:
        order_data = {
            "product_id": product["id"],
            "quantity_requested": 2,
            "message_from_buyer": "Test order for messaging integration"
        }
        
        response = requests.post(f"{API_URL}/orders?buyer_id={buyer['token']}", json=order_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test("Create Order", True, "Successfully created order", response)
            order = response.json()
        else:
            log_test("Create Order", False, "Failed to create order", response)
            return False
    except Exception as e:
        log_test("Create Order", False, f"Error creating order: {str(e)}")
        return False
    
    # Check seller notifications
    try:
        response = requests.get(f"{API_URL}/notifications?user_id={seller['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            notification = next((n for n in response.json() if n.get("type") == "new_order"), None)
            if notification:
                log_test("Order Notification", True, "Seller received notification about new order", notification)
            else:
                log_test("Order Notification", False, "Seller did not receive notification about new order", response)
                return False
        else:
            log_test("Order Notification", False, "Failed to retrieve seller notifications", response)
            return False
    except Exception as e:
        log_test("Order Notification", False, f"Error retrieving seller notifications: {str(e)}")
        return False
    
    # Accept the order
    try:
        update_data = {
            "status": "accepted",
            "response_message": "Order accepted for testing"
        }
        
        response = requests.put(f"{API_URL}/orders/{order['id']}?user_id={seller['token']}", json=update_data)
        
        if response.status_code == 200 and "id" in response.json() and response.json()["status"] == "accepted":
            log_test("Accept Order", True, "Successfully accepted order", response)
        else:
            log_test("Accept Order", False, "Failed to accept order", response)
            return False
    except Exception as e:
        log_test("Accept Order", False, f"Error accepting order: {str(e)}")
        return False
    
    # Wait for the system to create conversation and notifications
    time.sleep(2)
    
    # Check buyer notifications
    try:
        response = requests.get(f"{API_URL}/notifications?user_id={buyer['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            notification = next((n for n in response.json() if n.get("type") == "order_status_update"), None)
            if notification:
                log_test("Order Status Notification", True, "Buyer received notification about order acceptance", notification)
            else:
                log_test("Order Status Notification", False, "Buyer did not receive notification about order acceptance", response)
                return False
        else:
            log_test("Order Status Notification", False, "Failed to retrieve buyer notifications", response)
            return False
    except Exception as e:
        log_test("Order Status Notification", False, f"Error retrieving buyer notifications: {str(e)}")
        return False
    
    # Check if conversation was created
    try:
        response = requests.get(f"{API_URL}/conversations?user_id={buyer['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            conversations = response.json()
            
            # Check if there's a conversation with the seller
            seller_conversations = [
                conv for conv in conversations 
                if seller['user']['id'] in conv['participants']
            ]
            
            if seller_conversations:
                log_test("Automatic Conversation Creation", True, "Conversation was automatically created after order acceptance", seller_conversations[0])
                
                # Check if there's an initial message
                conversation_id = seller_conversations[0]["id"]
                messages_response = requests.get(f"{API_URL}/conversations/{conversation_id}/messages?user_id={buyer['token']}")
                
                if messages_response.status_code == 200 and isinstance(messages_response.json(), list) and len(messages_response.json()) > 0:
                    log_test("Automatic Initial Message", True, "Initial message was automatically sent", messages_response.json()[0])
                else:
                    log_test("Automatic Initial Message", False, "No initial message was sent", messages_response)
                    return False
            else:
                log_test("Automatic Conversation Creation", False, "No conversation was created with the seller", conversations)
                return False
        else:
            log_test("Automatic Conversation Creation", False, "Failed to retrieve conversations", response)
            return False
    except Exception as e:
        log_test("Automatic Conversation Creation", False, f"Error checking conversation creation: {str(e)}")
        return False
    
    return True

# Main test function
async def run_tests():
    print("\n===== TESTING AVIMARCHÉ MALI REAL-TIME MESSAGING AND WEBSOCKET =====\n")
    
    # Create test users
    test_users = create_test_users()
    if not test_users or len(test_users) < 2:
        print("\n❌ Failed to create enough test users. Stopping tests.")
        return
    
    # Get users for different roles
    aviculteur = test_users.get("aviculteur")
    acheteur = test_users.get("acheteur")
    fournisseur = test_users.get("fournisseur")
    
    if not aviculteur or not acheteur:
        print("\n❌ Missing required user roles (aviculteur and acheteur). Stopping tests.")
        return
    
    # Test WebSocket connection
    try:
        websocket_success = await test_websocket_connection(aviculteur["user"]["id"])
        if not websocket_success:
            print("\n⚠️ WebSocket connection test failed. Some real-time features may not work.")
    except Exception as e:
        print(f"\n⚠️ WebSocket connection test failed with error: {str(e)}")
        log_test("WebSocket Connection", False, f"Error in WebSocket connection test: {str(e)}")
    
    # Test messaging API
    print("\n----- Testing Messaging API -----")
    
    # Test conversation between aviculteur and acheteur
    conversation = test_create_conversation(aviculteur, acheteur)
    if conversation:
        # Test sending messages
        message = test_send_message(aviculteur, acheteur, conversation["id"])
        if message:
            # Test retrieving messages
            messages = test_get_messages(acheteur, conversation["id"])
            if messages:
                # Test marking messages as read
                test_mark_messages_read(acheteur, conversation["id"])
    
    # Test user presence
    print("\n----- Testing User Presence -----")
    test_user_presence(aviculteur["user"]["id"])
    test_online_users()
    
    # Test real-time messaging
    print("\n----- Testing Real-time Messaging -----")
    try:
        await test_realtime_messaging(acheteur, aviculteur)
    except Exception as e:
        print(f"\n⚠️ Real-time messaging test failed with error: {str(e)}")
        log_test("Real-time Messaging", False, f"Error in real-time messaging test: {str(e)}")
    
    # Test order integration with messaging
    print("\n----- Testing Order Integration with Messaging -----")
    order_integration_success = test_order_integration(acheteur, aviculteur)
    
    # Test role access to messaging
    print("\n----- Testing Role Access to Messaging -----")
    
    # Test AVICULTEUR to FOURNISSEUR messaging
    if aviculteur and fournisseur:
        print("\nTesting AVICULTEUR to FOURNISSEUR messaging")
        av_to_four_conv = test_create_conversation(aviculteur, fournisseur)
        if av_to_four_conv:
            test_send_message(aviculteur, fournisseur, av_to_four_conv["id"])
    
    # Test ACHETEUR to FOURNISSEUR messaging
    if acheteur and fournisseur:
        print("\nTesting ACHETEUR to FOURNISSEUR messaging")
        ach_to_four_conv = test_create_conversation(acheteur, fournisseur)
        if ach_to_four_conv:
            test_send_message(acheteur, fournisseur, ach_to_four_conv["id"])
    
    # Print summary
    print("\n===== TEST SUMMARY =====")
    print(f"Total tests: {test_results['success'] + test_results['failure']}")
    print(f"Passed: {test_results['success']}")
    print(f"Failed: {test_results['failure']}")
    
    if test_results['failure'] == 0:
        print("\n✅ All tests passed! The real-time messaging and WebSocket features are working correctly.")
    else:
        print(f"\n⚠️ {test_results['failure']} tests failed. See above for details.")

if __name__ == "__main__":
    try:
        asyncio.run(run_tests())
    except KeyboardInterrupt:
        print("\nTests interrupted by user.")
    except Exception as e:
        print(f"\nTests failed with error: {str(e)}")