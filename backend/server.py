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
from datetime import datetime
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
    FOURNISSEUR = "fournisseur"
    ACHETEUR = "acheteur"

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
                "nom": "Fatoumata Diallo",
                "telephone": "70987654",
                "role": "fournisseur",
                "localisation": "Sikasso", 
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
                "vendeur_id": test_users[1]["id"],
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
