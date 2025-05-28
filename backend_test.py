
import requests
import sys
import time
from datetime import datetime

class AviMarcheAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_product_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
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
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.text:
                    try:
                        return success, response.json()
                    except:
                        return success, response.text
                return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root(self):
        """Test the root API endpoint"""
        return self.run_test(
            "API Root",
            "GET",
            "",
            200
        )

    def test_stats(self):
        """Test the dashboard stats endpoint"""
        return self.run_test(
            "Dashboard Stats",
            "GET",
            "stats/dashboard",
            200
        )

    def test_login(self, telephone):
        """Test login with phone number"""
        success, response = self.run_test(
            "Login",
            "POST",
            "users/login",
            200,
            data={"telephone": telephone}
        )
        if success and 'user' in response and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            print(f"Logged in as {response['user']['nom']} (Role: {response['user']['role']})")
            return True, response['user']
        return False, None

    def test_register(self, user_data):
        """Test user registration"""
        timestamp = int(time.time())
        user_data['telephone'] = f"{user_data['telephone']}{timestamp}"  # Make phone unique
        
        success, response = self.run_test(
            "Register User",
            "POST",
            "users/register",
            200,
            data=user_data
        )
        return success, response

    def test_get_products(self, filters=None):
        """Test getting products with optional filters"""
        return self.run_test(
            "Get Products",
            "GET",
            "products",
            200,
            params=filters
        )

    def test_get_user_products(self, user_id):
        """Test getting products for a specific user"""
        return self.run_test(
            "Get User Products",
            "GET",
            f"products/user/{user_id}",
            200
        )

    def test_create_product(self, product_data):
        """Test creating a new product"""
        params = {"vendeur_id": self.user_id}
        success, response = self.run_test(
            "Create Product",
            "POST",
            "products",
            200,
            data=product_data,
            params=params
        )
        if success and 'id' in response:
            self.test_product_id = response['id']
        return success, response

    def test_update_product(self, product_id, update_data):
        """Test updating a product"""
        params = {"vendeur_id": self.user_id}
        return self.run_test(
            "Update Product",
            "PUT",
            f"products/{product_id}",
            200,
            data=update_data,
            params=params
        )

    def test_delete_product(self, product_id):
        """Test deleting a product"""
        params = {"vendeur_id": self.user_id}
        return self.run_test(
            "Delete Product",
            "DELETE",
            f"products/{product_id}",
            200,
            params=params
        )

def main():
    # Get the backend URL from the frontend .env file
    backend_url = "https://0bb20f80-d827-4ef9-9415-c8ae287826b9.preview.emergentagent.com"
    
    print(f"🚀 Testing AviMarché API at {backend_url}")
    tester = AviMarcheAPITester(backend_url)
    
    # Test basic API endpoints
    tester.test_root()
    success, stats = tester.test_stats()
    if success:
        print(f"📊 Dashboard Stats: {stats}")
    
    # Test login with existing user
    success, user = tester.test_login("76123456")  # Amadou Traoré (aviculteur)
    if not success:
        print("❌ Login failed, stopping tests")
        return 1
    
    # Test getting products
    success, products = tester.test_get_products()
    if success:
        print(f"📦 Found {len(products)} products")
        
        # Test filters
        filters = {"type_produit": "volaille_vivante"}
        success, filtered_products = tester.test_get_products(filters)
        if success:
            print(f"🔍 Found {len(filtered_products)} volaille_vivante products")
    
    # Test getting user's products
    success, user_products = tester.test_get_user_products(tester.user_id)
    if success:
        print(f"👤 User has {len(user_products)} products")
    
    # Test product creation (only for aviculteur or fournisseur)
    if user['role'] in ['aviculteur', 'fournisseur']:
        new_product = {
            "titre": "Test Poulets de Chair",
            "description": "Poulets de chair pour test API",
            "type_produit": "volaille_vivante",
            "prix": 4000,
            "unite": "pièce",
            "quantite_disponible": 10,
            "localisation": "Bamako",
            "race_volaille": "Cobb 500",
            "age_semaines": 7,
            "poids_moyen": 2.0
        }
        
        success, created_product = tester.test_create_product(new_product)
        if success:
            print(f"✅ Created product: {created_product['titre']}")
            
            # Test product update
            update_data = {
                "prix": 4500,
                "quantite_disponible": 8
            }
            success, updated_product = tester.test_update_product(tester.test_product_id, update_data)
            if success:
                print(f"✅ Updated product price to {updated_product['prix']} FCFA")
            
            # Test product deletion
            success, _ = tester.test_delete_product(tester.test_product_id)
            if success:
                print("✅ Deleted test product")
    
    # Test user registration
    new_user = {
        "nom": "Test Utilisateur",
        "telephone": "7512",  # Will be made unique with timestamp
        "role": "acheteur",
        "localisation": "Sikasso"
    }
    success, registered_user = tester.test_register(new_user)
    if success:
        print(f"✅ Registered new user: {registered_user['nom']}")
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
      