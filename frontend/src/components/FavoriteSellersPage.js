import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const FavoriteSellersPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [eleveursFavoris, setEleveursFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');

  useEffect(() => {
    // Simulation données éleveurs favoris
    const mockEleveursFavoris = [
      {
        id: '1',
        nom: 'Mamadou Keita',
        ferme: 'Ferme Sahel',
        localisation: 'Sikasso',
        telephone: '+223 76 12 34 56',
        specialites: ['Poulets de chair', 'Œufs frais'],
        evaluation: 4.8,
        commandesTotal: 12,
        derniereCommande: '2025-01-15',
        fiabilite: 95,
        qualite: 'Excellente',
        prix: 'Compétitif',
        delai: 'Rapide',
        avantages: [
          'Livraison ponctuelle',
          'Volailles saines',
          'Prix négociables',
          'Service client excellent'
        ],
        statistiques: {
          tauxSatisfaction: 96,
          tempsLivraison: '2-3 jours',
          retardMoyen: '0.5 jour',
          produitsPrincipaux: 'Poulets, Œufs'
        },
        derniersAchats: [
          { date: '15/01/2025', produit: 'Poulets de chair', quantite: 20, satisfaction: 5 },
          { date: '28/12/2024', produit: 'Œufs frais', quantite: 50, satisfaction: 5 },
          { date: '10/12/2024', produit: 'Poulets de chair', quantite: 15, satisfaction: 4 }
        ],
        contact: {
          whatsapp: '+223 76 12 34 56',
          preference: 'WhatsApp le matin',
          langues: ['Français', 'Bambara']
        }
      },
      {
        id: '2',
        nom: 'Fatoumata Diarra',
        ferme: 'Élevage Baobab',
        localisation: 'Ségou',
        telephone: '+223 65 43 21 98',
        specialites: ['Pintades', 'Canards', 'Œufs de village'],
        evaluation: 4.6,
        commandesTotal: 8,
        derniereCommande: '2025-01-10',
        fiabilite: 92,
        qualite: 'Très bonne',
        prix: 'Abordable',
        delai: 'Moyen',
        avantages: [
          'Volailles rustiques',
          'Élevage traditionnel',
          'Prix abordables',
          'Conseils d\'élevage'
        ],
        statistiques: {
          tauxSatisfaction: 88,
          tempsLivraison: '3-4 jours',
          retardMoyen: '1 jour',
          produitsPrincipaux: 'Pintades, Canards'
        },
        derniersAchats: [
          { date: '10/01/2025', produit: 'Pintades', quantite: 10, satisfaction: 5 },
          { date: '20/12/2024', produit: 'Canards', quantite: 8, satisfaction: 4 },
          { date: '05/12/2024', produit: 'Œufs village', quantite: 30, satisfaction: 5 }
        ],
        contact: {
          whatsapp: '+223 65 43 21 98',
          preference: 'Appel téléphonique',
          langues: ['Bambara', 'Français']
        }
      },
      {
        id: '3',
        nom: 'Ibrahim Coulibaly',
        ferme: 'Ranch Moderne',
        localisation: 'Bamako',
        telephone: '+223 78 87 65 43',
        specialites: ['Poulets bio', 'Dindes', 'Cailles'],
        evaluation: 4.9,
        commandesTotal: 15,
        derniereCommande: '2025-01-18',
        fiabilite: 98,
        qualite: 'Premium',
        prix: 'Élevé',
        delai: 'Très rapide',
        avantages: [
          'Certification bio',
          'Livraison express',
          'Volailles premium',
          'Traçabilité complète'
        ],
        statistiques: {
          tauxSatisfaction: 98,
          tempsLivraison: '1-2 jours',
          retardMoyen: '0.2 jour',
          produitsPrincipaux: 'Bio premium'
        },
        derniersAchats: [
          { date: '18/01/2025', produit: 'Poulets bio', quantite: 25, satisfaction: 5 },
          { date: '02/01/2025', produit: 'Dindes', quantite: 5, satisfaction: 5 },
          { date: '15/12/2024', produit: 'Cailles', quantite: 40, satisfaction: 5 }
        ],
        contact: {
          whatsapp: '+223 78 87 65 43',
          preference: 'WhatsApp ou email',
          langues: ['Français', 'Anglais']
        }
      },
      {
        id: '4',
        nom: 'Aminata Touré',
        ferme: 'Volailles du Fleuve',
        localisation: 'Mopti',
        telephone: '+223 69 78 45 12',
        specialites: ['Poulets fermiers', 'Œufs bio'],
        evaluation: 4.5,
        commandesTotal: 6,
        derniereCommande: '2025-01-12',
        fiabilite: 85,
        qualite: 'Bonne',
        prix: 'Moyen',
        delai: 'Variable',
        avantages: [
          'Élevage fermier',
          'Goût authentique',
          'Rapport qualité-prix',
          'Flexibilité commandes'
        ],
        statistiques: {
          tauxSatisfaction: 82,
          tempsLivraison: '2-5 jours',
          retardMoyen: '2 jours',
          produitsPrincipaux: 'Fermier traditionnel'
        },
        derniersAchats: [
          { date: '12/01/2025', produit: 'Poulets fermiers', quantite: 12, satisfaction: 4 },
          { date: '25/12/2024', produit: 'Œufs bio', quantite: 24, satisfaction: 5 },
          { date: '08/12/2024', produit: 'Poulets fermiers', quantite: 8, satisfaction: 4 }
        ],
        contact: {
          whatsapp: '+223 69 78 45 12',
          preference: 'Appel après 17h',
          langues: ['Peulh', 'Français']
        }
      }
    ];

    setTimeout(() => {
      setEleveursFavoris(mockEleveursFavoris);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEleveurs = eleveursFavoris.filter(eleveur => {
    if (filter === 'tous') return true;
    if (filter === 'premium') return eleveur.qualite === 'Premium' || eleveur.qualite === 'Excellente';
    if (filter === 'rapide') return eleveur.delai === 'Rapide' || eleveur.delai === 'Très rapide';
    if (filter === 'abordable') return eleveur.prix === 'Abordable' || eleveur.prix === 'Compétitif';
    return eleveur.localisation.toLowerCase().includes(filter.toLowerCase());
  });

  const handleContacter = (eleveur) => {
    alert(
      `📞 Contacter ${eleveur.nom}\n\n` +
      `🏡 Ferme : ${eleveur.ferme}\n` +
      `📍 Localisation : ${eleveur.localisation}\n` +
      `⭐ Évaluation : ${eleveur.evaluation}/5\n` +
      `🔄 Commandes précédentes : ${eleveur.commandesTotal}\n` +
      `📅 Dernière commande : ${eleveur.derniereCommande}\n\n` +
      `📱 Contact préféré : ${eleveur.contact.preference}\n` +
      `☎️ Téléphone : ${eleveur.telephone}\n\n` +
      `🐔 Spécialités :\n${eleveur.specialites.map(s => `• ${s}`).join('\n')}\n\n` +
      `✅ Avantages :\n${eleveur.avantages.map(a => `• ${a}`).join('\n')}`
    );
  };

  const handleVoirDetails = (eleveur) => {
    alert(
      `📊 Détails ${eleveur.nom}\n\n` +
      `📈 Statistiques :\n` +
      `• Satisfaction : ${eleveur.statistiques.tauxSatisfaction}%\n` +
      `• Délai livraison : ${eleveur.statistiques.tempsLivraison}\n` +
      `• Retard moyen : ${eleveur.statistiques.retardMoyen}\n` +
      `• Produits : ${eleveur.statistiques.produitsPrincipaux}\n\n` +
      `🛒 Derniers achats :\n` +
      eleveur.derniersAchats.map(achat => 
        `• ${achat.date} : ${achat.produit} (${achat.quantite}) - ${achat.satisfaction}⭐`
      ).join('\n')
    );
  };

  const getQualiteColor = (qualite) => {
    switch (qualite) {
      case 'Premium': return colors.success;
      case 'Excellente': return colors.success;
      case 'Très bonne': return colors.info;
      case 'Bonne': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const getFiabiliteColor = (fiabilite) => {
    if (fiabilite >= 95) return colors.success;
    if (fiabilite >= 85) return colors.info;
    if (fiabilite >= 75) return colors.warning;
    return colors.error;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p style={{ color: colors.text }}>Chargement de vos éleveurs favoris...</p>
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
              ⭐ Éleveurs Favoris
            </h1>
            <div></div>
          </div>
        </div>

        {/* Filtres */}
        <div className="px-4 pb-4">
          <div className="max-w-md mx-auto">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'tous', label: 'Tous', icon: '👨‍🌾' },
                { key: 'premium', label: 'Premium', icon: '⭐' },
                { key: 'rapide', label: 'Livraison rapide', icon: '🚚' },
                { key: 'abordable', label: 'Prix abordable', icon: '💰' },
                { key: 'bamako', label: 'Bamako', icon: '🏢' },
                { key: 'sikasso', label: 'Sikasso', icon: '🌾' }
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="px-3 py-2 rounded-full text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: filter === f.key ? colors.primary : colors.card,
                    color: filter === f.key ? 'white' : colors.text,
                    border: `1px solid ${filter === f.key ? colors.primary : colors.border}`
                  }}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Liste des éleveurs favoris */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-4">
          {filteredEleveurs.map(eleveur => (
            <div
              key={eleveur.id}
              className="p-4 rounded-xl shadow-lg border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border
              }}
            >
              {/* En-tête */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">👨‍🌾</span>
                    <h3 className="font-bold text-base" style={{ color: colors.text }}>
                      {eleveur.nom}
                    </h3>
                  </div>
                  <p className="text-sm font-medium" style={{ color: colors.primary }}>
                    {eleveur.ferme}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    📍 {eleveur.localisation} • {eleveur.commandesTotal} commandes
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-bold" style={{ color: colors.text }}>
                      {eleveur.evaluation}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    Fiabilité {eleveur.fiabilite}%
                  </p>
                </div>
              </div>

              {/* Badges qualité */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getQualiteColor(eleveur.qualite) }}
                >
                  🏆 {eleveur.qualite}
                </span>
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getFiabiliteColor(eleveur.fiabilite) }}
                >
                  🎯 Fiable {eleveur.fiabilite}%
                </span>
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: colors.info }}
                >
                  💰 {eleveur.prix}
                </span>
              </div>

              {/* Spécialités */}
              <div className="mb-3">
                <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                  🐔 Spécialités :
                </p>
                <div className="flex flex-wrap gap-1">
                  {eleveur.specialites.map((specialite, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded text-xs"
                      style={{ 
                        backgroundColor: colors.surface,
                        color: colors.textSecondary 
                      }}
                    >
                      {specialite}
                    </span>
                  ))}
                </div>
              </div>

              {/* Avantages */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                  ✅ Avantages :
                </p>
                <div className="space-y-1">
                  {eleveur.avantages.slice(0, 2).map((avantage, index) => (
                    <p key={index} className="text-xs" style={{ color: colors.textSecondary }}>
                      • {avantage}
                    </p>
                  ))}
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
                  onClick={() => handleVoirDetails(eleveur)}
                  className="px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  style={{ 
                    backgroundColor: colors.surface,
                    color: colors.text,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  📊 Détails
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
              ⭐ Vos Partenaires de Confiance
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Continuez à travailler avec vos éleveurs les plus fiables pour garantir la qualité
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteSellersPage;