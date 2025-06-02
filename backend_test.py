#!/usr/bin/env python3
import requests
import json
import uuid
import time
from datetime import datetime, timedelta
import random
import os

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://24d63c5a-1f9d-4a54-b336-7bbd28ae59ae.preview.emergentagent.com"
API_URL = f"{BACKEND_URL}/api"

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
    
    return all_success

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
    products_success = test_products_api(logged_in_users)
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
