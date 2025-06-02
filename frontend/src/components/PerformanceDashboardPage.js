import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const PerformanceDashboardPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState('mois');

  useEffect(() => {
    // Simulation données performance fournisseur
    const mockDashboard = {
      periodeActuelle: {
        ventes: {
          chiffreAffaires: 485000,
          nombreCommandes: 45,
          panierMoyen: 10778,
          croissance: 12.5
        },
        clients: {
          total: 28,
          nouveaux: 4,
          actifs: 22,
          tauxFidelisation: 85
        },
        produits: {
          reference: 12,
          stockTotal: 2850,
          rotationMoyenne: 8.5,
          ruptures: 2
        },
        satisfaction: {
          noteMoyenne: 4.3,
          tauxRecommandation: 88,
          reclamations: 3,
          resolutionMoyenne: 1.2
        }
      },
      comparaisonPeriodePrecedente: {
        chiffreAffaires: 8.2,
        nombreCommandes: 15.3,
        panierMoyen: -2.1,
        nouveauxClients: 25.0,
        satisfaction: 4.7
      },
      topProduits: [
        {
          nom: 'Maïs concassé premium',
          ventes: 1250,
          ca: 125000,
          rotation: 12.5,
          marge: 15,
          tendance: 'hausse'
        },
        {
          nom: 'Tourteau de soja',
          ventes: 680,
          ca: 85000,
          rotation: 9.8,
          marge: 18,
          tendance: 'stable'
        },
        {
          nom: 'Farine de poisson',
          ventes: 450,
          ca: 78000,
          rotation: 6.2,
          marge: 22,
          tendance: 'hausse'
        },
        {
          nom: 'Concentré ponte',
          ventes: 340,
          ca: 65000,
          rotation: 7.8,
          marge: 20,
          tendance: 'stable'
        },
        {
          nom: 'Son de blé',
          ventes: 2100,
          ca: 42000,
          rotation: 15.2,
          marge: 12,
          tendance: 'baisse'
        }
      ],
      topClients: [
        {
          nom: 'Ibrahim Coulibaly',
          commandes: 8,
          ca: 125000,
          frequence: 'Hebdomadaire',
          satisfaction: 4.9,
          evolution: 'hausse'
        },
        {
          nom: 'Mamadou Keita',
          commandes: 12,
          ca: 95000,
          frequence: 'Bi-mensuelle',
          satisfaction: 4.8,
          evolution: 'stable'
        },
        {
          nom: 'Fatoumata Diarra',
          commandes: 6,
          ca: 78000,
          frequence: 'Mensuelle',
          satisfaction: 4.5,
          evolution: 'hausse'
        }
      ],
      tendancesMarche: {
        demandeForte: ['Maïs concassé', 'Farine de poisson'],
        demandeFaible: ['Son de blé'],
        prixEnHausse: ['Farine de poisson', 'Concentré ponte'],
        prixEnBaisse: ['Son de blé'],
        saisonPic: 'Janvier-Mars (démarrage élevages)',
        conseils: [
          'Augmenter stock maïs avant saison sèche',
          'Promouvoir concentré ponte auprès nouveaux clients',
          'Réduire stock son de blé temporairement',
          'Négocier meilleurs prix farine de poisson'
        ]
      },
      alertes: [
        {
          type: 'stock_bas',
          message: 'Prémix vitamines en rupture',
          urgence: 'haute',
          action: 'Recommander immédiatement'
        },
        {
          type: 'client_inactif',
          message: '3 clients inactifs depuis 30 jours',
          urgence: 'moyenne',
          action: 'Relancer par téléphone'
        },
        {
          type: 'satisfaction',
          message: 'Sekou Traoré: satisfaction en baisse',
          urgence: 'moyenne',
          action: 'Appeler pour résoudre problème'
        },
        {
          type: 'opportunite',
          message: 'Hausse demande farine poisson (+25%)',
          urgence: 'basse',
          action: 'Augmenter stock et prix'
        }
      ],
      objectifs: {
        chiffreAffaires: {
          objectif: 500000,
          realise: 485000,
          pourcentage: 97
        },
        nouveauxClients: {
          objectif: 5,
          realise: 4,
          pourcentage: 80
        },
        satisfaction: {
          objectif: 4.5,
          realise: 4.3,
          pourcentage: 96
        },
        rotation: {
          objectif: 10,
          realise: 8.5,
          pourcentage: 85
        }
      }
    };

    setTimeout(() => {
      setDashboard(mockDashboard);
      setLoading(false);
    }, 1000);
  }, [periode]);

  const getEvolutionIcon = (tendance) => {
    switch (tendance) {
      case 'hausse': return '📈';
      case 'baisse': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getEvolutionColor = (tendance) => {
    switch (tendance) {
      case 'hausse': return colors.success;
      case 'baisse': return colors.error;
      case 'stable': return colors.info;
      default: return colors.textSecondary;
    }
  };

  const getUrgenceColor = (urgence) => {
    switch (urgence) {
      case 'haute': return colors.error;
      case 'moyenne': return colors.warning;
      case 'basse': return colors.info;
      default: return colors.textSecondary;
    }
  };

  const getObjectifColor = (pourcentage) => {
    if (pourcentage >= 95) return colors.success;
    if (pourcentage >= 80) return colors.warning;
    return colors.error;
  };

  const handleVoirDetails = (section) => {
    alert(
      `📊 Détails ${section}\n\n` +
      `Cette fonctionnalité permet d'analyser en profondeur :\n` +
      `• Évolution sur plusieurs périodes\n` +
      `• Comparaisons par produit/client\n` +
      `• Prévisions et recommandations\n` +
      `• Export des données\n\n` +
      `📞 Contactez le support pour activer les rapports détaillés`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p style={{ color: colors.text }}>Chargement du dashboard...</p>
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
              📊 Performance Business
            </h1>
            <div></div>
          </div>
        </div>

        {/* Sélecteur période */}
        <div className="px-4 pb-4">
          <div className="max-w-md mx-auto">
            <div className="flex rounded-lg overflow-hidden" style={{ backgroundColor: colors.card }}>
              {[
                { key: 'semaine', label: 'Semaine' },
                { key: 'mois', label: 'Mois' },
                { key: 'trimestre', label: 'Trimestre' }
              ].map(p => (
                <button
                  key={p.key}
                  onClick={() => setPeriode(p.key)}
                  className="flex-1 py-2 text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: periode === p.key ? colors.primary : 'transparent',
                    color: periode === p.key ? 'white' : colors.text
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Métriques principales */}
          <div
            className="p-4 rounded-xl shadow-lg"
            style={{ backgroundColor: colors.card }}
          >
            <h2 className="text-lg font-bold mb-3" style={{ color: colors.text }}>
              📈 Vue d'ensemble
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                  {dashboard.periodeActuelle.ventes.chiffreAffaires.toLocaleString()}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>FCFA - Chiffre d'affaires</p>
                <p className="text-xs mt-1" style={{ color: colors.success }}>
                  +{dashboard.comparaisonPeriodePrecedente.chiffreAffaires}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: colors.success }}>
                  {dashboard.periodeActuelle.ventes.nombreCommandes}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Commandes</p>
                <p className="text-xs mt-1" style={{ color: colors.success }}>
                  +{dashboard.comparaisonPeriodePrecedente.nombreCommandes}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: colors.info }}>
                  {dashboard.periodeActuelle.clients.actifs}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Clients actifs</p>
                <p className="text-xs mt-1" style={{ color: colors.success }}>
                  +{dashboard.comparaisonPeriodePrecedente.nouveauxClients}% nouveaux
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: colors.warning }}>
                  {dashboard.periodeActuelle.satisfaction.noteMoyenne}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Satisfaction /5</p>
                <p className="text-xs mt-1" style={{ color: colors.info }}>
                  {dashboard.periodeActuelle.satisfaction.tauxRecommandation}% recommandent
                </p>
              </div>
            </div>
          </div>

          {/* Objectifs */}
          <div
            className="p-4 rounded-xl shadow-lg"
            style={{ backgroundColor: colors.card }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                🎯 Objectifs
              </h2>
              <button
                onClick={() => handleVoirDetails('objectifs')}
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: colors.surface, color: colors.textSecondary }}
              >
                Détails
              </button>
            </div>
            <div className="space-y-3">
              {Object.entries(dashboard.objectifs).map(([key, obj]) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span style={{ color: colors.text }}>
                      {key === 'chiffreAffaires' ? 'CA' : 
                       key === 'nouveauxClients' ? 'Nouveaux clients' :
                       key === 'satisfaction' ? 'Satisfaction' : 'Rotation stock'}
                    </span>
                    <span style={{ color: colors.text }}>
                      {typeof obj.realise === 'number' && obj.realise > 1000 ? 
                        obj.realise.toLocaleString() : obj.realise} / {typeof obj.objectif === 'number' && obj.objectif > 1000 ? 
                        obj.objectif.toLocaleString() : obj.objectif}
                    </span>
                  </div>
                  <div 
                    className="w-full bg-gray-200 rounded-full h-2"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${obj.pourcentage}%`,
                        backgroundColor: getObjectifColor(obj.pourcentage)
                      }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-right" style={{ color: colors.textSecondary }}>
                    {obj.pourcentage}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Produits */}
          <div
            className="p-4 rounded-xl shadow-lg"
            style={{ backgroundColor: colors.card }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                🌾 Top Produits
              </h2>
              <button
                onClick={() => handleVoirDetails('produits')}
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: colors.surface, color: colors.textSecondary }}
              >
                Tous
              </button>
            </div>
            <div className="space-y-3">
              {dashboard.topProduits.slice(0, 3).map((produit, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getEvolutionIcon(produit.tendance)}</span>
                      <p className="font-medium text-sm" style={{ color: colors.text }}>
                        {produit.nom}
                      </p>
                    </div>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      {produit.ventes} unités • Marge {produit.marge}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color: colors.primary }}>
                      {produit.ca.toLocaleString()}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>FCFA</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Clients */}
          <div
            className="p-4 rounded-xl shadow-lg"
            style={{ backgroundColor: colors.card }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                👨‍🌾 Top Clients
              </h2>
              <button
                onClick={() => handleVoirDetails('clients')}
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: colors.surface, color: colors.textSecondary }}
              >
                Tous
              </button>
            </div>
            <div className="space-y-3">
              {dashboard.topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getEvolutionIcon(client.evolution)}</span>
                      <p className="font-medium text-sm" style={{ color: colors.text }}>
                        {client.nom}
                      </p>
                    </div>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      {client.commandes} commandes • {client.frequence}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color: colors.success }}>
                      {client.ca.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500 text-xs">⭐</span>
                      <span className="text-xs" style={{ color: colors.textSecondary }}>
                        {client.satisfaction}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes */}
          <div
            className="p-4 rounded-xl shadow-lg"
            style={{ backgroundColor: colors.card }}
          >
            <h2 className="text-lg font-bold mb-3" style={{ color: colors.text }}>
              🚨 Alertes & Actions
            </h2>
            <div className="space-y-2">
              {dashboard.alertes.map((alerte, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: colors.surface }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: colors.text }}>
                        {alerte.message}
                      </p>
                      <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                        💡 {alerte.action}
                      </p>
                    </div>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getUrgenceColor(alerte.urgence) }}
                    >
                      {alerte.urgence}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tendances marché */}
          <div
            className="p-4 rounded-xl shadow-lg"
            style={{ backgroundColor: colors.card }}
          >
            <h2 className="text-lg font-bold mb-3" style={{ color: colors.text }}>
              📊 Tendances Marché
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                  📈 Demande forte :
                </p>
                <p className="text-xs" style={{ color: colors.success }}>
                  {dashboard.tendancesMarche.demandeForte.join(', ')}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                  📉 Prix en hausse :
                </p>
                <p className="text-xs" style={{ color: colors.warning }}>
                  {dashboard.tendancesMarche.prixEnHausse.join(', ')}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                  🎯 Saison :
                </p>
                <p className="text-xs" style={{ color: colors.info }}>
                  {dashboard.tendancesMarche.saisonPic}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                💡 Recommandations :
              </p>
              <div className="space-y-1">
                {dashboard.tendancesMarche.conseils.slice(0, 2).map((conseil, index) => (
                  <p key={index} className="text-xs" style={{ color: colors.textSecondary }}>
                    • {conseil}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message d'aide */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-lg text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <p className="text-sm font-medium" style={{ color: colors.text }}>
              📊 Performance Business
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Suivez vos KPIs pour optimiser votre business d'aliments pour volailles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboardPage;