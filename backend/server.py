from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer()

# Enums for French interface
class UserRole(str, Enum):
    AVICULTEUR = "aviculteur"
    ACHETEUR = "acheteur"
    FOURNISSEUR = "fournisseur"

class ProductType(str, Enum):
    VOLAILLE_VIVANTE = "volaille_vivante"
    OEUFS = "oeufs"
    VOLAILLE_TRANSFORMEE = "volaille_transformee"
    AMENDEMENTS = "amendements"
    FIENTES = "fientes"

class ProductStatus(str, Enum):
    DISPONIBLE = "disponible"
    VENDU = "vendu"
    SUSPENDU = "suspendu"

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nom: str
    telephone: str
    role: UserRole
    localisation: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class UserCreate(BaseModel):
    nom: str
    telephone: str
    role: UserRole
    localisation: str

class UserLogin(BaseModel):
    telephone: str

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    titre: str
    description: str
    type_produit: ProductType
    prix: float
    unite: str  # kg, pièce, douzaine, etc.
    quantite_disponible: int
    localisation: str
    vendeur_id: str
    vendeur_nom: str
    vendeur_telephone: str
    status: ProductStatus = ProductStatus.DISPONIBLE
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Champs spécifiques selon le type
    race_volaille: Optional[str] = None  # Pour volaille
    age_semaines: Optional[int] = None   # Pour volaille
    poids_moyen: Optional[float] = None  # Pour volaille
    type_oeuf: Optional[str] = None      # Pour œufs (poule, canard, etc.)
    fraicheur_jours: Optional[int] = None # Pour œufs
    type_transformation: Optional[str] = None # Pour volaille transformée
    type_amendement: Optional[str] = None     # Pour amendements
    composition: Optional[str] = None         # Pour amendements/fientes

class ProductCreate(BaseModel):
    titre: str
    description: str
    type_produit: ProductType
    prix: float
    unite: str
    quantite_disponible: int
    localisation: str
    race_volaille: Optional[str] = None
    age_semaines: Optional[int] = None
    poids_moyen: Optional[float] = None
    type_oeuf: Optional[str] = None
    fraicheur_jours: Optional[int] = None
    type_transformation: Optional[str] = None
    type_amendement: Optional[str] = None
    composition: Optional[str] = None

class ProductUpdate(BaseModel):
    titre: Optional[str] = None
    description: Optional[str] = None
    prix: Optional[float] = None
    quantite_disponible: Optional[int] = None
    status: Optional[ProductStatus] = None
    race_volaille: Optional[str] = None
    age_semaines: Optional[int] = None
    poids_moyen: Optional[float] = None
    type_oeuf: Optional[str] = None
    fraicheur_jours: Optional[int] = None
    type_transformation: Optional[str] = None
    type_amendement: Optional[str] = None
    composition: Optional[str] = None

# Nouveaux modèles pour les modules additionnels

# Modèles pour Price Monitoring
class PriceCategory(str, Enum):
    INTRANTS = "intrants"
    PRODUITS = "produits"

class PriceType(str, Enum):
    # Intrants
    ALIMENT_PONTE = "aliment_ponte"
    ALIMENT_CHAIR = "aliment_chair"
    POUSSIN_PONTE = "poussin_ponte"
    POUSSIN_CHAIR = "poussin_chair"
    MEDICAMENT = "medicament"
    VACCIN = "vaccin"
    # Produits
    POULET_VIF = "poulet_vif"
    POULET_VIDE = "poulet_vide"
    OEUF_CONSO = "oeuf_conso"
    FUMIER = "fumier"

class PriceMonitoring(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    categorie: PriceCategory
    type_produit: PriceType
    prix_moyen: float
    prix_min: float
    prix_max: float
    unite: str
    localisation: str
    source: str = "Marché local"
    date_maj: datetime = Field(default_factory=datetime.utcnow)
    tendance: Optional[str] = None  # "hausse", "baisse", "stable"

# Modèles pour Animal Health
class Maladie(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nom: str
    symptomes: List[str]
    prevention: List[str]
    traitement: str
    gravite: str  # "legere", "moderee", "grave"
    contagieux: bool

class SymptomeReport(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    utilisateur_id: str
    symptomes_observes: List[str]
    nombre_animaux_affectes: int
    date_observation: datetime = Field(default_factory=datetime.utcnow)
    localisation: str
    actions_prises: Optional[str] = None
    status: str = "en_cours"  # "en_cours", "resolu", "aggrave"

class VaccinationRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    utilisateur_id: str
    type_vaccin: str
    nombre_animaux: int
    date_vaccination: datetime
    prochaine_vaccination: Optional[datetime] = None
    lot_volaille: Optional[str] = None
    veterinaire: Optional[str] = None

class Veterinaire(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nom: str
    telephone: str
    localisation: str
    specialites: List[str]
    disponible: bool = True
    tarif_consultation: Optional[float] = None

# Modèles pour Financial Tools
class TransactionType(str, Enum):
    REVENU = "revenu"
    DEPENSE = "depense"

class FinancialTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    utilisateur_id: str
    type_transaction: TransactionType
    montant: float
    description: str
    categorie: str  # "vente_oeufs", "achat_aliment", "frais_veterinaire", etc.
    date_transaction: datetime = Field(default_factory=datetime.utcnow)
    mode_paiement: Optional[str] = None  # "especes", "mobile_money", "cheque"
    reference: Optional[str] = None

class FinancialSummary(BaseModel):
    total_revenus: float
    total_depenses: float
    benefice_net: float
    periode_debut: datetime
    periode_fin: datetime
    principales_depenses: List[dict]
    principales_revenus: List[dict]

# Auth helpers
async def get_current_user(user_id: str) -> User:
    user_data = await db.users.find_one({"id": user_id})
    if not user_data:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return User(**user_data)

# Routes pour les utilisateurs
@api_router.post("/users/register", response_model=User)
async def register_user(user_data: UserCreate):
    # Vérifier si le téléphone existe déjà
    existing_user = await db.users.find_one({"telephone": user_data.telephone})
    if existing_user:
        raise HTTPException(status_code=400, detail="Ce numéro de téléphone est déjà enregistré")
    
    user = User(**user_data.dict())
    await db.users.insert_one(user.dict())
    return user

@api_router.post("/users/login")
async def login_user(login_data: UserLogin):
    user_data = await db.users.find_one({"telephone": login_data.telephone})
    if not user_data:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    user = User(**user_data)
    return {"message": "Connexion réussie", "user": user, "token": user.id}

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    return await get_current_user(user_id)

# Routes pour les produits
@api_router.post("/products", response_model=Product)
async def create_product(product_data: ProductCreate, vendeur_id: str = Query(...)):
    # Récupérer les infos du vendeur
    vendeur = await get_current_user(vendeur_id)
    if vendeur.role not in [UserRole.AVICULTEUR, UserRole.FOURNISSEUR]:
        raise HTTPException(status_code=403, detail="Seuls les aviculteurs et fournisseurs peuvent créer des annonces")
    
    product_dict = product_data.dict()
    product_dict.update({
        "vendeur_id": vendeur.id,
        "vendeur_nom": vendeur.nom,
        "vendeur_telephone": vendeur.telephone
    })
    
    product = Product(**product_dict)
    await db.products.insert_one(product.dict())
    return product

@api_router.get("/products", response_model=List[Product])
async def get_products(
    type_produit: Optional[ProductType] = None,
    localisation: Optional[str] = None,
    prix_min: Optional[float] = None,
    prix_max: Optional[float] = None,
    status: ProductStatus = ProductStatus.DISPONIBLE,
    limit: int = 50
):
    query = {"status": status}
    
    if type_produit:
        query["type_produit"] = type_produit
    if localisation:
        query["localisation"] = {"$regex": localisation, "$options": "i"}
    if prix_min is not None:
        query["prix"] = {"$gte": prix_min}
    if prix_max is not None:
        if "prix" in query:
            query["prix"]["$lte"] = prix_max
        else:
            query["prix"] = {"$lte": prix_max}
    
    products = await db.products.find(query).sort("created_at", -1).limit(limit).to_list(limit)
    return [Product(**product) for product in products]

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product_data = await db.products.find_one({"id": product_id})
    if not product_data:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return Product(**product_data)

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_update: ProductUpdate, vendeur_id: str = Query(...)):
    # Vérifier que le produit appartient au vendeur
    product_data = await db.products.find_one({"id": product_id})
    if not product_data:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    if product_data["vendeur_id"] != vendeur_id:
        raise HTTPException(status_code=403, detail="Vous ne pouvez modifier que vos propres annonces")
    
    update_data = {k: v for k, v in product_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.products.update_one({"id": product_id}, {"$set": update_data})
    updated_product = await db.products.find_one({"id": product_id})
    return Product(**updated_product)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, vendeur_id: str = Query(...)):
    # Vérifier que le produit appartient au vendeur
    product_data = await db.products.find_one({"id": product_id})
    if not product_data:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    if product_data["vendeur_id"] != vendeur_id:
        raise HTTPException(status_code=403, detail="Vous ne pouvez supprimer que vos propres annonces")
    
    await db.products.delete_one({"id": product_id})
    return {"message": "Annonce supprimée avec succès"}

@api_router.get("/products/user/{vendeur_id}", response_model=List[Product])
async def get_user_products(vendeur_id: str):
    products = await db.products.find({"vendeur_id": vendeur_id}).sort("created_at", -1).to_list(100)
    return [Product(**product) for product in products]

# Route de statistiques
@api_router.get("/stats/dashboard")
async def get_dashboard_stats():
    total_products = await db.products.count_documents({"status": ProductStatus.DISPONIBLE})
    total_users = await db.users.count_documents({})
    
    # Stats par type de produit
    pipeline = [
        {"$match": {"status": ProductStatus.DISPONIBLE}},
        {"$group": {"_id": "$type_produit", "count": {"$sum": 1}}}
    ]
    product_stats = await db.products.aggregate(pipeline).to_list(100)
    
    return {
        "total_produits": total_products,
        "total_utilisateurs": total_users,
        "stats_par_type": {stat["_id"]: stat["count"] for stat in product_stats}
    }

# Route de test
@api_router.get("/")
async def root():
    return {"message": "AviMarché API - Plateforme avicole du Mali"}

# ROUTES DE TÉLÉCHARGEMENT DES FICHIERS DE DÉPLOIEMENT
from fastapi.responses import FileResponse
import os

@api_router.get("/download/frontend")
async def download_frontend():
    """Télécharger le ZIP du frontend pour Netlify"""
    file_path = "/app/avimarche-frontend.zip"
    if os.path.exists(file_path):
        return FileResponse(
            path=file_path,
            filename="avimarche-frontend.zip",
            media_type="application/zip"
        )
    else:
        raise HTTPException(status_code=404, detail="Fichier frontend non trouvé")

@api_router.get("/download/backend-fixed")
async def download_backend_fixed():
    """Télécharger le ZIP du backend CORRIGÉ pour Render"""
    file_path = "/app/avimarche-backend-fixed.zip"
    if os.path.exists(file_path):
        return FileResponse(
            path=file_path,
            filename="avimarche-backend-fixed.zip",
            media_type="application/zip"
        )
    else:
        raise HTTPException(status_code=404, detail="Fichier backend corrigé non trouvé")

@api_router.get("/download/backend")
async def download_backend():
    """Télécharger le ZIP du backend pour Railway"""
    file_path = "/app/avimarche-backend.zip"
    if os.path.exists(file_path):
        return FileResponse(
            path=file_path,
            filename="avimarche-backend.zip",
            media_type="application/zip"
        )
    else:
        raise HTTPException(status_code=404, detail="Fichier backend non trouvé")

@api_router.get("/download/")
async def download_info():
    """Informations sur les fichiers disponibles"""
    frontend_exists = os.path.exists("/app/avimarche-frontend.zip")
    backend_exists = os.path.exists("/app/avimarche-backend.zip")
    backend_fixed_exists = os.path.exists("/app/avimarche-backend-fixed.zip")
    
    frontend_size = os.path.getsize("/app/avimarche-frontend.zip") if frontend_exists else 0
    backend_size = os.path.getsize("/app/avimarche-backend.zip") if backend_exists else 0
    backend_fixed_size = os.path.getsize("/app/avimarche-backend-fixed.zip") if backend_fixed_exists else 0
    
    return {
        "message": "Endpoints de téléchargement AviMarché",
        "files": {
            "frontend": {
                "available": frontend_exists,
                "size_bytes": frontend_size,
                "size_kb": round(frontend_size / 1024, 1),
                "download_url": "/api/download/frontend",
                "description": "ZIP du frontend React pour déploiement Netlify"
            },
            "backend": {
                "available": backend_exists,
                "size_bytes": backend_size,
                "size_kb": round(backend_size / 1024, 1),
                "download_url": "/api/download/backend",
                "description": "ZIP du backend FastAPI pour déploiement Railway"
            },
            "backend_fixed": {
                "available": backend_fixed_exists,
                "size_bytes": backend_fixed_size,
                "size_kb": round(backend_fixed_size / 1024, 1),
                "download_url": "/api/download/backend-fixed",
                "description": "ZIP du backend CORRIGÉ pour Render.com (structure de fichiers fixée)"
            }
        },
        "instructions": [
            "1. Clique sur les URLs de téléchargement ci-dessous",
            "2. Ton navigateur téléchargera automatiquement les fichiers",
            "3. Utilise le frontend ZIP sur Netlify.com",
            "4. Utilise le backend-fixed ZIP sur Render.com (RECOMMANDÉ)",
            "5. Utilise le backend ZIP sur Railway.app"
        ]
    }

# ROUTE D'ADMINISTRATION - EXPORT DE DONNÉES
@api_router.get("/admin/export")
async def export_all_data():
    """Export de toutes les données pour administration/backup"""
    try:
        # Récupérer toutes les données
        users = await db.users.find({}).to_list(1000)
        products = await db.products.find({}).to_list(1000)
        prices = await db.price_monitoring.find({}).to_list(1000)
        diseases = await db.diseases.find({}).to_list(1000)
        vets = await db.veterinaires.find({}).to_list(1000)
        transactions = await db.financial_transactions.find({}).to_list(1000)
        vaccinations = await db.vaccinations.find({}).to_list(1000)
        symptom_reports = await db.symptom_reports.find({}).to_list(1000)
        
        # Nettoyer les ObjectId pour JSON
        for collection in [users, products, prices, diseases, vets, transactions, vaccinations, symptom_reports]:
            for item in collection:
                if '_id' in item:
                    del item['_id']
        
        return {
            "export_date": datetime.utcnow(),
            "summary": {
                "total_users": len(users),
                "total_products": len(products),
                "total_prices": len(prices),
                "total_diseases": len(diseases),
                "total_veterinaires": len(vets),
                "total_transactions": len(transactions),
                "total_vaccinations": len(vaccinations),
                "total_symptom_reports": len(symptom_reports)
            },
            "data": {
                "users": users,
                "products": products,
                "price_monitoring": prices,
                "diseases": diseases,
                "veterinaires": vets,
                "financial_transactions": transactions,
                "vaccinations": vaccinations,
                "symptom_reports": symptom_reports
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur d'export: {str(e)}")

@api_router.get("/admin/stats")
async def admin_stats():
    """Statistiques détaillées pour administration"""
    try:
        # Stats générales
        total_users = await db.users.count_documents({})
        total_products = await db.products.count_documents({})
        active_products = await db.products.count_documents({"status": "disponible"})
        
        # Stats par rôle
        users_by_role = {}
        for role in ["aviculteur", "acheteur"]:
            count = await db.users.count_documents({"role": role})
            users_by_role[role] = count
        
        # Stats par localisation
        pipeline = [{"$group": {"_id": "$localisation", "count": {"$sum": 1}}}]
        users_by_location = await db.users.aggregate(pipeline).to_list(100)
        products_by_location = await db.products.aggregate(pipeline).to_list(100)
        
        # Stats financières
        revenue_pipeline = [
            {"$match": {"type_transaction": "revenu"}},
            {"$group": {"_id": None, "total": {"$sum": "$montant"}}}
        ]
        expense_pipeline = [
            {"$match": {"type_transaction": "depense"}},
            {"$group": {"_id": None, "total": {"$sum": "$montant"}}}
        ]
        
        total_revenue = await db.financial_transactions.aggregate(revenue_pipeline).to_list(1)
        total_expenses = await db.financial_transactions.aggregate(expense_pipeline).to_list(1)
        
        return {
            "timestamp": datetime.utcnow(),
            "general_stats": {
                "total_users": total_users,
                "total_products": total_products,
                "active_products": active_products,
                "total_transactions": await db.financial_transactions.count_documents({}),
                "total_diseases": await db.diseases.count_documents({}),
                "total_veterinaires": await db.veterinaires.count_documents({})
            },
            "users_by_role": users_by_role,
            "users_by_location": {item["_id"]: item["count"] for item in users_by_location},
            "products_by_location": {item["_id"]: item["count"] for item in products_by_location},
            "financial_summary": {
                "total_revenue": total_revenue[0]["total"] if total_revenue else 0,
                "total_expenses": total_expenses[0]["total"] if total_expenses else 0,
                "net_profit": (total_revenue[0]["total"] if total_revenue else 0) - (total_expenses[0]["total"] if total_expenses else 0)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de stats: {str(e)}")

# ROUTES POUR PRICE MONITORING
@api_router.get("/prices", response_model=List[PriceMonitoring])
async def get_prices(
    categorie: Optional[PriceCategory] = None,
    localisation: Optional[str] = None,
    type_produit: Optional[PriceType] = None
):
    query = {}
    if categorie:
        query["categorie"] = categorie
    if localisation:
        query["localisation"] = {"$regex": localisation, "$options": "i"}
    if type_produit:
        query["type_produit"] = type_produit
    
    prices = await db.price_monitoring.find(query).sort("date_maj", -1).limit(50).to_list(50)
    return [PriceMonitoring(**price) for price in prices]

@api_router.post("/prices/report")
async def report_price(price_data: dict, reporter_id: str = Query(...)):
    # Simulation de signalement de prix par utilisateur
    user = await get_current_user(reporter_id)
    
    new_price = PriceMonitoring(
        categorie=price_data["categorie"],
        type_produit=price_data["type_produit"],
        prix_moyen=price_data["prix"],
        prix_min=price_data["prix"] * 0.9,
        prix_max=price_data["prix"] * 1.1,
        unite=price_data["unite"],
        localisation=price_data["localisation"],
        source=f"Signalé par {user.nom}"
    )
    
    await db.price_monitoring.insert_one(new_price.dict())
    return {"message": "Prix signalé avec succès", "price": new_price}

# ROUTES POUR ANIMAL HEALTH
@api_router.get("/diseases", response_model=List[Maladie])
async def get_diseases():
    diseases = await db.diseases.find({}).to_list(100)
    return [Maladie(**disease) for disease in diseases]

@api_router.get("/diseases/{disease_id}", response_model=Maladie)
async def get_disease(disease_id: str):
    disease_data = await db.diseases.find_one({"id": disease_id})
    if not disease_data:
        raise HTTPException(status_code=404, detail="Maladie non trouvée")
    return Maladie(**disease_data)

@api_router.post("/symptoms/report", response_model=SymptomeReport)
async def report_symptoms(symptoms_data: dict, user_id: str = Query(...)):
    user = await get_current_user(user_id)
    
    report = SymptomeReport(
        utilisateur_id=user.id,
        symptomes_observes=symptoms_data["symptomes"],
        nombre_animaux_affectes=symptoms_data["nombre_animaux"],
        localisation=user.localisation,
        actions_prises=symptoms_data.get("actions_prises", "")
    )
    
    await db.symptom_reports.insert_one(report.dict())
    return report

@api_router.get("/symptoms/user/{user_id}", response_model=List[SymptomeReport])
async def get_user_symptom_reports(user_id: str):
    reports = await db.symptom_reports.find({"utilisateur_id": user_id}).sort("date_observation", -1).to_list(50)
    return [SymptomeReport(**report) for report in reports]

@api_router.post("/vaccinations", response_model=VaccinationRecord)
async def record_vaccination(vaccination_data: dict, user_id: str = Query(...)):
    user = await get_current_user(user_id)
    
    vaccination = VaccinationRecord(
        utilisateur_id=user.id,
        type_vaccin=vaccination_data["type_vaccin"],
        nombre_animaux=vaccination_data["nombre_animaux"],
        date_vaccination=datetime.fromisoformat(vaccination_data["date_vaccination"]),
        prochaine_vaccination=datetime.fromisoformat(vaccination_data["prochaine_vaccination"]) if vaccination_data.get("prochaine_vaccination") else None,
        lot_volaille=vaccination_data.get("lot_volaille"),
        veterinaire=vaccination_data.get("veterinaire")
    )
    
    await db.vaccinations.insert_one(vaccination.dict())
    return vaccination

@api_router.get("/vaccinations/user/{user_id}", response_model=List[VaccinationRecord])
async def get_user_vaccinations(user_id: str):
    vaccinations = await db.vaccinations.find({"utilisateur_id": user_id}).sort("date_vaccination", -1).to_list(50)
    return [VaccinationRecord(**vaccination) for vaccination in vaccinations]

@api_router.get("/veterinaires", response_model=List[Veterinaire])
async def get_veterinaires(localisation: Optional[str] = None):
    query = {"disponible": True}
    if localisation:
        query["localisation"] = {"$regex": localisation, "$options": "i"}
    
    vets = await db.veterinaires.find(query).to_list(50)
    return [Veterinaire(**vet) for vet in vets]

# ROUTES POUR FINANCIAL TOOLS
@api_router.post("/finances/transaction", response_model=FinancialTransaction)
async def add_transaction(transaction_data: dict, user_id: str = Query(...)):
    user = await get_current_user(user_id)
    
    transaction = FinancialTransaction(
        utilisateur_id=user.id,
        type_transaction=transaction_data["type_transaction"],
        montant=transaction_data["montant"],
        description=transaction_data["description"],
        categorie=transaction_data["categorie"],
        date_transaction=datetime.fromisoformat(transaction_data["date_transaction"]) if transaction_data.get("date_transaction") else datetime.utcnow(),
        mode_paiement=transaction_data.get("mode_paiement"),
        reference=transaction_data.get("reference")
    )
    
    await db.financial_transactions.insert_one(transaction.dict())
    return transaction

@api_router.get("/finances/transactions/user/{user_id}", response_model=List[FinancialTransaction])
async def get_user_transactions(user_id: str, limit: int = 50):
    transactions = await db.financial_transactions.find({"utilisateur_id": user_id}).sort("date_transaction", -1).limit(limit).to_list(limit)
    return [FinancialTransaction(**transaction) for transaction in transactions]

@api_router.get("/finances/summary/user/{user_id}", response_model=FinancialSummary)
async def get_financial_summary(user_id: str, days: int = 30):
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Récupérer les transactions de la période
    transactions = await db.financial_transactions.find({
        "utilisateur_id": user_id,
        "date_transaction": {"$gte": start_date}
    }).to_list(1000)
    
    revenus = [t for t in transactions if t["type_transaction"] == "revenu"]
    depenses = [t for t in transactions if t["type_transaction"] == "depense"]
    
    total_revenus = sum(t["montant"] for t in revenus)
    total_depenses = sum(t["montant"] for t in depenses)
    
    # Principales catégories
    from collections import defaultdict
    cat_revenus = defaultdict(float)
    cat_depenses = defaultdict(float)
    
    for t in revenus:
        cat_revenus[t["categorie"]] += t["montant"]
    for t in depenses:
        cat_depenses[t["categorie"]] += t["montant"]
    
    return FinancialSummary(
        total_revenus=total_revenus,
        total_depenses=total_depenses,
        benefice_net=total_revenus - total_depenses,
        periode_debut=start_date,
        periode_fin=datetime.utcnow(),
        principales_revenus=sorted([{"categorie": k, "montant": v} for k, v in cat_revenus.items()], key=lambda x: x["montant"], reverse=True)[:5],
        principales_depenses=sorted([{"categorie": k, "montant": v} for k, v in cat_depenses.items()], key=lambda x: x["montant"], reverse=True)[:5]
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Initialiser avec des données de test
@app.on_event("startup")
async def startup_event():
    logger.info("Démarrage d'AviMarché...")
    
    # Créer des utilisateurs de test si la base est vide
    user_count = await db.users.count_documents({})
    disease_count = await db.diseases.count_documents({})
    
    if user_count == 0:
        test_users = [
            {
                "id": str(uuid.uuid4()),
                "nom": "Amadou Traoré",
                "telephone": "76123456",
                "role": "aviculteur",
                "localisation": "Bamako",
                "created_at": datetime.utcnow(),
                "is_active": True
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Ibrahim Koné",
                "telephone": "65432189",
                "role": "acheteur",
                "localisation": "Kayes",
                "created_at": datetime.utcnow(),
                "is_active": True
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Fatoumata Diallo",
                "telephone": "70987654",
                "role": "aviculteur",
                "localisation": "Sikasso", 
                "created_at": datetime.utcnow(),
                "is_active": True
            }
        ]
        await db.users.insert_many(test_users)
        
        # Créer des produits de test
        test_products = [
            {
                "id": str(uuid.uuid4()),
                "titre": "Poulets de chair prêts à vendre",
                "description": "Poulets de chair de race Cobb 500, bien nourris avec des aliments de qualité",
                "type_produit": "volaille_vivante",
                "prix": 3500,
                "unite": "pièce",
                "quantite_disponible": 50,
                "localisation": "Bamako",
                "vendeur_id": test_users[0]["id"],
                "vendeur_nom": "Amadou Traoré",
                "vendeur_telephone": "76123456",
                "status": "disponible",
                "race_volaille": "Cobb 500",
                "age_semaines": 8,
                "poids_moyen": 2.2,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "titre": "Œufs frais de poules pondeuses",
                "description": "Œufs frais collectés quotidiennement de nos poules pondeuses en liberté",
                "type_produit": "oeufs",
                "prix": 150,
                "unite": "pièce",
                "quantite_disponible": 200,
                "localisation": "Sikasso",
                "vendeur_id": test_users[2]["id"],  # Fatoumata (maintenant avicultrice)
                "vendeur_nom": "Fatoumata Diallo",
                "vendeur_telephone": "70987654",
                "status": "disponible",
                "type_oeuf": "poule",
                "fraicheur_jours": 1,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "titre": "Fumier de volaille composté",
                "description": "Excellent engrais naturel pour vos cultures, composté depuis 6 mois",
                "type_produit": "fientes",
                "prix": 25,
                "unite": "kg",
                "quantite_disponible": 1000,
                "localisation": "Bamako",
                "vendeur_id": test_users[0]["id"],
                "vendeur_nom": "Amadou Traoré",
                "vendeur_telephone": "76123456",
                "status": "disponible",
                "composition": "Fumier de poulet composté, riche en azote et phosphore",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        await db.products.insert_many(test_products)
        logger.info("Données de test créées")

        # Créer des données de test pour Price Monitoring
        test_prices = [
            {
                "id": str(uuid.uuid4()),
                "categorie": "intrants",
                "type_produit": "aliment_ponte",
                "prix_moyen": 280,
                "prix_min": 270,
                "prix_max": 290,
                "unite": "kg",
                "localisation": "Bamako",
                "source": "Marché de Médina",
                "date_maj": datetime.utcnow(),
                "tendance": "stable"
            },
            {
                "id": str(uuid.uuid4()),
                "categorie": "intrants",
                "type_produit": "poussin_chair",
                "prix_moyen": 450,
                "prix_min": 400,
                "prix_max": 500,
                "unite": "pièce",
                "localisation": "Sikasso",
                "source": "Coopérative avicole",
                "date_maj": datetime.utcnow(),
                "tendance": "hausse"
            },
            {
                "id": str(uuid.uuid4()),
                "categorie": "produits",
                "type_produit": "poulet_vif",
                "prix_moyen": 3200,
                "prix_min": 3000,
                "prix_max": 3500,
                "unite": "kg",
                "localisation": "Kayes",
                "source": "Marché hebdomadaire",
                "date_maj": datetime.utcnow(),
                "tendance": "baisse"
            }
        ]
        await db.price_monitoring.insert_many(test_prices)

        # Créer des données pour Animal Health
        test_diseases = [
            {
                "id": str(uuid.uuid4()),
                "nom": "Newcastle (Pseudo-peste aviaire)",
                "symptomes": ["Difficultés respiratoires", "Écoulement nasal", "Diarrhée verdâtre", "Chute de ponte", "Mortalité élevée"],
                "prevention": ["Vaccination régulière", "Quarantaine des nouveaux animaux", "Désinfection des locaux"],
                "traitement": "Pas de traitement spécifique. Vaccination préventive obligatoire.",
                "gravite": "grave",
                "contagieux": True
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Coccidiose",
                "symptomes": ["Diarrhée sanglante", "Perte d'appétit", "Plumes ébouriffées", "Retard de croissance"],
                "prevention": ["Propreté des abreuvoirs", "Litière sèche", "Anticoccidiens préventifs"],
                "traitement": "Anticoccidiens spécifiques selon prescription vétérinaire.",
                "gravite": "moderee",
                "contagieux": True
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Bronchite infectieuse",
                "symptomes": ["Toux", "Éternuements", "Râles respiratoires", "Chute de ponte"],
                "prevention": ["Vaccination", "Ventilation adéquate", "Éviter les stress"],
                "traitement": "Antibiotiques si surinfection bactérienne. Repos et chaleur.",
                "gravite": "moderee",
                "contagieux": True
            }
        ]
        await db.diseases.insert_many(test_diseases)

        # Créer des vétérinaires de test
        test_vets = [
            {
                "id": str(uuid.uuid4()),
                "nom": "Dr. Mamadou Cissé",
                "telephone": "76234567",
                "localisation": "Bamako",
                "specialites": ["Aviculture", "Médecine préventive"],
                "disponible": True,
                "tarif_consultation": 15000
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Dr. Aïssa Traoré",
                "telephone": "70345678",
                "localisation": "Sikasso",
                "specialites": ["Pathologie aviaire", "Nutrition"],
                "disponible": True,
                "tarif_consultation": 12000
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Dr. Ibrahim Konaré",
                "telephone": "65456789",
                "localisation": "Mopti",
                "specialites": ["Médecine rurale", "Aviculture familiale"],
                "disponible": True,
                "tarif_consultation": 10000
            }
        ]
        await db.veterinaires.insert_many(test_vets)

        # Créer des transactions financières de test pour Amadou
        amadou_id = test_users[0]["id"]
        test_transactions = [
            {
                "id": str(uuid.uuid4()),
                "utilisateur_id": amadou_id,
                "type_transaction": "revenu",
                "montant": 175000,
                "description": "Vente de 50 poulets de chair",
                "categorie": "vente_volaille",
                "date_transaction": datetime.utcnow() - timedelta(days=5),
                "mode_paiement": "especes"
            },
            {
                "id": str(uuid.uuid4()),
                "utilisateur_id": amadou_id,
                "type_transaction": "depense",
                "montant": 84000,
                "description": "Achat aliment ponte - 300kg",
                "categorie": "achat_aliment",
                "date_transaction": datetime.utcnow() - timedelta(days=10),
                "mode_paiement": "mobile_money"
            },
            {
                "id": str(uuid.uuid4()),
                "utilisateur_id": amadou_id,
                "type_transaction": "revenu",
                "montant": 45000,
                "description": "Vente d'œufs - 300 pièces",
                "categorie": "vente_oeufs",
                "date_transaction": datetime.utcnow() - timedelta(days=2),
                "mode_paiement": "especes"
            },
            {
                "id": str(uuid.uuid4()),
                "utilisateur_id": amadou_id,
                "type_transaction": "depense",
                "montant": 15000,
                "description": "Consultation vétérinaire",
                "categorie": "frais_veterinaire",
                "date_transaction": datetime.utcnow() - timedelta(days=7),
                "mode_paiement": "especes"
            }
        ]
        await db.financial_transactions.insert_many(test_transactions)

        logger.info("Toutes les données de test créées pour tous les modules")
    
    # Créer les autres données si elles n'existent pas
    if disease_count == 0:
        # Créer des données pour Animal Health
        test_diseases = [
            {
                "id": str(uuid.uuid4()),
                "nom": "Newcastle (Pseudo-peste aviaire)",
                "symptomes": ["Difficultés respiratoires", "Écoulement nasal", "Diarrhée verdâtre", "Chute de ponte", "Mortalité élevée"],
                "prevention": ["Vaccination régulière", "Quarantaine des nouveaux animaux", "Désinfection des locaux"],
                "traitement": "Pas de traitement spécifique. Vaccination préventive obligatoire.",
                "gravite": "grave",
                "contagieux": True
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Coccidiose",
                "symptomes": ["Diarrhée sanglante", "Perte d'appétit", "Plumes ébouriffées", "Retard de croissance"],
                "prevention": ["Propreté des abreuvoirs", "Litière sèche", "Anticoccidiens préventifs"],
                "traitement": "Anticoccidiens spécifiques selon prescription vétérinaire.",
                "gravite": "moderee",
                "contagieux": True
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Bronchite infectieuse",
                "symptomes": ["Toux", "Éternuements", "Râles respiratoires", "Chute de ponte"],
                "prevention": ["Vaccination", "Ventilation adéquate", "Éviter les stress"],
                "traitement": "Antibiotiques si surinfection bactérienne. Repos et chaleur.",
                "gravite": "moderee",
                "contagieux": True
            }
        ]
        await db.diseases.insert_many(test_diseases)

        # Créer des données de test pour Price Monitoring
        test_prices = [
            {
                "id": str(uuid.uuid4()),
                "categorie": "intrants",
                "type_produit": "aliment_ponte",
                "prix_moyen": 280,
                "prix_min": 270,
                "prix_max": 290,
                "unite": "kg",
                "localisation": "Bamako",
                "source": "Marché de Médina",
                "date_maj": datetime.utcnow(),
                "tendance": "stable"
            },
            {
                "id": str(uuid.uuid4()),
                "categorie": "intrants",
                "type_produit": "poussin_chair",
                "prix_moyen": 450,
                "prix_min": 400,
                "prix_max": 500,
                "unite": "pièce",
                "localisation": "Sikasso",
                "source": "Coopérative avicole",
                "date_maj": datetime.utcnow(),
                "tendance": "hausse"
            },
            {
                "id": str(uuid.uuid4()),
                "categorie": "produits",
                "type_produit": "poulet_vif",
                "prix_moyen": 3200,
                "prix_min": 3000,
                "prix_max": 3500,
                "unite": "kg",
                "localisation": "Kayes",
                "source": "Marché hebdomadaire",
                "date_maj": datetime.utcnow(),
                "tendance": "baisse"
            }
        ]
        await db.price_monitoring.insert_many(test_prices)

        # Créer des vétérinaires de test
        test_vets = [
            {
                "id": str(uuid.uuid4()),
                "nom": "Dr. Mamadou Cissé",
                "telephone": "76234567",
                "localisation": "Bamako",
                "specialites": ["Aviculture", "Médecine préventive"],
                "disponible": True,
                "tarif_consultation": 15000
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Dr. Aïssa Traoré",
                "telephone": "70345678",
                "localisation": "Sikasso",
                "specialites": ["Pathologie aviaire", "Nutrition"],
                "disponible": True,
                "tarif_consultation": 12000
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Dr. Ibrahim Konaré",
                "telephone": "65456789",
                "localisation": "Mopti",
                "specialites": ["Médecine rurale", "Aviculture familiale"],
                "disponible": True,
                "tarif_consultation": 10000
            }
        ]
        await db.veterinaires.insert_many(test_vets)

        logger.info("Données additionnelles créées (maladies, prix, vétérinaires)")
