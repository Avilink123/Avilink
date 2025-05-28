import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Composants principaux
const Header = ({ currentUser, onLogin, onLogout, onNavigate, currentPage }) => {
  return (
    <header className="bg-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-green-900 font-bold text-xl">🐔</span>
            </div>
            <h1 className="text-2xl font-bold">AviMarché</h1>
            <span className="text-green-200 text-sm">Mali</span>
          </div>
          
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
            {currentUser && (
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

          <div>
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
    </header>
  );
};

const HomePage = ({ stats }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bienvenue sur AviMarché
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            La première plateforme numérique dédiée à l'aviculture au Mali. 
            Connectez-vous avec des aviculteurs, acheteurs et fournisseurs dans tout le pays.
          </p>
          <div className="bg-white/10 rounded-lg p-6 inline-block">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300">{stats.total_produits || 0}</div>
                <div className="text-sm">Annonces Actives</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">{stats.total_utilisateurs || 0}</div>
                <div className="text-sm">Utilisateurs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">
                  {Object.keys(stats.stats_par_type || {}).length}
                </div>
                <div className="text-sm">Catégories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Que pouvez-vous faire sur AviMarché ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🐔</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Vendre vos Produits</h3>
              <p className="text-gray-600">
                Créez des annonces pour vos volailles, œufs et produits dérivés. 
                Atteignez des acheteurs dans tout le Mali.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Acheter Facilement</h3>
              <p className="text-gray-600">
                Trouvez les meilleurs produits avicoles près de chez vous. 
                Contactez directement les vendeurs.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Réseau Professionnel</h3>
              <p className="text-gray-600">
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
                  <option value="fournisseur">Fournisseur</option>
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
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getProductIcon(product.type_produit)}</span>
            <div>
              <h3 className="font-semibold text-lg">{product.titre}</h3>
              <span className="text-sm text-gray-500">{getProductTypeName(product.type_produit)}</span>
            </div>
          </div>
          {isOwner && (
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(product)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="font-medium text-green-700">{product.prix.toLocaleString()} FCFA</span>
            <span className="text-gray-500">/{product.unite}</span>
          </div>
          <div className="text-gray-600">
            Stock: {product.quantite_disponible} {product.unite}
          </div>
          <div className="text-gray-600">📍 {product.localisation}</div>
          <div className="text-gray-600">👤 {product.vendeur_nom}</div>
        </div>
        
        {/* Détails spécifiques selon le type */}
        {product.race_volaille && (
          <div className="text-sm text-gray-600 mb-2">
            Race: {product.race_volaille} • {product.age_semaines} semaines • {product.poids_moyen}kg
          </div>
        )}
        {product.type_oeuf && (
          <div className="text-sm text-gray-600 mb-2">
            Type: {product.type_oeuf} • Fraîcheur: {product.fraicheur_jours} jour(s)
          </div>
        )}
        
        <div className="flex justify-between items-center pt-3 border-t">
          <span className="text-xs text-gray-500">
            {new Date(product.created_at).toLocaleDateString('fr-FR')}
          </span>
          {!isOwner && (
            <div className="flex space-x-2">
              <a
                href={`tel:${product.vendeur_telephone}`}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-semibold flex items-center space-x-1"
                title={`Appeler ${product.vendeur_nom}`}
              >
                <span>📞</span>
                <span>{product.vendeur_telephone}</span>
              </a>
              <button
                onClick={() => onContact(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold"
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
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">🛍️ AviMarché - Trouvez vos Produits</h1>
        
        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filtres de recherche</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type de produit</label>
              <select
                value={filters.type_produit}
                onChange={(e) => setFilters({...filters, type_produit: e.target.value})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Tous les types</option>
                <option value="volaille_vivante">Volaille Vivante</option>
                <option value="oeufs">Œufs</option>
                <option value="volaille_transformee">Volaille Transformée</option>
                <option value="fientes">Fientes</option>
                <option value="amendements">Amendements</option>
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
              <label className="block text-sm font-medium mb-1">Prix min (FCFA)</label>
              <input
                type="number"
                value={filters.prix_min}
                onChange={(e) => setFilters({...filters, prix_min: e.target.value})}
                className="w-full border rounded px-3 py-2"
                placeholder="Prix minimum"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Prix max (FCFA)</label>
              <input
                type="number"
                value={filters.prix_max}
                onChange={(e) => setFilters({...filters, prix_max: e.target.value})}
                className="w-full border rounded px-3 py-2"
                placeholder="Prix maximum"
              />
            </div>
          </div>
        </div>
        
        {/* Liste des produits */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Chargement des produits...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Aucun produit trouvé avec ces critères.</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                currentUser={currentUser}
                onContact={handleContact}
              />
            ))}
          </div>
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

  if (!['aviculteur', 'fournisseur'].includes(currentUser.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Accès non autorisé</h2>
          <p className="text-gray-600">Seuls les aviculteurs et fournisseurs peuvent créer des annonces.</p>
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