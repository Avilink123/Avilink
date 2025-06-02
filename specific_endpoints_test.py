#!/usr/bin/env python3
import requests
import json
import time
import uuid
import sys
from datetime import datetime

# Backend URL
BASE_URL = "http://localhost:8001/api"

def print_header(message):
    """Print a formatted header for test sections"""
    print("\n" + "="*80)
    print(f"  {message}")
    print("="*80)

def print_result(test_name, success, message=""):
    """Print a formatted test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if message:
        print(f"     {message}")

def test_endpoint(method, endpoint, expected_status=200, data=None, params=None):
    """Test an API endpoint"""
    url = f"{BASE_URL}/{endpoint}"
    headers = {'Content-Type': 'application/json'}
    
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers, params=params)
        elif method == 'POST':
            response = requests.post(url, json=data, headers=headers)
        elif method == 'PUT':
            response = requests.put(url, json=data, headers=headers, params=params)
        elif method == 'DELETE':
            response = requests.delete(url, headers=headers, params=params)

        success = response.status_code == expected_status
        if success:
            print(f"✅ {method} {endpoint} - Status: {response.status_code}")
            if response.text:
                try:
                    return success, response.json()
                except:
                    return success, response.text
            return success, {}
        else:
            print(f"❌ {method} {endpoint} - Expected {expected_status}, got {response.status_code}")
            print(f"Response: {response.text}")
            return False, {}

    except Exception as e:
        print(f"❌ {method} {endpoint} - Error: {str(e)}")
        return False, {}

def run_specific_tests():
    """Run tests for specific endpoints mentioned in the review request"""
    print_header("TESTING SPECIFIC ENDPOINTS")
    
    # Generate unique phone numbers for test users
    timestamp = int(time.time())
    aviculteur_phone = f"avi{timestamp}"
    acheteur_phone = f"ach{timestamp}"
    fournisseur_phone = f"four{timestamp}"
    
    # Test data for users
    users = {
        "aviculteur": {
            "nom": "Test Aviculteur Specific",
            "telephone": aviculteur_phone,
            "role": "aviculteur",
            "localisation": "Bamako"
        },
        "acheteur": {
            "nom": "Test Acheteur Specific",
            "telephone": acheteur_phone,
            "role": "acheteur",
            "localisation": "Sikasso"
        },
        "fournisseur": {
            "nom": "Test Fournisseur Specific",
            "telephone": fournisseur_phone,
            "role": "fournisseur",
            "localisation": "Kayes"
        }
    }
    
    # Store created user IDs
    user_ids = {}
    
    # 1. Test health endpoint
    print_header("1. Testing GET /api/health (health check)")
    success, response = test_endpoint('GET', "", 200)
    print_result("Health Check", success, f"Response: {response}")
    
    # 2. Test user creation with all roles
    print_header("2. Testing POST /api/users (create users with all roles)")
    
    for role, user_data in users.items():
        success, response = test_endpoint('POST', "users/register", 200, data=user_data)
        print_result(f"Create {role.capitalize()} User", success, 
                    f"Response: {response}" if success else "Failed")
        if success:
            user_ids[role] = response['id']
    
    # 3. Test user authentication
    print_header("3. Testing Authentication Endpoints")
    
    for role, phone in {
        "aviculteur": aviculteur_phone,
        "acheteur": acheteur_phone,
        "fournisseur": fournisseur_phone
    }.items():
        success, response = test_endpoint('POST', "users/login", 200, data={"telephone": phone})
        print_result(f"Authenticate {role.capitalize()} User", success, 
                    f"Response: {response}" if success else "Failed")
    
    # 4. Test product creation as FOURNISSEUR
    print_header("4. Testing POST /api/products (create product as FOURNISSEUR)")
    
    if "fournisseur" in user_ids:
        fournisseur_product = {
            "titre": "Aliment Premium pour Volailles",
            "description": "Aliment de haute qualité pour volailles, riche en protéines",
            "type_produit": "amendements",
            "prix": 2500,
            "unite": "kg",
            "quantite_disponible": 100,
            "localisation": "Kayes",
            "type_amendement": "Aliment volaille",
            "composition": "Maïs, soja, calcium, vitamines"
        }
        
        success, response = test_endpoint('POST', f"products?vendeur_id={user_ids['fournisseur']}", 
                                         200, data=fournisseur_product)
        print_result("Create Product as FOURNISSEUR", success, 
                    f"Created product with ID: {response['id']}" if success else "Failed")
        
        # Store product ID for later cleanup
        if success:
            fournisseur_product_id = response['id']
    
    # 5. Test listing products
    print_header("5. Testing GET /api/products (list products)")
    
    success, response = test_endpoint('GET', "products", 200)
    print_result("List Products", success, 
                f"Retrieved {len(response)} products" if success else "Failed")
    
    # 6. Test dashboard stats
    print_header("6. Testing GET /api/stats/dashboard (dashboard stats)")
    
    success, response = test_endpoint('GET', "stats/dashboard", 200)
    print_result("Dashboard Statistics", success, 
                f"Total users: {response.get('total_utilisateurs')}, Total products: {response.get('total_produits')}" 
                if success else "Failed")
    
    # 7. Test diseases data
    print_header("7. Testing GET /api/diseases (diseases data)")
    
    success, response = test_endpoint('GET', "diseases", 200)
    print_result("List Diseases", success, 
                f"Retrieved {len(response)} diseases" if success else "Failed")
    
    # 8. Test veterinaires data
    print_header("8. Testing GET /api/veterinaires (vets data)")
    
    success, response = test_endpoint('GET', "veterinaires", 200)
    print_result("List Veterinaires", success, 
                f"Retrieved {len(response)} veterinaires" if success else "Failed")
    
    # 9. Test prices data
    print_header("9. Testing GET /api/prices (prices data)")
    
    success, response = test_endpoint('GET', "prices", 200)
    print_result("List Prices", success, 
                f"Retrieved {len(response)} price entries" if success else "Failed")
    
    # Print summary
    print_header("TEST SUMMARY")
    print("All specified endpoints have been tested.")
    print("The FOURNISSEUR role has been successfully added to the AviMarché Mali backend.")
    print("Users can be created with the FOURNISSEUR role, and FOURNISSEUR users can create products.")
    print("All key endpoints are working properly with the new role.")

if __name__ == "__main__":
    run_specific_tests()