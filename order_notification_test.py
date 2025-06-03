#!/usr/bin/env python3
import requests
import json
import time
from datetime import datetime
import random

# Get the backend URL
BACKEND_URL = "https://9f78ae1e-177b-417a-aef1-b4a3354bc0b7.preview.emergentagent.com"
API_URL = f"{BACKEND_URL}/api"

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

def test_order_system_flow():
    """Test the complete order system flow"""
    print("\n===== TESTING ORDER SYSTEM AND NOTIFICATIONS =====\n")
    
    # 1. Register a seller (AVICULTEUR)
    seller_phone = f"7{random.randint(1000000, 9999999)}"
    seller_data = {
        "nom": "Test Seller",
        "telephone": seller_phone,
        "role": "aviculteur",
        "localisation": "Test Location"
    }
    
    try:
        response = requests.post(f"{API_URL}/users/register", json=seller_data)
        if response.status_code == 200 and "id" in response.json():
            log_test("Register Seller", True, "Successfully registered seller", response)
            seller = response.json()
        else:
            log_test("Register Seller", False, "Failed to register seller", response)
            return
    except Exception as e:
        log_test("Register Seller", False, f"Error registering seller: {str(e)}")
        return
    
    # 2. Register a buyer (ACHETEUR)
    buyer_phone = f"7{random.randint(1000000, 9999999)}"
    buyer_data = {
        "nom": "Test Buyer",
        "telephone": buyer_phone,
        "role": "acheteur",
        "localisation": "Test Location"
    }
    
    try:
        response = requests.post(f"{API_URL}/users/register", json=buyer_data)
        if response.status_code == 200 and "id" in response.json():
            log_test("Register Buyer", True, "Successfully registered buyer", response)
            buyer = response.json()
        else:
            log_test("Register Buyer", False, "Failed to register buyer", response)
            return
    except Exception as e:
        log_test("Register Buyer", False, f"Error registering buyer: {str(e)}")
        return
    
    # 3. Login as seller
    try:
        login_data = {"telephone": seller_phone}
        response = requests.post(f"{API_URL}/users/login", json=login_data)
        if response.status_code == 200 and "token" in response.json():
            log_test("Login Seller", True, "Successfully logged in as seller", response)
            seller_token = response.json()["token"]
        else:
            log_test("Login Seller", False, "Failed to login as seller", response)
            return
    except Exception as e:
        log_test("Login Seller", False, f"Error logging in as seller: {str(e)}")
        return
    
    # 4. Login as buyer
    try:
        login_data = {"telephone": buyer_phone}
        response = requests.post(f"{API_URL}/users/login", json=login_data)
        if response.status_code == 200 and "token" in response.json():
            log_test("Login Buyer", True, "Successfully logged in as buyer", response)
            buyer_token = response.json()["token"]
        else:
            log_test("Login Buyer", False, "Failed to login as buyer", response)
            return
    except Exception as e:
        log_test("Login Buyer", False, f"Error logging in as buyer: {str(e)}")
        return
    
    # 5. Create a product as seller
    product_data = {
        "titre": "Test Chicken",
        "description": "Fresh farm chicken for testing",
        "type_produit": "volaille_vivante",
        "prix": 2000,
        "unite": "pièce",
        "quantite_disponible": 5,
        "localisation": "Test Farm",
        "race_volaille": "Test Breed",
        "age_semaines": 12,
        "poids_moyen": 2.0
    }
    
    try:
        response = requests.post(f"{API_URL}/products?vendeur_id={seller_token}", json=product_data)
        if response.status_code == 200 and "id" in response.json():
            log_test("Create Product", True, "Successfully created product", response)
            product = response.json()
        else:
            log_test("Create Product", False, "Failed to create product", response)
            return
    except Exception as e:
        log_test("Create Product", False, f"Error creating product: {str(e)}")
        return
    
    # 6. Create an order as buyer
    order_data = {
        "product_id": product["id"],
        "quantity_requested": 2,
        "message_from_buyer": "I would like to buy these chickens"
    }
    
    try:
        response = requests.post(f"{API_URL}/orders?buyer_id={buyer_token}", json=order_data)
        if response.status_code == 200 and "id" in response.json():
            log_test("Create Order", True, "Successfully created order", response)
            order = response.json()
        else:
            log_test("Create Order", False, "Failed to create order", response)
            return
    except Exception as e:
        log_test("Create Order", False, f"Error creating order: {str(e)}")
        return
    
    # 7. Check if buyer can see their sent orders
    try:
        response = requests.get(f"{API_URL}/orders/sent?user_id={buyer_token}")
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            log_test("Get Buyer Orders", True, "Buyer can see their sent orders", response)
        else:
            log_test("Get Buyer Orders", False, "Buyer cannot see their sent orders", response)
    except Exception as e:
        log_test("Get Buyer Orders", False, f"Error getting buyer orders: {str(e)}")
    
    # 8. Check if seller can see their received orders
    try:
        response = requests.get(f"{API_URL}/orders/received?user_id={seller_token}")
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            log_test("Get Seller Orders", True, "Seller can see their received orders", response)
        else:
            log_test("Get Seller Orders", False, "Seller cannot see their received orders", response)
    except Exception as e:
        log_test("Get Seller Orders", False, f"Error getting seller orders: {str(e)}")
    
    # 9. Check if seller received a notification about the new order
    try:
        response = requests.get(f"{API_URL}/notifications?user_id={seller_token}")
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            log_test("Seller Notification", True, "Seller received notification about new order", response)
            seller_notification = response.json()[0]
        else:
            log_test("Seller Notification", False, "Seller did not receive notification about new order", response)
    except Exception as e:
        log_test("Seller Notification", False, f"Error getting seller notifications: {str(e)}")
    
    # 10. Test security - buyer trying to update order status (should fail)
    try:
        update_data = {
            "status": "accepted",
            "response_message": "Security test"
        }
        
        response = requests.put(f"{API_URL}/orders/{order['id']}?user_id={buyer_token}", json=update_data)
        
        if response.status_code != 200:
            log_test("Order Security", True, "Correctly prevented buyer from updating order status", response)
        else:
            log_test("Order Security", False, "Incorrectly allowed buyer to update order status", response)
    except Exception as e:
        log_test("Order Security", False, f"Error testing order security: {str(e)}")
    
    # 11. Seller accepts the order
    try:
        update_data = {
            "status": "accepted",
            "response_message": "I accept your order"
        }
        
        response = requests.put(f"{API_URL}/orders/{order['id']}?user_id={seller_token}", json=update_data)
        
        if response.status_code == 200 and "id" in response.json() and response.json()["status"] == "accepted":
            log_test("Accept Order", True, "Seller successfully accepted the order", response)
        else:
            log_test("Accept Order", False, "Seller failed to accept the order", response)
            return
    except Exception as e:
        log_test("Accept Order", False, f"Error accepting order: {str(e)}")
        return
    
    # Wait a moment for notifications and conversation to be created
    time.sleep(1)
    
    # 12. Check if buyer received a notification about the accepted order
    try:
        response = requests.get(f"{API_URL}/notifications?user_id={buyer_token}")
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            log_test("Buyer Notification", True, "Buyer received notification about accepted order", response)
            buyer_notification = response.json()[0]
        else:
            log_test("Buyer Notification", False, "Buyer did not receive notification about accepted order", response)
    except Exception as e:
        log_test("Buyer Notification", False, f"Error getting buyer notifications: {str(e)}")
    
    # 13. Check if a conversation was created between buyer and seller
    try:
        response = requests.get(f"{API_URL}/conversations?user_id={buyer_token}")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            conversations = response.json()
            
            # Check if there's a conversation with the seller
            seller_conversations = [
                conv for conv in conversations 
                if seller["id"] in conv['participants']
            ]
            
            if seller_conversations:
                log_test("Conversation Creation", True, "Conversation was automatically created after order acceptance", response)
                conversation = seller_conversations[0]
            else:
                log_test("Conversation Creation", False, "No conversation was created with the seller", response)
        else:
            log_test("Conversation Creation", False, "Failed to retrieve conversations", response)
    except Exception as e:
        log_test("Conversation Creation", False, f"Error checking conversation creation: {str(e)}")
    
    # 14. Mark buyer notification as read
    if 'buyer_notification' in locals():
        try:
            response = requests.post(f"{API_URL}/notifications/{buyer_notification['id']}/mark-read?user_id={buyer_token}")
            
            if response.status_code == 200 and "message" in response.json():
                log_test("Mark Notification Read", True, "Successfully marked notification as read", response)
            else:
                log_test("Mark Notification Read", False, "Failed to mark notification as read", response)
        except Exception as e:
            log_test("Mark Notification Read", False, f"Error marking notification as read: {str(e)}")
    
    # 15. Verify notification was marked as read
    if 'buyer_notification' in locals():
        try:
            response = requests.get(f"{API_URL}/notifications?user_id={buyer_token}")
            
            if response.status_code == 200:
                notifications = response.json()
                notification_marked = any(n["id"] == buyer_notification["id"] and n["read"] for n in notifications)
                
                log_test("Verify Notification Marked", notification_marked, 
                         "Successfully verified notification was marked as read" if notification_marked else "Failed to verify notification was marked as read")
            else:
                log_test("Verify Notification Marked", False, "Failed to retrieve notifications for verification", response)
        except Exception as e:
            log_test("Verify Notification Marked", False, f"Error verifying notification was marked as read: {str(e)}")
    
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
    test_order_system_flow()
