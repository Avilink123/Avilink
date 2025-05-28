
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
    
    print("\n===== TESTING ORIGINAL MARKETPLACE MODULE =====")
    
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
    
    print("\n===== TESTING PRICE MONITORING MODULE =====")
    
    # Test getting price monitoring data
    success, prices = tester.test_get_prices()
    if success:
        print(f"💰 Found {len(prices)} price records")
        
        # Test filters
        filters = {"categorie": "intrants"}
        success, filtered_prices = tester.test_get_prices(filters)
        if success:
            print(f"🔍 Found {len(filtered_prices)} intrants price records")
    
    # Test reporting a new price
    new_price = {
        "categorie": "produits",
        "type_produit": "oeuf_conso",
        "prix": 125,
        "unite": "pièce",
        "localisation": "Bamako"
    }
    success, reported_price = tester.test_report_price(new_price)
    if success:
        print(f"✅ Reported new price: {reported_price['price']['type_produit']} at {reported_price['price']['prix_moyen']} FCFA/{reported_price['price']['unite']}")
    
    print("\n===== TESTING ANIMAL HEALTH MODULE =====")
    
    # Test getting diseases
    success, diseases = tester.test_get_diseases()
    if success:
        print(f"🦠 Found {len(diseases)} diseases")
        
        if len(diseases) > 0:
            # Test getting a specific disease
            disease_id = diseases[0]['id']
            success, disease = tester.test_get_disease(disease_id)
            if success:
                print(f"✅ Got details for disease: {disease['nom']}")
                print(f"   Gravité: {disease['gravite']}")
                print(f"   Symptômes: {', '.join(disease['symptomes'][:3])}...")
    
    # Test getting veterinarians
    success, vets = tester.test_get_veterinaires()
    if success:
        print(f"👨‍⚕️ Found {len(vets)} veterinarians")
        
        # Test filtering by location
        success, local_vets = tester.test_get_veterinaires("Bamako")
        if success:
            print(f"🔍 Found {len(local_vets)} veterinarians in Bamako")
    
    # Test reporting symptoms
    symptoms_data = {
        "symptomes": ["Toux", "Perte d'appétit"],
        "nombre_animaux": 5,
        "actions_prises": "Isolation des animaux malades"
    }
    success, report = tester.test_report_symptoms(symptoms_data)
    if success:
        print(f"✅ Reported symptoms for {report['nombre_animaux_affectes']} animals")
    
    # Test getting user's symptom reports
    success, reports = tester.test_get_user_symptom_reports()
    if success:
        print(f"📋 User has {len(reports)} symptom reports")
    
    # Test recording a vaccination
    vaccination_data = {
        "type_vaccin": "Newcastle",
        "nombre_animaux": 100,
        "date_vaccination": datetime.utcnow().isoformat(),
        "prochaine_vaccination": (datetime.utcnow() + timedelta(days=90)).isoformat(),
        "lot_volaille": "Lot A-2023"
    }
    success, vaccination = tester.test_record_vaccination(vaccination_data)
    if success:
        print(f"✅ Recorded vaccination of {vaccination['nombre_animaux']} animals against {vaccination['type_vaccin']}")
    
    # Test getting user's vaccination records
    success, vaccinations = tester.test_get_user_vaccinations()
    if success:
        print(f"💉 User has {len(vaccinations)} vaccination records")
    
    print("\n===== TESTING FINANCIAL TOOLS MODULE =====")
    
    # Test getting financial summary
    success, summary = tester.test_get_financial_summary()
    if success:
        print(f"💰 Financial Summary:")
        print(f"   Total Revenus: {summary['total_revenus']} FCFA")
        print(f"   Total Dépenses: {summary['total_depenses']} FCFA")
        print(f"   Bénéfice Net: {summary['benefice_net']} FCFA")
    
    # Test getting user's transactions
    success, transactions = tester.test_get_user_transactions()
    if success:
        print(f"📊 User has {len(transactions)} financial transactions")
        
        # Count by type
        revenus = [t for t in transactions if t['type_transaction'] == 'revenu']
        depenses = [t for t in transactions if t['type_transaction'] == 'depense']
        print(f"   Revenus: {len(revenus)}, Dépenses: {len(depenses)}")
    
    # Test adding a new transaction
    transaction_data = {
        "type_transaction": "revenu",
        "montant": 25000,
        "description": "Vente de poulets de chair",
        "categorie": "vente_volaille",
        "date_transaction": datetime.utcnow().isoformat(),
        "mode_paiement": "especes"
    }
    success, transaction = tester.test_add_transaction(transaction_data)
    if success:
        print(f"✅ Added new transaction: {transaction['description']} for {transaction['montant']} FCFA")
    
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
      