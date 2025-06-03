import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

// Import des composants modernes existants
import ModernHeader from "./components/ModernHeader";
import ModernHomePage from "./components/ModernHomePage";
import ModernLoginModal from "./components/ModernLoginModal";
import ModernMarketplace from "./components/ModernMarketplace";
import ModernMyProducts from "./components/ModernMyProducts";
import ModernPriceMonitoring from "./components/ModernPriceMonitoring";
import ModernAnimalHealth from "./components/ModernAnimalHealth";

// Import des nouveaux composants accessibles et contexts
import { ThemeProvider } from "./contexts/ThemeContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { ErrorBoundary } from "./utils/performance";
import AccessibleHeader from "./components/AccessibleHeader";
import AccessibleHomePage from "./components/AccessibleHomePage";
import AviculteurHomePage from "./components/AviculteurHomePage";
import AcheteurHomePage from "./components/AcheteurHomePage";
import FournisseurHomePage from "./components/FournisseurHomePage";
import BottomNavigation from "./components/BottomNavigation";
import RegistrationPage from "./components/RegistrationPage";

// Import des nouvelles pages spécialisées
import VendreVolaillesPage from "./components/VendreVolaillesPage";
import VeterinairePage from "./components/VeterinairePage";
import CalculateurPage from "./components/CalculateurPage";

// Import des nouvelles pages demandées
import BuyFeedPage from "./components/BuyFeedPage";
import BuyChicksPage from "./components/BuyChicksPage";
import MessagesPage from "./components/MessagesPage";
import EnhancedMessagesPage from "./components/EnhancedMessagesPage";
import MyPoultryStockPage from "./components/MyPoultryStockPage";
import ContactSupportPage from "./components/ContactSupportPage";

// Import des pages simplifiées pour illettrés
import SimpleFinancialToolsPage from "./components/SimpleFinancialToolsPage";
import SimplePricesPage from "./components/SimplePricesPage";
import SimpleFeedPricesPage from "./components/SimpleFeedPricesPage";
import PracticalAdvicePage from "./components/PracticalAdvicePage";

// Import des pages ÉLEVEURS
import FeedMarketPage from "./components/FeedMarketPage";
import VeterinaireContactsPage from "./components/VeterinaireContactsPage";
import FeedPricesPage from "./components/FeedPricesPage";

// Import des pages ACHETEURS
import FavoriteSellersPage from "./components/FavoriteSellersPage";
import ReceivedOrdersPage from "./components/ReceivedOrdersPage";
import TopSellersPage from "./components/TopSellersPage";
import BuyPoultryPage from "./components/BuyPoultryPage";
import BuyEggsPage from "./components/BuyEggsPage";
import BuyerMessagesPage from "./components/BuyerMessagesPage";
import BuyerOrdersPage from "./components/BuyerOrdersPage";
import BuyerContactSupportPage from "./components/BuyerContactSupportPage";

// Import des pages FOURNISSEURS
import MyFeedProductsPage from "./components/MyFeedProductsPage";
import FeedOrdersPage from "./components/FeedOrdersPage";
import FarmerContactsPage from "./components/FarmerContactsPage";
import PerformanceDashboardPage from "./components/PerformanceDashboardPage";
import SupplierFeedPricesPage from "./components/SupplierFeedPricesPage";
import SupplierSalesPage from "./components/SupplierSalesPage";
import ProductDemandPage from "./components/ProductDemandPage";
import SupplierAdvicePage from "./components/SupplierAdvicePage";
import SupplierContactSupportPage from "./components/SupplierContactSupportPage";
import MarketDemandPage from "./components/MarketDemandPage";

// Import des nouvelles pages FEEDBACK BIDIRECTIONNEL
import RateFarmerPage from "./components/RateFarmerPage";
import RateSupplierPage from "./components/RateSupplierPage";
import MyRatingsPage from "./components/MyRatingsPage";

// Import des nouvelles pages AUTHENTIFICATION AMÉLIORÉE
import EnhancedLoginModal from "./components/EnhancedLoginModal";
import PasswordSettingsPage from "./components/PasswordSettingsPage";

// Import des composants de performance
import LoadingSpinner from "./components/LoadingSpinner";
import PerformanceOptimizedProductCard from "./components/PerformanceOptimizedProductCard";
import NotificationsPage from "./components/NotificationsPage";

// Import des composants existants (temporaire)
import FinancialTools from "./FinancialTools";
import AdminDashboard from "./AdminDashboard";
import DownloadPage from "./DownloadPage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Composants principaux
const Header = ({ currentUser, onLogin, onLogout, onNavigate, currentPage }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <header className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-green-900 font-bold text-xl">🐔</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">AviMarché</h1>
                <span className="text-green-200 text-xs md:text-sm">Mali</span>
              </div>
            </div>
            
            {/* Navigation Desktop */}
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => onNavigate('home')}
                className={`hover:text-yellow-300 ${currentPage === 'home' ? 'text-yellow-300' : ''}`}
              >
                Accueil
              </button>
              <button 
                onClick={() => onNavigate('marketplace')}
                className={`hover:text-yellow-300 ${currentPage === 'marketplace' ? 'text-yellow-300' : ''}`}
              >
                Marché
              </button>
              <button 
                onClick={() => onNavigate('prices')}
                className={`hover:text-yellow-300 ${currentPage === 'prices' ? 'text-yellow-300' : ''}`}
              >
                Prix
              </button>
              <button 
                onClick={() => onNavigate('health')}
                className={`hover:text-yellow-300 ${currentPage === 'health' ? 'text-yellow-300' : ''}`}
              >
                Santé
              </button>
              {currentUser && currentUser.role === 'aviculteur' && currentUser.nom === 'Amadou Traoré' && (
                <>
                  <button 
                    onClick={() => onNavigate('admin')}
                    className={`hover:text-yellow-300 ${currentPage === 'admin' ? 'text-yellow-300' : ''}`}
                  >
                    🛠️ Admin
                  </button>
                  <button 
                    onClick={() => onNavigate('download')}
                    className={`hover:text-yellow-300 ${currentPage === 'download' ? 'text-yellow-300' : ''}`}
                  >
                    📦 Télécharger
                  </button>
                </>
              )}
              {currentUser && currentUser.role === 'aviculteur' && (
                <>
                  <button 
                    onClick={() => onNavigate('finances')}
                    className={`hover:text-yellow-300 ${currentPage === 'finances' ? 'text-yellow-300' : ''}`}
                  >
                    Finances
                  </button>
                  <button 
                    onClick={() => onNavigate('myproducts')}
                    className={`hover:text-yellow-300 ${currentPage === 'myproducts' ? 'text-yellow-300' : ''}`}
                  >
                    Mes Annonces
                  </button>
                </>
              )}
            </nav>

            {/* Menu Mobile Toggle */}
            <div className="md:hidden flex items-center space-x-2">
              {currentUser && (
                <span className="text-xs">👋 {currentUser.nom.split(' ')[0]}</span>
              )}
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-white p-2"
              >
                {showMobileMenu ? '✕' : '☰'}
              </button>
            </div>

            {/* Auth Desktop */}
            <div className="hidden md:block">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm">
                    Bonjour, <span className="font-semibold">{currentUser.nom}</span>
                  </span>
                  <button 
                    onClick={onLogout}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => onLogin()}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-semibold text-green-900"
                >
                  Connexion
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {showMobileMenu && (
          <div className="md:hidden bg-green-800 border-t border-green-600">
            <div className="px-4 py-2 space-y-1">
              <button 
                onClick={() => { onNavigate('home'); setShowMobileMenu(false); }}
                className={`block w-full text-left py-3 px-2 rounded ${currentPage === 'home' ? 'bg-green-600' : 'hover:bg-green-600'}`}
              >
                🏠 Accueil
              </button>
              <button 
                onClick={() => { onNavigate('marketplace'); setShowMobileMenu(false); }}
                className={`block w-full text-left py-3 px-2 rounded ${currentPage === 'marketplace' ? 'bg-green-600' : 'hover:bg-green-600'}`}
              >
                🛍️ Marché
              </button>
              <button 
                onClick={() => { onNavigate('prices'); setShowMobileMenu(false); }}
                className={`block w-full text-left py-3 px-2 rounded ${currentPage === 'prices' ? 'bg-green-600' : 'hover:bg-green-600'}`}
              >
                💰 Prix
              </button>
              <button 
                onClick={() => { onNavigate('health'); setShowMobileMenu(false); }}
                className={`block w-full text-left py-3 px-2 rounded ${currentPage === 'health' ? 'bg-green-600' : 'hover:bg-green-600'}`}
              >
                🩺 Santé
              </button>
              
              {currentUser && currentUser.role === 'aviculteur' && (
                <>
                  <button 
                    onClick={() => { onNavigate('finances'); setShowMobileMenu(false); }}
                    className={`block w-full text-left py-3 px-2 rounded ${currentPage === 'finances' ? 'bg-green-600' : 'hover:bg-green-600'}`}
                  >
                    📊 Finances
                  </button>
                  <button 
                    onClick={() => { onNavigate('myproducts'); setShowMobileMenu(false); }}
                    className={`block w-full text-left py-3 px-2 rounded ${currentPage === 'myproducts' ? 'bg-green-600' : 'hover:bg-green-600'}`}
                  >
                    📦 Mes Annonces
                  </button>
                </>
              )}

              {currentUser && currentUser.role === 'aviculteur' && currentUser.nom === 'Amadou Traoré' && (
                <>
                  <button 
                    onClick={() => { onNavigate('admin'); setShowMobileMenu(false); }}
                    className={`block w-full text-left py-3 px-2 rounded ${currentPage === 'admin' ? 'bg-green-600' : 'hover:bg-green-600'}`}
                  >
                    🛠️ Admin
                  </button>
                  <button 
                    onClick={() => { onNavigate('download'); setShowMobileMenu(false); }}
                    className={`block w-full text-left py-3 px-2 rounded ${currentPage === 'download' ? 'bg-green-600' : 'hover:bg-green-600'}`}
                  >
                    📥 Télécharger
                  </button>
                </>
              )}

              <div className="border-t border-green-600 pt-2 mt-2">
                {currentUser ? (
                  <button 
                    onClick={() => { onLogout(); setShowMobileMenu(false); }}
                    className="block w-full text-left py-3 px-2 rounded bg-red-600 hover:bg-red-700"
                  >
                    🚪 Déconnexion
                  </button>
                ) : (
                  <button 
                    onClick={() => { onLogin(); setShowMobileMenu(false); }}
                    className="block w-full text-left py-3 px-2 rounded bg-yellow-600 hover:bg-yellow-700 text-green-900 font-semibold"
                  >
                    🔑 Connexion
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

// Composant Animal Health
const AnimalHealth = ({ currentUser }) => {
  const [diseases, setDiseases] = useState([]);
  const [veterinaires, setVeterinaires] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('diseases'); // diseases, symptoms, vets

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [diseasesRes, vetsRes] = await Promise.all([
        axios.get(`${API}/diseases`),
        axios.get(`${API}/veterinaires`)
      ]);
      setDiseases(diseasesRes.data);
      setVeterinaires(vetsRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (gravite) => {
    switch (gravite) {
      case 'grave': return 'bg-red-100 text-red-800 border-red-300';
      case 'moderee': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'legere': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (gravite) => {
    switch (gravite) {
      case 'grave': return '🚨';
      case 'moderee': return '⚠️';
      case 'legere': return '💛';
      default: return '❓';
    }
  };

  const DiseaseCard = ({ disease }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{disease.nom}</h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs border ${getSeverityColor(disease.gravite)}`}>
            {getSeverityIcon(disease.gravite)} {disease.gravite}
          </span>
          {disease.contagieux && (
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
              🦠 Contagieux
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-red-700 mb-1">🩺 Symptômes:</h4>
          <ul className="text-sm text-gray-700 list-disc list-inside">
            {disease.symptomes.map((symptome, index) => (
              <li key={index}>{symptome}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-blue-700 mb-1">🛡️ Prévention:</h4>
          <ul className="text-sm text-gray-700 list-disc list-inside">
            {disease.prevention.map((prev, index) => (
              <li key={index}>{prev}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-green-700 mb-1">💊 Traitement:</h4>
          <p className="text-sm text-gray-700">{disease.traitement}</p>
        </div>
      </div>
      
      <button
        onClick={() => setSelectedDisease(disease)}
        className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        📋 Voir détails complets
      </button>
    </div>
  );

  const VetCard = ({ vet }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{vet.nom}</h3>
          <p className="text-gray-600">📍 {vet.localisation}</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs ${vet.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {vet.disponible ? '✅ Disponible' : '❌ Indisponible'}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div>
          <span className="font-medium text-blue-700">Spécialités:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {vet.specialites.map((spec, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {spec}
              </span>
            ))}
          </div>
        </div>
        
        {vet.tarif_consultation && (
          <div className="text-sm">
            <span className="font-medium">Tarif consultation:</span> {vet.tarif_consultation.toLocaleString()} FCFA
          </div>
        )}
      </div>
      
      <a
        href={`tel:${vet.telephone}`}
        className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded font-semibold"
      >
        📞 {vet.telephone}
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">🩺 Santé Animale</h1>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('diseases')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'diseases' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              🦠 Guide des Maladies
            </button>
            <button
              onClick={() => setActiveTab('vets')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'vets' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              👨‍⚕️ Vétérinaires
            </button>
            {currentUser && (
              <button
                onClick={() => setActiveTab('symptoms')}
                className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'symptoms' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                📝 Signaler Symptômes
              </button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Chargement...</div>
          </div>
        ) : (
          <>
            {/* Guide des maladies */}
            {activeTab === 'diseases' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Guide des maladies communes en aviculture</h2>
                  <p className="text-gray-600">
                    Consultez ce guide pour identifier et traiter les maladies les plus courantes chez la volaille.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                  {diseases.map(disease => (
                    <DiseaseCard key={disease.id} disease={disease} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Annuaire vétérinaires */}
            {activeTab === 'vets' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Annuaire des vétérinaires</h2>
                  <p className="text-gray-600">
                    Trouvez un vétérinaire spécialisé en aviculture près de chez vous.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {veterinaires.map(vet => (
                    <VetCard key={vet.id} vet={vet} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Signalement de symptômes */}
            {activeTab === 'symptoms' && currentUser && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Signaler des symptômes</h2>
                  <p className="text-gray-600">
                    Décrivez les symptômes observés chez vos volailles pour obtenir des conseils.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Attention</h3>
                    <p className="text-yellow-800 text-sm">
                      En cas de mortalité importante ou de symptômes graves, contactez immédiatement un vétérinaire. 
                      Ce formulaire ne remplace pas une consultation professionnelle.
                    </p>
                  </div>
                  
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">🚧</div>
                    <p className="text-gray-600">
                      Fonctionnalité de signalement en cours de développement.
                      <br />
                      Contactez directement un vétérinaire depuis l'annuaire pour le moment.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Modal détails maladie */}
        {selectedDisease && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedDisease.nom}</h2>
                <button 
                  onClick={() => setSelectedDisease(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded border ${getSeverityColor(selectedDisease.gravite)}`}>
                    {getSeverityIcon(selectedDisease.gravite)} Gravité: {selectedDisease.gravite}
                  </span>
                  {selectedDisease.contagieux && (
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded">
                      🦠 Maladie contagieuse
                    </span>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-red-700 mb-2">🩺 Symptômes à surveiller:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedDisease.symptomes.map((symptome, index) => (
                      <li key={index} className="text-gray-700">{symptome}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">🛡️ Mesures de prévention:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedDisease.prevention.map((prev, index) => (
                      <li key={index} className="text-gray-700">{prev}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-700 mb-2">💊 Traitement:</h3>
                  <p className="text-gray-700 bg-green-50 p-3 rounded">{selectedDisease.traitement}</p>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-red-800 text-sm">
                    <strong>⚕️ Important:</strong> Consultez toujours un vétérinaire pour un diagnostic précis et un traitement adapté. 
                    Ne tentez pas d'automédicamenter vos volailles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">💡 Conseils généraux</h3>
          <ul className="text-green-800 text-sm space-y-1">
            <li>• Maintenez une hygiène rigoureuse dans vos poulaillers</li>
            <li>• Respectez le calendrier de vaccination</li>
            <li>• Isolez immédiatement tout animal malade</li>
            <li>• Surveillez quotidiennement l'état de vos volailles</li>
            <li>• Gardez un registre des traitements et vaccinations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Composant Price Monitoring
const PriceMonitoring = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categorie: '',
    localisation: '',
    type_produit: ''
  });

  useEffect(() => {
    loadPrices();
  }, [filters]);

  const loadPrices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.categorie) params.append('categorie', filters.categorie);
      if (filters.localisation) params.append('localisation', filters.localisation);
      if (filters.type_produit) params.append('type_produit', filters.type_produit);
      
      const response = await axios.get(`${API}/prices?${params}`);
      setPrices(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des prix:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductTypeName = (type) => {
    const types = {
      'aliment_ponte': 'Aliment ponte',
      'aliment_chair': 'Aliment chair',
      'poussin_ponte': 'Poussin ponte',
      'poussin_chair': 'Poussin chair',
      'medicament': 'Médicament',
      'vaccin': 'Vaccin',
      'poulet_vif': 'Poulet vif',
      'poulet_vide': 'Poulet vidé',
      'oeuf_conso': 'Œuf consommation',
      'fumier': 'Fumier'
    };
    return types[type] || type;
  };

  const getTendanceIcon = (tendance) => {
    switch (tendance) {
      case 'hausse': return '📈';
      case 'baisse': return '📉';
      default: return '➡️';
    }
  };

  const getTendanceColor = (tendance) => {
    switch (tendance) {
      case 'hausse': return 'text-red-600';
      case 'baisse': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">💰 Suivi des Prix - Mali</h1>
        
        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filtres de recherche</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select
                value={filters.categorie}
                onChange={(e) => setFilters({...filters, categorie: e.target.value})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Toutes les catégories</option>
                <option value="intrants">Intrants</option>
                <option value="produits">Produits</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Localisation</label>
              <input
                type="text"
                value={filters.localisation}
                onChange={(e) => setFilters({...filters, localisation: e.target.value})}
                className="w-full border rounded px-3 py-2"
                placeholder="Ville ou région"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Type de produit</label>
              <select
                value={filters.type_produit}
                onChange={(e) => setFilters({...filters, type_produit: e.target.value})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Tous les types</option>
                <optgroup label="Intrants">
                  <option value="aliment_ponte">Aliment ponte</option>
                  <option value="aliment_chair">Aliment chair</option>
                  <option value="poussin_ponte">Poussin ponte</option>
                  <option value="poussin_chair">Poussin chair</option>
                  <option value="medicament">Médicament</option>
                  <option value="vaccin">Vaccin</option>
                </optgroup>
                <optgroup label="Produits">
                  <option value="poulet_vif">Poulet vif</option>
                  <option value="poulet_vide">Poulet vidé</option>
                  <option value="oeuf_conso">Œuf consommation</option>
                  <option value="fumier">Fumier</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
        
        {/* Liste des prix */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Chargement des prix...</div>
          </div>
        ) : prices.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Aucun prix trouvé avec ces critères.</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prices.map(price => (
              <div key={price.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{getProductTypeName(price.type_produit)}</h3>
                    <span className={`text-sm px-2 py-1 rounded ${price.categorie === 'intrants' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {price.categorie === 'intrants' ? '📦 Intrant' : '🐔 Produit'}
                    </span>
                  </div>
                  <div className={`flex items-center space-x-1 ${getTendanceColor(price.tendance)}`}>
                    <span>{getTendanceIcon(price.tendance)}</span>
                    <span className="text-sm font-medium">{price.tendance}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-center bg-gray-50 p-3 rounded">
                    <div className="text-2xl font-bold text-green-700">
                      {price.prix_moyen.toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-gray-600">/{price.unite}</div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Min: <span className="font-medium">{price.prix_min.toLocaleString()} FCFA</span></span>
                    <span>Max: <span className="font-medium">{price.prix_max.toLocaleString()} FCFA</span></span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div>📍 {price.localisation}</div>
                  <div>📊 {price.source}</div>
                  <div>📅 {new Date(price.date_maj).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Information</h3>
          <p className="text-blue-800 text-sm">
            Les prix affichés sont collectés auprès des marchés locaux et des coopératives. 
            Ils peuvent varier selon la qualité et la saison. Contactez directement les fournisseurs pour confirmer.
          </p>
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ stats, currentUser, onNavigate }) => {
  return <ModernHomePage stats={stats} currentUser={currentUser} onNavigate={onNavigate} />;
};

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  return <ModernLoginModal isOpen={isOpen} onClose={onClose} onLogin={onLogin} />;
};

const ProductCard = ({ product, currentUser, onContact, onEdit, onDelete }) => {
  const getProductIcon = (type) => {
    switch (type) {
      case 'volaille_vivante': return '🐔';
      case 'oeufs': return '🥚';
      case 'volaille_transformee': return '🍗';
      case 'amendements': case 'fientes': return '🌱';
      default: return '📦';
    }
  };

  const getProductTypeName = (type) => {
    switch (type) {
      case 'volaille_vivante': return 'Volaille Vivante';
      case 'oeufs': return 'Œufs';
      case 'volaille_transformee': return 'Volaille Transformée';
      case 'amendements': return 'Amendements';
      case 'fientes': return 'Fientes';
      default: return 'Produit';
    }
  };

  const isOwner = currentUser && currentUser.id === product.vendeur_id;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1">
            <span className="text-3xl">{getProductIcon(product.type_produit)}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg md:text-xl truncate">{product.titre}</h3>
              <span className="text-sm text-gray-500">{getProductTypeName(product.type_produit)}</span>
            </div>
          </div>
          {isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(product)}
                className="text-blue-600 hover:text-blue-800 text-lg p-1"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="text-red-600 hover:text-red-800 text-lg p-1"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="col-span-2 md:col-span-1">
            <span className="font-bold text-lg text-green-700">{product.prix.toLocaleString()} FCFA</span>
            <span className="text-gray-500">/{product.unite}</span>
          </div>
          <div className="text-gray-600">
            Stock: {product.quantite_disponible} {product.unite}
          </div>
          <div className="text-gray-600 truncate">📍 {product.localisation}</div>
          <div className="text-gray-600 truncate">👤 {product.vendeur_nom}</div>
        </div>
        
        {/* Détails spécifiques selon le type */}
        {product.race_volaille && (
          <div className="text-xs md:text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded">
            Race: {product.race_volaille} • {product.age_semaines} sem • {product.poids_moyen}kg
          </div>
        )}
        {product.type_oeuf && (
          <div className="text-xs md:text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded">
            Type: {product.type_oeuf} • Fraîcheur: {product.fraicheur_jours} jour(s)
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-3 border-t space-y-2 md:space-y-0">
          <span className="text-xs text-gray-500">
            {new Date(product.created_at).toLocaleDateString('fr-FR')}
          </span>
          {!isOwner && (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
              <a
                href={`tel:${product.vendeur_telephone}`}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold text-center flex items-center justify-center space-x-1"
                title={`Appeler ${product.vendeur_nom}`}
              >
                <span>📞</span>
                <span className="hidden md:inline">{product.vendeur_telephone}</span>
                <span className="md:hidden">Appeler</span>
              </a>
              <button
                onClick={() => onContact(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
                title="Plus d'infos"
              >
                💬 Info
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Marketplace = ({ currentUser }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type_produit: '',
    localisation: '',
    prix_min: '',
    prix_max: ''
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type_produit) params.append('type_produit', filters.type_produit);
      if (filters.localisation) params.append('localisation', filters.localisation);
      if (filters.prix_min) params.append('prix_min', filters.prix_min);
      if (filters.prix_max) params.append('prix_max', filters.prix_max);
      
      const response = await axios.get(`${API}/products?${params}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const handleContact = (product) => {
    const phoneNumber = product.vendeur_telephone;
    if (window.confirm(`Appeler ${product.vendeur_nom} au ${phoneNumber} ?`)) {
      // Try to open phone dialer
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">🛍️ AviMarché - Trouvez vos Produits</h1>
        
        {/* Filtres - Optimisés Mobile */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">🔍 Rechercher</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type de produit</label>
              <select
                value={filters.type_produit}
                onChange={(e) => setFilters({...filters, type_produit: e.target.value})}
                className="w-full border rounded px-3 py-3 text-base"
              >
                <option value="">Tous les types</option>
                <option value="volaille_vivante">🐔 Volaille Vivante</option>
                <option value="oeufs">🥚 Œufs</option>
                <option value="volaille_transformee">🍗 Volaille Transformée</option>
                <option value="fientes">🌱 Fientes</option>
                <option value="amendements">🌱 Amendements</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Localisation</label>
              <input
                type="text"
                value={filters.localisation}
                onChange={(e) => setFilters({...filters, localisation: e.target.value})}
                className="w-full border rounded px-3 py-3 text-base"
                placeholder="Ville ou région"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Prix min (FCFA)</label>
              <input
                type="number"
                value={filters.prix_min}
                onChange={(e) => setFilters({...filters, prix_min: e.target.value})}
                className="w-full border rounded px-3 py-3 text-base"
                placeholder="Prix minimum"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Prix max (FCFA)</label>
              <input
                type="number"
                value={filters.prix_max}
                onChange={(e) => setFilters({...filters, prix_max: e.target.value})}
                className="w-full border rounded px-3 py-3 text-base"
                placeholder="Prix maximum"
              />
            </div>
          </div>
        </div>
        
        {/* Liste des produits - Optimisée Mobile */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Chargement des produits...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-gray-600 text-lg">Aucun produit trouvé</div>
            <div className="text-gray-500 text-sm mt-2">Essayez de modifier vos critères de recherche</div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              📊 {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currentUser={currentUser}
                  onContact={handleContact}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MyProducts = ({ currentUser }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type_produit: 'volaille_vivante',
    prix: '',
    unite: 'pièce',
    quantite_disponible: '',
    localisation: '',
    race_volaille: '',
    age_semaines: '',
    poids_moyen: '',
    type_oeuf: '',
    fraicheur_jours: '',
    type_transformation: '',
    type_amendement: '',
    composition: ''
  });

  const loadMyProducts = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API}/products/user/${currentUser.id}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyProducts();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        prix: parseFloat(formData.prix),
        quantite_disponible: parseInt(formData.quantite_disponible),
        age_semaines: formData.age_semaines ? parseInt(formData.age_semaines) : null,
        poids_moyen: formData.poids_moyen ? parseFloat(formData.poids_moyen) : null,
        fraicheur_jours: formData.fraicheur_jours ? parseInt(formData.fraicheur_jours) : null
      };

      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}?vendeur_id=${currentUser.id}`, productData);
        alert('Annonce mise à jour avec succès !');
      } else {
        await axios.post(`${API}/products?vendeur_id=${currentUser.id}`, productData);
        alert('Annonce créée avec succès !');
      }
      
      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        titre: '', description: '', type_produit: 'volaille_vivante', prix: '',
        unite: 'pièce', quantite_disponible: '', localisation: '',
        race_volaille: '', age_semaines: '', poids_moyen: '',
        type_oeuf: '', fraicheur_jours: '', type_transformation: '',
        type_amendement: '', composition: ''
      });
      loadMyProducts();
    } catch (error) {
      alert(error.response?.data?.detail || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      titre: product.titre,
      description: product.description,
      type_produit: product.type_produit,
      prix: product.prix.toString(),
      unite: product.unite,
      quantite_disponible: product.quantite_disponible.toString(),
      localisation: product.localisation,
      race_volaille: product.race_volaille || '',
      age_semaines: product.age_semaines?.toString() || '',
      poids_moyen: product.poids_moyen?.toString() || '',
      type_oeuf: product.type_oeuf || '',
      fraicheur_jours: product.fraicheur_jours?.toString() || '',
      type_transformation: product.type_transformation || '',
      type_amendement: product.type_amendement || '',
      composition: product.composition || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await axios.delete(`${API}/products/${productId}?vendeur_id=${currentUser.id}`);
        alert('Annonce supprimée avec succès !');
        loadMyProducts();
      } catch (error) {
        alert(error.response?.data?.detail || 'Erreur lors de la suppression');
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
          <p className="text-gray-600">Vous devez être connecté pour gérer vos annonces.</p>
        </div>
      </div>
    );
  }

  if (!['aviculteur'].includes(currentUser.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Accès non autorisé</h2>
          <p className="text-gray-600">Seuls les aviculteurs peuvent créer des annonces.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📋 Mes Annonces</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            ➕ Nouvelle Annonce
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Chargement...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Vous n'avez encore aucune annonce. Créez votre première annonce !</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                currentUser={currentUser}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Modal de création/modification */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingProduct ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
                </h2>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Titre*</label>
                    <input
                      type="text"
                      required
                      value={formData.titre}
                      onChange={(e) => setFormData({...formData, titre: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Titre de votre annonce"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Type de produit*</label>
                    <select
                      value={formData.type_produit}
                      onChange={(e) => setFormData({...formData, type_produit: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="volaille_vivante">Volaille Vivante</option>
                      <option value="oeufs">Œufs</option>
                      <option value="volaille_transformee">Volaille Transformée</option>
                      <option value="fientes">Fientes</option>
                      <option value="amendements">Amendements</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description*</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border rounded px-3 py-2 h-20"
                    placeholder="Décrivez votre produit..."
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prix (FCFA)*</label>
                    <input
                      type="number"
                      required
                      value={formData.prix}
                      onChange={(e) => setFormData({...formData, prix: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Prix unitaire"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Unité*</label>
                    <select
                      value={formData.unite}
                      onChange={(e) => setFormData({...formData, unite: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="pièce">Pièce</option>
                      <option value="kg">Kilogramme</option>
                      <option value="douzaine">Douzaine</option>
                      <option value="sac">Sac</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantité disponible*</label>
                    <input
                      type="number"
                      required
                      value={formData.quantite_disponible}
                      onChange={(e) => setFormData({...formData, quantite_disponible: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Stock disponible"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Localisation*</label>
                  <input
                    type="text"
                    required
                    value={formData.localisation}
                    onChange={(e) => setFormData({...formData, localisation: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Ville ou région"
                  />
                </div>
                
                {/* Champs spécifiques selon le type */}
                {formData.type_produit === 'volaille_vivante' && (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Race</label>
                      <input
                        type="text"
                        value={formData.race_volaille}
                        onChange={(e) => setFormData({...formData, race_volaille: e.target.value})}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Ex: Cobb 500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Âge (semaines)</label>
                      <input
                        type="number"
                        value={formData.age_semaines}
                        onChange={(e) => setFormData({...formData, age_semaines: e.target.value})}
                        className="w-full border rounded px-3 py-2"
                        placeholder="8"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Poids moyen (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.poids_moyen}
                        onChange={(e) => setFormData({...formData, poids_moyen: e.target.value})}
                        className="w-full border rounded px-3 py-2"
                        placeholder="2.2"
                      />
                    </div>
                  </div>
                )}
                
                {formData.type_produit === 'oeufs' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Type d'œuf</label>
                      <select
                        value={formData.type_oeuf}
                        onChange={(e) => setFormData({...formData, type_oeuf: e.target.value})}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Choisir...</option>
                        <option value="poule">Poule</option>
                        <option value="canard">Canard</option>
                        <option value="pintade">Pintade</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Fraîcheur (jours)</label>
                      <input
                        type="number"
                        value={formData.fraicheur_jours}
                        onChange={(e) => setFormData({...formData, fraicheur_jours: e.target.value})}
                        className="w-full border rounded px-3 py-2"
                        placeholder="1"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
                  >
                    {editingProduct ? 'Mettre à jour' : 'Créer l\'annonce'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  // Fonction de navigation avancée pour gérer les paramètres
  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
  };
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [stats, setStats] = useState({});
  const [useAccessibleInterface, setUseAccessibleInterface] = useState(() => {
    // Par défaut, utiliser l'interface accessible (Orange Money style)
    const saved = localStorage.getItem('avimarche_interface_mode');
    return saved ? saved === 'accessible' : true;
  });

  useEffect(() => {
    loadStats();
    
    // Vérifier si un utilisateur est connecté (simulé avec localStorage)
    const savedUser = localStorage.getItem('avimarket_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Sauvegarder la préférence d'interface
  useEffect(() => {
    localStorage.setItem('avimarche_interface_mode', useAccessibleInterface ? 'accessible' : 'classic');
  }, [useAccessibleInterface]);

  const toggleInterfaceMode = () => {
    setUseAccessibleInterface(!useAccessibleInterface);
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API}/stats/dashboard`);
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('avimarket_user', JSON.stringify(user));
    localStorage.setItem('avimarket_token', token);
    setShowLoginModal(false);
    setCurrentPage('home'); // Rediriger vers home après connexion réussie
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('avimarket_user');
    localStorage.removeItem('avimarket_token');
    setCurrentPage('register'); // Rediriger vers inscription après déconnexion
  };

  const handleRegister = async (userData) => {
    try {
      // Validation basique
      if (!userData.nom || !userData.telephone || !userData.localisation || !userData.role) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      // Appel API pour créer l'utilisateur
      console.log('Inscription en cours:', userData);
      
      const response = await axios.post(`${API}/users/register`, {
        nom: userData.nom,
        telephone: userData.telephone,
        localisation: userData.localisation,
        role: userData.role
      });

      if (response.data && response.data.id) {
        const newUser = response.data;
        
        setCurrentUser(newUser);
        localStorage.setItem('avimarket_user', JSON.stringify(newUser));
        
        // Message de bienvenue selon le rôle
        const roleMessage = {
          'aviculteur': 'Bienvenue éleveur ! Commencez à vendre vos volailles',
          'acheteur': 'Bienvenue acheteur ! Trouvez les meilleures volailles',
          'fournisseur': 'Bienvenue fournisseur ! Proposez vos aliments aux éleveurs'
        };
        
        alert(`✅ Compte créé avec succès !\n${roleMessage[userData.role] || 'Bienvenue sur AviMarché !'}`);
        setCurrentPage('home');
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        alert(`❌ Erreur: ${error.response.data.detail}`);
      } else {
        alert('❌ Erreur lors de la création du compte. Veuillez réessayer.');
      }
    }
  };

  const renderAccessibleContent = () => {
    switch (currentPage) {
      case 'feed-market':
        // Marché des aliments - Accessible aux aviculteurs et fournisseurs uniquement
        if (!currentUser || (currentUser.role !== 'aviculteur' && currentUser.role !== 'fournisseur')) {
          alert('Accès restreint : Cette section est réservée aux éleveurs et fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <div className="p-4"><h2 className="text-xl font-bold">🌾 Marché des Aliments pour Volailles</h2><p>Fonctionnalité en développement...</p><button onClick={() => setCurrentPage('home')} className="mt-4 p-3 bg-green-600 text-white rounded">Retour à l'accueil</button></div>;
      
      case 'my-feed-products':
        // Gestion stock aliments - Fournisseurs uniquement
        if (!currentUser || currentUser.role !== 'fournisseur') {
          alert('Accès restreint : Cette section est réservée aux fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <MyFeedProductsPage currentUser={currentUser} onNavigate={handleNavigate} />;
      
      case 'feed-orders':
        // Commandes aliments - Fournisseurs uniquement
        if (!currentUser || currentUser.role !== 'fournisseur') {
          alert('Accès restreint : Cette section est réservée aux fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <FeedOrdersPage currentUser={currentUser} onNavigate={handleNavigate} />;
      
      case 'feed-prices':
        // Prix aliments - Éleveurs uniquement
        if (!currentUser || currentUser.role !== 'aviculteur') {
          alert('Accès restreint : Cette section est réservée aux éleveurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <SimpleFeedPricesPage currentUser={currentUser} onNavigate={handleNavigate} />;
      
      case 'farmer-contacts':
        // Contacts éleveurs - Fournisseurs uniquement
        if (!currentUser || currentUser.role !== 'fournisseur') {
          alert('Accès restreint : Cette section est réservée aux fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <FarmerContactsPage currentUser={currentUser} onNavigate={handleNavigate} />;
      

      case 'contacts':
        // Contacts pour acheteurs
        if (!currentUser || currentUser.role !== 'acheteur') {
          alert('Accès restreint : Cette section est réservée aux acheteurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <div className="p-4"><h2 className="text-xl font-bold">📞 Mes Contacts Vendeurs</h2><p>Fonctionnalité en développement...</p><button onClick={() => setCurrentPage('home')} className="mt-4 p-3 bg-green-600 text-white rounded">Retour à l'accueil</button></div>;
      
      case 'orders':
        // Commandes - Accessible aux aviculteurs et acheteurs
        if (!currentUser || (currentUser.role !== 'aviculteur' && currentUser.role !== 'acheteur')) {
          alert('Accès restreint : Cette section est réservée aux éleveurs et acheteurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <div className="p-4"><h2 className="text-xl font-bold">📋 {currentUser.role === 'aviculteur' ? 'Commandes Reçues' : 'Mes Commandes'}</h2><div className="mt-4 space-y-3">{currentUser.role === 'aviculteur' ? <div><div className="bg-green-50 p-3 rounded border-l-4 border-green-500"><h3 className="font-bold text-green-800">📦 Commande #001</h3><p>• 10 poules pondeuses</p><p>• Client : Amadou Diallo</p><p>• Montant : 25,000 FCFA</p><p className="text-sm text-green-600 mt-1">🕐 Reçue il y a 2 heures</p></div><div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500"><h3 className="font-bold text-blue-800">📦 Commande #002</h3><p>• 50 œufs frais</p><p>• Client : Fatou Keita</p><p>• Montant : 7,500 FCFA</p><p className="text-sm text-blue-600 mt-1">🕐 Reçue hier</p></div></div> : <div><div className="bg-orange-50 p-3 rounded border-l-4 border-orange-500"><h3 className="font-bold text-orange-800">🛒 Ma commande #003</h3><p>• 5 poules pondeuses</p><p>• Vendeur : Mamadou Traoré</p><p>• Montant : 12,500 FCFA</p><p className="text-sm text-orange-600 mt-1">📦 En cours de livraison</p></div></div>}</div><button onClick={() => setCurrentPage('home')} className="mt-4 p-3 bg-green-600 text-white rounded">Retour à l'accueil</button></div>;
      
      case 'marketplace':
        // Marché volailles - Interdit aux fournisseurs
        if (currentUser && currentUser.role === 'fournisseur') {
          alert('Accès restreint : Les fournisseurs d\'aliments ne peuvent pas accéder au marché des volailles');
          setCurrentPage('feed-market');
          return <div className="p-4"><h2 className="text-xl font-bold">🌾 Marché des Aliments pour Volailles</h2><p>Vous êtes redirigé vers votre marché...</p></div>;
        }
        return <ModernMarketplace currentUser={currentUser} onNavigate={setCurrentPage} />;
      
      case 'myproducts':
        // Mes produits - Aviculteurs uniquement (volailles et œufs)
        if (!currentUser || currentUser.role !== 'aviculteur') {
          alert('Accès restreint : Cette section est réservée aux éleveurs de volailles');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <ModernMyProducts currentUser={currentUser} onNavigate={setCurrentPage} />;
      
      case 'health':
        // Page conseils pratiques et maladies - Aviculteurs uniquement
        if (!currentUser || currentUser.role !== 'aviculteur') {
          alert('Accès restreint : Cette section est réservée aux éleveurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <PracticalAdvicePage currentUser={currentUser} onNavigate={handleNavigate} />;

      case 'prices':
        // Page prix volailles simplifiée - Tous utilisateurs
        return <SimplePricesPage currentUser={currentUser} onNavigate={handleNavigate} />;
      case 'financial':
        // Page outils financiers simplifiés - Tous utilisateurs connectés
        if (!currentUser) {
          alert('Vous devez être connecté pour accéder aux outils financiers');
          setCurrentPage('register');
          return <RegistrationPage onRegister={handleRegister} onNavigate={setCurrentPage} onLogin={handleLogin} />;
        }
        return <SimpleFinancialToolsPage currentUser={currentUser} onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminDashboard />;
      case 'download':
        return <DownloadPage />;
      // ===== NOUVELLES PAGES DEMANDÉES =====
      case 'buy-feed':
        // Page acheter aliments volailles - Aviculteurs uniquement
        if (!currentUser || currentUser.role !== 'aviculteur') {
          alert('Accès restreint : Cette section est réservée aux éleveurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <BuyFeedPage currentUser={currentUser} onNavigate={setCurrentPage} />;

      case 'buy-chicks':
        // Page acheter poussins/œufs fécondés - Aviculteurs uniquement
        if (!currentUser || currentUser.role !== 'aviculteur') {
          alert('Accès restreint : Cette section est réservée aux éleveurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <BuyChicksPage currentUser={currentUser} onNavigate={setCurrentPage} />;

      case 'messages':
        // Page messages - Tous les utilisateurs connectés
        if (!currentUser) {
          alert('Vous devez être connecté pour accéder aux messages');
          setCurrentPage('register');
          return <RegistrationPage onRegister={handleRegister} onNavigate={setCurrentPage} onLogin={handleLogin} />;
        }
        return <EnhancedMessagesPage currentUser={currentUser} onNavigate={handleNavigate} params={pageParams} />;

      case 'contact-support':
        // Page contact support - Aviculteurs uniquement
        if (!currentUser || currentUser.role !== 'aviculteur') {
          alert('Accès restreint : Cette section est réservée aux éleveurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <ContactSupportPage currentUser={currentUser} onNavigate={handleNavigate} />;

      case 'my-poultry-stock':
        // Page mon stock volailles - Aviculteurs uniquement
        if (!currentUser || currentUser.role !== 'aviculteur') {
          alert('Accès restreint : Cette section est réservée aux éleveurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <MyPoultryStockPage currentUser={currentUser} onNavigate={setCurrentPage} />;

      case 'vendre-volailles':
        // Page vente volailles/œufs - Aviculteurs uniquement
        if (!currentUser || currentUser.role !== 'aviculteur') {
          alert('Accès restreint : Cette section est réservée aux éleveurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <VendreVolaillesPage currentUser={currentUser} onNavigate={setCurrentPage} />;
      
      case 'veterinaire-contacts':
        // Page vétérinaires - Aviculteurs uniquement 
        if (!currentUser || currentUser.role !== 'aviculteur') {
          alert('Accès restreint : Cette section est réservée aux éleveurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <VeterinaireContactsPage currentUser={currentUser} onNavigate={setCurrentPage} />;
      
      case 'calculateur':
        // Page calculateur - Éleveurs et Acheteurs
        if (!currentUser || (currentUser.role !== 'acheteur' && currentUser.role !== 'aviculteur')) {
          alert('Accès restreint : Cette section est réservée aux éleveurs et acheteurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <CalculateurPage currentUser={currentUser} onNavigate={setCurrentPage} />;

      // ===== PAGES ÉLEVEURS (AVICULTEURS) =====
      case 'feed-market':
        // Page marché des aliments - Aviculteurs uniquement
        if (!currentUser || currentUser.role !== 'aviculteur') {
          alert('Accès restreint : Cette section est réservée aux éleveurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <FeedMarketPage currentUser={currentUser} onNavigate={setCurrentPage} />;

      case 'feed-prices':
        // Page prix des aliments - Aviculteurs et Fournisseurs
        if (!currentUser || !['aviculteur', 'fournisseur'].includes(currentUser.role)) {
          alert('Accès restreint : Cette section est réservée aux éleveurs et fournisseurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <SimpleFeedPricesPage currentUser={currentUser} onNavigate={setCurrentPage} />;

      // ===== PAGES ACHETEURS =====
      case 'favorite-sellers':
        // Page éleveurs favoris - Acheteurs uniquement
        if (!currentUser || currentUser.role !== 'acheteur') {
          alert('Accès restreint : Cette section est réservée aux acheteurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <FavoriteSellersPage currentUser={currentUser} onNavigate={setCurrentPage} />;

      case 'received-orders':
        // Page stock reçu - Acheteurs uniquement
        if (!currentUser || currentUser.role !== 'acheteur') {
          alert('Accès restreint : Cette section est réservée aux acheteurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <ReceivedOrdersPage currentUser={currentUser} onNavigate={setCurrentPage} />;

      case 'top-sellers':
        // Page classement éleveurs - Acheteurs uniquement
        if (!currentUser || currentUser.role !== 'acheteur') {
          alert('Accès restreint : Cette section est réservée aux acheteurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <TopSellersPage currentUser={currentUser} onNavigate={handleNavigate} />;

      case 'buy-poultry':
        // Page acheter volailles - Acheteurs uniquement
        if (!currentUser || currentUser.role !== 'acheteur') {
          alert('Accès restreint : Cette section est réservée aux acheteurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <BuyPoultryPage currentUser={currentUser} onNavigate={handleNavigate} />;

      case 'buy-eggs':
        // Page acheter œufs - Acheteurs uniquement
        if (!currentUser || currentUser.role !== 'acheteur') {
          alert('Accès restreint : Cette section est réservée aux acheteurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <BuyEggsPage currentUser={currentUser} onNavigate={handleNavigate} />;

      case 'buyer-messages':
        // Page messages acheteurs - Acheteurs uniquement
        if (!currentUser || currentUser.role !== 'acheteur') {
          alert('Accès restreint : Cette section est réservée aux acheteurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <EnhancedMessagesPage currentUser={currentUser} onNavigate={handleNavigate} params={pageParams} />;

      case 'buyer-orders':
        // Page mes commandes acheteurs - Acheteurs uniquement
        if (!currentUser || currentUser.role !== 'acheteur') {
          alert('Accès restreint : Cette section est réservée aux acheteurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <BuyerOrdersPage currentUser={currentUser} onNavigate={handleNavigate} />;

      case 'buyer-contact-support':
        // Page contact support acheteurs - Acheteurs uniquement
        if (!currentUser || currentUser.role !== 'acheteur') {
          alert('Accès restreint : Cette section est réservée aux acheteurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <BuyerContactSupportPage currentUser={currentUser} onNavigate={handleNavigate} />;

      // ===== PAGES FOURNISSEURS D'ALIMENTS =====
      case 'my-feed-products':
        // Page gestion stock aliments - Fournisseurs uniquement
        if (!currentUser || currentUser.role !== 'fournisseur') {
          alert('Accès restreint : Cette section est réservée aux fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <MyFeedProductsPage currentUser={currentUser} onNavigate={setCurrentPage} />;

      case 'feed-orders':
        // Page commandes aliments - Fournisseurs uniquement
        if (!currentUser || currentUser.role !== 'fournisseur') {
          alert('Accès restreint : Cette section est réservée aux fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <FeedOrdersPage currentUser={currentUser} onNavigate={setCurrentPage} />;

      case 'farmer-contacts':
        // Page clients éleveurs - Fournisseurs uniquement
        if (!currentUser || currentUser.role !== 'fournisseur') {
          alert('Accès restreint : Cette section est réservée aux fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <FarmerContactsPage currentUser={currentUser} onNavigate={handleNavigate} />;

      case 'performance-dashboard':
        // Page dashboard performance - Fournisseurs uniquement
        if (!currentUser || currentUser.role !== 'fournisseur') {
          alert('Accès restreint : Cette section est réservée aux fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <PerformanceDashboardPage currentUser={currentUser} onNavigate={handleNavigate} />;

      case 'supplier-sales':
        // Mes ventes - Fournisseurs uniquement
        if (!currentUser || currentUser.role !== 'fournisseur') {
          alert('Accès restreint : Cette section est réservée aux fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <SupplierSalesPage currentUser={currentUser} onNavigate={handleNavigate} />;

      case 'supplier-feed-prices':
        // Prix du marché fournisseurs - Fournisseurs uniquement
        if (!currentUser || currentUser.role !== 'fournisseur') {
          alert('Accès restreint : Cette section est réservée aux fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <SupplierFeedPricesPage currentUser={currentUser} onNavigate={handleNavigate} />;

      case 'product-demand':
        // Produits les plus demandés - Fournisseurs uniquement
        if (!currentUser || currentUser.role !== 'fournisseur') {
          alert('Accès restreint : Cette section est réservée aux fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <ProductDemandPage currentUser={currentUser} onNavigate={handleNavigate} />;

      case 'market-demand':
        // Demande du marché - Fournisseurs uniquement
        if (!currentUser || currentUser.role !== 'fournisseur') {
          alert('Accès restreint : Cette section est réservée aux fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <MarketDemandPage currentUser={currentUser} onNavigate={handleNavigate} />;

      case 'supplier-advice':
        // Conseils fournisseurs - Fournisseurs uniquement
        if (!currentUser || currentUser.role !== 'fournisseur') {
          alert('Accès restreint : Cette section est réservée aux fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <SupplierAdvicePage currentUser={currentUser} onNavigate={handleNavigate} />;

      case 'supplier-contact-support':
        // Contact support fournisseurs - Fournisseurs uniquement
        if (!currentUser || currentUser.role !== 'fournisseur') {
          alert('Accès restreint : Cette section est réservée aux fournisseurs d\'aliments');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={handleNavigate} />;
        }
        return <SupplierContactSupportPage currentUser={currentUser} onNavigate={handleNavigate} />;
      
      case 'register':
        // Page d'inscription
        return <RegistrationPage onNavigate={setCurrentPage} onRegister={handleRegister} />;
      case 'login':
        // Ouvrir le modal de login et retourner à l'accueil
        setShowLoginModal(true);
        setCurrentPage('home');
        return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
      case 'notifications':
        // Page notifications simple
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">📢 Notifications</h2>
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h3 className="font-semibold text-green-800">🐔 Nouvelle commande</h3>
                <p className="text-green-700 text-sm">Un acheteur est intéressé par vos poules pondeuses</p>
                <p className="text-xs text-green-600 mt-1">Il y a 2 heures</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-blue-800">💰 Prix marché</h3>
                <p className="text-blue-700 text-sm">Le prix des poules a augmenté de 100 FCFA</p>
                <p className="text-xs text-blue-600 mt-1">Il y a 4 heures</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-semibold text-red-800">🩺 Alerte santé</h3>
                <p className="text-red-700 text-sm">Vaccination recommandée cette semaine</p>
                <p className="text-xs text-red-600 mt-1">Il y a 1 jour</p>
              </div>
            </div>
            <button onClick={() => setCurrentPage('home')} className="w-full mt-4 p-3 bg-green-600 text-white rounded">
              Retour à l'accueil
            </button>
          </div>
        );
      case 'profile':
        // Si connecté, afficher profil, sinon rediriger vers login
        if (!currentUser) {
          setShowLoginModal(true);
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        // Pour l'instant, afficher une page profil simple
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Mon Profil</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Informations personnelles</h3>
                <p><strong>Nom:</strong> {currentUser.nom || 'Non renseigné'}</p>
                <p><strong>Téléphone:</strong> {currentUser.telephone}</p>
                <p><strong>Rôle:</strong> {currentUser.role}</p>
                <p><strong>Localisation:</strong> {currentUser.localisation || 'Non renseigné'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-3">Sécurité et Authentification</h3>
                <button 
                  onClick={() => setCurrentPage('password-settings')} 
                  className="w-full p-3 bg-blue-600 text-white rounded-lg mb-2 hover:bg-blue-700 transition-colors"
                >
                  🔒 Configurer mot de passe
                </button>
                <p className="text-sm text-gray-600">
                  {currentUser.password ? 'Modifier votre mot de passe' : 'Créer un mot de passe pour connexion rapide'}
                </p>
              </div>
              <button onClick={() => setCurrentPage('home')} className="w-full p-3 bg-green-600 text-white rounded">
                Retour à l'accueil
              </button>
              <button onClick={handleLogout} className="w-full p-3 bg-red-600 text-white rounded">
                Se déconnecter
              </button>
            </div>
          </div>
        );
      case 'more':
        // Page "Plus" avec options supplémentaires
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Plus d'options</h2>
            <div className="space-y-2">
              <button onClick={() => setCurrentPage('financial')} className="w-full p-3 bg-green-600 text-white rounded">
                Outils Financiers
              </button>
              <button onClick={() => setCurrentPage('admin')} className="w-full p-3 bg-green-600 text-white rounded">
                Administration
              </button>
              <button onClick={() => setCurrentPage('download')} className="w-full p-3 bg-green-600 text-white rounded">
                Téléchargements
              </button>
            </div>
          </div>
        );
      // ===== NOUVELLES PAGES FEEDBACK BIDIRECTIONNEL =====
      case 'rate-farmer':
        // Page noter un éleveur - Acheteurs uniquement
        if (!currentUser || currentUser.role !== 'acheteur') {
          alert('Accès restreint : Cette section est réservée aux acheteurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <RateFarmerPage currentUser={currentUser} onBack={() => setCurrentPage('home')} />;

      case 'rate-supplier':
        // Page noter un fournisseur - Éleveurs uniquement
        if (!currentUser || currentUser.role !== 'aviculteur') {
          alert('Accès restreint : Cette section est réservée aux éleveurs');
          setCurrentPage('home');
          return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        return <RateSupplierPage currentUser={currentUser} onBack={() => setCurrentPage('home')} />;

      case 'my-ratings':
        // Page voir mes évaluations - Tous les utilisateurs connectés
        if (!currentUser) {
          alert('Vous devez être connecté pour voir vos évaluations');
          setCurrentPage('register');
          return <RegistrationPage onRegister={handleRegister} onNavigate={setCurrentPage} onLogin={handleLogin} />;
        }
        return <MyRatingsPage currentUser={currentUser} onBack={() => setCurrentPage('home')} />;

      // ===== NOUVELLES PAGES AUTHENTIFICATION AMÉLIORÉE =====
      case 'password-settings':
        // Page configuration mot de passe - Tous les utilisateurs connectés
        if (!currentUser) {
          alert('Vous devez être connecté pour configurer un mot de passe');
          setCurrentPage('register');
          return <RegistrationPage onRegister={handleRegister} onNavigate={setCurrentPage} onLogin={handleLogin} />;
        }
        return <PasswordSettingsPage currentUser={currentUser} onBack={() => setCurrentPage('profile')} />;

      case 'notifications':
        // Page notifications
        if (!currentUser) {
          alert('Vous devez être connecté pour voir les notifications');
          setCurrentPage('register');
          return <RegistrationPage onRegister={handleRegister} onNavigate={setCurrentPage} onLogin={handleLogin} />;
        }
        return <NotificationsPage currentUser={currentUser} onNavigate={setCurrentPage} />;

      case 'orders-received':
        // Page commandes reçues (pour vendeurs)
        if (!currentUser) {
          alert('Vous devez être connecté pour voir vos commandes');
          setCurrentPage('register');
          return <RegistrationPage onRegister={handleRegister} onNavigate={setCurrentPage} onLogin={handleLogin} />;
        }
        return <div className="p-4"><h2 className="text-xl font-bold">📦 Commandes reçues</h2><p>Fonctionnalité en développement...</p><button onClick={() => setCurrentPage('home')} className="mt-4 p-3 bg-green-600 text-white rounded">Retour à l'accueil</button></div>;

      case 'orders-sent':
        // Page commandes envoyées (pour acheteurs)
        if (!currentUser) {
          alert('Vous devez être connecté pour voir vos commandes');
          setCurrentPage('register');
          return <RegistrationPage onRegister={handleRegister} onNavigate={setCurrentPage} onLogin={handleLogin} />;
        }
        return <div className="p-4"><h2 className="text-xl font-bold">🛒 Mes commandes envoyées</h2><p>Fonctionnalité en développement...</p><button onClick={() => setCurrentPage('home')} className="mt-4 p-3 bg-green-600 text-white rounded">Retour à l'accueil</button></div>;

      default:
        // Pour les non-connectés : afficher la page d'inscription
        if (!currentUser) {
          return <RegistrationPage onNavigate={setCurrentPage} onRegister={handleRegister} />;
        }
        // Pour les aviculteurs : page d'accueil spécialisée selon votre schéma
        if (currentUser.role === 'aviculteur') {
          return <AviculteurHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        // Pour les acheteurs : page d'accueil spécialisée selon votre schéma
        if (currentUser.role === 'acheteur') {
          return <AcheteurHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        // Pour les fournisseurs : page d'accueil spécialisée selon votre schéma
        if (currentUser.role === 'fournisseur') {
          return <FournisseurHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
        }
        // Fallback pour autres rôles
        return <AccessibleHomePage currentUser={currentUser} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <WebSocketProvider currentUser={currentUser}>
          <div className="App">
            {/* Interface Accessible UNIQUEMENT (Orange Money style) */}
            <AccessibleHeader
              currentUser={currentUser}
              onNavigate={setCurrentPage}
              onLogout={handleLogout}
            />
            
            {renderAccessibleContent()}
            
            <BottomNavigation
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              currentUser={currentUser}
            />
            
            <EnhancedLoginModal
              isOpen={showLoginModal}
              onClose={() => setShowLoginModal(false)}
              onLogin={handleLogin}
            />
            
            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
              <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <span className="text-2xl">🐔</span>
                  <span className="text-xl font-bold">AviMarché Mali</span>
                </div>
                <p className="text-gray-400">
                  Plateforme dédiée au développement de l'aviculture malienne
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  © 2024 AviMarché. Connecter, Acheter, Vendre en temps réel.
                </p>
              </div>
            </footer>
          </div>
        </WebSocketProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}


export default App;