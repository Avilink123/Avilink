import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const FeedPricesPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [prixActuels, setPrixActuels] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('actuels'); // 'actuels' ou 'historique'

  useEffect(() => {
    // Simulation données prix aliments
    const mockPrixActuels = [
      {
        id: '1',
        produit: 'Maïs concassé',
        prixMoyen: 350,
        prixMin: 320,
        prixMax: 380,
        unite: 'kg',
        variation: '+2.5%',
        tendance: 'hausse',
        marches: [
          { lieu: 'Bamako', prix: 360 },
          { lieu: 'Sikasso', prix: 340 },
          { lieu: 'Ségou', prix: 355 }
        ],
        conseils: 'Prix en hausse saisonnière. Stockez maintenant avant la période sèche.'
      },
      {
        id: '2',
        produit: 'Tourteau de soja',
        prixMoyen: 450,
        prixMin: 420,
        prixMax: 480,
        unite: 'kg',
        variation: '-1.2%',
        tendance: 'baisse',
        marches: [
          { lieu: 'Bamako', prix: 460 },
          { lieu: 'Sikasso', prix: 430 },
          { lieu: 'Kayes', prix: 465 }
        ],
        conseils: 'Bon moment pour acheter. Prix en baisse après la récolte de soja.'
      },
      {
        id: '3',
        produit: 'Farine de poisson',
        prixMoyen: 750,
        prixMin: 700,
        prixMax: 800,
        unite: 'kg',
        variation: '+5.8%',
        tendance: 'hausse',
        marches: [
          { lieu: 'Mopti', prix: 720 },
          { lieu: 'Bamako', prix: 780 },
          { lieu: 'Gao', prix: 740 }
        ],
        conseils: 'Hausse due à la saison de pêche. Cherchez des alternatives temporaires.'
      },
      {
        id: '4',
        produit: 'Son de blé',
        prixMoyen: 280,
        prixMin: 260,
        prixMax: 300,
        unite: 'kg',
        variation: '0%',
        tendance: 'stable',
        marches: [
          { lieu: 'Ségou', prix: 275 },
          { lieu: 'Bamako', prix: 285 },
          { lieu: 'Sikasso', prix: 280 }
        ],
        conseils: 'Prix stable. Bon produit de base pour économiser sur l\'alimentation.'
      },
      {
        id: '5',
        produit: 'Concentré ponte',
        prixMoyen: 520,
        prixMin: 490,
        prixMax: 550,
        unite: 'kg',
        variation: '+3.1%',
        tendance: 'hausse',
        marches: [
          { lieu: 'Bamako', prix: 530 },
          { lieu: 'Kayes', prix: 510 },
          { lieu: 'Sikasso', prix: 525 }
        ],
        conseils: 'Hausse modérée. Investissement rentable pour améliorer la ponte.'
      },
      {
        id: '6',
        produit: 'Prémix vitamines',
        prixMoyen: 1200,
        prixMin: 1150,
        prixMax: 1250,
        unite: 'kg',
        variation: '-0.8%',
        tendance: 'stable',
        marches: [
          { lieu: 'Bamako', prix: 1220 },
          { lieu: 'Sikasso', prix: 1180 },
          { lieu: 'Mopti', prix: 1200 }
        ],
        conseils: 'Prix stable. Essentiel pour la santé des volailles, ne négligez pas.'
      }
    ];

    const mockHistorique = [
      {
        semaine: 'Semaine 1',
        date: '01-07 Jan',
        maïs: 340,
        soja: 455,
        poisson: 710,
        son: 280
      },
      {
        semaine: 'Semaine 2',
        date: '08-14 Jan',
        maïs: 345,
        soja: 460,
        poisson: 725,
        son: 275
      },
      {
        semaine: 'Semaine 3',
        date: '15-21 Jan',
        maïs: 348,
        soja: 452,
        poisson: 740,
        son: 280
      },
      {
        semaine: 'Semaine 4',
        date: '22-28 Jan',
        maïs: 350,
        soja: 450,
        poisson: 750,
        son: 280
      }
    ];

    setTimeout(() => {
      setPrixActuels(mockPrixActuels);
      setHistorique(mockHistorique);
      setLoading(false);
    }, 1000);
  }, []);

  const getTendanceIcon = (tendance) => {
    switch (tendance) {
      case 'hausse': return '📈';
      case 'baisse': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTendanceColor = (tendance) => {
    switch (tendance) {
      case 'hausse': return colors.error;
      case 'baisse': return colors.success;
      case 'stable': return colors.info;
      default: return colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p style={{ color: colors.text }}>Chargement des prix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: colors.surface }}>
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.card }}
            >
              <span className="text-xl">←</span>
            </button>
            <h1 className="text-lg font-bold" style={{ color: colors.text }}>
              📊 Prix des Aliments
            </h1>
            <div></div>
          </div>
        </div>

        {/* Onglets */}
        <div className="px-4 pb-4">
          <div className="max-w-md mx-auto">
            <div className="flex rounded-lg overflow-hidden" style={{ backgroundColor: colors.card }}>
              <button
                onClick={() => setView('actuels')}
                className="flex-1 py-3 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: view === 'actuels' ? colors.primary : 'transparent',
                  color: view === 'actuels' ? 'white' : colors.text
                }}
              >
                📊 Prix Actuels
              </button>
              <button
                onClick={() => setView('historique')}
                className="flex-1 py-3 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: view === 'historique' ? colors.primary : 'transparent',
                  color: view === 'historique' ? 'white' : colors.text
                }}
              >
                📈 Historique
              </button>
            </div>
          </div>
        </div>
      </div>

      {view === 'actuels' ? (
        /* Prix actuels */
        <div className="px-4">
          <div className="max-w-md mx-auto space-y-4">
            {prixActuels.map(prix => (
              <div
                key={prix.id}
                className="p-4 rounded-xl shadow-lg border"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border
                }}
              >
                {/* En-tête produit */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-base" style={{ color: colors.text }}>
                      {prix.produit}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-lg">{getTendanceIcon(prix.tendance)}</span>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: getTendanceColor(prix.tendance) }}
                      >
                        {prix.variation}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                      {prix.prixMoyen}
                    </p>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      FCFA/{prix.unite}
                    </p>
                  </div>
                </div>

                {/* Fourchette de prix */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span style={{ color: colors.textSecondary }}>Fourchette de prix :</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: colors.success }}>Min: {prix.prixMin} FCFA</span>
                    <span style={{ color: colors.error }}>Max: {prix.prixMax} FCFA</span>
                  </div>
                </div>

                {/* Marchés */}
                <div className="mb-3">
                  <p className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Prix par marché :
                  </p>
                  <div className="space-y-1">
                    {prix.marches.map((marche, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span style={{ color: colors.textSecondary }}>📍 {marche.lieu}</span>
                        <span className="font-medium" style={{ color: colors.text }}>
                          {marche.prix} FCFA
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conseils */}
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: colors.surface }}
                >
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    💡 <span className="font-medium">Conseil :</span> {prix.conseils}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Historique des prix */
        <div className="px-4">
          <div className="max-w-md mx-auto">
            <div
              className="p-4 rounded-xl shadow-lg border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border
              }}
            >
              <h3 className="font-bold text-lg mb-4" style={{ color: colors.text }}>
                📈 Évolution des Prix (4 dernières semaines)
              </h3>

              <div className="space-y-3">
                {historique.map((semaine, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: colors.text }}>
                        {semaine.semaine}
                      </span>
                      <span className="text-xs" style={{ color: colors.textSecondary }}>
                        {semaine.date}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span style={{ color: colors.textSecondary }}>Maïs:</span>
                        <span style={{ color: colors.text }}>{semaine.maïs} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.textSecondary }}>Soja:</span>
                        <span style={{ color: colors.text }}>{semaine.soja} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.textSecondary }}>Poisson:</span>
                        <span style={{ color: colors.text }}>{semaine.poisson} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.textSecondary }}>Son blé:</span>
                        <span style={{ color: colors.text }}>{semaine.son} FCFA</span>
                      </div>
                    </div>
                    {index < historique.length - 1 && (
                      <hr className="mt-3" style={{ borderColor: colors.border }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Analyse tendance */}
              <div
                className="mt-4 p-3 rounded-lg"
                style={{ backgroundColor: colors.surface }}
              >
                <p className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                  📊 Analyse des tendances
                </p>
                <div className="space-y-1 text-xs">
                  <p style={{ color: colors.textSecondary }}>
                    • Maïs : Hausse progressive (+2.9% sur 4 semaines)
                  </p>
                  <p style={{ color: colors.textSecondary }}>
                    • Tourteau de soja : Légère baisse (-1.1% récemment)
                  </p>
                  <p style={{ color: colors.textSecondary }}>
                    • Farine de poisson : Forte hausse (+5.6% sur 4 semaines)
                  </p>
                  <p style={{ color: colors.textSecondary }}>
                    • Son de blé : Prix stable (aucune variation)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message d'aide */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-lg text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <p className="text-sm font-medium" style={{ color: colors.text }}>
              📈 Conseil Économique
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Surveillez les tendances pour optimiser vos achats d'aliments et réduire les coûts d'élevage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPricesPage;