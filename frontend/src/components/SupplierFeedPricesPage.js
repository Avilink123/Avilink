import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SupplierFeedPricesPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('maïs');

  // Données prix marché pour fournisseurs - Catégories qu'ils vendent
  const supplierPrices = {
    'maïs': {
      name: 'Maïs Concassé',
      icon: '🌽',
      color: '#FFB74D',
      currentPrice: 285,
      unit: 'CFA/kg',
      trend: 'hausse',
      trendPercent: '+5%',
      myPrice: 280,
      competitif: true,
      history: [
        { semaine: 'Sem 1', prix_marche: 250, mon_prix: 245 },
        { semaine: 'Sem 2', prix_marche: 260, mon_prix: 255 },
        { semaine: 'Sem 3', prix_marche: 270, mon_prix: 265 },
        { semaine: 'Sem 4', prix_marche: 275, mon_prix: 270 },
        { semaine: 'Sem 5', prix_marche: 280, mon_prix: 275 },
        { semaine: 'Sem 6', prix_marche: 285, mon_prix: 280 }
      ]
    },
    'soja': {
      name: 'Tourteau Soja',
      icon: '🫘',
      color: '#8BC34A',
      currentPrice: 420,
      unit: 'CFA/kg',
      trend: 'stable',
      trendPercent: '+1%',
      myPrice: 415,
      competitif: true,
      history: [
        { semaine: 'Sem 1', prix_marche: 390, mon_prix: 385 },
        { semaine: 'Sem 2', prix_marche: 400, mon_prix: 395 },
        { semaine: 'Sem 3', prix_marche: 410, mon_prix: 405 },
        { semaine: 'Sem 4', prix_marche: 415, mon_prix: 410 },
        { semaine: 'Sem 5', prix_marche: 418, mon_prix: 413 },
        { semaine: 'Sem 6', prix_marche: 420, mon_prix: 415 }
      ]
    },
    'son': {
      name: 'Son de Blé',
      icon: '🌾',
      color: '#FF7043',
      currentPrice: 190,
      unit: 'CFA/kg',
      trend: 'stable',
      trendPercent: '0%',
      myPrice: 195,
      competitif: false,
      history: [
        { semaine: 'Sem 1', prix_marche: 180, mon_prix: 185 },
        { semaine: 'Sem 2', prix_marche: 185, mon_prix: 190 },
        { semaine: 'Sem 3', prix_marche: 188, mon_prix: 193 },
        { semaine: 'Sem 4', prix_marche: 190, mon_prix: 195 },
        { semaine: 'Sem 5', prix_marche: 190, mon_prix: 195 },
        { semaine: 'Sem 6', prix_marche: 190, mon_prix: 195 }
      ]
    },
    'concentré': {
      name: 'Concentré Ponte',
      icon: '🥣',
      color: '#AB47BC',
      currentPrice: 380,
      unit: 'CFA/kg',
      trend: 'hausse',
      trendPercent: '+8%',
      myPrice: 375,
      competitif: true,
      history: [
        { semaine: 'Sem 1', prix_marche: 350, mon_prix: 345 },
        { semaine: 'Sem 2', prix_marche: 360, mon_prix: 355 },
        { semaine: 'Sem 3', prix_marche: 365, mon_prix: 360 },
        { semaine: 'Sem 4', prix_marche: 370, mon_prix: 365 },
        { semaine: 'Sem 5', prix_marche: 375, mon_prix: 370 },
        { semaine: 'Sem 6', prix_marche: 380, mon_prix: 375 }
      ]
    },
    'vitamines': {
      name: 'Prémix Vitamines',
      icon: '💊',
      color: '#E91E63',
      currentPrice: 850,
      unit: 'CFA/kg',
      trend: 'baisse',
      trendPercent: '-3%',
      myPrice: 820,
      competitif: true,
      history: [
        { semaine: 'Sem 1', prix_marche: 880, mon_prix: 850 },
        { semaine: 'Sem 2', prix_marche: 870, mon_prix: 840 },
        { semaine: 'Sem 3', prix_marche: 865, mon_prix: 835 },
        { semaine: 'Sem 4', prix_marche: 860, mon_prix: 830 },
        { semaine: 'Sem 5', prix_marche: 855, mon_prix: 825 },
        { semaine: 'Sem 6', prix_marche: 850, mon_prix: 820 }
      ]
    },
    'poussins': {
      name: 'Poussins 1 jour',
      icon: '🐤',
      color: '#FFC107',
      currentPrice: 650,
      unit: 'CFA/unité',
      trend: 'hausse',
      trendPercent: '+4%',
      myPrice: 640,
      competitif: true,
      history: [
        { semaine: 'Sem 1', prix_marche: 620, mon_prix: 610 },
        { semaine: 'Sem 2', prix_marche: 625, mon_prix: 615 },
        { semaine: 'Sem 3', prix_marche: 630, mon_prix: 620 },
        { semaine: 'Sem 4', prix_marche: 635, mon_prix: 625 },
        { semaine: 'Sem 5', prix_marche: 645, mon_prix: 635 },
        { semaine: 'Sem 6', prix_marche: 650, mon_prix: 640 }
      ]
    }
  };

  const currentProduct = supplierPrices[selectedCategory];
  const maxPrice = Math.max(...currentProduct.history.map(h => Math.max(h.prix_marche, h.mon_prix))) + 20;

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'hausse': return '#4CAF50';
      case 'baisse': return '#F44336';
      case 'stable': return '#FF9800';
      default: return colors.textSecondary;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'hausse': return '📈';
      case 'baisse': return '📉';
      case 'stable': return '📊';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="px-4 py-6" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-md mx-auto text-center">
          <button 
            onClick={() => onNavigate('home')}
            className="text-3xl mb-4"
          >
            ← 
          </button>
          <div className="text-6xl mb-4">📈</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Prix du Marché
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Comparez vos prix avec le marché
          </p>
        </div>
      </div>

      {/* Sélection catégorie */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            📋 Choisissez un produit :
          </h2>
          
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(supplierPrices).map(([key, product]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`p-3 rounded-xl text-center transition-all ${
                  selectedCategory === key ? 'scale-105 shadow-lg' : ''
                }`}
                style={{ 
                  backgroundColor: selectedCategory === key ? product.color : colors.card,
                  color: selectedCategory === key ? 'white' : colors.text,
                  border: selectedCategory === key ? `3px solid ${product.color}` : `2px solid ${colors.border}`
                }}
              >
                <div className="text-2xl mb-1">{product.icon}</div>
                <p className="font-bold text-xs leading-tight">{product.name}</p>
                {selectedCategory === key && (
                  <p className="text-xs mt-1">✅ Sélectionné</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prix actuel - Comparaison */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Prix du marché */}
          <div 
            className="p-4 rounded-xl text-center shadow-lg"
            style={{ backgroundColor: currentProduct.color }}
          >
            <div className="text-4xl mb-2">{currentProduct.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">
              {currentProduct.name}
            </h3>
            <div className="text-3xl font-bold text-white mb-1">
              {currentProduct.currentPrice} F
            </div>
            <p className="text-white mb-2">
              Prix marché aujourd'hui
            </p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">
                {getTrendIcon(currentProduct.trend)}
              </span>
              <span 
                className="font-bold px-2 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: getTrendColor(currentProduct.trend),
                  color: 'white'
                }}
              >
                {currentProduct.trendPercent}
              </span>
            </div>
          </div>

          {/* Mon prix */}
          <div 
            className="p-4 rounded-xl text-center shadow-lg border-2"
            style={{ 
              backgroundColor: colors.card,
              borderColor: currentProduct.competitif ? '#4CAF50' : '#F44336'
            }}
          >
            <div className="text-3xl mb-2">💰</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
              Mon Prix Actuel
            </h3>
            <div 
              className="text-3xl font-bold mb-1"
              style={{ color: currentProduct.competitif ? '#4CAF50' : '#F44336' }}
            >
              {currentProduct.myPrice} F
            </div>
            <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
              {currentProduct.unit}
            </p>
            <div 
              className="inline-block px-3 py-1 rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: currentProduct.competitif ? '#4CAF50' : '#F44336' }}
            >
              {currentProduct.competitif ? '✅ Compétitif' : '⚠️ Trop élevé'}
            </div>
          </div>
        </div>
      </div>

      {/* Graphique comparatif */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            📊 Évolution des Prix (6 dernières semaines)
          </h3>
          
          <div 
            className="p-4 rounded-xl"
            style={{ backgroundColor: colors.card }}
          >
            {/* Graphique en barres doubles */}
            <div className="space-y-4">
              {currentProduct.history.map((item, index) => {
                const marketBarWidth = (item.prix_marche / maxPrice) * 100;
                const myBarWidth = (item.mon_prix / maxPrice) * 100;
                const isLatest = index === currentProduct.history.length - 1;
                
                return (
                  <div key={index} className="space-y-1">
                    {/* Label semaine */}
                    <div className="text-xs font-bold text-center" style={{ color: colors.text }}>
                      {item.semaine}
                    </div>
                    
                    {/* Prix marché */}
                    <div className="flex items-center space-x-2">
                      <div className="w-16 text-xs" style={{ color: colors.textSecondary }}>
                        Marché
                      </div>
                      <div className="flex-1 relative">
                        <div 
                          className="h-6 rounded-lg flex items-center justify-end pr-2 transition-all"
                          style={{ 
                            width: `${marketBarWidth}%`,
                            backgroundColor: isLatest ? currentProduct.color : colors.primary,
                            opacity: isLatest ? 1 : 0.7
                          }}
                        >
                          <span className="text-white text-xs font-bold">
                            {item.prix_marche}F
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mon prix */}
                    <div className="flex items-center space-x-2">
                      <div className="w-16 text-xs" style={{ color: colors.textSecondary }}>
                        Mon prix
                      </div>
                      <div className="flex-1 relative">
                        <div 
                          className="h-6 rounded-lg flex items-center justify-end pr-2 transition-all"
                          style={{ 
                            width: `${myBarWidth}%`,
                            backgroundColor: isLatest ? (item.mon_prix <= item.prix_marche ? '#4CAF50' : '#F44336') : '#FF9800',
                            opacity: isLatest ? 1 : 0.7
                          }}
                        >
                          <span className="text-white text-xs font-bold">
                            {item.mon_prix}F
                          </span>
                        </div>
                        {isLatest && (
                          <div className="absolute -top-1 -right-1">
                            <span className="text-lg">👆</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {index < currentProduct.history.length - 1 && (
                      <div className="border-t mt-2" style={{ borderColor: colors.border }}></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Légende */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: currentProduct.color }}
                  ></div>
                  <span style={{ color: colors.textSecondary }}>Prix marché</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: currentProduct.competitif ? '#4CAF50' : '#F44336' }}
                  ></div>
                  <span style={{ color: colors.textSecondary }}>Mon prix 👆</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conseil stratégique */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div 
            className="p-4 rounded-xl text-center"
            style={{ 
              backgroundColor: currentProduct.competitif ? '#e8f5e8' : '#ffebee' 
            }}
          >
            <div className="text-4xl mb-3">
              {currentProduct.competitif ? '💡' : '⚠️'}
            </div>
            <h4 className="font-bold mb-2" style={{ 
              color: currentProduct.competitif ? '#2e7d32' : '#c62828' 
            }}>
              {currentProduct.competitif ? 'Stratégie Optimale' : 'Action Recommandée'}
            </h4>
            <p className="text-sm" style={{ 
              color: currentProduct.competitif ? '#2e7d32' : '#c62828' 
            }}>
              {currentProduct.competitif 
                ? `Votre prix de ${currentProduct.myPrice}F est compétitif ! Maintenez cette stratégie pour attirer plus de clients.`
                : `Votre prix de ${currentProduct.myPrice}F est au-dessus du marché (${currentProduct.currentPrice}F). Considérez une baisse pour rester compétitif.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Résumé de tous les produits */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            📋 Résumé de Mes Prix
          </h3>
          
          <div className="space-y-2">
            {Object.entries(supplierPrices).map(([key, product]) => (
              <div
                key={key}
                className="flex items-center space-x-3 p-3 rounded-xl"
                style={{ backgroundColor: colors.card }}
              >
                <div className="text-2xl">{product.icon}</div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: colors.text }}>
                    {product.name}
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    Marché: {product.currentPrice}F • Mon prix: {product.myPrice}F
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm">
                    {getTrendIcon(product.trend)}
                  </span>
                  <span 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: product.competitif ? '#4CAF50' : '#F44336' }}
                  ></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message d'aide */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm font-bold" style={{ color: colors.text }}>
              Conseil du marché
            </p>
            <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>
              Surveillez les prix chaque semaine et ajustez vos tarifs pour rester compétitif !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierFeedPricesPage;