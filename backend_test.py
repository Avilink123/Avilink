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
BACKEND_URL = "https://9f78ae1e-177b-417a-aef1-b4a3354bc0b7.preview.emergentagent.com"
API_URL = f"{BACKEND_URL}/api"
WS_URL = f"wss://{BACKEND_URL.replace('https://', '')}/ws"

print(f"Testing backend API at: {API_URL}")

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

# 2. Test MongoDB connection through stats endpoint
def test_mongodb_connection():
    try:
        response = requests.get(f"{API_URL}/stats/dashboard")
        if response.status_code == 200 and "total_produits" in response.json():
            log_test("MongoDB Connection", True, "MongoDB connection is working", response)
            return True
        else:
            log_test("MongoDB Connection", False, "MongoDB connection failed", response)
            return False
    except Exception as e:
        log_test("MongoDB Connection", False, f"Error testing MongoDB connection: {str(e)}")
        return False

# 3. Test User Registration for all roles
def test_user_registration():
    roles = ["aviculteur", "acheteur", "fournisseur"]
    test_users = {}
    
    all_success = True
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
                all_success = False
        except Exception as e:
            log_test(f"User Registration - {role}", False, f"Error registering {role}: {str(e)}")
            all_success = False
    
    return all_success, test_users

# 4. Test User Login
def test_user_login(test_users):
    all_success = True
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
                all_success = False
        except Exception as e:
            log_test(f"User Login - {role}", False, f"Error logging in as {role}: {str(e)}")
            all_success = False
    
    return all_success, logged_in_users

# 5. Test Products API - CRUD operations
def test_products_api(logged_in_users):
    all_success = True
    created_products = {}
    
    # Test product creation for each role
    for role, user in logged_in_users.items():
        try:
            # Define product type based on role
            if role == "aviculteur":
                product_types = ["volaille_vivante", "oeufs"]
            elif role == "fournisseur":
                product_types = ["amendements"]
            else:  # acheteur
                product_types = ["volaille_vivante"]  # Should fail for ACHETEUR
            
            for product_type in product_types:
                product_data = {
                    "titre": f"Test {product_type} by {role}",
                    "description": f"Test product created by {role}",
                    "type_produit": product_type,
                    "prix": 1000,
                    "unite": "pièce",
                    "quantite_disponible": 10,
                    "localisation": "Test Location"
                }
                
                # Add specific fields based on product type
                if product_type == "volaille_vivante":
                    product_data["race_volaille"] = "Test Race"
                    product_data["age_semaines"] = 10
                    product_data["poids_moyen"] = 2.5
                elif product_type == "oeufs":
                    product_data["type_oeuf"] = "poule"
                    product_data["fraicheur_jours"] = 1
                elif product_type == "amendements":
                    product_data["type_amendement"] = "Test Amendement"
                    product_data["composition"] = "Test Composition"
                
                response = requests.post(f"{API_URL}/products?vendeur_id={user['token']}", json=product_data)
                
                expected_success = role in ["aviculteur", "fournisseur"]
                
                if expected_success and response.status_code == 200 and "id" in response.json():
                    log_test(f"Product Creation - {role} - {product_type}", True, f"Successfully created {product_type} product as {role}", response)
                    if role not in created_products:
                        created_products[role] = []
                    created_products[role].append(response.json())
                elif not expected_success and response.status_code != 200:
                    log_test(f"Product Creation - {role} - {product_type}", True, f"Correctly prevented {role} from creating {product_type} product", response)
                else:
                    if expected_success:
                        log_test(f"Product Creation - {role} - {product_type}", False, f"Failed to create {product_type} product as {role}", response)
                        all_success = False
                    else:
                        log_test(f"Product Creation - {role} - {product_type}", False, f"Incorrectly allowed {role} to create {product_type} product", response)
                        all_success = False
        except Exception as e:
            log_test(f"Product Creation - {role}", False, f"Error creating product as {role}: {str(e)}")
            all_success = False
    
    # Test product listing
    try:
        response = requests.get(f"{API_URL}/products")
        if response.status_code == 200 and isinstance(response.json(), list):
            log_test("Product Listing", True, "Successfully listed products", response)
        else:
            log_test("Product Listing", False, "Failed to list products", response)
            all_success = False
    except Exception as e:
        log_test("Product Listing", False, f"Error listing products: {str(e)}")
        all_success = False
    
    # Test product update and delete for roles that created products
    for role, products in created_products.items():
        if not products:
            continue
        
        product = products[0]
        user = logged_in_users[role]
        
        # Test product update
        try:
            update_data = {
                "titre": f"Updated {product['titre']}",
                "prix": product['prix'] + 500
            }
            
            response = requests.put(f"{API_URL}/products/{product['id']}?vendeur_id={user['token']}", json=update_data)
            
            if response.status_code == 200 and response.json()["titre"] == update_data["titre"]:
                log_test(f"Product Update - {role}", True, f"Successfully updated product as {role}", response)
            else:
                log_test(f"Product Update - {role}", False, f"Failed to update product as {role}", response)
                all_success = False
        except Exception as e:
            log_test(f"Product Update - {role}", False, f"Error updating product as {role}: {str(e)}")
            all_success = False
        
        # Test product delete
        try:
            response = requests.delete(f"{API_URL}/products/{product['id']}?vendeur_id={user['token']}")
            
            if response.status_code == 200 and "message" in response.json():
                log_test(f"Product Delete - {role}", True, f"Successfully deleted product as {role}", response)
            else:
                log_test(f"Product Delete - {role}", False, f"Failed to delete product as {role}", response)
                all_success = False
        except Exception as e:
            log_test(f"Product Delete - {role}", False, f"Error deleting product as {role}: {str(e)}")
            all_success = False
    
    return all_success, created_products

# 6. Test Admin Endpoints
def test_admin_endpoints():
    all_success = True
    
    # Test admin stats
    try:
        response = requests.get(f"{API_URL}/admin/stats")
        if response.status_code == 200 and "general_stats" in response.json():
            log_test("Admin Stats", True, "Successfully retrieved admin stats", response)
        else:
            log_test("Admin Stats", False, "Failed to retrieve admin stats", response)
            all_success = False
    except Exception as e:
        log_test("Admin Stats", False, f"Error retrieving admin stats: {str(e)}")
        all_success = False
    
    # Test admin export
    try:
        response = requests.get(f"{API_URL}/admin/export")
        if response.status_code == 200 and "data" in response.json():
            log_test("Admin Export", True, "Successfully exported admin data", response)
        else:
            log_test("Admin Export", False, "Failed to export admin data", response)
            all_success = False
    except Exception as e:
        log_test("Admin Export", False, f"Error exporting admin data: {str(e)}")
        all_success = False
    
    return all_success

# 7. Test Additional Modules
def test_additional_modules(logged_in_users):
    all_success = True
    
    # Test Price Monitoring
    try:
        response = requests.get(f"{API_URL}/prices")
        if response.status_code == 200 and isinstance(response.json(), list):
            log_test("Price Monitoring - Get Prices", True, "Successfully retrieved prices", response)
        else:
            log_test("Price Monitoring - Get Prices", False, "Failed to retrieve prices", response)
            all_success = False
    except Exception as e:
        log_test("Price Monitoring - Get Prices", False, f"Error retrieving prices: {str(e)}")
        all_success = False
    
    # Test Animal Health - Get Diseases
    try:
        response = requests.get(f"{API_URL}/diseases")
        if response.status_code == 200 and isinstance(response.json(), list):
            log_test("Animal Health - Get Diseases", True, "Successfully retrieved diseases", response)
        else:
            log_test("Animal Health - Get Diseases", False, "Failed to retrieve diseases", response)
            all_success = False
    except Exception as e:
        log_test("Animal Health - Get Diseases", False, f"Error retrieving diseases: {str(e)}")
        all_success = False
    
    # Test Financial Tools - Add Transaction (for AVICULTEUR)
    if "aviculteur" in logged_in_users:
        try:
            user = logged_in_users["aviculteur"]
            transaction_data = {
                "type_transaction": "revenu",
                "montant": 5000,
                "description": "Test transaction",
                "categorie": "vente_oeufs",
                "date_transaction": (datetime.utcnow()).isoformat()
            }
            
            response = requests.post(f"{API_URL}/finances/transaction?user_id={user['token']}", json=transaction_data)
            
            if response.status_code == 200 and "id" in response.json():
                log_test("Financial Tools - Add Transaction", True, "Successfully added transaction", response)
            else:
                log_test("Financial Tools - Add Transaction", False, "Failed to add transaction", response)
                all_success = False
        except Exception as e:
            log_test("Financial Tools - Add Transaction", False, f"Error adding transaction: {str(e)}")
            all_success = False
        
        # Test Financial Tools - Get Financial Summary
        try:
            user = logged_in_users["aviculteur"]
            response = requests.get(f"{API_URL}/finances/summary/user/{user['token']}?days=30")
            
            if response.status_code == 200 and "total_revenus" in response.json():
                log_test("Financial Tools - Get Financial Summary", True, "Successfully retrieved financial summary", response)
            else:
                log_test("Financial Tools - Get Financial Summary", False, "Failed to retrieve financial summary", response)
                all_success = False
        except Exception as e:
            log_test("Financial Tools - Get Financial Summary", False, f"Error retrieving financial summary: {str(e)}")
            all_success = False
    
    return all_success

# 8. Test ACHETEUR specific functionality
def test_acheteur_functionality(logged_in_users):
    if "acheteur" not in logged_in_users:
        log_test("ACHETEUR Functionality", False, "No ACHETEUR user available for testing")
        return False
    
    all_success = True
    user = logged_in_users["acheteur"]
    
    # Test that ACHETEUR can view products
    try:
        response = requests.get(f"{API_URL}/products")
        if response.status_code == 200 and isinstance(response.json(), list):
            log_test("ACHETEUR - View Products", True, "ACHETEUR can view products", response)
        else:
            log_test("ACHETEUR - View Products", False, "ACHETEUR cannot view products", response)
            all_success = False
    except Exception as e:
        log_test("ACHETEUR - View Products", False, f"Error when ACHETEUR views products: {str(e)}")
        all_success = False
    
    # Test that ACHETEUR cannot create products
    try:
        product_data = {
            "titre": "Test product by ACHETEUR",
            "description": "This should fail",
            "type_produit": "volaille_vivante",
            "prix": 1000,
            "unite": "pièce",
            "quantite_disponible": 10,
            "localisation": "Test Location",
            "race_volaille": "Test Race",
            "age_semaines": 10,
            "poids_moyen": 2.5
        }
        
        response = requests.post(f"{API_URL}/products?vendeur_id={user['token']}", json=product_data)
        
        if response.status_code != 200:
            log_test("ACHETEUR - Create Product", True, "Correctly prevented ACHETEUR from creating product", response)
        else:
            log_test("ACHETEUR - Create Product", False, "Incorrectly allowed ACHETEUR to create product", response)
            all_success = False
    except Exception as e:
        log_test("ACHETEUR - Create Product", False, f"Error testing ACHETEUR product creation: {str(e)}")
        all_success = False
    
    return all_success

# 9. Test Bidirectional Feedback System
def test_feedback_system(logged_in_users):
    all_success = True
    
    # We need at least an ACHETEUR and an AVICULTEUR for buyer_to_farmer ratings
    # And an AVICULTEUR and a FOURNISSEUR for farmer_to_supplier ratings
    if "acheteur" not in logged_in_users or "aviculteur" not in logged_in_users:
        log_test("Feedback System - Buyer to Farmer", False, "Missing required users (ACHETEUR and AVICULTEUR) for testing")
        all_success = False
    else:
        # Test buyer_to_farmer rating
        try:
            acheteur = logged_in_users["acheteur"]
            aviculteur = logged_in_users["aviculteur"]
            
            rating_data = {
                "type_rating": "buyer_to_farmer",
                "evaluateur_id": acheteur["user"]["id"],
                "evalué_id": aviculteur["user"]["id"],
                "note": 4,
                "commentaire": "Très bons produits, livraison rapide",
                "produit_concerne": "Poulets de chair",
                "localisation": "Bamako"
            }
            
            response = requests.post(f"{API_URL}/ratings", json=rating_data)
            
            if response.status_code == 200 and "id" in response.json():
                log_test("Feedback System - Buyer to Farmer", True, "Successfully created buyer to farmer rating", response)
            else:
                log_test("Feedback System - Buyer to Farmer", False, "Failed to create buyer to farmer rating", response)
                all_success = False
        except Exception as e:
            log_test("Feedback System - Buyer to Farmer", False, f"Error creating buyer to farmer rating: {str(e)}")
            all_success = False
    
    # Test farmer_to_supplier rating if we have the required users
    if "aviculteur" not in logged_in_users or "fournisseur" not in logged_in_users:
        log_test("Feedback System - Farmer to Supplier", False, "Missing required users (AVICULTEUR and FOURNISSEUR) for testing")
        all_success = False
    else:
        try:
            aviculteur = logged_in_users["aviculteur"]
            fournisseur = logged_in_users["fournisseur"]
            
            rating_data = {
                "type_rating": "farmer_to_supplier",
                "evaluateur_id": aviculteur["user"]["id"],
                "evalué_id": fournisseur["user"]["id"],
                "note": 5,
                "commentaire": "Excellente qualité d'aliments, prix compétitifs",
                "produit_concerne": "Aliments pour volailles",
                "localisation": "Bamako"
            }
            
            response = requests.post(f"{API_URL}/ratings", json=rating_data)
            
            if response.status_code == 200 and "id" in response.json():
                log_test("Feedback System - Farmer to Supplier", True, "Successfully created farmer to supplier rating", response)
            else:
                log_test("Feedback System - Farmer to Supplier", False, "Failed to create farmer to supplier rating", response)
                all_success = False
        except Exception as e:
            log_test("Feedback System - Farmer to Supplier", False, f"Error creating farmer to supplier rating: {str(e)}")
            all_success = False
    
    # Test wrong role combinations (should fail)
    if "acheteur" in logged_in_users and "fournisseur" in logged_in_users:
        try:
            acheteur = logged_in_users["acheteur"]
            fournisseur = logged_in_users["fournisseur"]
            
            rating_data = {
                "type_rating": "buyer_to_farmer",
                "evaluateur_id": acheteur["user"]["id"],
                "evalué_id": fournisseur["user"]["id"],  # Wrong role for this type
                "note": 3,
                "commentaire": "Test invalid role combination",
                "localisation": "Bamako"
            }
            
            response = requests.post(f"{API_URL}/ratings", json=rating_data)
            
            if response.status_code != 200:
                log_test("Feedback System - Invalid Role Combination", True, "Correctly rejected invalid role combination", response)
            else:
                log_test("Feedback System - Invalid Role Combination", False, "Incorrectly accepted invalid role combination", response)
                all_success = False
        except Exception as e:
            log_test("Feedback System - Invalid Role Combination", False, f"Error testing invalid role combination: {str(e)}")
            all_success = False
    
    # Test get user ratings
    if "aviculteur" in logged_in_users:
        try:
            aviculteur = logged_in_users["aviculteur"]
            
            response = requests.get(f"{API_URL}/ratings/user/{aviculteur['user']['id']}")
            
            if response.status_code == 200 and isinstance(response.json(), list):
                log_test("Feedback System - Get User Ratings", True, "Successfully retrieved user ratings", response)
            else:
                log_test("Feedback System - Get User Ratings", False, "Failed to retrieve user ratings", response)
                all_success = False
        except Exception as e:
            log_test("Feedback System - Get User Ratings", False, f"Error retrieving user ratings: {str(e)}")
            all_success = False
    
    # Test get rating summary
    if "aviculteur" in logged_in_users:
        try:
            aviculteur = logged_in_users["aviculteur"]
            
            response = requests.get(f"{API_URL}/ratings/summary/{aviculteur['user']['id']}")
            
            if response.status_code == 200 and "note_moyenne" in response.json():
                log_test("Feedback System - Get Rating Summary", True, "Successfully retrieved rating summary", response)
            else:
                log_test("Feedback System - Get Rating Summary", False, "Failed to retrieve rating summary", response)
                all_success = False
        except Exception as e:
            log_test("Feedback System - Get Rating Summary", False, f"Error retrieving rating summary: {str(e)}")
            all_success = False
    
    return all_success

# 10. Test Improved Authentication
def test_improved_authentication():
    all_success = True
    
    # Test user registration with password
    try:
        phone = f"7{random.randint(1000000, 9999999)}"
        user_data = {
            "nom": "Test Auth User",
            "telephone": phone,
            "role": "aviculteur",
            "localisation": "Test Location",
            "password": "testpassword123",
            "use_sms": False
        }
        
        response = requests.post(f"{API_URL}/users/register", json=user_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test("Improved Auth - Register with Password", True, "Successfully registered user with password", response)
            user_id = response.json()["id"]
        else:
            log_test("Improved Auth - Register with Password", False, "Failed to register user with password", response)
            all_success = False
            return all_success  # Can't continue without a user
    except Exception as e:
        log_test("Improved Auth - Register with Password", False, f"Error registering user with password: {str(e)}")
        all_success = False
        return all_success  # Can't continue without a user
    
    # Test login with password
    try:
        login_data = {
            "telephone": phone,
            "password": "testpassword123",
            "use_sms": False
        }
        
        response = requests.post(f"{API_URL}/users/login", json=login_data)
        
        if response.status_code == 200 and "token" in response.json() and response.json()["method"] == "password":
            log_test("Improved Auth - Login with Password", True, "Successfully logged in with password", response)
        else:
            log_test("Improved Auth - Login with Password", False, "Failed to log in with password", response)
            all_success = False
    except Exception as e:
        log_test("Improved Auth - Login with Password", False, f"Error logging in with password: {str(e)}")
        all_success = False
    
    # Test login with SMS
    try:
        login_data = {
            "telephone": phone,
            "use_sms": True
        }
        
        response = requests.post(f"{API_URL}/users/login", json=login_data)
        
        if response.status_code == 200 and "require_sms_verification" in response.json() and response.json()["method"] == "sms":
            log_test("Improved Auth - Request SMS Code", True, "Successfully requested SMS code", response)
            
            # We can't actually verify the SMS code in a test environment since we don't receive the SMS
            # But we can check that the endpoint exists and returns the expected format
            verification_data = {
                "user_id": response.json()["user_id"],
                "sms_code": "123456"  # This will fail, but we're just testing the endpoint
            }
            
            verify_response = requests.post(f"{API_URL}/users/verify-sms", json=verification_data)
            
            if verify_response.status_code == 401:  # Expected to fail with wrong code
                log_test("Improved Auth - Verify SMS Code", True, "SMS verification endpoint exists and correctly rejects invalid codes", verify_response)
            else:
                log_test("Improved Auth - Verify SMS Code", False, "SMS verification endpoint not working as expected", verify_response)
                all_success = False
        else:
            log_test("Improved Auth - Request SMS Code", False, "Failed to request SMS code", response)
            all_success = False
    except Exception as e:
        log_test("Improved Auth - Request SMS Code", False, f"Error requesting SMS code: {str(e)}")
        all_success = False
    
    # Test set password
    try:
        password_data = {
            "new_password": "newpassword456",
            "current_password": "testpassword123"
        }
        
        response = requests.post(f"{API_URL}/users/set-password?user_id={user_id}", json=password_data)
        
        if response.status_code == 200 and "message" in response.json():
            log_test("Improved Auth - Set Password", True, "Successfully changed password", response)
            
            # Verify we can log in with the new password
            login_data = {
                "telephone": phone,
                "password": "newpassword456",
                "use_sms": False
            }
            
            login_response = requests.post(f"{API_URL}/users/login", json=login_data)
            
            if login_response.status_code == 200 and "token" in login_response.json():
                log_test("Improved Auth - Login with New Password", True, "Successfully logged in with new password", login_response)
            else:
                log_test("Improved Auth - Login with New Password", False, "Failed to log in with new password", login_response)
                all_success = False
        else:
            log_test("Improved Auth - Set Password", False, "Failed to change password", response)
            all_success = False
    except Exception as e:
        log_test("Improved Auth - Set Password", False, f"Error changing password: {str(e)}")
        all_success = False
    
    # Test toggle SMS preference
    try:
        response = requests.post(f"{API_URL}/users/toggle-sms?user_id={user_id}")
        
        if response.status_code == 200 and "use_sms" in response.json():
            log_test("Improved Auth - Toggle SMS Preference", True, "Successfully toggled SMS preference", response)
            
            # Toggle back
            toggle_response = requests.post(f"{API_URL}/users/toggle-sms?user_id={user_id}")
            
            if toggle_response.status_code == 200 and "use_sms" in toggle_response.json() and toggle_response.json()["use_sms"] != response.json()["use_sms"]:
                log_test("Improved Auth - Toggle SMS Preference Again", True, "Successfully toggled SMS preference again", toggle_response)
            else:
                log_test("Improved Auth - Toggle SMS Preference Again", False, "Failed to toggle SMS preference again", toggle_response)
                all_success = False
        else:
            log_test("Improved Auth - Toggle SMS Preference", False, "Failed to toggle SMS preference", response)
            all_success = False
    except Exception as e:
        log_test("Improved Auth - Toggle SMS Preference", False, f"Error toggling SMS preference: {str(e)}")
        all_success = False
    
    return all_success

# 11. Test Messaging API
def test_messaging_api(logged_in_users):
    all_success = True
    
    # We need at least two users to test messaging
    if len(logged_in_users) < 2:
        log_test("Messaging API", False, "Need at least two users to test messaging")
        return False
    
    # Get two users for testing
    users = list(logged_in_users.values())
    user1 = users[0]
    user2 = users[1]
    
    # Test creating a conversation
    try:
        conversation_data = {
            "participant_id": user2["user"]["id"],
            "initial_message": "Hello, this is a test message!"
        }
        
        response = requests.post(f"{API_URL}/conversations?sender_id={user1['token']}", json=conversation_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test("Messaging API - Create Conversation", True, "Successfully created conversation", response)
            conversation_id = response.json()["id"]
        else:
            log_test("Messaging API - Create Conversation", False, "Failed to create conversation", response)
            all_success = False
            return all_success  # Can't continue without a conversation
    except Exception as e:
        log_test("Messaging API - Create Conversation", False, f"Error creating conversation: {str(e)}")
        all_success = False
        return all_success  # Can't continue without a conversation
    
    # Test getting user conversations
    try:
        response = requests.get(f"{API_URL}/conversations?user_id={user1['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            log_test("Messaging API - Get User Conversations", True, "Successfully retrieved user conversations", response)
        else:
            log_test("Messaging API - Get User Conversations", False, "Failed to retrieve user conversations", response)
            all_success = False
    except Exception as e:
        log_test("Messaging API - Get User Conversations", False, f"Error retrieving user conversations: {str(e)}")
        all_success = False
    
    # Test getting conversation messages
    try:
        response = requests.get(f"{API_URL}/conversations/{conversation_id}/messages?user_id={user1['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            log_test("Messaging API - Get Conversation Messages", True, "Successfully retrieved conversation messages", response)
        else:
            log_test("Messaging API - Get Conversation Messages", False, "Failed to retrieve conversation messages", response)
            all_success = False
    except Exception as e:
        log_test("Messaging API - Get Conversation Messages", False, f"Error retrieving conversation messages: {str(e)}")
        all_success = False
    
    # Test sending a message
    try:
        message_data = {
            "conversation_id": conversation_id,
            "recipient_id": user2["user"]["id"],
            "content": "This is another test message!"
        }
        
        response = requests.post(f"{API_URL}/messages?sender_id={user1['token']}", json=message_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test("Messaging API - Send Message", True, "Successfully sent message", response)
            message_id = response.json()["id"]
        else:
            log_test("Messaging API - Send Message", False, "Failed to send message", response)
            all_success = False
    except Exception as e:
        log_test("Messaging API - Send Message", False, f"Error sending message: {str(e)}")
        all_success = False
    
    # Test marking messages as read
    try:
        response = requests.post(f"{API_URL}/conversations/{conversation_id}/mark-read?user_id={user2['token']}")
        
        if response.status_code == 200 and "message" in response.json():
            log_test("Messaging API - Mark Messages as Read", True, "Successfully marked messages as read", response)
        else:
            log_test("Messaging API - Mark Messages as Read", False, "Failed to mark messages as read", response)
            all_success = False
    except Exception as e:
        log_test("Messaging API - Mark Messages as Read", False, f"Error marking messages as read: {str(e)}")
        all_success = False
    
    # Test getting online users
    try:
        response = requests.get(f"{API_URL}/users/online")
        
        if response.status_code == 200 and isinstance(response.json(), list):
            log_test("Messaging API - Get Online Users", True, "Successfully retrieved online users", response)
        else:
            log_test("Messaging API - Get Online Users", False, "Failed to retrieve online users", response)
            all_success = False
    except Exception as e:
        log_test("Messaging API - Get Online Users", False, f"Error retrieving online users: {str(e)}")
        all_success = False
    
    # Test getting user presence
    try:
        response = requests.get(f"{API_URL}/users/{user1['user']['id']}/presence")
        
        if response.status_code == 200 and "user_id" in response.json():
            log_test("Messaging API - Get User Presence", True, "Successfully retrieved user presence", response)
        else:
            log_test("Messaging API - Get User Presence", False, "Failed to retrieve user presence", response)
            all_success = False
    except Exception as e:
        log_test("Messaging API - Get User Presence", False, f"Error retrieving user presence: {str(e)}")
        all_success = False
    
    return all_success

# 12. Test WebSocket Connection
async def websocket_test(user_id, user_name, message_queue):
    """Async function to test WebSocket connection"""
    try:
        uri = f"{WS_URL}/{user_id}"
        async with websockets.connect(uri) as websocket:
            # Send a ping message
            ping_message = json.dumps({"type": "ping"})
            await websocket.send(ping_message)
            
            # Wait for pong response
            response = await websocket.recv()
            response_data = json.loads(response)
            
            if response_data.get("type") == "pong":
                message_queue.append(("WebSocket - Ping/Pong", True, "Successfully received pong response"))
            else:
                message_queue.append(("WebSocket - Ping/Pong", False, f"Unexpected response to ping: {response}"))
            
            # Wait for any incoming messages for a short time
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=2.0)
                message_queue.append(("WebSocket - Received Message", True, f"Received message: {response}"))
            except asyncio.TimeoutError:
                # This is expected if no messages are sent
                pass
            
            # Send a typing indicator
            typing_message = json.dumps({
                "type": "typing",
                "conversation_id": "test_conversation",
                "is_typing": True
            })
            await websocket.send(typing_message)
            message_queue.append(("WebSocket - Typing Indicator", True, "Successfully sent typing indicator"))
            
            # Wait a bit to see if we get any responses
            await asyncio.sleep(1)
            
    except Exception as e:
        message_queue.append(("WebSocket Connection", False, f"Error in WebSocket connection: {str(e)}"))
        return False

def test_websocket_connection(logged_in_users):
    """Test WebSocket connection and basic functionality"""
    if not logged_in_users:
        log_test("WebSocket Connection", False, "No users available for testing")
        return False
    
    all_success = True
    user = list(logged_in_users.values())[0]
    user_id = user["user"]["id"]
    user_name = user["user"]["nom"]
    
    # Create a message queue to collect results from the async function
    message_queue = []
    
    # Run the async WebSocket test
    try:
        asyncio.run(websocket_test(user_id, user_name, message_queue))
        
        # Process the results
        for name, success, message in message_queue:
            log_test(name, success, message)
            if not success:
                all_success = False
        
        if not message_queue:
            log_test("WebSocket Connection", False, "No WebSocket test results received")
            all_success = False
    except Exception as e:
        log_test("WebSocket Connection", False, f"Error running WebSocket test: {str(e)}")
        all_success = False
    
    return all_success

# 13. Test Order System
def test_order_system(logged_in_users, created_products):
    all_success = True
    
    # We need at least an ACHETEUR and an AVICULTEUR with a product for testing
    if "acheteur" not in logged_in_users or "aviculteur" not in logged_in_users:
        log_test("Order System", False, "Missing required users (ACHETEUR and AVICULTEUR) for testing")
        return False
    
    buyer_user = logged_in_users["acheteur"]
    seller_user = logged_in_users["aviculteur"]
    
    # Create a test product if none exists
    product = None
    if "aviculteur" in created_products and created_products["aviculteur"]:
        product = created_products["aviculteur"][0]
    
    if not product:
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
                log_test("Order System - Create Test Product", True, "Successfully created test product for order", response)
                product = response.json()
            else:
                log_test("Order System - Create Test Product", False, "Failed to create test product for order", response)
                return False
        except Exception as e:
            log_test("Order System - Create Test Product", False, f"Error creating test product for order: {str(e)}")
            return False
    
    # Test creating an order
    try:
        order_data = {
            "product_id": product["id"],
            "quantity_requested": 2,
            "message_from_buyer": "Test order message"
        }
        
        response = requests.post(f"{API_URL}/orders?buyer_id={buyer_user['token']}", json=order_data)
        
        if response.status_code == 200 and "id" in response.json():
            log_test("Order System - Create Order", True, "Successfully created order", response)
            order = response.json()
        else:
            log_test("Order System - Create Order", False, "Failed to create order", response)
            return False
    except Exception as e:
        log_test("Order System - Create Order", False, f"Error creating order: {str(e)}")
        return False
    
    # Test getting sent orders (buyer)
    try:
        response = requests.get(f"{API_URL}/orders/sent?user_id={buyer_user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            log_test("Order System - Get Sent Orders", True, "Successfully retrieved sent orders", response)
        else:
            log_test("Order System - Get Sent Orders", False, "Failed to retrieve sent orders", response)
            all_success = False
    except Exception as e:
        log_test("Order System - Get Sent Orders", False, f"Error retrieving sent orders: {str(e)}")
        all_success = False
    
    # Test getting received orders (seller)
    try:
        response = requests.get(f"{API_URL}/orders/received?user_id={seller_user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            log_test("Order System - Get Received Orders", True, "Successfully retrieved received orders", response)
        else:
            log_test("Order System - Get Received Orders", False, "Failed to retrieve received orders", response)
            all_success = False
    except Exception as e:
        log_test("Order System - Get Received Orders", False, f"Error retrieving received orders: {str(e)}")
        all_success = False
    
    # Test getting seller notifications (should have a new order notification)
    try:
        response = requests.get(f"{API_URL}/notifications?user_id={seller_user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            log_test("Order System - Seller Notifications", True, "Seller received notification about new order", response)
            seller_notification = response.json()[0]
        else:
            log_test("Order System - Seller Notifications", False, "Seller did not receive notification about new order", response)
            all_success = False
    except Exception as e:
        log_test("Order System - Seller Notifications", False, f"Error retrieving seller notifications: {str(e)}")
        all_success = False
    
    # Test order security (buyer trying to update order)
    try:
        update_data = {
            "status": "accepted",
            "response_message": "Security test"
        }
        
        response = requests.put(f"{API_URL}/orders/{order['id']}?user_id={buyer_user['token']}", json=update_data)
        
        if response.status_code != 200:
            log_test("Order System - Security", True, "Correctly prevented buyer from updating order status", response)
        else:
            log_test("Order System - Security", False, "Incorrectly allowed buyer to update order status", response)
            all_success = False
    except Exception as e:
        log_test("Order System - Security", False, f"Error testing order security: {str(e)}")
        all_success = False
    
    # Test updating order status to accepted
    try:
        update_data = {
            "status": "accepted",
            "response_message": "Order accepted"
        }
        
        response = requests.put(f"{API_URL}/orders/{order['id']}?user_id={seller_user['token']}", json=update_data)
        
        if response.status_code == 200 and "id" in response.json() and response.json()["status"] == "accepted":
            log_test("Order System - Update Status", True, "Successfully updated order status to accepted", response)
        else:
            log_test("Order System - Update Status", False, "Failed to update order status to accepted", response)
            all_success = False
            return all_success  # Can't continue if update fails
    except Exception as e:
        log_test("Order System - Update Status", False, f"Error updating order status: {str(e)}")
        all_success = False
        return all_success  # Can't continue if update fails
    
    # Give the system time to create notifications and conversation
    time.sleep(1)
    
    # Test if buyer received notification about order acceptance
    try:
        response = requests.get(f"{API_URL}/notifications?user_id={buyer_user['token']}")
        
        if response.status_code == 200 and isinstance(response.json(), list) and len(response.json()) > 0:
            log_test("Order System - Buyer Notifications", True, "Buyer received notification about order acceptance", response)
            buyer_notification = response.json()[0]
        else:
            log_test("Order System - Buyer Notifications", False, "Buyer did not receive notification about order acceptance", response)
            all_success = False
    except Exception as e:
        log_test("Order System - Buyer Notifications", False, f"Error retrieving buyer notifications: {str(e)}")
        all_success = False
    
    # Test if a conversation was created
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
                log_test("Order System - Conversation Creation", True, "Conversation was automatically created after order acceptance", response)
            else:
                log_test("Order System - Conversation Creation", False, "No conversation was created with the seller", response)
                all_success = False
        else:
            log_test("Order System - Conversation Creation", False, "Failed to retrieve conversations", response)
            all_success = False
    except Exception as e:
        log_test("Order System - Conversation Creation", False, f"Error checking conversation creation: {str(e)}")
        all_success = False
    
    # Test marking a notification as read
    if 'buyer_notification' in locals():
        try:
            response = requests.post(f"{API_URL}/notifications/{buyer_notification['id']}/mark-read?user_id={buyer_user['token']}")
            
            if response.status_code == 200 and "message" in response.json():
                log_test("Order System - Mark Notification Read", True, "Successfully marked notification as read", response)
                
                # Verify notification was marked as read
                verify_response = requests.get(f"{API_URL}/notifications?user_id={buyer_user['token']}")
                
                if verify_response.status_code == 200:
                    notifications = verify_response.json()
                    notification_marked = any(n["id"] == buyer_notification["id"] and n["read"] for n in notifications)
                    
                    log_test("Order System - Verify Notification Marked", notification_marked, 
                             "Successfully verified notification was marked as read" if notification_marked else "Failed to verify notification was marked as read")
            else:
                log_test("Order System - Mark Notification Read", False, "Failed to mark notification as read", response)
                all_success = False
        except Exception as e:
            log_test("Order System - Mark Notification Read", False, f"Error marking notification as read: {str(e)}")
            all_success = False
    
    return all_success

# Main test function
def run_tests():
    print("\n===== TESTING AVIMARCHÉ MALI BACKEND API =====\n")
    
    # Test API Root
    api_root_success = test_api_root()
    if not api_root_success:
        print("\n❌ API Root test failed. Stopping tests.")
        return
    
    # Test MongoDB Connection
    mongodb_success = test_mongodb_connection()
    if not mongodb_success:
        print("\n❌ MongoDB Connection test failed. Stopping tests.")
        return
    
    # Test User Registration
    registration_success, test_users = test_user_registration()
    if not registration_success:
        print("\n⚠️ User Registration test had some failures. Continuing with available users.")
    
    # Test User Login
    login_success, logged_in_users = test_user_login(test_users)
    if not login_success:
        print("\n⚠️ User Login test had some failures. Continuing with available logged-in users.")
    
    # Test Products API
    products_success, created_products = test_products_api(logged_in_users)
    if not products_success:
        print("\n⚠️ Products API test had some failures.")
    
    # Test Admin Endpoints
    admin_success = test_admin_endpoints()
    if not admin_success:
        print("\n⚠️ Admin Endpoints test had some failures.")
    
    # Test Additional Modules
    modules_success = test_additional_modules(logged_in_users)
    if not modules_success:
        print("\n⚠️ Additional Modules test had some failures.")
    
    # Test ACHETEUR Functionality
    acheteur_success = test_acheteur_functionality(logged_in_users)
    if not acheteur_success:
        print("\n⚠️ ACHETEUR Functionality test had some failures.")
    
    # Test Bidirectional Feedback System
    feedback_success = test_feedback_system(logged_in_users)
    if not feedback_success:
        print("\n⚠️ Bidirectional Feedback System test had some failures.")
    
    # Test Improved Authentication
    auth_success = test_improved_authentication()
    if not auth_success:
        print("\n⚠️ Improved Authentication test had some failures.")
    
    # Test Messaging API
    messaging_success = test_messaging_api(logged_in_users)
    if not messaging_success:
        print("\n⚠️ Messaging API test had some failures.")
    
    # Test Order System
    order_success = test_order_system(logged_in_users, created_products)
    if not order_success:
        print("\n⚠️ Order System test had some failures.")
    
    # Test WebSocket Connection
    try:
        websocket_success = test_websocket_connection(logged_in_users)
        if not websocket_success:
            print("\n⚠️ WebSocket Connection test had some failures.")
    except Exception as e:
        print(f"\n⚠️ WebSocket Connection test failed with error: {str(e)}")
        test_results["failure"] += 1
    
    # Print summary
    print("\n===== TEST SUMMARY =====")
    print(f"Total tests: {test_results['success'] + test_results['failure']}")
    print(f"Passed: {test_results['success']}")
    print(f"Failed: {test_results['failure']}")
    
    if test_results['failure'] == 0:
        print("\n✅ All tests passed! The backend API is working correctly.")
    else:
        print(f"\n⚠️ {test_results['failure']} tests failed. See above for details.")

if __name__ == "__main__":
    run_tests()
