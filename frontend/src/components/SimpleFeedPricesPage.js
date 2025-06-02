import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SimpleFeedPricesPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [prixAliments, setPrixAliments] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState('mais');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Données prix aliments simplifiées (simple pour illettrés)
    const mockPrixAliments = {
      mais: {
        nom: 'Maïs concassé',
        icon: '🌾',
        prixActuel: 350,
        evolution: '+20',
        tendance: 'hausse',
        historique: [
          { semaine: 'Il y a 6 semaines', prix: 320 },
          { semaine: 'Il y a 5 semaines', prix: 325 },
          { semaine: 'Il y a 4 semaines', prix: 330 },
          { semaine: 'Il y a 3 semaines', prix: 340 },
          { semaine: 'Il y a 2 semaines', prix: 345 },
          { semaine: 'Cette semaine', prix: 350 }
        ],
        conseil: 'Prix en hausse. Achetez maintenant avant que ça monte plus.'
      },
      soja: {
        nom: 'Tourteau de soja',
        icon: '🫘',
        prixActuel: 450,
        evolution: '-30',
        tendance: 'baisse',
        historique: [
          { semaine: 'Il y a 6 semaines', prix: 480 },
          { semaine: 'Il y a 5 semaines', prix: 475 },
          { semaine: 'Il y a 4 semaines', prix: 470 },
          { semaine: 'Il y a 3 semaines', prix: 465 },
          { semaine: 'Il y a 2 semaines', prix: 455 },
          { semaine: 'Cette semaine', prix: 450 }
        ],
        conseil: 'Prix en baisse. Bon moment pour acheter du soja.'
      },
      poisson: {
        nom: 'Farine de poisson',
        icon: '🐟',
        prixActuel: 750,
        evolution: '+50',
        tendance: 'hausse',
        historique: [
          { semaine: 'Il y a 6 semaines', prix: 680 },
          { semaine: 'Il y a 5 semaines', prix: 700 },
          { semaine: 'Il y a 4 semaines', prix: 720 },
          { semaine: 'Il y a 3 semaines', prix: 730 },
          { semaine: 'Il y a 2 semaines', prix: 740 },
          { semaine: 'Cette semaine', prix: 750 }
        ],
        conseil: 'Prix très cher maintenant. Cherchez d\'autres protéines.'
      },
      son: {
        nom: 'Son de blé',
        icon: '🌾',
        prixActuel: 280,
        evolution: '0',
        tendance: 'stable',
        historique: [
          { semaine: 'Il y a 6 semaines', prix: 280 },
          { semaine: 'Il y a 5 semaines', prix: 275 },
          { semaine: 'Il y a 4 semaines', prix: 280 },
          { semaine: 'Il y a 3 semaines', prix: 285 },
          { semaine: 'Il y a 2 semaines', prix: 280 },
          { semaine: 'Cette semaine', prix: 280 }
        ],
        conseil: 'Prix stable et abordable. Bon aliment de base.'
      },
      concentre: {
        nom: 'Concentré ponte',
        icon: '💊',
        prixActuel: 520,
        evolution: '+20',
        tendance: 'hausse',
        historique: [
          { semaine: 'Il y a 6 semaines', prix: 480 },
          { semaine: 'Il y a 5 semaines', prix: 490 },
          { semaine: 'Il y a 4 semaines', prix: 500 },
          { semaine: 'Il y a 3 semaines', prix: 510 },
          { semaine: 'Il y a 2 semaines', prix: 515 },
          { semaine: 'Cette semaine', prix: 520 }
        ],
        conseil: 'Prix monte mais ça améliore la ponte. Bon investissement.'
      },
      vitamines: {
        nom: 'Prémix vitamines',
        icon: '💉',
        prixActuel: 1200,
        evolution: '-50',
        tendance: 'baisse',
        historique: [
          { semaine: 'Il y a 6 semaines', prix: 1280 },
          { semaine: 'Il y a 5 semaines', prix: 1260 },
          { semaine: 'Il y a 4 semaines', prix: 1240 },
          { semaine: 'Il y a 3 semaines', prix: 1230 },
          { semaine: 'Il y a 2 semaines', prix: 1210 },
          { semaine: 'Cette semaine', prix: 1200 }
        ],
        conseil: 'Prix baisse. Bon moment pour acheter vitamines.'
      }
    };

    setTimeout(() => {
      setPrixAliments(mockPrixAliments);
      setLoading(false);
    }, 800);
  }, []);

  const currentFeed = prixAliments[selectedFeed];

  const getTendanceColor = (tendance) => {
    switch (tendance) {
      case 'hausse': return colors.error; // Rouge pour hausse (mauvais pour acheteur)
      case 'baisse': return colors.success; // Vert pour baisse (bon pour acheteur)
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
          <div className="text-6xl mb-4">📊</div>
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
            📊 Prix des Aliments
          </h1>
          <p className="text-center mt-2" style={{ color: colors.textSecondary }}>
            Suivez les prix pour acheter au bon moment
          </p>
        </div>
      </div>

      {/* Sélecteur d'aliment */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-2 mb-6">
            {Object.entries(prixAliments).map(([key, feed]) => (
              <button
                key={key}
                onClick={() => setSelectedFeed(key)}
                className="p-2 rounded-xl font-bold text-sm"
                style={{
                  backgroundColor: selectedFeed === key ? colors.primary : colors.card,
                  color: selectedFeed === key ? 'white' : colors.text
                }}
              >
                <div className="text-xl mb-1">{feed.icon}</div>
                <div className="text-xs">{feed.nom}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prix actuel */}
      {currentFeed && (
        <div className="px-4">
          <div className="max-w-md mx-auto">
            {/* Prix principal */}
            <div className="p-4 rounded-xl mb-4 text-center" style={{ backgroundColor: colors.card }}>
              <div className="text-4xl mb-2">{currentFeed.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
                {currentFeed.nom}
              </h3>
              <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
                {currentFeed.prixActuel.toLocaleString()} FCFA
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">{getTendanceIcon(currentFeed.tendance)}</span>
                <span 
                  className="text-lg font-bold"
                  style={{ color: getTendanceColor(currentFeed.tendance) }}
                >
                  {currentFeed.evolution === '0' ? 'Stable' : `${currentFeed.evolution} FCFA`}
                </span>
              </div>
              <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
                Prix par kg
              </p>
            </div>

            {/* Graphique simple */}
            <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: colors.card }}>
              <h4 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
                📊 Évolution des Prix
              </h4>
              
              {/* Graphique avec barres simples */}
              <div className="space-y-3">
                {currentFeed.historique.map((point, index) => {
                  const maxPrix = Math.max(...currentFeed.historique.map(p => p.prix));
                  const width = (point.prix / maxPrix) * 100;
                  const isLast = index === currentFeed.historique.length - 1;
                  
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

            {/* Conseil d'achat */}
            <div 
              className="p-4 rounded-xl text-center"
              style={{ 
                backgroundColor: currentFeed.tendance === 'baisse' ? '#d4edda' : 
                                 currentFeed.tendance === 'hausse' ? '#f8d7da' : '#d1ecf1'
              }}
            >
              <p className="text-lg font-bold mb-2">💡 Conseil d'Achat</p>
              <p className="text-sm font-medium">{currentFeed.conseil}</p>
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
              📊 Suivre les Prix
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              Achetez quand les prix baissent pour économiser de l'argent
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleFeedPricesPage;