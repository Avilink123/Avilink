import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModernCard from './ModernCard';
import StatCard from './StatCard';
import ModernButton from './ModernButton';
import { BACKGROUND_IMAGES, PRODUCT_TYPES, REGIONS_MALI } from '../constants';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ModernMarketplace = ({ currentUser, onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedType, selectedLocation]);

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedType) {
      filtered = filtered.filter(product => product.type === selectedType);
    }
    
    if (selectedLocation) {
      filtered = filtered.filter(product => product.localisation === selectedLocation);
    }
    
    setFilteredProducts(filtered);
  };

  const getProductTypeInfo = (type) => {
    const productType = PRODUCT_TYPES.find(pt => pt.key === type);
    return productType || { label: type, icon: '📦', color: '#16a34a' };
  };

  const handleContact = (vendeur) => {
    window.open(`tel:${vendeur.telephone}`, '_self');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedLocation('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du marché...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Hero */}
      <ModernCard
        backgroundImage={BACKGROUND_IMAGES.marketplace}
        gradient
        className="mx-4 mt-6 md:mx-8"
      >
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Marché Avicole Mali
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Découvrez les meilleurs produits avicoles du Mali
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{products.length}</div>
              <div className="text-sm">Produits</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{new Set(products.map(p => p.localisation)).size}</div>
              <div className="text-sm">Régions</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{new Set(products.map(p => p.vendeur?.nom)).size}</div>
              <div className="text-sm">Vendeurs</div>
            </div>
          </div>
        </div>
      </ModernCard>

      <div className="container mx-auto px-4 py-8">
        {/* Barre de recherche et filtres */}
        <ModernCard className="mb-8">
          <div className="space-y-4">
            {/* Recherche */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>

            {/* Boutons de filtres */}
            <div className="flex flex-wrap gap-3">
              <ModernButton
                title={showFilters ? "Masquer Filtres" : "Afficher Filtres"}
                icon="🔧"
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="small"
              />
              
              {(selectedType || selectedLocation || searchTerm) && (
                <ModernButton
                  title="Effacer Filtres"
                  icon="✕"
                  onClick={clearFilters}
                  variant="ghost"
                  size="small"
                />
              )}

              {/* Filtres actifs */}
              {selectedType && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                  <span>{getProductTypeInfo(selectedType).icon} {getProductTypeInfo(selectedType).label}</span>
                  <button onClick={() => setSelectedType('')} className="ml-2 text-green-600 hover:text-green-800">×</button>
                </div>
              )}
              
              {selectedLocation && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                  <span>📍 {selectedLocation}</span>
                  <button onClick={() => setSelectedLocation('')} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                </div>
              )}
            </div>

            {/* Panel de filtres détaillés */}
            {showFilters && (
              <div className="border-t pt-4 mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Type de produit</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {PRODUCT_TYPES.map((type) => (
                      <button
                        key={type.key}
                        onClick={() => setSelectedType(selectedType === type.key ? '' : type.key)}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          selectedType === type.key
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
                  <h3 className="font-semibold mb-3">Région</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {REGIONS_MALI.map((region) => (
                      <ModernButton
                        key={region}
                        title={region}
                        onClick={() => setSelectedLocation(selectedLocation === region ? '' : region)}
                        variant={selectedLocation === region ? 'primary' : 'outline'}
                        size="small"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ModernCard>

        {/* Catégories rapides */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Catégories Populaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {PRODUCT_TYPES.map((type) => {
              const count = products.filter(p => p.type === type.key).length;
              return (
                <ModernCard
                  key={type.key}
                  className="text-center cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedType(type.key)}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="font-semibold text-gray-800">{type.label}</div>
                  <div className="text-sm text-gray-600">{count} produits</div>
                </ModernCard>
              );
            })}
          </div>
        </div>

        {/* Liste des produits */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Produits Disponibles {filteredProducts.length > 0 && `(${filteredProducts.length})`}
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <ModernCard className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600 mb-6">
                {products.length === 0 
                  ? "Aucun produit n'est actuellement disponible sur le marché."
                  : "Aucun produit ne correspond à vos critères de recherche."
                }
              </p>
              {(selectedType || selectedLocation || searchTerm) && (
                <ModernButton
                  title="Effacer les filtres"
                  onClick={clearFilters}
                  variant="outline"
                />
              )}
            </ModernCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const typeInfo = getProductTypeInfo(product.type);
                return (
                  <ModernCard key={product.id} className="hover:shadow-lg transition-shadow">
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
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center space-x-1 mb-1">
                            <span>👤</span>
                            <span>{product.vendeur?.nom}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>📍</span>
                            <span>{product.localisation}</span>
                          </div>
                        </div>

                        {currentUser?.role === 'acheteur' && (
                          <ModernButton
                            title="Contacter"
                            icon="📞"
                            onClick={() => handleContact(product.vendeur)}
                            size="small"
                            variant="outline"
                          />
                        )}
                      </div>
                    </div>
                  </ModernCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Call to action */}
        {currentUser?.role === 'aviculteur' && (
          <ModernCard
            backgroundImage={BACKGROUND_IMAGES.chickens}
            gradient
            className="text-center py-8"
          >
            <h2 className="text-2xl font-bold mb-4">Vendez vos produits sur AviMarché</h2>
            <p className="text-lg mb-6 opacity-90">
              Créez vos annonces et atteignez des acheteurs dans tout le Mali
            </p>
            <ModernButton
              title="Créer une annonce"
              icon="➕"
              size="large"
              className="bg-white text-green-700 hover:bg-gray-100"
              onClick={() => onNavigate('myproducts')}
            />
          </ModernCard>
        )}
      </div>
    </div>
  );
};

export default ModernMarketplace;