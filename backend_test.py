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
import base64

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

print(f"Testing backend API for AviMarché Mali Mobile at: {API_URL}")

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
            response_data = response.json()
        except:
            response_data = response.text[:100] + "..." if len(response.text) > 100 else response.text
    
    test_results["tests"].append({
        "name": name,
        "success": success,
        "message": message,
        "response": response_data,
        "status_code": response.status_code if response else None
    })
    
    if success:
        test_results["success"] += 1
    else:
        test_results["failure"] += 1

# 1. Test API Root endpoint
def test_api_root():
    try:
        response = requests.get(f"{API_URL}/")
        if response.status_code == 200 and "AviMarché API" in response.text:
            log_test("API Root", True, "API root endpoint is working", response)
            return True
        else:
            log_test("API Root", False, f"API root endpoint returned unexpected response: {response.text}", response)
            return False
    except Exception as e:
        log_test("API Root", False, f"Error connecting to API root: {str(e)}")
        return False

# 2. Test Mobile Authentication for all roles
def test_mobile_authentication():
    roles = ["aviculteur", "acheteur", "fournisseur"]
    test_users = {}
    
    all_success = True
    for role in roles:
        try:
            # Generate unique phone number to avoid conflicts
            phone = f"7{random.randint(1000000, 9999999)}"
            
            # Test registration with password (mobile app uses password auth)
            user_data = {
                "nom": f"Test Mobile {role.capitalize()}",
                "telephone": phone,
                "role": role,
                "localisation": "Bamako",
                "password": "testmobile123",
                "use_sms": True  # Mobile app supports SMS verification
            }
            
            response = requests.post(f"{API_URL}/users/register", json=user_data)
            
            if response.status_code == 200 and "id" in response.json():
                log_test(f"Mobile Auth - Register {role}", True, f"Successfully registered mobile {role}", response)
                test_users[role] = response.json()
                
                # Test password login
                login_data = {
                    "telephone": phone,
                    "password": "testmobile123",
                    "use_sms": False
                }
                
                login_response = requests.post(f"{API_URL}/users/login", json=login_data)
                
                if login_response.status_code == 200 and "token" in login_response.json():
                    log_test(f"Mobile Auth - Password Login {role}", True, f"Successfully logged in as {role} with password", login_response)
                    test_users[role] = login_response.json()
                else:
                    log_test(f"Mobile Auth - Password Login {role}", False, f"Failed to log in as {role} with password", login_response)
                    all_success = False
                
                # Test SMS login request
                sms_login_data = {
                    "telephone": phone,
                    "use_sms": True
                }
                
                sms_response = requests.post(f"{API_URL}/users/login", json=sms_login_data)
                
                if sms_response.status_code == 200 and "require_sms_verification" in sms_response.json():
                    log_test(f"Mobile Auth - SMS Login Request {role}", True, f"Successfully requested SMS code for {role}", sms_response)
                    
                    # We can't actually verify the SMS code in a test environment
                    # But we can check that the endpoint exists and returns the expected format
                    verification_data = {
                        "user_id": sms_response.json()["user_id"],
                        "sms_code": "123456"  # This will fail, but we're just testing the endpoint
                    }
                    
                    verify_response = requests.post(f"{API_URL}/users/verify-sms", json=verification_data)
                    
                    if verify_response.status_code == 401:  # Expected to fail with wrong code
                        log_test(f"Mobile Auth - SMS Verification {role}", True, f"SMS verification endpoint exists and correctly rejects invalid codes for {role}", verify_response)
                    else:
                        log_test(f"Mobile Auth - SMS Verification {role}", False, f"SMS verification endpoint not working as expected for {role}", verify_response)
                        all_success = False
                else:
                    log_test(f"Mobile Auth - SMS Login Request {role}", False, f"Failed to request SMS code for {role}", sms_response)
                    all_success = False
                
                # Test FCM token update (simulated for mobile)
                # In a real mobile app, this would be the Firebase Cloud Messaging token
                fcm_token = f"fcm-token-{uuid.uuid4()}"
                
                # This is a simulated endpoint - in a real app, you would have an endpoint to update FCM tokens
                # For this test, we'll assume the token is stored in user data
                user_update_data = {
                    "fcm_token": fcm_token
                }
                
                # This is a simulated request - in a real app, you would have a specific endpoint
                # Here we're using the user update endpoint as a proxy
                fcm_response = requests.put(f"{API_URL}/users/{test_users[role]['user']['id']}?user_id={test_users[role]['token']}", json=user_update_data)
                
                # Since this is a simulated endpoint, we'll just check if the request was accepted
                if fcm_response.status_code < 400:
                    log_test(f"Mobile Auth - FCM Token Update {role}", True, f"Successfully simulated FCM token update for {role}", fcm_response)
                else:
                    log_test(f"Mobile Auth - FCM Token Update {role}", False, f"Failed to simulate FCM token update for {role}", fcm_response)
                    # This is not a critical failure since we're simulating
            else:
                log_test(f"Mobile Auth - Register {role}", False, f"Failed to register mobile {role}", response)
                all_success = False
        except Exception as e:
            log_test(f"Mobile Auth - {role}", False, f"Error in mobile authentication for {role}: {str(e)}")
            all_success = False
    
    return all_success, test_users

# 3. Test Product Publication with Base64 Images
def test_product_publication_with_images(logged_in_users):
    all_success = True
    created_products = {}
    
    # Generate a simple base64 image for testing
    def generate_test_image():
        # This creates a very small 1x1 pixel image
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    
    # Test product creation for AVICULTEUR and FOURNISSEUR with base64 images
    for role, user in logged_in_users.items():
        if role not in ["aviculteur", "fournisseur"]:
            continue
            
        try:
            # Define product type based on role
            if role == "aviculteur":
                product_types = ["volaille_vivante", "oeufs"]
            else:  # fournisseur
                product_types = ["amendements"]
            
            for product_type in product_types:
                # Generate a base64 image
                base64_image = generate_test_image()
                
                product_data = {
                    "titre": f"Test Mobile {product_type} by {role}",
                    "description": f"Test product created by mobile {role}",
                    "type_produit": product_type,
                    "prix": 1500,
                    "unite": "pièce" if product_type != "amendements" else "kg",
                    "quantite_disponible": 15,
                    "localisation": "Bamako",
                    "image": base64_image  # Mobile app sends images as base64
                }
                
                # Add specific fields based on product type
                if product_type == "volaille_vivante":
                    product_data["race_volaille"] = "Leghorn"
                    product_data["age_semaines"] = 12
                    product_data["poids_moyen"] = 2.2
                elif product_type == "oeufs":
                    product_data["type_oeuf"] = "fécondés"  # Changed from "poule" to "fécondés" for mobile
                    product_data["fraicheur_jours"] = 2
                elif product_type == "amendements":
                    product_data["type_amendement"] = "Aliment complet"
                    product_data["composition"] = "Maïs, soja, vitamines"
                
                response = requests.post(f"{API_URL}/products?vendeur_id={user['token']}", json=product_data)
                
                if response.status_code == 200 and "id" in response.json():
                    log_test(f"Mobile Product Creation - {role} - {product_type}", True, f"Successfully created {product_type} product with base64 image as {role}", response)
                    if role not in created_products:
                        created_products[role] = []
                    created_products[role].append(response.json())
                else:
                    log_test(f"Mobile Product Creation - {role} - {product_type}", False, f"Failed to create {product_type} product with base64 image as {role}", response)
                    all_success = False
        except Exception as e:
            log_test(f"Mobile Product Creation - {role}", False, f"Error creating product with base64 image as {role}: {str(e)}")
            all_success = False
    
    return all_success, created_products

# 4. Test Order System for Mobile
def test_mobile_order_system(logged_in_users, created_products):
    all_success = True
    
    # We need at least an ACHETEUR and an AVICULTEUR/FOURNISSEUR with a product for testing
    if "acheteur" not in logged_in_users or (
        "aviculteur" not in logged_in_users and "fournisseur" not in logged_in_users):
        log_test("Mobile Order System", False, "Missing required users for testing")
        return False
    
    buyer_user = logged_in_users["acheteur"]
    
    # Choose a seller based on available roles
    seller_role = "aviculteur" if "aviculteur" in logged_in_users else "fournisseur"
    seller_user = logged_in_users[seller_role]
    
    # Get a product to order
    product = None
    if seller_role in created_products and created_products[seller_role]:
        product = created_products[seller_role][0]
    
    if not product:
        log_test("Mobile Order System", False, "No product available for testing orders")
        return False
    
    # Test creating an order via OrderModal
    try:
        order_data = {
            "product_id": product["id"],
            "quantity_requested": 3,
            "message_from_buyer": "Test mobile order message from OrderModal"
        }
        
        response = requests.post(f"{API_URL}/orders?buyer_id={buyer_user['token']}", json=order_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test("Mobile Order System - Create Order", True, "Successfully created order via OrderModal", response)
            order = response.json()
        else:
            log_test("Mobile Order System - Create Order", False, "Failed to create order via OrderModal", response)
            return False
    except Exception as e:
        log_test("Mobile Order System - Create Order", False, f"Error creating order via OrderModal: {str(e)}")
        return False
    
    # Test getting sent orders (buyer)
    try:
        response = requests.get(f"{API_URL}/orders/sent?user_id={buyer_user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            log_test("Mobile Order System - Get Sent Orders", True, "Successfully retrieved sent orders on mobile", response)
        else:
            log_test("Mobile Order System - Get Sent Orders", False, "Failed to retrieve sent orders on mobile", response)
            all_success = False
    except Exception as e:
        log_test("Mobile Order System - Get Sent Orders", False, f"Error retrieving sent orders on mobile: {str(e)}")
        all_success = False
    
    # Test getting received orders (seller)
    try:
        response = requests.get(f"{API_URL}/orders/received?user_id={seller_user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            log_test("Mobile Order System - Get Received Orders", True, "Successfully retrieved received orders on mobile", response)
        else:
            log_test("Mobile Order System - Get Received Orders", False, "Failed to retrieve received orders on mobile", response)
            all_success = False
    except Exception as e:
        log_test("Mobile Order System - Get Received Orders", False, f"Error retrieving received orders on mobile: {str(e)}")
        all_success = False
    
    # Test getting seller notifications (should have a new order notification)
    try:
        response = requests.get(f"{API_URL}/notifications?user_id={seller_user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            notification_found = False
            for notification in response.json():
                if notification["type"] == "new_order" and notification["related_id"] == order["id"]:
                    notification_found = True
                    break
            
            if notification_found:
                log_test("Mobile Order System - Order Notification", True, "Seller received notification about new order on mobile", response)
            else:
                log_test("Mobile Order System - Order Notification", False, "Seller did not receive specific notification about new order", response)
                all_success = False
        else:
            log_test("Mobile Order System - Order Notification", False, "Seller did not receive any notifications", response)
            all_success = False
    except Exception as e:
        log_test("Mobile Order System - Order Notification", False, f"Error retrieving seller notifications: {str(e)}")
        all_success = False
    
    # Test updating order status to accepted
    try:
        update_data = {
            "status": "accepted",
            "response_message": "Order accepted via mobile"
        }
        
        response = requests.put(f"{API_URL}/orders/{order['id']}?user_id={seller_user['token']}", json=update_data)
        
        if response.status_code == 200 and "id" in response.json() and response.json()["status"] == "accepted":
            log_test("Mobile Order System - Accept Order", True, "Successfully accepted order on mobile", response)
        else:
            log_test("Mobile Order System - Accept Order", False, "Failed to accept order on mobile", response)
            all_success = False
            return all_success  # Can't continue if update fails
    except Exception as e:
        log_test("Mobile Order System - Accept Order", False, f"Error accepting order on mobile: {str(e)}")
        all_success = False
        return all_success  # Can't continue if update fails
    
    # Give the system time to create notifications and conversation
    time.sleep(1)
    
    # Test if buyer received notification about order acceptance
    try:
        response = requests.get(f"{API_URL}/notifications?user_id={buyer_user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            notification_found = False
            for notification in response.json():
                if notification["type"] == "order_status_update" and notification["related_id"] == order["id"]:
                    notification_found = True
                    break
            
            if notification_found:
                log_test("Mobile Order System - Acceptance Notification", True, "Buyer received notification about order acceptance on mobile", response)
            else:
                log_test("Mobile Order System - Acceptance Notification", False, "Buyer did not receive specific notification about order acceptance", response)
                all_success = False
        else:
            log_test("Mobile Order System - Acceptance Notification", False, "Buyer did not receive any notifications", response)
            all_success = False
    except Exception as e:
        log_test("Mobile Order System - Acceptance Notification", False, f"Error retrieving buyer notifications: {str(e)}")
        all_success = False
    
    # Test if a conversation was created automatically
    try:
        response = requests.get(f"{API_URL}/conversations?user_id={buyer_user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            conversations = response.json()
            
            # Check if there's a conversation with the seller
            seller_conversations = [
                conv for conv in conversations 
                if seller_user['user']['id'] in conv['participants']
            ]
            
            if seller_conversations:
                log_test("Mobile Order System - Auto Conversation", True, "Conversation was automatically created after order acceptance", response)
                conversation_id = seller_conversations[0]["id"]
                
                # Check if there's an initial message in the conversation
                messages_response = requests.get(f"{API_URL}/conversations/{conversation_id}/messages?user_id={buyer_user['token']}")
                
                if messages_response.status_code == 200 and isinstance(messages_response.json(), list) and len(messages_response.json()) > 0:
                    log_test("Mobile Order System - Initial Message", True, "Initial message was automatically sent in the conversation", messages_response)
                else:
                    log_test("Mobile Order System - Initial Message", False, "No initial message in the conversation", messages_response)
                    all_success = False
            else:
                log_test("Mobile Order System - Auto Conversation", False, "No conversation was created with the seller", response)
                all_success = False
        else:
            log_test("Mobile Order System - Auto Conversation", False, "Failed to retrieve conversations", response)
            all_success = False
    except Exception as e:
        log_test("Mobile Order System - Auto Conversation", False, f"Error checking conversation creation: {str(e)}")
        all_success = False
    
    # Test rejecting an order (create a new order first)
    try:
        order_data = {
            "product_id": product["id"],
            "quantity_requested": 1,
            "message_from_buyer": "Test mobile order to be rejected"
        }
        
        response = requests.post(f"{API_URL}/orders?buyer_id={buyer_user['token']}", json=order_data)
        
        if response.status_code == 200 and "id" in response.json():
            reject_order = response.json()
            
            # Reject the order
            update_data = {
                "status": "rejected",
                "response_message": "Order rejected via mobile"
            }
            
            response = requests.put(f"{API_URL}/orders/{reject_order['id']}?user_id={seller_user['token']}", json=update_data)
            
            if response.status_code == 200 and "id" in response.json() and response.json()["status"] == "rejected":
                log_test("Mobile Order System - Reject Order", True, "Successfully rejected order on mobile", response)
                
                # Give the system time to create notifications
                time.sleep(1)
                
                # Check if buyer received rejection notification
                response = requests.get(f"{API_URL}/notifications?user_id={buyer_user['token']}")
                
                if response.status_code == 200 and isinstance(response.json(), list):
                    notification_found = False
                    for notification in response.json():
                        if notification["type"] == "order_status_update" and notification["related_id"] == reject_order["id"]:
                            notification_found = True
                            break
                    
                    if notification_found:
                        log_test("Mobile Order System - Rejection Notification", True, "Buyer received notification about order rejection on mobile", response)
                    else:
                        log_test("Mobile Order System - Rejection Notification", False, "Buyer did not receive specific notification about order rejection", response)
                        all_success = False
                else:
                    log_test("Mobile Order System - Rejection Notification", False, "Failed to retrieve buyer notifications after rejection", response)
                    all_success = False
            else:
                log_test("Mobile Order System - Reject Order", False, "Failed to reject order on mobile", response)
                all_success = False
        else:
            log_test("Mobile Order System - Create Order for Rejection", False, "Failed to create order for rejection test", response)
            all_success = False
    except Exception as e:
        log_test("Mobile Order System - Rejection Test", False, f"Error in rejection test: {str(e)}")
        all_success = False
    
    return all_success

# 5. Test Real-time Messaging for Mobile
def test_mobile_messaging(logged_in_users):
    all_success = True
    
    # We need at least two users to test messaging
    if len(logged_in_users) < 2:
        log_test("Mobile Messaging", False, "Need at least two users to test messaging")
        return False
    
    # Get two users for testing
    users = list(logged_in_users.values())
    user1 = users[0]
    user2 = users[1]
    
    # Test creating a conversation
    try:
        conversation_data = {
            "participant_id": user2["user"]["id"],
            "initial_message": "Hello from mobile app!"
        }
        
        response = requests.post(f"{API_URL}/conversations?sender_id={user1['token']}", json=conversation_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test("Mobile Messaging - Create Conversation", True, "Successfully created conversation from mobile", response)
            conversation_id = response.json()["id"]
        else:
            log_test("Mobile Messaging - Create Conversation", False, "Failed to create conversation from mobile", response)
            all_success = False
            return all_success  # Can't continue without a conversation
    except Exception as e:
        log_test("Mobile Messaging - Create Conversation", False, f"Error creating conversation from mobile: {str(e)}")
        all_success = False
        return all_success  # Can't continue without a conversation
    
    # Test getting user conversations
    try:
        response = requests.get(f"{API_URL}/conversations?user_id={user1['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            log_test("Mobile Messaging - Get Conversations", True, "Successfully retrieved conversations on mobile", response)
        else:
            log_test("Mobile Messaging - Get Conversations", False, "Failed to retrieve conversations on mobile", response)
            all_success = False
    except Exception as e:
        log_test("Mobile Messaging - Get Conversations", False, f"Error retrieving conversations on mobile: {str(e)}")
        all_success = False
    
    # Test getting conversation messages
    try:
        response = requests.get(f"{API_URL}/conversations/{conversation_id}/messages?user_id={user1['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            log_test("Mobile Messaging - Get Messages", True, "Successfully retrieved messages on mobile", response)
        else:
            log_test("Mobile Messaging - Get Messages", False, "Failed to retrieve messages on mobile", response)
            all_success = False
    except Exception as e:
        log_test("Mobile Messaging - Get Messages", False, f"Error retrieving messages on mobile: {str(e)}")
        all_success = False
    
    # Test sending a message
    try:
        message_data = {
            "conversation_id": conversation_id,
            "recipient_id": user2["user"]["id"],
            "content": "This is a test message from mobile!"
        }
        
        response = requests.post(f"{API_URL}/messages?sender_id={user1['token']}", json=message_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test("Mobile Messaging - Send Message", True, "Successfully sent message from mobile", response)
        else:
            log_test("Mobile Messaging - Send Message", False, "Failed to send message from mobile", response)
            all_success = False
    except Exception as e:
        log_test("Mobile Messaging - Send Message", False, f"Error sending message from mobile: {str(e)}")
        all_success = False
    
    # Test marking messages as read
    try:
        response = requests.post(f"{API_URL}/conversations/{conversation_id}/mark-read?user_id={user2['token']}")
        
        if response.status_code == 200 and "message" in response.json():
            log_test("Mobile Messaging - Mark Read", True, "Successfully marked messages as read on mobile", response)
        else:
            log_test("Mobile Messaging - Mark Read", False, "Failed to mark messages as read on mobile", response)
            all_success = False
    except Exception as e:
        log_test("Mobile Messaging - Mark Read", False, f"Error marking messages as read on mobile: {str(e)}")
        all_success = False
    
    # Test user presence
    try:
        response = requests.get(f"{API_URL}/users/{user1['user']['id']}/presence")
        
        if response.status_code == 200 and "user_id" in response.json():
            log_test("Mobile Messaging - User Presence", True, "Successfully retrieved user presence on mobile", response)
        else:
            log_test("Mobile Messaging - User Presence", False, "Failed to retrieve user presence on mobile", response)
            all_success = False
    except Exception as e:
        log_test("Mobile Messaging - User Presence", False, f"Error retrieving user presence on mobile: {str(e)}")
        all_success = False
    
    return all_success

# 6. Test WebSocket Connection for Mobile
async def mobile_websocket_test(user_id, message_queue):
    """Async function to test WebSocket connection for mobile"""
    try:
        uri = f"{WS_URL}/{user_id}"
        print(f"Attempting to connect to WebSocket at: {uri}")
        
        # Set a timeout for the connection attempt
        async with websockets.connect(uri, ping_interval=None, ping_timeout=None, close_timeout=5) as websocket:
            # Send a ping message
            ping_message = json.dumps({"type": "ping"})
            await websocket.send(ping_message)
            
            # Wait for pong response with a timeout
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                response_data = json.loads(response)
                
                if response_data.get("type") == "pong":
                    message_queue.append(("Mobile WebSocket - Ping/Pong", True, "Successfully received pong response"))
                else:
                    message_queue.append(("Mobile WebSocket - Ping/Pong", False, f"Unexpected response to ping: {response}"))
            except asyncio.TimeoutError:
                message_queue.append(("Mobile WebSocket - Ping/Pong", False, "Timeout waiting for pong response"))
            
            # Send a typing indicator
            typing_message = json.dumps({
                "type": "typing",
                "conversation_id": "test_conversation",
                "is_typing": True
            })
            await websocket.send(typing_message)
            message_queue.append(("Mobile WebSocket - Typing Indicator", True, "Successfully sent typing indicator"))
            
            # Wait a bit to see if we get any responses
            await asyncio.sleep(1)
            
    except Exception as e:
        message_queue.append(("Mobile WebSocket Connection", False, f"Error in WebSocket connection: {str(e)}"))
        return False

def test_mobile_websocket(logged_in_users):
    """Test WebSocket connection for mobile app"""
    if not logged_in_users:
        log_test("Mobile WebSocket", False, "No users available for testing")
        return False
    
    all_success = True
    user = list(logged_in_users.values())[0]
    user_id = user["user"]["id"]
    
    # Create a message queue to collect results from the async function
    message_queue = []
    
    # Run the async WebSocket test
    try:
        print(f"Testing WebSocket connection for mobile user: {user_id}")
        asyncio.run(mobile_websocket_test(user_id, message_queue))
        
        # Process the results
        for name, success, message in message_queue:
            log_test(name, success, message)
            if not success:
                all_success = False
        
        if not message_queue:
            log_test("Mobile WebSocket", False, "No WebSocket test results received")
            all_success = False
    except Exception as e:
        log_test("Mobile WebSocket", False, f"Error running WebSocket test for mobile: {str(e)}")
        all_success = False
    
    return all_success

# 7. Test Push Notifications System
def test_push_notifications(logged_in_users):
    """Test the push notifications system for mobile"""
    # Note: We can't actually send push notifications in a test environment
    # But we can check that the notification data structure is correct for mobile
    
    all_success = True
    
    # We need at least one user to test notifications
    if not logged_in_users:
        log_test("Push Notifications", False, "No users available for testing")
        return False
    
    user = list(logged_in_users.values())[0]
    
    # Test getting notifications
    try:
        response = requests.get(f"{API_URL}/notifications?user_id={user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            notifications = response.json()
            
            # Check notification structure for mobile compatibility
            if notifications:
                notification = notifications[0]
                required_fields = ["id", "type", "title", "message", "related_id", "read", "created_at"]
                
                missing_fields = [field for field in required_fields if field not in notification]
                
                if not missing_fields:
                    log_test("Push Notifications - Structure", True, "Notification structure is compatible with mobile", response)
                else:
                    log_test("Push Notifications - Structure", False, f"Notification structure missing fields for mobile: {missing_fields}", response)
                    all_success = False
            else:
                log_test("Push Notifications - Structure", True, "No notifications to check structure, but endpoint works")
        else:
            log_test("Push Notifications - Get Notifications", False, "Failed to retrieve notifications for mobile", response)
            all_success = False
    except Exception as e:
        log_test("Push Notifications - Get Notifications", False, f"Error retrieving notifications for mobile: {str(e)}")
        all_success = False
    
    # Test marking a notification as read
    if "notifications" in locals() and notifications:
        try:
            notification_id = notifications[0]["id"]
            
            response = requests.post(f"{API_URL}/notifications/{notification_id}/mark-read?user_id={user['token']}")
            
            if response.status_code == 200 and "message" in response.json():
                log_test("Push Notifications - Mark Read", True, "Successfully marked notification as read on mobile", response)
                
                # Verify notification was marked as read
                verify_response = requests.get(f"{API_URL}/notifications?user_id={user['token']}")
                
                if verify_response.status_code == 200:
                    updated_notifications = verify_response.json()
                    notification_marked = any(n["id"] == notification_id and n["read"] for n in updated_notifications)
                    
                    log_test("Push Notifications - Verify Marked", notification_marked, 
                             "Successfully verified notification was marked as read" if notification_marked else "Failed to verify notification was marked as read")
                    
                    if not notification_marked:
                        all_success = False
            else:
                log_test("Push Notifications - Mark Read", False, "Failed to mark notification as read on mobile", response)
                all_success = False
        except Exception as e:
            log_test("Push Notifications - Mark Read", False, f"Error marking notification as read on mobile: {str(e)}")
            all_success = False
    
    return all_success

# Main test function
def run_tests():
    print("\n===== TESTING AVIMARCHÉ MALI MOBILE BACKEND API =====\n")
    
    # Test API Root
    api_root_success = test_api_root()
    if not api_root_success:
        print("\n❌ API Root test failed. Stopping tests.")
        return
    
    # Test Mobile Authentication
    auth_success, logged_in_users = test_mobile_authentication()
    if not auth_success:
        print("\n⚠️ Mobile Authentication test had some failures. Continuing with available users.")
    
    if not logged_in_users:
        print("\n❌ No users available for testing. Stopping tests.")
        return
    
    # Test Product Publication with Base64 Images
    products_success, created_products = test_product_publication_with_images(logged_in_users)
    if not products_success:
        print("\n⚠️ Product Publication test had some failures.")
    
    # Test Order System for Mobile
    order_success = test_mobile_order_system(logged_in_users, created_products)
    if not order_success:
        print("\n⚠️ Mobile Order System test had some failures.")
    
    # Test Real-time Messaging for Mobile
    messaging_success = test_mobile_messaging(logged_in_users)
    if not messaging_success:
        print("\n⚠️ Mobile Messaging test had some failures.")
    
    # Test Push Notifications System
    notifications_success = test_push_notifications(logged_in_users)
    if not notifications_success:
        print("\n⚠️ Push Notifications test had some failures.")
    
    # Test WebSocket Connection for Mobile
    try:
        websocket_success = test_mobile_websocket(logged_in_users)
        if not websocket_success:
            print("\n⚠️ Mobile WebSocket test had some failures.")
    except Exception as e:
        print(f"\n⚠️ Mobile WebSocket test failed with error: {str(e)}")
        test_results["failure"] += 1
    
    # Print summary
    print("\n===== TEST SUMMARY =====")
    print(f"Total tests: {test_results['success'] + test_results['failure']}")
    print(f"Passed: {test_results['success']}")
    print(f"Failed: {test_results['failure']}")
    
    if test_results['failure'] == 0:
        print("\n✅ All tests passed! The mobile backend API is working correctly.")
    else:
        print(f"\n⚠️ {test_results['failure']} tests failed. See above for details.")
    
    # Detailed results for specific mobile features
    print("\n===== MOBILE-SPECIFIC FEATURES =====")
    
    # Check authentication tests
    auth_tests = [t for t in test_results["tests"] if "Mobile Auth" in t["name"]]
    auth_success = all(t["success"] for t in auth_tests)
    print(f"1. Mobile Authentication: {'✅ PASS' if auth_success else '❌ FAIL'}")
    
    # Check order system tests
    order_tests = [t for t in test_results["tests"] if "Mobile Order System" in t["name"]]
    order_success = all(t["success"] for t in order_tests)
    print(f"2. Mobile Order System: {'✅ PASS' if order_success else '❌ FAIL'}")
    
    # Check messaging tests
    messaging_tests = [t for t in test_results["tests"] if "Mobile Messaging" in t["name"]]
    messaging_success = all(t["success"] for t in messaging_tests)
    print(f"3. Mobile Real-time Messaging: {'✅ PASS' if messaging_success else '❌ FAIL'}")
    
    # Check WebSocket tests
    websocket_tests = [t for t in test_results["tests"] if "Mobile WebSocket" in t["name"]]
    websocket_success = all(t["success"] for t in websocket_tests)
    print(f"4. Mobile WebSocket Support: {'✅ PASS' if websocket_success else '❌ FAIL'}")
    
    # Check push notification tests
    notification_tests = [t for t in test_results["tests"] if "Push Notifications" in t["name"]]
    notification_success = all(t["success"] for t in notification_tests)
    print(f"5. Mobile Push Notifications: {'✅ PASS' if notification_success else '❌ FAIL'}")
    
    # Check product publication tests
    product_tests = [t for t in test_results["tests"] if "Mobile Product Creation" in t["name"]]
    product_success = all(t["success"] for t in product_tests)
    print(f"6. Mobile Product Publication: {'✅ PASS' if product_success else '❌ FAIL'}")

if __name__ == "__main__":
    run_tests()
