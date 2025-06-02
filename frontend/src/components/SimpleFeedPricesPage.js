import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SimpleFeedPricesPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [selectedFeed, setSelectedFeed] = useState('maïs');

  // Données simulation prix aliments - Ultra simple
  const feedPrices = {
    'maïs': {
      name: 'Maïs',
      icon: '🌽',
      color: '#FFB74D',
      currentPrice: 285,
      unit: 'CFA/kg',
      history: [
        { semaine: 'Sem 1', prix: 250 },
        { semaine: 'Sem 2', prix: 260 },
        { semaine: 'Sem 3', prix: 270 },
        { semaine: 'Sem 4', prix: 275 },
        { semaine: 'Sem 5', prix: 280 },
        { semaine: 'Sem 6', prix: 285 }
      ]
    },
    'soja': {
      name: 'Tourteau Soja',
      icon: '🫘',
      color: '#8BC34A',
      currentPrice: 420,
      unit: 'CFA/kg',
      history: [
        { semaine: 'Sem 1', prix: 390 },
        { semaine: 'Sem 2', prix: 400 },
        { semaine: 'Sem 3', prix: 410 },
        { semaine: 'Sem 4', prix: 415 },
        { semaine: 'Sem 5', prix: 418 },
        { semaine: 'Sem 6', prix: 420 }
      ]
    },
    'son': {
      name: 'Son de Blé',
      icon: '🌾',
      color: '#FF7043',
      currentPrice: 190,
      unit: 'CFA/kg',
      history: [
        { semaine: 'Sem 1', prix: 180 },
        { semaine: 'Sem 2', prix: 185 },
        { semaine: 'Sem 3', prix: 188 },
        { semaine: 'Sem 4', prix: 190 },
        { semaine: 'Sem 5', prix: 190 },
        { semaine: 'Sem 6', prix: 190 }
      ]
    },
    'concentré': {
      name: 'Concentré Ponte',
      icon: '🥣',
      color: '#AB47BC',
      currentPrice: 380,
      unit: 'CFA/kg',
      history: [
        { semaine: 'Sem 1', prix: 350 },
        { semaine: 'Sem 2', prix: 360 },
        { semaine: 'Sem 3', prix: 365 },
        { semaine: 'Sem 4', prix: 370 },
        { semaine: 'Sem 5', prix: 375 },
        { semaine: 'Sem 6', prix: 380 }
      ]
    }
  };

  const currentFeed = feedPrices[selectedFeed];
  const maxPrice = Math.max(...currentFeed.history.map(h => h.prix)) + 20;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header ultra-simple */}
      <div className="px-4 py-6" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-md mx-auto text-center">
          <button 
            onClick={() => onNavigate('home')}
            className="text-3xl mb-4"
          >
            ← 
          </button>
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Prix des Aliments
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Suivez les prix pour bien acheter
          </p>
        </div>
      </div>

      {/* Sélection aliment - Gros boutons */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            📋 Choisissez un aliment :
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(feedPrices).map(([key, feed]) => (
              <button
                key={key}
                onClick={() => setSelectedFeed(key)}
                className={`p-4 rounded-xl text-center transition-all ${
                  selectedFeed === key ? 'scale-105 shadow-lg' : ''
                }`}
                style={{ 
                  backgroundColor: selectedFeed === key ? feed.color : colors.card,
                  color: selectedFeed === key ? 'white' : colors.text,
                  border: selectedFeed === key ? `3px solid ${feed.color}` : `2px solid ${colors.border}`
                }}
              >
                <div className="text-3xl mb-2">{feed.icon}</div>
                <p className="font-bold text-sm">{feed.name}</p>
                <p className="text-xs mt-1">
                  {selectedFeed === key ? '✅ Sélectionné' : 'Toucher pour voir'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prix actuel - Très visible */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div 
            className="p-6 rounded-xl text-center shadow-lg"
            style={{ backgroundColor: currentFeed.color }}
          >
            <div className="text-5xl mb-3">{currentFeed.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {currentFeed.name}
            </h3>
            <div className="text-4xl font-bold text-white mb-2">
              {currentFeed.currentPrice} F
            </div>
            <p className="text-lg text-white">
              Prix par kg aujourd'hui
            </p>
          </div>
        </div>
      </div>

      {/* Graphique ultra-simple */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            📈 Histoire des Prix (6 dernières semaines)
          </h3>
          
          <div 
            className="p-4 rounded-xl"
            style={{ backgroundColor: colors.card }}
          >
            {/* Graphique en barres horizontales ultra-simple */}
            <div className="space-y-3">
              {currentFeed.history.map((item, index) => {
                const barWidth = (item.prix / maxPrice) * 100;
                const isLatest = index === currentFeed.history.length - 1;
                
                return (
                  <div key={index} className="flex items-center space-x-3">
                    {/* Semaine */}
                    <div className="w-12 text-xs font-bold" style={{ color: colors.text }}>
                      {item.semaine}
                    </div>
                    
                    {/* Barre */}
                    <div className="flex-1 relative">
                      <div 
                        className="h-8 rounded-lg flex items-center justify-end pr-2 transition-all"
                        style={{ 
                          width: `${barWidth}%`,
                          backgroundColor: isLatest ? currentFeed.color : colors.primary,
                          opacity: isLatest ? 1 : 0.7
                        }}
                      >
                        <span className="text-white text-xs font-bold">
                          {item.prix}F
                        </span>
                      </div>
                      {isLatest && (
                        <div className="absolute -top-1 -right-1">
                          <span className="text-lg">👆</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Légende simple */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                  <span style={{ color: colors.textSecondary }}>Semaines passées</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: currentFeed.color }}
                  ></div>
                  <span style={{ color: colors.textSecondary }}>Cette semaine 👆</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conseil simple */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div 
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <div className="text-4xl mb-3">💡</div>
            <h4 className="font-bold mb-2" style={{ color: colors.text }}>
              Conseil du Jour
            </h4>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {selectedFeed === 'maïs' && 'Le maïs monte. Achetez maintenant si vous pouvez stocker.'}
              {selectedFeed === 'soja' && 'Le soja est stable. Bon moment pour acheter.'}
              {selectedFeed === 'son' && 'Le son de blé ne bouge pas. Prix correct.'}
              {selectedFeed === 'concentré' && 'Le concentré monte lentement. Planifiez vos achats.'}
            </p>
          </div>
        </div>
      </div>

      {/* Message encouragement */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e8f5e8' }}
          >
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              Suivez les prix chaque semaine !
            </p>
            <p className="text-xs text-green-700">
              Acheter au bon moment vous fait économiser beaucoup d'argent
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleFeedPricesPage;