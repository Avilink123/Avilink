import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const PerformanceDashboardPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [activeSection, setActiveSection] = useState('notes');

  // Simulation feedback éleveurs
  const feedbackData = {
    moyenne_generale: 4.6,
    total_avis: 47,
    repartition: {
      5: 32,
      4: 11,
      3: 3,
      2: 1,
      1: 0
    }
  };

  const avisRecents = [
    {
      id: '1',
      client: 'Amadou Traoré',
      note: 5,
      commentaire: 'Excellent maïs, mes poules pondent mieux !',
      produit: 'Maïs Concassé',
      date: '2024-01-15',
      localisation: 'Bamako, Commune III'
    },
    {
      id: '2',
      client: 'Fatoumata Diallo',
      note: 5,
      commentaire: 'Poussins en parfaite santé, livraison rapide',
      produit: 'Poussins 1 jour',
      date: '2024-01-14',
      localisation: 'Bamako, Commune IV'
    },
    {
      id: '3',
      client: 'Ibrahim Keita',
      note: 4,
      commentaire: 'Bonne qualité concentré, prix correct',
      produit: 'Concentré Ponte',
      date: '2024-01-13',
      localisation: 'Kati'
    },
    {
      id: '4',
      client: 'Mariam Coulibaly',
      note: 5,
      commentaire: 'Tourteau de soja frais, mes volailles adorent !',
      produit: 'Tourteau Soja',
      date: '2024-01-12',
      localisation: 'Bamako, Commune II'
    },
    {
      id: '5',
      client: 'Sekou Sanogo',
      note: 4,
      commentaire: 'Œufs bien fécondés, bon taux d\'éclosion',
      produit: 'Œufs Fécondés',
      date: '2024-01-11',
      localisation: 'Koulikoro'
    },
    {
      id: '6',
      client: 'Awa Traore',
      note: 3,
      commentaire: 'Correct mais livraison un peu lente',
      produit: 'Son de Blé',
      date: '2024-01-10',
      localisation: 'Bamako, Commune V'
    }
  ];

  const performanceMetrics = {
    qualite_produits: {
      score: 4.7,
      details: 'Produits frais et conformes',
      amelioration: 'Continuez comme ça !'
    },
    rapidite_livraison: {
      score: 4.3,
      details: 'Livraisons dans les délais',
      amelioration: 'Quelques livraisons à améliorer'
    },
    service_client: {
      score: 4.8,
      details: 'Excellent accueil et conseil',
      amelioration: 'Clients très satisfaits'
    },
    prix_competitifs: {
      score: 4.2,
      details: 'Prix dans la moyenne du marché',
      amelioration: 'Quelques prix à revoir'
    }
  };

  const suggestions = [
    {
      id: '1',
      titre: 'Améliorer les délais de livraison',
      description: 'Certains clients mentionnent des livraisons lentes',
      impact: 'moyen',
      facilite: 'facile',
      icon: '🚛'
    },
    {
      id: '2',
      titre: 'Maintenir la qualité des produits',
      description: 'Vos produits sont très appréciés, continuez !',
      impact: 'elevé',
      facilite: 'facile',
      icon: '⭐'
    },
    {
      id: '3',
      titre: 'Revoir le prix du son de blé',
      description: 'Plusieurs clients trouvent ce produit cher',
      impact: 'moyen',
      facilite: 'moyen',
      icon: '💰'
    },
    {
      id: '4',
      titre: 'Diversifier la gamme',
      description: 'Demandes pour plus de variétés d\'aliments',
      impact: 'elevé',
      facilite: 'difficile',
      icon: '📦'
    }
  ];

  const getStarDisplay = (note) => {
    return '⭐'.repeat(note) + '☆'.repeat(5 - note);
  };

  const getScoreColor = (score) => {
    if (score >= 4.5) return '#4CAF50';
    if (score >= 4.0) return '#8BC34A';
    if (score >= 3.5) return '#FF9800';
    if (score >= 3.0) return '#FF5722';
    return '#F44336';
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'elevé': return '#F44336';
      case 'moyen': return '#FF9800';
      case 'faible': return '#4CAF50';
      default: return colors.textSecondary;
    }
  };

  const getFaciliteColor = (facilite) => {
    switch (facilite) {
      case 'facile': return '#4CAF50';
      case 'moyen': return '#FF9800';
      case 'difficile': return '#F44336';
      default: return colors.textSecondary;
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
            Ma Performance
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Feedback de mes clients éleveurs
          </p>
        </div>
      </div>

      {/* Score général */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div 
            className="p-6 rounded-xl text-center shadow-lg"
            style={{ backgroundColor: colors.card }}
          >
            <div className="text-6xl mb-3">⭐</div>
            <div 
              className="text-4xl font-bold mb-2"
              style={{ color: getScoreColor(feedbackData.moyenne_generale) }}
            >
              {feedbackData.moyenne_generale}/5
            </div>
            <p className="text-lg font-bold mb-2" style={{ color: colors.text }}>
              Note Moyenne Générale
            </p>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Basée sur {feedbackData.total_avis} avis d'éleveurs
            </p>
            
            {/* Répartition des notes */}
            <div className="mt-4 space-y-2">
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{star}⭐</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${(feedbackData.repartition[star] / feedbackData.total_avis) * 100}%`,
                        backgroundColor: getScoreColor(star)
                      }}
                    ></div>
                  </div>
                  <span className="text-sm w-8" style={{ color: colors.textSecondary }}>
                    {feedbackData.repartition[star]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation sections */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveSection('notes')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeSection === 'notes' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeSection === 'notes' ? colors.primary : colors.card,
                color: activeSection === 'notes' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">💬</div>
              <p className="text-sm">Avis Clients</p>
            </button>
            
            <button
              onClick={() => setActiveSection('details')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeSection === 'details' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeSection === 'details' ? colors.warning : colors.card,
                color: activeSection === 'details' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">📈</div>
              <p className="text-sm">Détails</p>
            </button>

            <button
              onClick={() => setActiveSection('conseils')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeSection === 'conseils' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeSection === 'conseils' ? colors.success : colors.card,
                color: activeSection === 'conseils' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">💡</div>
              <p className="text-sm">Conseils</p>
            </button>
          </div>
        </div>
      </div>

      {/* Section Avis Clients */}
      {activeSection === 'notes' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              💬 Derniers Avis d'Éleveurs
            </h2>
            
            <div className="space-y-4">
              {avisRecents.map(avis => (
                <div
                  key={avis.id}
                  className="p-4 rounded-xl shadow-sm border-l-4"
                  style={{ 
                    backgroundColor: colors.card,
                    borderLeftColor: getScoreColor(avis.note)
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: getScoreColor(avis.note), color: 'white' }}
                    >
                      👨‍🌾
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                          {avis.client}
                        </h3>
                        <div className="text-lg">
                          {getStarDisplay(avis.note)}
                        </div>
                      </div>
                      
                      <p className="text-sm mb-2 font-medium" style={{ color: colors.primary }}>
                        📦 {avis.produit}
                      </p>
                      
                      <p className="text-sm mb-2 italic" style={{ color: colors.textSecondary }}>
                        "{avis.commentaire}"
                      </p>
                      
                      <div className="text-xs" style={{ color: colors.textMuted }}>
                        📍 {avis.localisation} • 📅 {avis.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section Détails Performance */}
      {activeSection === 'details' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              📈 Détails de Ma Performance
            </h2>
            
            <div className="space-y-4">
              {Object.entries(performanceMetrics).map(([key, metric]) => (
                <div
                  key={key}
                  className="p-4 rounded-xl shadow-sm"
                  style={{ backgroundColor: colors.card }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                      {key === 'qualite_produits' && '🏆 Qualité Produits'}
                      {key === 'rapidite_livraison' && '🚛 Rapidité Livraison'}
                      {key === 'service_client' && '🤝 Service Client'}
                      {key === 'prix_competitifs' && '💰 Prix Compétitifs'}
                    </h3>
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: getScoreColor(metric.score) }}
                    >
                      {metric.score}/5
                    </div>
                  </div>
                  
                  <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                    {metric.details}
                  </p>
                  
                  <p className="text-sm font-medium" style={{ color: getScoreColor(metric.score) }}>
                    💡 {metric.amelioration}
                  </p>
                  
                  {/* Barre de progression */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${(metric.score / 5) * 100}%`,
                          backgroundColor: getScoreColor(metric.score)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section Conseils d'Amélioration */}
      {activeSection === 'conseils' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              💡 Conseils d'Amélioration
            </h2>
            
            <div className="space-y-4">
              {suggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="p-4 rounded-xl shadow-sm"
                  style={{ backgroundColor: colors.card }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: colors.primary, color: 'white' }}
                    >
                      {suggestion.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2" style={{ color: colors.text }}>
                        {suggestion.titre}
                      </h3>
                      
                      <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                        {suggestion.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <span className="font-bold">Impact:</span>
                          <span 
                            className="px-2 py-1 rounded-full font-bold text-white"
                            style={{ backgroundColor: getImpactColor(suggestion.impact) }}
                          >
                            {suggestion.impact.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="font-bold">Facilité:</span>
                          <span 
                            className="px-2 py-1 rounded-full font-bold text-white"
                            style={{ backgroundColor: getFaciliteColor(suggestion.facilite) }}
                          >
                            {suggestion.facilite.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message encouragement */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e8f5e8' }}
          >
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              Excellente performance !
            </p>
            <p className="text-xs text-green-700">
              Vos clients éleveurs sont très satisfaits. Continuez comme ça pour développer votre business !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboardPage;