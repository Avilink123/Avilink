import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SimplePricesPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [prixData, setPrixData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('poulets');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Données de prix simplifiées avec historique (simple pour illettrés)
    const mockPrixData = {
      poulets: {
        nom: 'Poulets de chair',
        icon: '🐔',
        prixActuel: 2500,
        evolution: '+200',
        tendance: 'hausse',
        historique: [
          { semaine: 'Il y a 6 semaines', prix: 2200 },
          { semaine: 'Il y a 5 semaines', prix: 2250 },
          { semaine: 'Il y a 4 semaines', prix: 2300 },
          { semaine: 'Il y a 3 semaines', prix: 2350 },
          { semaine: 'Il y a 2 semaines', prix: 2400 },
          { semaine: 'Cette semaine', prix: 2500 }
        ],
        conseil: 'Bon moment pour vendre ! Prix en hausse.'
      },
      poules: {
        nom: 'Poules pondeuses',
        icon: '🐓',
        prixActuel: 3000,
        evolution: '+100',
        tendance: 'hausse',
        historique: [
          { semaine: 'Il y a 6 semaines', prix: 2800 },
          { semaine: 'Il y a 5 semaines', prix: 2850 },
          { semaine: 'Il y a 4 semaines', prix: 2900 },
          { semaine: 'Il y a 3 semaines', prix: 2950 },
          { semaine: 'Il y a 2 semaines', prix: 2950 },
          { semaine: 'Cette semaine', prix: 3000 }
        ],
        conseil: 'Prix stables et bons. Vendez maintenant.'
      },
      pintades: {
        nom: 'Pintades',
        icon: '🦃',
        prixActuel: 3500,
        evolution: '-200',
        tendance: 'baisse',
        historique: [
          { semaine: 'Il y a 6 semaines', prix: 3800 },
          { semaine: 'Il y a 5 semaines', prix: 3750 },
          { semaine: 'Il y a 4 semaines', prix: 3700 },
          { semaine: 'Il y a 3 semaines', prix: 3650 },
          { semaine: 'Il y a 2 semaines', prix: 3600 },
          { semaine: 'Cette semaine', prix: 3500 }
        ],
        conseil: 'Prix en baisse. Attendez ou vendez vite.'
      },
      oeufs: {
        nom: 'Œufs frais',
        icon: '🥚',
        prixActuel: 125,
        evolution: '+15',
        tendance: 'hausse',
        historique: [
          { semaine: 'Il y a 6 semaines', prix: 100 },
          { semaine: 'Il y a 5 semaines', prix: 105 },
          { semaine: 'Il y a 4 semaines', prix: 110 },
          { semaine: 'Il y a 3 semaines', prix: 115 },
          { semaine: 'Il y a 2 semaines', prix: 120 },
          { semaine: 'Cette semaine', prix: 125 }
        ],
        conseil: 'Très bon prix pour les œufs ! Vendez.'
      }
    };

    setTimeout(() => {
      setPrixData(mockPrixData);
      setLoading(false);
    }, 800);
  }, []);

  const currentProduct = prixData[selectedProduct];

  const getTendanceColor = (tendance) => {
    switch (tendance) {
      case 'hausse': return colors.success;
      case 'baisse': return colors.error;
      case 'stable': return colors.info;
      default: return colors.textSecondary;
    }
  };

  const getTendanceIcon = (tendance) => {
    switch (tendance) {
      case 'hausse': return '📈';
      case 'baisse': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="text-6xl mb-4">📈</div>
          <p className="text-xl" style={{ color: colors.text }}>Chargement des prix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header simple */}
      <div className="px-4 py-6" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => onNavigate('home')}
            className="text-2xl mb-4"
          >
            ← 
          </button>
          <h1 className="text-2xl font-bold text-center" style={{ color: colors.text }}>
            📈 Prix des Volailles
          </h1>
          <p className="text-center mt-2" style={{ color: colors.textSecondary }}>
            Suivez l'évolution des prix
          </p>
        </div>
      </div>

      {/* Sélecteur de produit */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(prixData).map(([key, product]) => (
              <button
                key={key}
                onClick={() => setSelectedProduct(key)}
                className="p-3 rounded-xl font-bold text-lg"
                style={{
                  backgroundColor: selectedProduct === key ? colors.primary : colors.card,
                  color: selectedProduct === key ? 'white' : colors.text
                }}
              >
                <div className="text-2xl mb-1">{product.icon}</div>
                <div className="text-sm">{product.nom}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prix actuel */}
      {currentProduct && (
        <div className="px-4">
          <div className="max-w-md mx-auto">
            {/* Prix principal */}
            <div className="p-4 rounded-xl mb-4 text-center" style={{ backgroundColor: colors.card }}>
              <div className="text-4xl mb-2">{currentProduct.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
                {currentProduct.nom}
              </h3>
              <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
                {currentProduct.prixActuel.toLocaleString()} FCFA
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">{getTendanceIcon(currentProduct.tendance)}</span>
                <span 
                  className="text-lg font-bold"
                  style={{ color: getTendanceColor(currentProduct.tendance) }}
                >
                  {currentProduct.evolution} FCFA
                </span>
              </div>
              <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
                Prix par {currentProduct.nom.includes('Œufs') ? 'unité' : 'kg'}
              </p>
            </div>

            {/* Graphique simple */}
            <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: colors.card }}>
              <h4 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
                📊 Évolution des Prix
              </h4>
              
              {/* Graphique avec barres simples */}
              <div className="space-y-3">
                {currentProduct.historique.map((point, index) => {
                  const maxPrix = Math.max(...currentProduct.historique.map(p => p.prix));
                  const width = (point.prix / maxPrix) * 100;
                  const isLast = index === currentProduct.historique.length - 1;
                  
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-24 text-xs" style={{ color: colors.textSecondary }}>
                        {point.semaine}
                      </div>
                      <div className="flex-1">
                        <div 
                          className="h-6 rounded"
                          style={{ 
                            width: `${width}%`,
                            backgroundColor: isLast ? colors.primary : colors.surface,
                            minWidth: '20px'
                          }}
                        ></div>
                      </div>
                      <div className="w-16 text-sm font-bold text-right" style={{ color: colors.text }}>
                        {point.prix.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conseil */}
            <div 
              className="p-4 rounded-xl text-center"
              style={{ 
                backgroundColor: currentProduct.tendance === 'hausse' ? '#d4edda' : 
                                 currentProduct.tendance === 'baisse' ? '#f8d7da' : '#d1ecf1'
              }}
            >
              <p className="text-lg font-bold mb-2">💡 Conseil</p>
              <p className="text-sm font-medium">{currentProduct.conseil}</p>
            </div>
          </div>
        </div>
      )}

      {/* Message d'aide */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <p className="text-lg font-bold" style={{ color: colors.text }}>
              📈 Suivre les Prix
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              Regardez l'évolution pour savoir quand vendre au meilleur prix
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePricesPage;