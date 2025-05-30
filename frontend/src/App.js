import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
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

const HomePage = ({ stats }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section Hero - Optimisée Mobile */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            Bienvenue sur AviMarché
          </h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            La première plateforme numérique dédiée à l'aviculture au Mali. 
            Connectez-vous avec des aviculteurs et acheteurs dans tout le pays.
          </p>
          <div className="bg-white/10 rounded-lg p-4 md:p-6 inline-block">
            <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-yellow-300">{stats.total_produits || 0}</div>
                <div className="text-xs md:text-sm">Annonces Actives</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-yellow-300">{stats.total_utilisateurs || 0}</div>
                <div className="text-xs md:text-sm">Utilisateurs</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-yellow-300">
                  {Object.keys(stats.stats_par_type || {}).length}
                </div>
                <div className="text-xs md:text-sm">Catégories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités - Optimisée Mobile */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-12 text-gray-800">
            Que pouvez-vous faire sur AviMarché ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🐔</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Vendre vos Produits</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Créez des annonces pour vos volailles, œufs et produits dérivés. 
                Atteignez des acheteurs dans tout le Mali.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Acheter Facilement</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Trouvez les meilleurs produits avicoles près de chez vous. 
                Contactez directement les vendeurs.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Réseau Professionnel</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Connectez-vous avec d'autres professionnels de l'aviculture 
                et développez votre réseau.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    role: 'acheteur',
    localisation: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isRegistering) {
        const response = await axios.post(`${API}/users/register`, formData);
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setIsRegistering(false);
        setFormData({ nom: '', telephone: '', role: 'acheteur', localisation: '' });
      } else {
        const response = await axios.post(`${API}/users/login`, {
          telephone: formData.telephone
        });
        onLogin(response.data.user, response.data.token);
        onClose();
      }
    } catch (error) {
      alert(error.response?.data?.detail || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isRegistering ? 'Créer un compte' : 'Se connecter'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Votre nom complet"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="acheteur">Acheteur</option>
                  <option value="aviculteur">Aviculteur</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Localisation</label>
                <input
                  type="text"
                  required
                  value={formData.localisation}
                  onChange={(e) => setFormData({...formData, localisation: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ville ou région"
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Numéro de téléphone</label>
            <input
              type="tel"
              required
              value={formData.telephone}
              onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="76123456"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold disabled:opacity-50"
          >
            {loading ? 'Chargement...' : (isRegistering ? "S'inscrire" : 'Se connecter')}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-green-600 hover:text-green-700 text-sm"
          >
            {isRegistering ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadStats();
    
    // Vérifier si un utilisateur est connecté (simulé avec localStorage)
    const savedUser = localStorage.getItem('avimarket_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

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
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('avimarket_user');
    localStorage.removeItem('avimarket_token');
    setCurrentPage('home');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'marketplace':
        return <Marketplace currentUser={currentUser} />;
      case 'myproducts':
        return <MyProducts currentUser={currentUser} />;
      case 'prices':
        return <PriceMonitoring />;
      case 'health':
        return <AnimalHealth currentUser={currentUser} />;
      case 'finances':
        return <FinancialTools currentUser={currentUser} />;
      case 'admin':
        return <AdminDashboard />;
      case 'download':
        return <DownloadPage />;
      default:
        return <HomePage stats={stats} />;
    }
  };

  return (
    <div className="App">
      <Header
        currentUser={currentUser}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      
      {renderCurrentPage()}
      
      <LoginModal
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
            © 2024 AviMarché. Connecter, Acheter, Vendre.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;