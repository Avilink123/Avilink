import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MarketDemandPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [selectedView, setSelectedView] = useState('apercu');

  // Simulation données demande globale du marché
  const marketOverview = {
    total_eleveurs_actifs: 1247,
    nouvelles_commandes_semaine: 156,
    croissance_mensuelle: '+18%',
    regions_actives: 8,
    produits_categories: 6
  };

  // Aperçu des besoins du mois
  const monthlyDemand = [
    {
      besoin: 'Maïs pour saison sèche',
      icon: '🌽',
      color: '#FFB74D',
      urgence: 'Élevée',
      quantite_estimee: '15 tonnes',
      regions: ['Bamako', 'Kati', 'Koulikoro'],
      prix_cible: '280-290 F/kg',
      periode: 'Maintenant',
      description: 'Les éleveurs stockent massivement pour la saison sèche qui approche'
    },
    {
      besoin: 'Poussins nouveau cycle',
      icon: '🐤',
      color: '#FFC107',
      urgence: 'Élevée',
      quantite_estimee: '2,500 unités',
      regions: ['Bamako', 'Sikasso', 'Ségou'],
      prix_cible: '630-670 F/unité',
      periode: 'Fin janvier',
      description: 'Nouveau cycle d\'élevage commence, forte demande de démarrage'
    },
    {
      besoin: 'Tourteau soja ponte',
      icon: '🫘',
      color: '#8BC34A',
      urgence: 'Moyenne',
      quantite_estimee: '8 tonnes',
      regions: ['Bamako', 'Kati'],
      prix_cible: '410-430 F/kg',
      periode: 'Février',
      description: 'Période de ponte maximale, demande constante de protéines'
    },
    {
      besoin: 'Concentré ponte renforcé',
      icon: '🥣',
      color: '#AB47BC',
      urgence: 'Moyenne',
      quantite_estimee: '5 tonnes',
      regions: ['Bamako', 'Koulikoro'],
      prix_cible: '370-390 F/kg',
      periode: 'Mars',
      description: 'Amélioration rendement ponte en fin de saison sèche'
    },
    {
      besoin: 'Œufs fécondés qualité',
      icon: '🥚',
      color: '#FF7043',
      urgence: 'Faible',
      quantite_estimee: '800 unités',
      regions: ['Bamako', 'Sikasso'],
      prix_cible: '340-360 F/unité',
      periode: 'Avril',
      description: 'Reproduction naturelle pour éleveurs traditionnels'
    }
  ];

  // Tendances par région
  const regionalTrends = [
    {
      region: 'Bamako',
      icon: '🏛️',
      color: '#2196F3',
      eleveurs_actifs: 487,
      demande_principale: 'Maïs + Poussins',
      croissance: '+22%',
      budget_moyen: '45,000F',
      opportunite: 'Marché premium, accepte prix plus élevés'
    },
    {
      region: 'Kati',
      icon: '🌾',
      color: '#4CAF50',
      eleveurs_actifs: 234,
      demande_principale: 'Concentré + Soja',
      croissance: '+15%',
      budget_moyen: '32,000F',
      opportunite: 'Élevage intensif, volumes importants'
    },
    {
      region: 'Koulikoro',
      icon: '🚜',
      color: '#FF9800',
      eleveurs_actifs: 189,
      demande_principale: 'Maïs + Vitamines',
      croissance: '+18%',
      budget_moyen: '28,000F',
      opportunite: 'Élevage familial en croissance'
    },
    {
      region: 'Sikasso',
      icon: '🌱',
      color: '#795548',
      eleveurs_actifs: 156,
      demande_principale: 'Poussins + Œufs',
      croissance: '+12%',
      budget_moyen: '38,000F',
      opportunite: 'Zone agricole, reproduction importante'
    },
    {
      region: 'Ségou',
      icon: '🌊',
      color: '#607D8B',
      eleveurs_actifs: 124,
      demande_principale: 'Son + Compléments',
      croissance: '+8%',
      budget_moyen: '25,000F',
      opportunite: 'Marché prix sensible, volumes moyens'
    }
  ];

  // Alertes et opportunités
  const marketAlerts = [
    {
      type: 'opportunite',
      titre: 'Pénurie maïs prévue février',
      icon: '🚨',
      color: '#4CAF50',
      urgence: 'Élevée',
      detail: 'Stocks éleveurs bas, demande forte attendue. Opportunité de hausser les prix 10-15%.',
      action: 'Stockez massivement maintenant'
    },
    {
      type: 'alerte',
      titre: 'Concurrence prix poussins',
      icon: '⚠️',
      color: '#FF9800',
      urgence: 'Moyenne',
      detail: 'Nouveaux fournisseurs Bamako avec prix agressifs. Risque perte de parts de marché.',
      action: 'Surveillez vos prix et ajustez'
    },
    {
      type: 'tendance',
      titre: 'Demande vitamines croissante',
      icon: '📈',
      color: '#2196F3',
      urgence: 'Faible',
      detail: 'Éleveurs plus conscients santé volailles. Demande prémix vitamines +25% ce mois.',
      action: 'Diversifiez votre gamme'
    },
    {
      type: 'saisonnier',
      titre: 'Pic ponte mars-avril',
      icon: '🥚',
      color: '#AB47BC',
      urgence: 'Faible',
      detail: 'Période ponte maximale approche. Demande concentré ponte va exploser.',
      action: 'Préparez vos stocks concentré'
    }
  ];

  const getUrgenceColor = (urgence) => {
    switch (urgence) {
      case 'Élevée': return '#F44336';
      case 'Moyenne': return '#FF9800';
      case 'Faible': return '#4CAF50';
      default: return colors.textSecondary;
    }
  };

  const getAlertTypeIcon = (type) => {
    switch (type) {
      case 'opportunite': return '💰';
      case 'alerte': return '⚠️';
      case 'tendance': return '📊';
      case 'saisonnier': return '📅';
      default: return '💡';
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
            Demande du Marché
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Besoins des éleveurs maliens
          </p>
        </div>
      </div>

      {/* Navigation sections */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedView('apercu')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                selectedView === 'apercu' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: selectedView === 'apercu' ? colors.primary : colors.card,
                color: selectedView === 'apercu' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">📊</div>
              <p className="text-sm">Aperçu</p>
            </button>
            
            <button
              onClick={() => setSelectedView('regions')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                selectedView === 'regions' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: selectedView === 'regions' ? colors.warning : colors.card,
                color: selectedView === 'regions' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">🗺️</div>
              <p className="text-sm">Régions</p>
            </button>

            <button
              onClick={() => setSelectedView('alertes')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                selectedView === 'alertes' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: selectedView === 'alertes' ? colors.error : colors.card,
                color: selectedView === 'alertes' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">🚨</div>
              <p className="text-sm">Alertes</p>
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div 
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.card }}
          >
            <h3 className="font-bold mb-3" style={{ color: colors.text }}>
              📊 Marché Malien Aujourd'hui
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <p className="text-xl font-bold" style={{ color: colors.primary }}>
                  {marketOverview.total_eleveurs_actifs.toLocaleString()}
                </p>
                <p style={{ color: colors.textSecondary }}>Éleveurs actifs</p>
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: colors.success }}>
                  {marketOverview.nouvelles_commandes_semaine}
                </p>
                <p style={{ color: colors.textSecondary }}>Commandes/semaine</p>
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: colors.warning }}>
                  {marketOverview.croissance_mensuelle}
                </p>
                <p style={{ color: colors.textSecondary }}>Croissance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Aperçu des besoins */}
      {selectedView === 'apercu' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              🎯 Besoins Prioritaires du Mois
            </h2>
            
            <div className="space-y-4">
              {monthlyDemand.map((besoin, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl shadow-sm border-l-4"
                  style={{ 
                    backgroundColor: colors.card,
                    borderLeftColor: besoin.color
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: besoin.color, color: 'white' }}
                    >
                      {besoin.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                          {besoin.besoin}
                        </h3>
                        <span 
                          className="text-xs font-bold px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: getUrgenceColor(besoin.urgence) }}
                        >
                          {besoin.urgence}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <p className="font-bold" style={{ color: colors.primary }}>
                            📦 {besoin.quantite_estimee}
                          </p>
                          <p style={{ color: colors.textSecondary }}>Quantité estimée</p>
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: colors.success }}>
                            💰 {besoin.prix_cible}
                          </p>
                          <p style={{ color: colors.textSecondary }}>Prix cible</p>
                        </div>
                      </div>

                      <p className="text-sm mb-3 italic" style={{ color: colors.textSecondary }}>
                        {besoin.description}
                      </p>

                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold" style={{ color: colors.warning }}>
                            📍 {besoin.regions.join(', ')}
                          </p>
                          <p style={{ color: colors.textMuted }}>Régions principales</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: colors.info }}>
                            🕐 {besoin.periode}
                          </p>
                          <p style={{ color: colors.textMuted }}>Période optimale</p>
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

      {/* Section Tendances régionales */}
      {selectedView === 'regions' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              🗺️ Tendances par Région
            </h2>
            
            <div className="space-y-4">
              {regionalTrends.map((region, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl shadow-sm border-l-4"
                  style={{ 
                    backgroundColor: colors.card,
                    borderLeftColor: region.color
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: region.color, color: 'white' }}
                    >
                      {region.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                          {region.region}
                        </h3>
                        <span 
                          className="text-sm font-bold px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: region.color }}
                        >
                          {region.croissance}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <p className="font-bold" style={{ color: colors.primary }}>
                            👨‍🌾 {region.eleveurs_actifs}
                          </p>
                          <p style={{ color: colors.textSecondary }}>Éleveurs actifs</p>
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: colors.success }}>
                            💰 {region.budget_moyen}
                          </p>
                          <p style={{ color: colors.textSecondary }}>Budget moyen</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="font-bold text-sm mb-1" style={{ color: colors.warning }}>
                          🔥 Demande principale :
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {region.demande_principale}
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-sm mb-1" style={{ color: colors.info }}>
                          💡 Opportunité :
                        </p>
                        <p className="text-sm font-medium" style={{ color: colors.text }}>
                          {region.opportunite}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section Alertes et opportunités */}
      {selectedView === 'alertes' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              🚨 Alertes & Opportunités
            </h2>
            
            <div className="space-y-4">
              {marketAlerts.map((alerte, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl shadow-sm border-l-4"
                  style={{ 
                    backgroundColor: colors.card,
                    borderLeftColor: alerte.color
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: alerte.color, color: 'white' }}
                    >
                      {getAlertTypeIcon(alerte.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                          {alerte.titre}
                        </h3>
                        <span 
                          className="text-xs font-bold px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: getUrgenceColor(alerte.urgence) }}
                        >
                          {alerte.urgence}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                        {alerte.detail}
                      </p>

                      <div 
                        className="p-2 rounded-lg text-center"
                        style={{ backgroundColor: colors.surface }}
                      >
                        <p className="font-bold text-sm" style={{ color: colors.text }}>
                          🎯 Action recommandée : {alerte.action}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message d'encouragement */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e8f5e8' }}
          >
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              Marché en pleine croissance !
            </p>
            <p className="text-xs text-green-700">
              +18% d'éleveurs actifs ce mois. Excellente période pour développer votre activité de fournisseur !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDemandPage;