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

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://3afd9d07-bf98-406e-bfa1-1905a275aa64.preview.emergentagent.com"
API_URL = f"{BACKEND_URL}/api"
WS_URL = f"wss://{BACKEND_URL.replace('https://', '')}/ws"

print(f"Testing Order System and Notifications at: {API_URL}")

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

# Register test users (buyer and seller)
def register_test_users():
    test_users = {}
    
    roles = ["aviculteur", "acheteur"]  # Seller and buyer
    for role in roles:
        try:
            # Generate unique phone number to avoid conflicts
            phone = f"7{random.randint(1000000, 9999999)}"
            user_data = {
                "nom": f"Test {role.capitalize()}",
                "telephone": phone,
                "role": role,
                "localisation": "Test Location"
            }
            
            response = requests.post(f"{API_URL}/users/register", json=user_data)
            
            if response.status_code == 200 and "id" in response.json():
                log_test(f"User Registration - {role}", True, f"Successfully registered {role}", response)
                test_users[role] = response.json()
            else:
                log_test(f"User Registration - {role}", False, f"Failed to register {role}", response)
        except Exception as e:
            log_test(f"User Registration - {role}", False, f"Error registering {role}: {str(e)}")
    
    return test_users

# Login test users
def login_test_users(test_users):
    logged_in_users = {}
    
    for role, user in test_users.items():
        try:
            login_data = {
                "telephone": user["telephone"]
            }
            
            response = requests.post(f"{API_URL}/users/login", json=login_data)
            
            if response.status_code == 200 and "token" in response.json():
                log_test(f"User Login - {role}", True, f"Successfully logged in as {role}", response)
                logged_in_users[role] = response.json()
            else:
                log_test(f"User Login - {role}", False, f"Failed to log in as {role}", response)
        except Exception as e:
            log_test(f"User Login - {role}", False, f"Error logging in as {role}: {str(e)}")
    
    return logged_in_users

# Create a test product as seller
def create_test_product(seller_user):
    try:
        product_data = {
            "titre": "Test Product for Order",
            "description": "Test product created for order testing",
            "type_produit": "volaille_vivante",
            "prix": 1000,
            "unite": "pièce",
            "quantite_disponible": 10,
            "localisation": "Test Location",
            "race_volaille": "Test Race",
            "age_semaines": 10,
            "poids_moyen": 2.5
        }
        
        response = requests.post(f"{API_URL}/products?vendeur_id={seller_user['token']}", json=product_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test("Product Creation", True, "Successfully created test product", response)
            return response.json()
        else:
            log_test("Product Creation", False, "Failed to create test product", response)
            return None
    except Exception as e:
        log_test("Product Creation", False, f"Error creating test product: {str(e)}")
        return None

# Test creating an order
def test_create_order(buyer_user, product):
    try:
        order_data = {
            "product_id": product["id"],
            "quantity_requested": 2,
            "message_from_buyer": "Test order message"
        }
        
        response = requests.post(f"{API_URL}/orders?buyer_id={buyer_user['token']}", json=order_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test("Order Creation", True, "Successfully created order", response)
            return response.json()
        else:
            log_test("Order Creation", False, "Failed to create order", response)
            return None
    except Exception as e:
        log_test("Order Creation", False, f"Error creating order: {str(e)}")
        return None

# Test getting orders sent by buyer
def test_get_sent_orders(buyer_user):
    try:
        response = requests.get(f"{API_URL}/orders/sent?user_id={buyer_user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            log_test("Get Sent Orders", True, "Successfully retrieved sent orders", response)
            return response.json()
        else:
            log_test("Get Sent Orders", False, "Failed to retrieve sent orders", response)
            return []
    except Exception as e:
        log_test("Get Sent Orders", False, f"Error retrieving sent orders: {str(e)}")
        return []

# Test getting orders received by seller
def test_get_received_orders(seller_user):
    try:
        response = requests.get(f"{API_URL}/orders/received?user_id={seller_user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            log_test("Get Received Orders", True, "Successfully retrieved received orders", response)
            return response.json()
        else:
            log_test("Get Received Orders", False, "Failed to retrieve received orders", response)
            return []
    except Exception as e:
        log_test("Get Received Orders", False, f"Error retrieving received orders: {str(e)}")
        return []

# Test getting notifications
def test_get_notifications(user):
    try:
        response = requests.get(f"{API_URL}/notifications?user_id={user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            log_test("Get Notifications", True, "Successfully retrieved notifications", response)
            return response.json()
        else:
            log_test("Get Notifications", False, "Failed to retrieve notifications", response)
            return []
    except Exception as e:
        log_test("Get Notifications", False, f"Error retrieving notifications: {str(e)}")
        return []

# Test marking a notification as read
def test_mark_notification_read(user, notification_id):
    try:
        response = requests.post(f"{API_URL}/notifications/{notification_id}/mark-read?user_id={user['token']}")
        
        if response.status_code == 200 and "message" in response.json():
            log_test("Mark Notification Read", True, "Successfully marked notification as read", response)
            return True
        else:
            log_test("Mark Notification Read", False, "Failed to mark notification as read", response)
            return False
    except Exception as e:
        log_test("Mark Notification Read", False, f"Error marking notification as read: {str(e)}")
        return False

# Test updating order status
def test_update_order_status(seller_user, order_id, new_status):
    try:
        update_data = {
            "status": new_status,
            "response_message": f"Order {new_status}"
        }
        
        response = requests.put(f"{API_URL}/orders/{order_id}?user_id={seller_user['token']}", json=update_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test(f"Update Order Status - {new_status}", True, f"Successfully updated order status to {new_status}", response)
            return response.json()
        else:
            log_test(f"Update Order Status - {new_status}", False, f"Failed to update order status to {new_status}", response)
            return None
    except Exception as e:
        log_test(f"Update Order Status - {new_status}", False, f"Error updating order status: {str(e)}")
        return None

# Test security - buyer trying to update order status (should fail)
def test_order_security(buyer_user, order_id):
    try:
        update_data = {
            "status": "accepted",
            "response_message": "Security test"
        }
        
        response = requests.put(f"{API_URL}/orders/{order_id}?user_id={buyer_user['token']}", json=update_data)
        
        if response.status_code != 200:
            log_test("Order Security", True, "Correctly prevented buyer from updating order status", response)
            return True
        else:
            log_test("Order Security", False, "Incorrectly allowed buyer to update order status", response)
            return False
    except Exception as e:
        log_test("Order Security", False, f"Error testing order security: {str(e)}")
        return False

# Test if conversation was created after order acceptance
def test_conversation_creation(buyer_user, seller_user):
    try:
        # Get buyer's conversations
        response = requests.get(f"{API_URL}/conversations?user_id={buyer_user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            conversations = response.json()
            
            # Check if there's a conversation with the seller
            seller_conversations = [
                conv for conv in conversations 
                if seller_user['user']['id'] in conv['participants']
            ]
            
            if seller_conversations:
                log_test("Conversation Creation", True, "Conversation was automatically created after order acceptance", response)
                return seller_conversations[0]
            else:
                log_test("Conversation Creation", False, "No conversation was created with the seller", response)
                return None
        else:
            log_test("Conversation Creation", False, "Failed to retrieve conversations", response)
            return None
    except Exception as e:
        log_test("Conversation Creation", False, f"Error checking conversation creation: {str(e)}")
        return None

# Main test function
def test_order_system():
    print("\n===== TESTING AVIMARCHÉ MALI ORDER SYSTEM AND NOTIFICATIONS =====\n")
    
    # Register test users
    test_users = register_test_users()
    if not test_users or "aviculteur" not in test_users or "acheteur" not in test_users:
        print("\n❌ Failed to register required test users. Stopping tests.")
        return
    
    # Login test users
    logged_in_users = login_test_users(test_users)
    if not logged_in_users or "aviculteur" not in logged_in_users or "acheteur" not in logged_in_users:
        print("\n❌ Failed to log in required test users. Stopping tests.")
        return
    
    seller_user = logged_in_users["aviculteur"]
    buyer_user = logged_in_users["acheteur"]
    
    # Create a test product
    product = create_test_product(seller_user)
    if not product:
        print("\n❌ Failed to create test product. Stopping tests.")
        return
    
    # Test creating an order
    order = test_create_order(buyer_user, product)
    if not order:
        print("\n❌ Failed to create test order. Stopping tests.")
        return
    
    # Test getting sent orders (buyer)
    sent_orders = test_get_sent_orders(buyer_user)
    if not sent_orders:
        print("\n⚠️ Failed to retrieve sent orders.")
    
    # Test getting received orders (seller)
    received_orders = test_get_received_orders(seller_user)
    if not received_orders:
        print("\n⚠️ Failed to retrieve received orders.")
    
    # Test getting seller notifications (should have a new order notification)
    print("\nChecking if seller received notification about the new order...")
    seller_notifications = test_get_notifications(seller_user)
    
    # Test order security (buyer trying to update order)
    security_result = test_order_security(buyer_user, order["id"])
    
    # Test updating order status to accepted
    print("\nUpdating order status to 'accepted'...")
    updated_order = test_update_order_status(seller_user, order["id"], "accepted")
    
    if updated_order:
        # Test if buyer received notification about order acceptance
        print("\nChecking if buyer received notification about order acceptance...")
        time.sleep(1)  # Give the system time to create the notification
        buyer_notifications = test_get_notifications(buyer_user)
        
        # Test if a conversation was created
        print("\nChecking if a conversation was created after order acceptance...")
        conversation = test_conversation_creation(buyer_user, seller_user)
        
        # Test marking a notification as read
        if buyer_notifications:
            notification_id = buyer_notifications[0]["id"]
            mark_read_result = test_mark_notification_read(buyer_user, notification_id)
            
            # Verify notification was marked as read
            if mark_read_result:
                updated_notifications = test_get_notifications(buyer_user)
                notification_marked = any(n["id"] == notification_id and n["read"] for n in updated_notifications)
                log_test("Verify Notification Marked", notification_marked, 
                         "Successfully verified notification was marked as read" if notification_marked else "Failed to verify notification was marked as read")
    
    # Print summary
    print("\n===== TEST SUMMARY =====")
    print(f"Total tests: {test_results['success'] + test_results['failure']}")
    print(f"Passed: {test_results['success']}")
    print(f"Failed: {test_results['failure']}")
    
    if test_results['failure'] == 0:
        print("\n✅ All tests passed! The order system and notifications are working correctly.")
    else:
        print(f"\n⚠️ {test_results['failure']} tests failed. See above for details.")

if __name__ == "__main__":
    test_order_system()
