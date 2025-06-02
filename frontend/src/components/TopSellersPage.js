import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TopSellersPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [classement, setClassement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [critereTri, setCritereTri] = useState('global');
  const [periode, setPeriode] = useState('mois');

  useEffect(() => {
    // Simulation données classement éleveurs
    const mockClassement = [
      {
        id: '1',
        rang: 1,
        nom: 'Ibrahim Coulibaly',
        ferme: 'Ranch Moderne',
        localisation: 'Bamako',
        telephone: '+223 78 87 65 43',
        scores: {
          global: 9.2,
          qualite: 9.5,
          prix: 8.8,
          service: 9.4,
          delai: 9.0
        },
        specialites: ['Poulets bio', 'Dindes', 'Certification bio'],
        statistiques: {
          ventesTotales: '125 000 FCFA',
          commandes: 18,
          clientsSatisfaits: '98%',
          tempsLivraison: '1.2 jours',
          tauxRetour: '0.5%'
        },
        badges: ['🏆 N°1 Qualité', '⚡ Livraison Express', '🌱 Bio Certifié', '⭐ 5 étoiles'],
        avis: [
          { client: 'Mariam S.', note: 5, commentaire: 'Excellente qualité, poulets bio parfaits' },
          { client: 'Amadou K.', note: 5, commentaire: 'Livraison ultra rapide, service impeccable' },
          { client: 'Fatoumata D.', note: 5, commentaire: 'Prix justifiés par la qualité premium' }
        ],
        tendance: 'hausse',
        evolution: '+2 places',
        certifications: ['Bio Mali', 'HACCP', 'Vétérinaire approuvé'],
        prixMoyens: {
          'Poulet bio': '3200 FCFA/kg',
          'Dinde bio': '4500 FCFA/kg',
          'Œufs bio': '180 FCFA/unité'
        }
      },
      {
        id: '2',
        rang: 2,
        nom: 'Mamadou Keita',
        ferme: 'Ferme Sahel',
        localisation: 'Sikasso',
        telephone: '+223 76 12 34 56',
        scores: {
          global: 8.9,
          qualite: 9.0,
          prix: 9.2,
          service: 8.8,
          delai: 8.6
        },
        specialites: ['Poulets de chair', 'Œufs frais', 'Prix compétitifs'],
        statistiques: {
          ventesTotales: '95 000 FCFA',
          commandes: 22,
          clientsSatisfaits: '94%',
          tempsLivraison: '2.1 jours',
          tauxRetour: '1.2%'
        },
        badges: ['💰 Meilleur Rapport Q/P', '🎯 Fiable', '📦 Gros Volumes', '🤝 Négociable'],
        avis: [
          { client: 'Sekou T.', note: 5, commentaire: 'Très bon rapport qualité prix' },
          { client: 'Aïssata M.', note: 4, commentaire: 'Bonne qualité, délais respectés' },
          { client: 'Boubacar S.', note: 5, commentaire: 'Prix imbattables sur Sikasso' }
        ],
        tendance: 'stable',
        evolution: 'Stable',
        certifications: ['Vétérinaire Mali', 'Chambre Agriculture'],
        prixMoyens: {
          'Poulet chair': '2500 FCFA/kg',
          'Œufs frais': '120 FCFA/unité',
          'Poules pondeuses': '3000 FCFA/unité'
        }
      },
      {
        id: '3',
        rang: 3,
        nom: 'Fatoumata Diarra',
        ferme: 'Élevage Baobab',
        localisation: 'Ségou',
        telephone: '+223 65 43 21 98',
        scores: {
          global: 8.6,
          qualite: 8.8,
          prix: 8.7,
          service: 8.5,
          delai: 8.3
        },
        specialites: ['Pintades', 'Canards', 'Volailles rustiques'],
        statistiques: {
          ventesTotales: '78 000 FCFA',
          commandes: 15,
          clientsSatisfaits: '91%',
          tempsLivraison: '2.8 jours',
          tauxRetour: '2.1%'
        },
        badges: ['🦃 Spécialiste Pintades', '🏡 Élevage Traditionnel', '💚 Local Mali', '🌾 Rustique'],
        avis: [
          { client: 'Djeneba K.', note: 5, commentaire: 'Pintades excellentes, goût authentique' },
          { client: 'Mohamed L.', note: 4, commentaire: 'Bonne qualité, élevage traditionnel' },
          { client: 'Hawa T.', note: 4, commentaire: 'Volailles résistantes, bien adaptées' }
        ],
        tendance: 'hausse',
        evolution: '+1 place',
        certifications: ['Élevage Traditionnel Mali', 'Local Ségou'],
        prixMoyens: {
          'Pintades': '2800 FCFA/kg',
          'Canards': '3000 FCFA/kg',
          'Œufs pintade': '200 FCFA/unité'
        }
      },
      {
        id: '4',
        rang: 4,
        nom: 'Aminata Touré',
        ferme: 'Volailles du Fleuve',
        localisation: 'Mopti',
        telephone: '+223 69 78 45 12',
        scores: {
          global: 8.3,
          qualite: 8.5,
          prix: 8.2,
          service: 8.1,
          delai: 8.0
        },
        specialites: ['Poulets fermiers', 'Œufs bio', 'Élevage Delta'],
        statistiques: {
          ventesTotales: '62 000 FCFA',
          commandes: 12,
          clientsSatisfaits: '88%',
          tempsLivraison: '3.2 jours',
          tauxRetour: '3.0%'
        },
        badges: ['🌊 Élevage Delta', '🍃 Fermier', '🐔 Goût Authentique', '📍 Région Mopti'],
        avis: [
          { client: 'Issa D.', note: 4, commentaire: 'Goût fermier authentique, très bon' },
          { client: 'Mariame B.', note: 4, commentaire: 'Qualité correcte, prix raisonnable' },
          { client: 'Oumar K.', note: 5, commentaire: 'Excellent poulet du delta, recommandé' }
        ],
        tendance: 'stable',
        evolution: 'Stable',
        certifications: ['Fermier Delta Mali', 'Agriculture Mopti'],
        prixMoyens: {
          'Poulet fermier': '2200 FCFA/kg',
          'Œufs bio': '150 FCFA/unité',
          'Poules locales': '2500 FCFA/unité'
        }
      },
      {
        id: '5',
        rang: 5,
        nom: 'Moussa Sangaré',
        ferme: 'Aviculture Moderne Kayes',
        localisation: 'Kayes',
        telephone: '+223 72 55 44 33',
        scores: {
          global: 8.0,
          qualite: 8.0,
          prix: 8.3,
          service: 7.8,
          delai: 7.9
        },
        specialites: ['Coqs locaux', 'Poules pondeuses', 'Gros volumes'],
        statistiques: {
          ventesTotales: '55 000 FCFA',
          commandes: 9,
          clientsSatisfaits: '85%',
          tempsLivraison: '3.5 jours',
          tauxRetour: '4.2%'
        },
        badges: ['🐓 Spécialiste Coqs', '📦 Gros Volumes', '💪 Volailles Robustes', '🏜️ Kayes Region'],
        avis: [
          { client: 'Bakary K.', note: 4, commentaire: 'Coqs locaux de bonne taille' },
          { client: 'Nana T.', note: 4, commentaire: 'Prix correct, service à améliorer' },
          { client: 'Souleymane D.', note: 4, commentaire: 'Bonnes poules pondeuses' }
        ],
        tendance: 'baisse',
        evolution: '-1 place',
        certifications: ['Aviculture Kayes', 'Coopérative Locale'],
        prixMoyens: {
          'Coqs locaux': '4000 FCFA/unité',
          'Poules pondeuses': '3200 FCFA/unité',
          'Œufs village': '100 FCFA/unité'
        }
      }
    ];

    setTimeout(() => {
      setClassement(mockClassement);
      setLoading(false);
    }, 1000);
  }, []);

  // Tri des données selon le critère sélectionné
  const classementTrie = [...classement].sort((a, b) => {
    if (critereTri === 'global') return a.rang - b.rang;
    return b.scores[critereTri] - a.scores[critereTri];
  });

  const handleContacter = (eleveur) => {
    alert(
      `📞 Contacter ${eleveur.nom}\n\n` +
      `🏆 Classement : #${eleveur.rang}\n` +
      `🏡 Ferme : ${eleveur.ferme}\n` +
      `📍 Localisation : ${eleveur.localisation}\n` +
      `⭐ Score global : ${eleveur.scores.global}/10\n` +
      `📱 Téléphone : ${eleveur.telephone}\n\n` +
      `🐔 Spécialités :\n${eleveur.specialites.map(s => `• ${s}`).join('\n')}\n\n` +
      `💰 Prix moyens :\n${Object.entries(eleveur.prixMoyens).map(([produit, prix]) => `• ${produit}: ${prix}`).join('\n')}\n\n` +
      `🏆 Badges :\n${eleveur.badges.map(b => `${b}`).join('\n')}`
    );
  };

  const handleVoirAvis = (eleveur) => {
    alert(
      `💬 Avis Clients - ${eleveur.nom}\n\n` +
      `📊 Statistiques :\n` +
      `• Clients satisfaits : ${eleveur.statistiques.clientsSatisfaits}\n` +
      `• Commandes : ${eleveur.statistiques.commandes}\n` +
      `• Temps livraison : ${eleveur.statistiques.tempsLivraison}\n` +
      `• Taux retour : ${eleveur.statistiques.tauxRetour}\n\n` +
      `💬 Derniers avis :\n\n` +
      eleveur.avis.map(avis => 
        `⭐ ${avis.note}/5 - ${avis.client}\n"${avis.commentaire}"`
      ).join('\n\n')
    );
  };

  const getRangColor = (rang) => {
    if (rang === 1) return '#FFD700'; // Gold
    if (rang === 2) return '#C0C0C0'; // Silver
    if (rang === 3) return '#CD7F32'; // Bronze
    return colors.textSecondary;
  };

  const getRangIcon = (rang) => {
    if (rang === 1) return '🥇';
    if (rang === 2) return '🥈';
    if (rang === 3) return '🥉';
    return `#${rang}`;
  };

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
      case 'hausse': return colors.success;
      case 'baisse': return colors.error;
      case 'stable': return colors.info;
      default: return colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p style={{ color: colors.text }}>Chargement du classement...</p>
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
              🏆 Top Éleveurs
            </h1>
            <div></div>
          </div>
        </div>

        {/* Filtres et tri */}
        <div className="px-4 pb-4">
          <div className="max-w-md mx-auto space-y-3">
            {/* Critères de tri */}
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                📊 Trier par :
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'global', label: 'Classement général', icon: '🏆' },
                  { key: 'qualite', label: 'Qualité', icon: '⭐' },
                  { key: 'prix', label: 'Prix', icon: '💰' },
                  { key: 'service', label: 'Service', icon: '🤝' },
                  { key: 'delai', label: 'Délais', icon: '⚡' }
                ].map(critere => (
                  <button
                    key={critere.key}
                    onClick={() => setCritereTri(critere.key)}
                    className="px-3 py-2 rounded-full text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: critereTri === critere.key ? colors.primary : colors.card,
                      color: critereTri === critere.key ? 'white' : colors.text,
                      border: `1px solid ${critereTri === critere.key ? colors.primary : colors.border}`
                    }}
                  >
                    {critere.icon} {critere.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classement */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-4">
          {classementTrie.map((eleveur, index) => (
            <div
              key={eleveur.id}
              className="p-4 rounded-xl shadow-lg border"
              style={{
                backgroundColor: colors.card,
                borderColor: eleveur.rang <= 3 ? getRangColor(eleveur.rang) : colors.border,
                borderWidth: eleveur.rang <= 3 ? '2px' : '1px'
              }}
            >
              {/* En-tête avec rang */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: getRangColor(eleveur.rang) }}
                  >
                    {getRangIcon(eleveur.rang)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base" style={{ color: colors.text }}>
                      {eleveur.nom}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: colors.primary }}>
                      {eleveur.ferme}
                    </p>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      📍 {eleveur.localisation}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-lg font-bold" style={{ color: colors.text }}>
                      {eleveur.scores[critereTri].toFixed(1)}
                    </span>
                    <span className="text-sm" style={{ color: colors.textSecondary }}>/10</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{getTendanceIcon(eleveur.tendance)}</span>
                    <span 
                      className="text-xs"
                      style={{ color: getTendanceColor(eleveur.tendance) }}
                    >
                      {eleveur.evolution}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scores détaillés */}
              <div className="mb-3">
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <p style={{ color: colors.textSecondary }}>Qualité</p>
                    <p className="font-bold" style={{ color: colors.text }}>{eleveur.scores.qualite}</p>
                  </div>
                  <div className="text-center">
                    <p style={{ color: colors.textSecondary }}>Prix</p>
                    <p className="font-bold" style={{ color: colors.text }}>{eleveur.scores.prix}</p>
                  </div>
                  <div className="text-center">
                    <p style={{ color: colors.textSecondary }}>Service</p>
                    <p className="font-bold" style={{ color: colors.text }}>{eleveur.scores.service}</p>
                  </div>
                  <div className="text-center">
                    <p style={{ color: colors.textSecondary }}>Délais</p>
                    <p className="font-bold" style={{ color: colors.text }}>{eleveur.scores.delai}</p>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {eleveur.badges.slice(0, 3).map((badge, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ 
                        backgroundColor: colors.surface,
                        color: colors.textSecondary 
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Statistiques clés */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span style={{ color: colors.textSecondary }}>Ventes : </span>
                    <span className="font-medium" style={{ color: colors.text }}>
                      {eleveur.statistiques.ventesTotales}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: colors.textSecondary }}>Satisfaction : </span>
                    <span className="font-medium" style={{ color: colors.success }}>
                      {eleveur.statistiques.clientsSatisfaits}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: colors.textSecondary }}>Commandes : </span>
                    <span className="font-medium" style={{ color: colors.text }}>
                      {eleveur.statistiques.commandes}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: colors.textSecondary }}>Livraison : </span>
                    <span className="font-medium" style={{ color: colors.text }}>
                      {eleveur.statistiques.tempsLivraison}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleContacter(eleveur)}
                  className="flex-1 py-2 rounded-lg font-medium text-white transition-colors text-sm"
                  style={{ backgroundColor: colors.primary }}
                >
                  📞 Contacter
                </button>
                <button
                  onClick={() => handleVoirAvis(eleveur)}
                  className="px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  style={{ 
                    backgroundColor: colors.surface,
                    color: colors.text,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  💬 Avis
                </button>
              </div>
            </div>
          ))}
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
              🏆 Classement de Qualité
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Basé sur la qualité, les prix, le service et les délais de livraison
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSellersPage;