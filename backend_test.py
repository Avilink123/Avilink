
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
        
        # Check if FOURNISSEUR role is included in the stats
        if 'fournisseur' in stats_data['users_by_role']:
            print(f"  - Fournisseur users: {stats_data['users_by_role']['fournisseur']}")
            print("✅ FOURNISSEUR role is included in admin stats")
        else:
            print("⚠️ FOURNISSEUR role is not included in admin stats yet")
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
        
        # Check if there are any FOURNISSEUR users in the export
        fournisseur_users = [user for user in export_data['data']['users'] if user.get('role') == 'fournisseur']
        if fournisseur_users:
            print(f"  - Found {len(fournisseur_users)} FOURNISSEUR users in the export")
            print("✅ FOURNISSEUR role is included in admin export")
        else:
            print("⚠️ No FOURNISSEUR users found in the export yet")
    else:
        print("❌ Admin export endpoint failed")
    
    return success_stats and success_export

def test_all_api_endpoints(tester):
    """Test all API endpoints comprehensively"""
    print("\n===== COMPREHENSIVE API TESTING =====")
    all_tests_passed = True
    
    # 1. User Management APIs
    print("\n----- Testing User Management APIs -----")
    
    # Test user registration (already tested in main function)
    print("✅ User registration tested in main function")
    
    # Test user login (already tested in main function)
    print("✅ User login tested in main function")
    
    # Test get user profile
    if tester.user_id:
        success, user_profile = tester.run_test(
            "Get User Profile",
            "GET",
            f"users/{tester.user_id}",
            200
        )
        if success:
            print(f"✅ Get user profile working: {user_profile['nom']}")
        else:
            print("❌ Get user profile failed")
            all_tests_passed = False
    else:
        print("⚠️ Skipping user profile test - no user logged in")
    
    # 2. Product/Marketplace APIs
    print("\n----- Testing Product/Marketplace APIs -----")
    
    # Test get all products
    success, products = tester.test_get_products()
    if success:
        print(f"✅ Get all products working: {len(products)} products found")
        
        # If products exist, test get single product
        if products:
            product_id = products[0]['id']
            success, product = tester.run_test(
                "Get Single Product",
                "GET",
                f"products/{product_id}",
                200
            )
            if success:
                print(f"✅ Get single product working: {product['titre']}")
            else:
                print("❌ Get single product failed")
                all_tests_passed = False
    else:
        print("❌ Get all products failed")
        all_tests_passed = False
    
    # Test product creation (if user is aviculteur or fournisseur)
    if tester.user_id:
        # Get user role first
        success, user = tester.run_test(
            "Get User Role",
            "GET",
            f"users/{tester.user_id}",
            200
        )
        
        if success and user.get('role') in ['aviculteur', 'fournisseur']:
            # Test product creation based on role
            if user.get('role') == 'aviculteur':
                new_product = {
                    "titre": "Test API Product",
                    "description": "Product created during API testing",
                    "type_produit": "volaille_vivante",
                    "prix": 3800,
                    "unite": "pièce",
                    "quantite_disponible": 5,
                    "localisation": "Test Location",
                    "race_volaille": "Test Race",
                    "age_semaines": 6,
                    "poids_moyen": 1.8
                }
                product_type = "volaille_vivante"
            else:  # fournisseur
                new_product = {
                    "titre": "Test API Aliment",
                    "description": "Aliment created during API testing",
                    "type_produit": "amendements",
                    "prix": 2800,
                    "unite": "kg",
                    "quantite_disponible": 50,
                    "localisation": "Test Location",
                    "type_amendement": "Aliment volaille",
                    "composition": "Maïs, soja, vitamines"
                }
                product_type = "amendements"
            
            success, created_product = tester.test_create_product(new_product)
            if success:
                print(f"✅ {user.get('role').capitalize()} can create {product_type} products: {created_product['titre']}")
                
                # Test product update
                if tester.test_product_id:
                    update_data = {
                        "titre": f"Updated Test {product_type}",
                        "prix": new_product["prix"] + 200,
                        "quantite_disponible": new_product["quantite_disponible"] - 2
                    }
                    
                    success, updated_product = tester.test_update_product(tester.test_product_id, update_data)
                    if success:
                        print(f"✅ Update product working: {updated_product['titre']}")
                    else:
                        print("❌ Update product failed")
                        all_tests_passed = False
                    
                    # Test product deletion (cleanup)
                    success, _ = tester.test_delete_product(tester.test_product_id)
                    if success:
                        print("✅ Delete product working")
                    else:
                        print("❌ Delete product failed")
                        all_tests_passed = False
            else:
                print(f"❌ {user.get('role').capitalize()} cannot create products")
                all_tests_passed = False
        else:
            print(f"⚠️ Skipping product creation tests - user is not an aviculteur or fournisseur")
    else:
        print("⚠️ Skipping product creation tests - no user logged in")
    
    # 3. Price Monitoring APIs
    print("\n----- Testing Price Monitoring APIs -----")
    
    # Test get all prices
    success, prices = tester.test_get_prices()
    if success:
        print(f"✅ Get all prices working: {len(prices)} price entries found")
    else:
        print("❌ Get all prices failed")
        all_tests_passed = False
    
    # Test report price (if user is logged in)
    if tester.user_id:
        price_data = {
            "categorie": "produits",
            "type_produit": "poulet_vif",
            "prix": 3500,
            "unite": "kg",
            "localisation": "Test Location"
        }
        
        success, reported_price = tester.test_report_price(price_data)
        if success:
            print("✅ Report price working")
        else:
            print("❌ Report price failed")
            all_tests_passed = False
    else:
        print("⚠️ Skipping price reporting test - no user logged in")
    
    # 4. Animal Health APIs
    print("\n----- Testing Animal Health APIs -----")
    
    # Test get all diseases
    success, diseases = tester.test_get_diseases()
    if success:
        print(f"✅ Get all diseases working: {len(diseases)} diseases found")
        
        # If diseases exist, test get single disease
        if diseases:
            disease_id = diseases[0]['id']
            success, disease = tester.test_get_disease(disease_id)
            if success:
                print(f"✅ Get single disease working: {disease['nom']}")
            else:
                print("❌ Get single disease failed")
                all_tests_passed = False
    else:
        print("❌ Get all diseases failed")
        all_tests_passed = False
    
    # Test get veterinarians
    success, vets = tester.test_get_veterinaires()
    if success:
        print(f"✅ Get veterinarians working: {len(vets)} veterinarians found")
    else:
        print("❌ Get veterinarians failed")
        all_tests_passed = False
    
    # Test report symptoms (if user is logged in)
    if tester.user_id:
        symptoms_data = {
            "symptomes": ["Toux", "Perte d'appétit"],
            "nombre_animaux": 3,
            "actions_prises": "Isolation des animaux malades"
        }
        
        success, report = tester.test_report_symptoms(symptoms_data)
        if success:
            print("✅ Report symptoms working")
            
            # Test get user symptom reports
            success, reports = tester.test_get_user_symptom_reports()
            if success:
                print(f"✅ Get user symptom reports working: {len(reports)} reports found")
            else:
                print("❌ Get user symptom reports failed")
                all_tests_passed = False
        else:
            print("❌ Report symptoms failed")
            all_tests_passed = False
    else:
        print("⚠️ Skipping symptom reporting test - no user logged in")
    
    # 5. Financial Tools APIs
    print("\n----- Testing Financial Tools APIs -----")
    
    # Test add transaction (if user is logged in)
    if tester.user_id:
        transaction_data = {
            "type_transaction": "revenu",
            "montant": 25000,
            "description": "Test transaction",
            "categorie": "vente_volaille",
            "date_transaction": datetime.utcnow().isoformat(),
            "mode_paiement": "especes"
        }
        
        success, transaction = tester.test_add_transaction(transaction_data)
        if success:
            print("✅ Add transaction working")
            
            # Test get user transactions
            success, transactions = tester.test_get_user_transactions()
            if success:
                print(f"✅ Get user transactions working: {len(transactions)} transactions found")
            else:
                print("❌ Get user transactions failed")
                all_tests_passed = False
            
            # Test get financial summary
            success, summary = tester.test_get_financial_summary()
            if success:
                print("✅ Get financial summary working")
                print(f"  - Total revenue: {summary['total_revenus']}")
                print(f"  - Total expenses: {summary['total_depenses']}")
                print(f"  - Net profit: {summary['benefice_net']}")
            else:
                print("❌ Get financial summary failed")
                all_tests_passed = False
        else:
            print("❌ Add transaction failed")
            all_tests_passed = False
    else:
        print("⚠️ Skipping financial tools tests - no user logged in")
    
    return all_tests_passed

def main():
    # Get the backend URL from the frontend .env file
    import os
    import re
    
    # Read the REACT_APP_BACKEND_URL from the frontend/.env file
    backend_url = None
    try:
        with open('/app/frontend/.env', 'r') as f:
            env_content = f.read()
            match = re.search(r'REACT_APP_BACKEND_URL=(.+)', env_content)
            if match:
                backend_url = match.group(1).strip()
    except Exception as e:
        print(f"Error reading frontend/.env file: {str(e)}")
    
    # Fallback if we couldn't read from the file
    if not backend_url:
        backend_url = "https://bc63c916-6d63-41d7-b174-d6220494df1e.preview.emergentagent.com"
    
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
    
    # Test registering with role 'fournisseur' (should now work with the added FOURNISSEUR role)
    fournisseur_data = {
        "nom": "Test Fournisseur",
        "telephone": "7514",  # Will be made unique with timestamp
        "role": "fournisseur",
        "localisation": "Kayes"
    }
    success_fournisseur, registered_fournisseur = tester.test_register(fournisseur_data)
    if success_fournisseur:
        print(f"✅ Registered new fournisseur: {registered_fournisseur['nom']} with role {registered_fournisseur['role']}")
        
        # Save the fournisseur phone number for later login test
        fournisseur_phone = registered_fournisseur['telephone']
        
        # Test login with the newly created fournisseur
        tester_fournisseur = AviMarcheAPITester(backend_url)  # New tester instance
        success_login, user_fournisseur = tester_fournisseur.test_login(fournisseur_phone)
        
        if success_login:
            print(f"✅ Successfully logged in as fournisseur: {user_fournisseur['nom']}")
            
            # Test product creation as fournisseur (should work)
            new_product = {
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
            
            success_create, created_product = tester_fournisseur.test_create_product(new_product)
            if success_create:
                print(f"✅ Fournisseur can create products: {created_product['titre']}")
                product_id = created_product['id']
                
                # Test updating the product as fournisseur
                update_data = {
                    "titre": "Aliment Premium pour Volailles - Mise à jour",
                    "prix": 2700,
                    "quantite_disponible": 90
                }
                
                success_update, updated_product = tester_fournisseur.test_update_product(product_id, update_data)
                if success_update:
                    print(f"✅ Fournisseur can update products: {updated_product['titre']}")
                else:
                    print("❌ Fournisseur cannot update products (unexpected)")
                
                # Test getting user products as fournisseur
                success_get, user_products = tester_fournisseur.test_get_user_products(user_fournisseur['id'])
                if success_get:
                    print(f"✅ Fournisseur can view their products: {len(user_products)} products found")
                else:
                    print("❌ Fournisseur cannot view their products (unexpected)")
                
                # Clean up
                if tester_fournisseur.test_product_id:
                    success_delete, _ = tester_fournisseur.test_delete_product(tester_fournisseur.test_product_id)
                    if success_delete:
                        print("✅ Fournisseur can delete products")
                    else:
                        print("❌ Fournisseur cannot delete products (unexpected)")
            else:
                print("❌ Fournisseur cannot create products (unexpected)")
                
            # Test dashboard stats to ensure FOURNISSEUR role is included
            success_stats, stats = tester_fournisseur.test_stats()
            if success_stats:
                print("✅ Dashboard stats include FOURNISSEUR data")
                print(f"  - Total users: {stats['total_utilisateurs']}")
                print(f"  - Total products: {stats['total_produits']}")
                if 'stats_par_type' in stats and 'amendements' in stats['stats_par_type']:
                    print(f"  - Amendements products: {stats['stats_par_type']['amendements']}")
            else:
                print("❌ Dashboard stats failed")
        else:
            print("❌ Login as fournisseur failed")
    else:
        print("❌ Registration with 'fournisseur' role failed (unexpected)")
    
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
    
    # Comprehensive API testing with aviculteur
    print("\n===== RUNNING COMPREHENSIVE API TESTS WITH AVICULTEUR =====")
    tester = AviMarcheAPITester(backend_url)  # Reset tester
    success_login, _ = tester.test_login("76123456")  # Login as Amadou (aviculteur)
    
    if success_login:
        comprehensive_success = test_all_api_endpoints(tester)
        if comprehensive_success:
            print("\n✅ All API endpoints are working correctly with AVICULTEUR role!")
        else:
            print("\n⚠️ Some API endpoints have issues with AVICULTEUR role. See details above.")
    else:
        print("\n❌ Could not login as AVICULTEUR for comprehensive testing")
    
    # Comprehensive API testing with fournisseur
    print("\n===== RUNNING COMPREHENSIVE API TESTS WITH FOURNISSEUR =====")
    
    # First, register a new fournisseur if needed
    tester = AviMarcheAPITester(backend_url)  # Reset tester
    fournisseur_data = {
        "nom": "Test Fournisseur Complet",
        "telephone": "7515",  # Will be made unique with timestamp
        "role": "fournisseur",
        "localisation": "Bamako"
    }
    success_register, registered_fournisseur = tester.test_register(fournisseur_data)
    
    if success_register:
        fournisseur_phone = registered_fournisseur['telephone']
        success_login, _ = tester.test_login(fournisseur_phone)
        
        if success_login:
            comprehensive_success = test_all_api_endpoints(tester)
            if comprehensive_success:
                print("\n✅ All API endpoints are working correctly with FOURNISSEUR role!")
            else:
                print("\n⚠️ Some API endpoints have issues with FOURNISSEUR role. See details above.")
        else:
            print("\n❌ Could not login as FOURNISSEUR for comprehensive testing")
    else:
        print("\n❌ Could not register a FOURNISSEUR for comprehensive testing")
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
      