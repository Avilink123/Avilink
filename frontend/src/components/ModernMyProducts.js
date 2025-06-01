import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModernCard from './ModernCard';
import StatCard from './StatCard';
import ModernButton from './ModernButton';
import { BACKGROUND_IMAGES, PRODUCT_TYPES, REGIONS_MALI } from '../constants';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ModernMyProducts = ({ currentUser, onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    type: 'volaille_vivante',
    prix: '',
    description: '',
    localisation: currentUser?.localisation || 'Bamako'
  });

  useEffect(() => {
    if (currentUser) {
      loadProducts();
    }
  }, [currentUser]);

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API}/products/user/${currentUser.telephone}`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        prix: parseFloat(formData.prix),
        vendeur_telephone: currentUser.telephone
      };

      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, productData);
        alert('Produit modifié avec succès !');
      } else {
        await axios.post(`${API}/products`, productData);
        alert('Produit ajouté avec succès !');
      }

      setFormData({
        nom: '',
        type: 'volaille_vivante',
        prix: '',
        description: '',
        localisation: currentUser?.localisation || 'Bamako'
      });
      setShowAddForm(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      nom: product.nom,
      type: product.type,
      prix: product.prix.toString(),
      description: product.description || '',
      localisation: product.localisation
    });
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`${API}/products/${productId}`);
        alert('Produit supprimé avec succès !');
        loadProducts();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getProductTypeInfo = (type) => {
    const productType = PRODUCT_TYPES.find(pt => pt.key === type);
    return productType || { label: type, icon: '📦', color: '#16a34a' };
  };

  const calculateStats = () => {
    const totalValue = products.reduce((sum, product) => sum + (product.prix || 0), 0);
    const typeStats = {};
    products.forEach(product => {
      typeStats[product.type] = (typeStats[product.type] || 0) + 1;
    });
    
    return {
      totalProducts: products.length,
      totalValue,
      typeStats,
      avgPrice: products.length > 0 ? totalValue / products.length : 0
    };
  };

  const stats = calculateStats();

  if (!currentUser || currentUser.role !== 'aviculteur') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ModernCard className="text-center max-w-md">
          <div className="text-6xl mb-4">🚜</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès Aviculteur Requis</h2>
          <p className="text-gray-600 mb-6">
            Cette section est réservée aux aviculteurs pour gérer leurs annonces.
          </p>
          <ModernButton
            title="Retour à l'accueil"
            onClick={() => window.location.href = '#home'}
          />
        </ModernCard>
      </div>
    );
  }

  if (loading && !showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos annonces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Hero */}
      <ModernCard
        backgroundImage={BACKGROUND_IMAGES.farm}
        gradient
        className="mx-4 mt-6 md:mx-8"
      >
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Mes Annonces
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Gérez vos produits avicoles en ligne
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{stats.totalProducts}</div>
              <div className="text-sm">Annonces Actives</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{stats.totalValue.toLocaleString()} FCFA</div>
              <div className="text-sm">Valeur Totale</div>
            </div>
          </div>
        </div>
      </ModernCard>

      <div className="container mx-auto px-4 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Annonces Actives"
            value={stats.totalProducts}
            icon="📦"
            color="#16a34a"
          />
          <StatCard
            title="Valeur Totale"
            value={`${stats.totalValue.toLocaleString()} FCFA`}
            icon="💰"
            color="#f59e0b"
          />
          <StatCard
            title="Prix Moyen"
            value={`${Math.round(stats.avgPrice).toLocaleString()} FCFA`}
            icon="📊"
            color="#3b82f6"
          />
          <StatCard
            title="Catégories"
            value={Object.keys(stats.typeStats).length}
            icon="🏷️"
            color="#8b5cf6"
          />
        </div>

        {/* Actions principales */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <ModernButton
            title={showAddForm ? "Annuler" : "Ajouter un Produit"}
            icon={showAddForm ? "✕" : "➕"}
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingProduct(null);
              setFormData({
                nom: '',
                type: 'volaille_vivante',
                prix: '',
                description: '',
                localisation: currentUser?.localisation || 'Bamako'
              });
            }}
            variant={showAddForm ? "outline" : "primary"}
            size="large"
          />
          
          {products.length > 0 && (
            <ModernButton
              title="Actualiser"
              icon="🔄"
              onClick={loadProducts}
              variant="outline"
              size="large"
            />
          )}
        </div>

        {/* Formulaire d'ajout/modification */}
        {showAddForm && (
          <ModernCard className="mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="Ex: Poulets de chair"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prix (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.prix}
                    onChange={(e) => setFormData({...formData, prix: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="Ex: 2500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type de produit *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {PRODUCT_TYPES.map((type) => (
                    <button
                      key={type.key}
                      type="button"
                      onClick={() => setFormData({...formData, type: type.key})}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        formData.type === type.key
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-xs font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Région
                </label>
                <select
                  value={formData.localisation}
                  onChange={(e) => setFormData({...formData, localisation: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
                >
                  {REGIONS_MALI.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="Décrivez votre produit..."
                />
              </div>

              <div className="flex gap-4">
                <ModernButton
                  type="submit"
                  title={editingProduct ? "Modifier" : "Ajouter"}
                  loading={loading}
                  size="large"
                />
                <ModernButton
                  type="button"
                  title="Annuler"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                  }}
                  variant="outline"
                  size="large"
                />
              </div>
            </form>
          </ModernCard>
        )}

        {/* Liste des produits */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Vos Annonces {products.length > 0 && `(${products.length})`}
          </h2>

          {products.length === 0 ? (
            <ModernCard className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune annonce</h3>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore créé d'annonces. Commencez dès maintenant !
              </p>
              <ModernButton
                title="Créer ma première annonce"
                icon="➕"
                onClick={() => setShowAddForm(true)}
              />
            </ModernCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const typeInfo = getProductTypeInfo(product.type);
                return (
                  <ModernCard key={product.id}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">{typeInfo.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{product.nom}</h3>
                          <p className="text-sm text-gray-600">{typeInfo.label}</p>
                        </div>
                      </div>
                      <div 
                        className="px-3 py-1 rounded-full text-white text-sm font-bold"
                        style={{ backgroundColor: typeInfo.color }}
                      >
                        {product.prix?.toLocaleString()} FCFA
                      </div>
                    </div>

                    {product.description && (
                      <p className="text-gray-600 text-sm mb-4">
                        {product.description}
                      </p>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <span>📍</span>
                            <span>{product.localisation}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(product.date_creation).toLocaleDateString('fr-FR')}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <ModernButton
                          title="Modifier"
                          icon="✏️"
                          onClick={() => handleEdit(product)}
                          variant="outline"
                          size="small"
                          className="flex-1"
                        />
                        <ModernButton
                          title="Supprimer"
                          icon="🗑️"
                          onClick={() => handleDelete(product.id)}
                          variant="outline"
                          size="small"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        />
                      </div>
                    </div>
                  </ModernCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernMyProducts;