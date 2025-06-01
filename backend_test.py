
import requests
import sys
import time
from datetime import datetime, timedelta

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
        success, response = self.run_test(
            "Create Product",
            "POST",
            f"products?vendeur_id={self.user_id}",
            200,
            data=product_data
        )
        if success and 'id' in response:
            self.test_product_id = response['id']
        return success, response

    def test_update_product(self, product_id, update_data):
        """Test updating a product"""
        return self.run_test(
            "Update Product",
            "PUT",
            f"products/{product_id}?vendeur_id={self.user_id}",
            200,
            data=update_data
        )

    def test_delete_product(self, product_id):
        """Test deleting a product"""
        return self.run_test(
            "Delete Product",
            "DELETE",
            f"products/{product_id}?vendeur_id={self.user_id}",
            200
        )

    # New methods for Price Monitoring module
    def test_get_prices(self, filters=None):
        """Test getting price monitoring data with optional filters"""
        return self.run_test(
            "Get Price Monitoring Data",
            "GET",
            "prices",
            200,
            params=filters
        )

    def test_report_price(self, price_data):
        """Test reporting a new price"""
        return self.run_test(
            "Report Price",
            "POST",
            f"prices/report?reporter_id={self.user_id}",
            200,
            data=price_data
        )

    # New methods for Animal Health module
    def test_get_diseases(self):
        """Test getting diseases list"""
        return self.run_test(
            "Get Diseases",
            "GET",
            "diseases",
            200
        )

    def test_get_disease(self, disease_id):
        """Test getting a specific disease"""
        return self.run_test(
            "Get Disease Details",
            "GET",
            f"diseases/{disease_id}",
            200
        )

    def test_report_symptoms(self, symptoms_data):
        """Test reporting symptoms"""
        return self.run_test(
            "Report Symptoms",
            "POST",
            f"symptoms/report?user_id={self.user_id}",
            200,
            data=symptoms_data
        )

    def test_get_user_symptom_reports(self):
        """Test getting user's symptom reports"""
        return self.run_test(
            "Get User Symptom Reports",
            "GET",
            f"symptoms/user/{self.user_id}",
            200
        )

    def test_get_veterinaires(self, localisation=None):
        """Test getting veterinarians list"""
        params = {"localisation": localisation} if localisation else None
        return self.run_test(
            "Get Veterinarians",
            "GET",
            "veterinaires",
            200,
            params=params
        )

    def test_record_vaccination(self, vaccination_data):
        """Test recording a vaccination"""
        return self.run_test(
            "Record Vaccination",
            "POST",
            f"vaccinations?user_id={self.user_id}",
            200,
            data=vaccination_data
        )

    def test_get_user_vaccinations(self):
        """Test getting user's vaccination records"""
        return self.run_test(
            "Get User Vaccinations",
            "GET",
            f"vaccinations/user/{self.user_id}",
            200
        )

    # New methods for Financial Tools module
    def test_add_transaction(self, transaction_data):
        """Test adding a financial transaction"""
        return self.run_test(
            "Add Financial Transaction",
            "POST",
            f"finances/transaction?user_id={self.user_id}",
            200,
            data=transaction_data
        )

    def test_get_user_transactions(self, limit=50):
        """Test getting user's financial transactions"""
        return self.run_test(
            "Get User Transactions",
            "GET",
            f"finances/transactions/user/{self.user_id}?limit={limit}",
            200
        )

    def test_get_financial_summary(self, days=30):
        """Test getting financial summary"""
        return self.run_test(
            "Get Financial Summary",
            "GET",
            f"finances/summary/user/{self.user_id}?days={days}",
            200
        )

def test_admin_endpoints(tester):
    """Test admin-specific endpoints"""
    print("\n===== TESTING ADMIN ENDPOINTS =====")
    
    # Test admin stats endpoint
    success_stats, stats_data = tester.run_test(
        "Admin Stats",
        "GET",
        "admin/stats",
        200
    )
    
    if success_stats:
        print("✅ Admin stats endpoint working")
        print(f"  - Total users: {stats_data['general_stats']['total_users']}")
        print(f"  - Total products: {stats_data['general_stats']['total_products']}")
        print(f"  - Active products: {stats_data['general_stats']['active_products']}")
        print(f"  - Users by role: {stats_data['users_by_role']}")
    else:
        print("❌ Admin stats endpoint failed")
    
    # Test admin export endpoint
    success_export, export_data = tester.run_test(
        "Admin Export",
        "GET",
        "admin/export",
        200
    )
    
    if success_export:
        print("✅ Admin export endpoint working")
        print(f"  - Export summary: {export_data['summary']}")
    else:
        print("❌ Admin export endpoint failed")
    
    return success_stats and success_export

def main():
    # Get the backend URL from the frontend .env file
    backend_url = "https://73f50d78-544a-4e40-998e-545a731a11e7.preview.emergentagent.com"
    
    print(f"🚀 Testing AviMarché API at {backend_url}")
    tester = AviMarcheAPITester(backend_url)
    
    print("\n===== TESTING USER ROLES =====")
    
    # Test user registration with different roles
    print("\n🔍 Testing user registration with different roles...")
    
    # Test registering with role 'acheteur'
    acheteur_data = {
        "nom": "Test Acheteur",
        "telephone": "7512",  # Will be made unique with timestamp
        "role": "acheteur",
        "localisation": "Bamako"
    }
    success_acheteur, registered_acheteur = tester.test_register(acheteur_data)
    if success_acheteur:
        print(f"✅ Registered new acheteur: {registered_acheteur['nom']} with role {registered_acheteur['role']}")
    
    # Test registering with role 'aviculteur'
    aviculteur_data = {
        "nom": "Test Aviculteur",
        "telephone": "7513",  # Will be made unique with timestamp
        "role": "aviculteur",
        "localisation": "Sikasso"
    }
    success_aviculteur, registered_aviculteur = tester.test_register(aviculteur_data)
    if success_aviculteur:
        print(f"✅ Registered new aviculteur: {registered_aviculteur['nom']} with role {registered_aviculteur['role']}")
    
    # Test registering with role 'fournisseur' (should fail or be converted to another role)
    fournisseur_data = {
        "nom": "Test Fournisseur",
        "telephone": "7514",  # Will be made unique with timestamp
        "role": "fournisseur",
        "localisation": "Kayes"
    }
    success_fournisseur, registered_fournisseur = tester.test_register(fournisseur_data)
    if success_fournisseur:
        print(f"⚠️ Registered user with 'fournisseur' role: {registered_fournisseur['nom']} with role {registered_fournisseur['role']}")
        print("   This should not be possible if 'fournisseur' role has been removed")
    else:
        print("✅ Registration with 'fournisseur' role failed as expected")
    
    print("\n===== TESTING EXISTING USERS =====")
    
    # Test login with Amadou Traoré (aviculteur)
    success_amadou, user_amadou = tester.test_login("76123456")
    if success_amadou:
        print(f"✅ Logged in as Amadou Traoré (Role: {user_amadou['role']})")
        
        # Test product creation (should work for aviculteur)
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
        
        success_create, created_product = tester.test_create_product(new_product)
        if success_create:
            print(f"✅ Aviculteur can create products: {created_product['titre']}")
            
            # Clean up
            if tester.test_product_id:
                tester.test_delete_product(tester.test_product_id)
        else:
            print("❌ Aviculteur cannot create products")
    else:
        print("❌ Login as Amadou Traoré failed")
    
    # Test login with Ibrahim Koné (acheteur)
    tester = AviMarcheAPITester(backend_url)  # Reset tester
    success_ibrahim, user_ibrahim = tester.test_login("65432189")
    if success_ibrahim:
        print(f"✅ Logged in as Ibrahim Koné (Role: {user_ibrahim['role']})")
        
        # Test product creation (should fail for acheteur)
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
        
        success_create, _ = tester.test_create_product(new_product)
        if not success_create:
            print("✅ Acheteur cannot create products (as expected)")
        else:
            print("❌ Acheteur can create products (unexpected)")
            
            # Clean up if needed
            if tester.test_product_id:
                tester.test_delete_product(tester.test_product_id)
    else:
        print("❌ Login as Ibrahim Koné failed")
    
    # Test login with Fatoumata Diallo (changed from fournisseur to aviculteur)
    tester = AviMarcheAPITester(backend_url)  # Reset tester
    success_fatoumata, user_fatoumata = tester.test_login("70987654")
    if success_fatoumata:
        print(f"✅ Logged in as Fatoumata Diallo (Role: {user_fatoumata['role']})")
        
        if user_fatoumata['role'] == 'aviculteur':
            print("✅ Fatoumata's role has been changed from fournisseur to aviculteur")
            
            # Test product creation (should work for aviculteur)
            new_product = {
                "titre": "Test Oeufs Frais",
                "description": "Oeufs frais pour test API",
                "type_produit": "oeufs",
                "prix": 150,
                "unite": "pièce",
                "quantite_disponible": 100,
                "localisation": "Sikasso",
                "type_oeuf": "poule",
                "fraicheur_jours": 1
            }
            
            success_create, created_product = tester.test_create_product(new_product)
            if success_create:
                print(f"✅ Fatoumata (now aviculteur) can create products: {created_product['titre']}")
                
                # Clean up
                if tester.test_product_id:
                    tester.test_delete_product(tester.test_product_id)
            else:
                print("❌ Fatoumata (now aviculteur) cannot create products")
        else:
            print(f"❌ Fatoumata's role is still {user_fatoumata['role']}, not aviculteur")
    else:
        print("❌ Login as Fatoumata Diallo failed")
    
    # Test admin endpoints with Amadou Traoré (admin user)
    print("\n===== TESTING ADMIN USER =====")
    tester = AviMarcheAPITester(backend_url)  # Reset tester
    success_amadou, user_amadou = tester.test_login("76123456")
    if success_amadou:
        print(f"✅ Logged in as Amadou Traoré (Role: {user_amadou['role']})")
        
        # Test admin endpoints
        admin_success = test_admin_endpoints(tester)
        if admin_success:
            print("✅ Admin endpoints working correctly")
        else:
            print("❌ Some admin endpoints failed")
    else:
        print("❌ Login as Amadou Traoré failed")
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
      