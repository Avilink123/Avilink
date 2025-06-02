import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ProductDemandPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('semaine');

  // Simulation données demande produits
  const demandData = {
    semaine: {
      periode: 'Cette semaine',
      total_demandes: 156,
      produits: [
        {
          rank: 1,
          produit: 'Maïs Concassé',
          icon: '🌽',
          color: '#FFB74D',
          demandes: 45,
          tendance: 'hausse',
          variation: '+15%',
          prix_moyen: 285,
          raison: 'Saison sèche - Les éleveurs stockent',
          regions: ['Bamako (25)', 'Kati (12)', 'Koulikoro (8)']
        },
        {
          rank: 2,
          produit: 'Poussins 1 jour',
          icon: '🐤',
          color: '#FFC107',
          demandes: 38,
          tendance: 'hausse',
          variation: '+8%',
          prix_moyen: 650,
          raison: 'Nouvelle saison d\'élevage',
          regions: ['Bamako (28)', 'Sikasso (6)', 'Ségou (4)']
        },
        {
          rank: 3,
          produit: 'Tourteau Soja',
          icon: '🫘',
          color: '#8BC34A',
          demandes: 32,
          tendance: 'stable',
          variation: '+2%',
          prix_moyen: 420,
          raison: 'Demande constante pour ponte',
          regions: ['Bamako (18)', 'Kati (9)', 'Koulikoro (5)']
        },
        {
          rank: 4,
          produit: 'Concentré Ponte',
          icon: '🥣',
          color: '#AB47BC',
          demandes: 28,
          tendance: 'hausse',
          variation: '+12%',
          prix_moyen: 380,
          raison: 'Pic de ponte des poules',
          regions: ['Bamako (20)', 'Kati (5)', 'Ségou (3)']
        },
        {
          rank: 5,
          produit: 'Œufs Fécondés',
          icon: '🥚',
          color: '#FF7043',
          demandes: 25,
          tendance: 'hausse',
          variation: '+6%',
          prix_moyen: 350,
          raison: 'Demande croissante reproduction',
          regions: ['Bamako (15)', 'Koulikoro (6)', 'Sikasso (4)']
        },
        {
          rank: 6,
          produit: 'Prémix Vitamines',
          icon: '💊',
          color: '#E91E63',
          demandes: 18,
          tendance: 'stable',
          variation: '0%',
          prix_moyen: 850,
          raison: 'Demande régulière santé',
          regions: ['Bamako (12)', 'Kati (4)', 'Ségou (2)']
        }
      ]
    },
    mois: {
      periode: 'Ce mois',
      total_demandes: 672,
      produits: [
        {
          rank: 1,
          produit: 'Maïs Concassé',
          icon: '🌽',
          color: '#FFB74D',
          demandes: 195,
          tendance: 'hausse',
          variation: '+18%',
          prix_moyen: 282,
          raison: 'Aliment de base très demandé',
          regions: ['Bamako (120)', 'Kati (45)', 'Koulikoro (30)']
        },
        {
          rank: 2,
          produit: 'Tourteau Soja',
          icon: '🫘',
          color: '#8BC34A',
          demandes: 142,
          tendance: 'hausse',
          variation: '+8%',
          prix_moyen: 418,
          raison: 'Protéines pour volailles',
          regions: ['Bamako (85)', 'Kati (32)', 'Sikasso (25)']
        },
        {
          rank: 3,
          produit: 'Poussins 1 jour',
          icon: '🐤',
          color: '#FFC107',
          demandes: 126,
          tendance: 'hausse',
          variation: '+22%',
          prix_moyen: 645,
          raison: 'Expansion des élevages',
          regions: ['Bamako (78)', 'Sikasso (28)', 'Ségou (20)']
        },
        {
          rank: 4,
          produit: 'Concentré Ponte',
          icon: '🥣',
          color: '#AB47BC',
          demandes: 89,
          tendance: 'hausse',
          variation: '+15%',
          prix_moyen: 378,
          raison: 'Amélioration ponte',
          regions: ['Bamako (58)', 'Kati (18)', 'Koulikoro (13)']
        },
        {
          rank: 5,
          produit: 'Son de Blé',
          icon: '🌾',
          color: '#FF7043',
          demandes: 76,
          tendance: 'baisse',
          variation: '-5%',
          prix_moyen: 192,
          raison: 'Alternative moins chère',
          regions: ['Bamako (45)', 'Kati (20)', 'Ségou (11)']
        },
        {
          rank: 6,
          produit: 'Œufs Fécondés',
          icon: '🥚',
          color: '#FF7043',
          demandes: 44,
          tendance: 'stable',
          variation: '+3%',
          prix_moyen: 348,
          raison: 'Reproduction naturelle',
          regions: ['Bamako (28)', 'Koulikoro (10)', 'Sikasso (6)']
        }
      ]
    }
  };

  const currentData = demandData[selectedPeriod];

  const getTrendColor = (tendance) => {
    switch (tendance) {
      case 'hausse': return '#4CAF50';
      case 'baisse': return '#F44336';
      case 'stable': return '#FF9800';
      default: return colors.textSecondary;
    }
  };

  const getTrendIcon = (tendance) => {
    switch (tendance) {
      case 'hausse': return '📈';
      case 'baisse': return '📉';
      case 'stable': return '📊';
      default: return '📊';
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1: return { icon: '🥇', color: '#FFD700' };
      case 2: return { icon: '🥈', color: '#C0C0C0' };
      case 3: return { icon: '🥉', color: '#CD7F32' };
      default: return { icon: `${rank}`, color: colors.primary };
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
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Produits les Plus Demandés
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Tendances du marché malien
          </p>
        </div>
      </div>

      {/* Sélecteur de période */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-3">
            <button
              onClick={() => setSelectedPeriod('semaine')}
              className={`flex-1 p-4 rounded-xl font-bold text-center transition-all ${
                selectedPeriod === 'semaine' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: selectedPeriod === 'semaine' ? colors.primary : colors.card,
                color: selectedPeriod === 'semaine' ? 'white' : colors.text
              }}
            >
              <div className="text-3xl mb-2">📅</div>
              <p>Cette Semaine</p>
              <p className="text-xs mt-1">{demandData.semaine.total_demandes} demandes</p>
            </button>
            
            <button
              onClick={() => setSelectedPeriod('mois')}
              className={`flex-1 p-4 rounded-xl font-bold text-center transition-all ${
                selectedPeriod === 'mois' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: selectedPeriod === 'mois' ? colors.success : colors.card,
                color: selectedPeriod === 'mois' ? 'white' : colors.text
              }}
            >
              <div className="text-3xl mb-2">📊</div>
              <p>Ce Mois</p>
              <p className="text-xs mt-1">{demandData.mois.total_demandes} demandes</p>
            </button>
          </div>
        </div>
      </div>

      {/* Résumé général */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div 
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.card }}
          >
            <h3 className="font-bold mb-3" style={{ color: colors.text }}>
              📊 {currentData.periode}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                  {currentData.total_demandes}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Total demandes</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.success }}>
                  {currentData.produits.filter(p => p.tendance === 'hausse').length}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>En hausse 📈</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.warning }}>
                  {Math.round(currentData.total_demandes / currentData.produits.length)}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Moy. par produit</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classement des produits */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            🏆 Classement des Produits
          </h2>
          
          <div className="space-y-4">
            {currentData.produits.map(produit => {
              const rankBadge = getRankBadge(produit.rank);
              
              return (
                <div
                  key={produit.rank}
                  className="p-4 rounded-xl shadow-sm border-l-4"
                  style={{ 
                    backgroundColor: colors.card,
                    borderLeftColor: produit.color
                  }}
                >
                  <div className="flex items-start space-x-4">
                    {/* Badge de rang */}
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                      style={{ backgroundColor: rankBadge.color, color: 'white' }}
                    >
                      {rankBadge.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{produit.icon}</span>
                          <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                            {produit.produit}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">
                            {getTrendIcon(produit.tendance)}
                          </span>
                          <span 
                            className="text-sm font-bold px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: getTrendColor(produit.tendance) }}
                          >
                            {produit.variation}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="font-bold text-xl" style={{ color: colors.primary }}>
                            {produit.demandes}
                          </p>
                          <p style={{ color: colors.textSecondary }}>Demandes {selectedPeriod === 'semaine' ? 'cette semaine' : 'ce mois'}</p>
                        </div>
                        <div>
                          <p className="font-bold text-xl" style={{ color: colors.success }}>
                            {produit.prix_moyen}F
                          </p>
                          <p style={{ color: colors.textSecondary }}>Prix moyen demandé</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-bold mb-1" style={{ color: colors.info }}>
                          💡 Pourquoi c'est demandé :
                        </p>
                        <p className="text-sm italic" style={{ color: colors.textSecondary }}>
                          {produit.raison}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-bold mb-1" style={{ color: colors.warning }}>
                          📍 Principales régions demandées :
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {produit.regions.map((region, index) => (
                            <span 
                              key={index}
                              className="text-xs px-2 py-1 rounded-full"
                              style={{ backgroundColor: colors.surface, color: colors.text }}
                            >
                              {region}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conseils stratégiques */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-4">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e8f5e8' }}
          >
            <div className="text-4xl mb-2">💡</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              Conseil Stratégique
            </p>
            <p className="text-xs text-green-700">
              Les 3 premiers produits représentent 70% de la demande. Concentrez vos efforts sur le maïs, les poussins et le tourteau de soja !
            </p>
          </div>

          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#fff3e0' }}
          >
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm font-bold text-orange-800 mb-1">
              Opportunité Business
            </p>
            <p className="text-xs text-orange-700">
              {selectedPeriod === 'semaine' 
                ? 'Cette semaine, le maïs et les poussins sont en forte hausse. Augmentez vos stocks !'
                : 'Ce mois, tous les produits de base sont en demande croissante. Excellent moment pour développer votre activité !'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDemandPage;