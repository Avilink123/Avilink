import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModernCard from './ModernCard';
import StatCard from './StatCard';
import ModernButton from './ModernButton';
import { BACKGROUND_IMAGES, REGIONS_MALI } from '../constants';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ModernPriceMonitoring = () => {
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { key: 'Intrants', icon: '🌾', color: '#f59e0b' },
    { key: 'Volaille Vivante', icon: '🐔', color: '#16a34a' },
    { key: 'Œufs', icon: '🥚', color: '#fbbf24' },
    { key: 'Volaille Transformée', icon: '🍗', color: '#f97316' },
    { key: 'Fientes', icon: '🌱', color: '#84cc16' },
  ];

  useEffect(() => {
    loadPrices();
  }, []);

  useEffect(() => {
    filterPrices();
  }, [prices, selectedCategory, selectedLocation, searchTerm]);

  const loadPrices = async () => {
    try {
      const response = await axios.get(`${API}/prices`);
      setPrices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading prices:', error);
      setLoading(false);
    }
  };

  const filterPrices = () => {
    let filtered = prices;
    
    if (searchTerm) {
      filtered = filtered.filter(price => 
        price.produit.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(price => price.categorie === selectedCategory);
    }
    
    if (selectedLocation) {
      filtered = filtered.filter(price => price.localisation === selectedLocation);
    }
    
    setFilteredPrices(filtered);
  };

  const getTrendIcon = (tendance) => {
    switch (tendance) {
      case 'hausse': return '📈';
      case 'baisse': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (tendance) => {
    switch (tendance) {
      case 'hausse': return '#10b981';
      case 'baisse': return '#ef4444';
      default: return '#64748b';
    }
  };

  const calculateStats = () => {
    const avgPrice = prices.length > 0 
      ? prices.reduce((sum, price) => sum + price.prix, 0) / prices.length 
      : 0;
    
    const trends = {
      hausse: prices.filter(p => p.tendance === 'hausse').length,
      baisse: prices.filter(p => p.tendance === 'baisse').length,
      stable: prices.filter(p => p.tendance === 'stable').length,
    };

    return { avgPrice, trends, totalPrices: prices.length };
  };

  const stats = calculateStats();

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedLocation('');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des prix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Hero */}
      <ModernCard
        backgroundImage={BACKGROUND_IMAGES.money}
        gradient
        className="mx-4 mt-6 md:mx-8"
      >
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Suivi des Prix
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Tendances du marché avicole malien en temps réel
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{Math.round(stats.avgPrice).toLocaleString()}</div>
              <div className="text-sm">Prix Moyen (FCFA)</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{stats.totalPrices}</div>
              <div className="text-sm">Prix Suivis</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{categories.length}</div>
              <div className="text-sm">Catégories</div>
            </div>
          </div>
        </div>
      </ModernCard>

      <div className="container mx-auto px-4 py-8">
        {/* Statistiques de tendances */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Prix Moyen"
            value={`${Math.round(stats.avgPrice).toLocaleString()} FCFA`}
            icon="💰"
            color="#16a34a"
          />
          <StatCard
            title="En Hausse"
            value={stats.trends.hausse}
            subtitle="produits"
            icon="📈"
            color="#10b981"
          />
          <StatCard
            title="En Baisse" 
            value={stats.trends.baisse}
            subtitle="produits"
            icon="📉"
            color="#ef4444"
          />
          <StatCard
            title="Stables"
            value={stats.trends.stable}
            subtitle="produits"
            icon="➡️"
            color="#64748b"
          />
        </div>

        {/* Recherche et filtres */}
        <ModernCard className="mb-8">
          <div className="space-y-4">
            {/* Barre de recherche */}
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

            {/* Filtres actifs */}
            {(selectedCategory || selectedLocation || searchTerm) && (
              <div className="flex flex-wrap gap-2">
                <ModernButton
                  title="Effacer Filtres"
                  icon="✕"
                  onClick={clearFilters}
                  variant="ghost"
                  size="small"
                />
                
                {selectedCategory && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                    <span>{categories.find(c => c.key === selectedCategory)?.icon} {selectedCategory}</span>
                    <button onClick={() => setSelectedCategory('')} className="ml-2 text-green-600 hover:text-green-800">×</button>
                  </div>
                )}
                
                {selectedLocation && (
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                    <span>📍 {selectedLocation}</span>
                    <button onClick={() => setSelectedLocation('')} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </ModernCard>

        {/* Catégories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Catégories de Prix</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <ModernCard
              className="text-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelectedCategory('')}
            >
              <div className="text-3xl mb-2">🏪</div>
              <div className="font-semibold text-gray-800">Tous</div>
              <div className="text-sm text-gray-600">{prices.length} prix</div>
            </ModernCard>
            {categories.map((category) => {
              const count = prices.filter(p => p.categorie === category.key).length;
              return (
                <ModernCard
                  key={category.key}
                  className={`text-center cursor-pointer hover:scale-105 transition-transform ${
                    selectedCategory === category.key ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category.key ? '' : category.key)}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="font-semibold text-gray-800">{category.key}</div>
                  <div className="text-sm text-gray-600">{count} prix</div>
                </ModernCard>
              );
            })}
          </div>
        </div>

        {/* Régions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Filtrer par Région</h2>
          <div className="flex flex-wrap gap-2">
            <ModernButton
              title="Toutes les régions"
              onClick={() => setSelectedLocation('')}
              variant={!selectedLocation ? 'primary' : 'outline'}
              size="small"
            />
            {REGIONS_MALI.slice(0, 8).map((region) => (
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

        {/* Liste des prix */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Prix du Marché {filteredPrices.length > 0 && `(${filteredPrices.length})`}
            </h2>
            <ModernButton
              title="Actualiser"
              icon="🔄"
              onClick={loadPrices}
              variant="outline"
              size="small"
            />
          </div>

          {filteredPrices.length === 0 ? (
            <ModernCard className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun prix trouvé</h3>
              <p className="text-gray-600 mb-6">
                {prices.length === 0 
                  ? "Aucun prix n'est actuellement disponible."
                  : "Aucun prix ne correspond à vos critères de recherche."
                }
              </p>
              {(selectedCategory || selectedLocation || searchTerm) && (
                <ModernButton
                  title="Effacer les filtres"
                  onClick={clearFilters}
                  variant="outline"
                />
              )}
            </ModernCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrices.map((price) => {
                const categoryInfo = categories.find(c => c.key === price.categorie);
                return (
                  <ModernCard key={price.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: categoryInfo?.color || '#16a34a' }}
                        >
                          <span className="text-xl">{categoryInfo?.icon || '📦'}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{price.produit}</h3>
                          <p className="text-sm text-gray-600">{price.categorie}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div 
                          className="text-xl font-bold mb-1"
                          style={{ color: getTrendColor(price.tendance) }}
                        >
                          {getTrendIcon(price.tendance)}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {price.prix?.toLocaleString()} FCFA/{price.unite}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <span>📍</span>
                          <span>{price.localisation}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>📅</span>
                          <span>{new Date(price.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  </ModernCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Information complémentaire */}
        <ModernCard className="mt-12 bg-green-50 border border-green-200">
          <div className="text-center">
            <h3 className="font-semibold text-green-900 mb-2">💡 Information</h3>
            <p className="text-green-800 text-sm">
              Les prix affichés sont mis à jour quotidiennement et proviennent de diverses sources du marché malien. 
              Ils vous donnent une indication des tendances mais peuvent varier selon les négociations locales.
            </p>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};

export default ModernPriceMonitoring;