import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const FarmerContactsPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [eleveurs, setEleveurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');

  useEffect(() => {
    // Simulation données clients éleveurs du fournisseur
    const mockEleveurs = [
      {
        id: '1',
        nom: 'Mamadou Keita',
        ferme: 'Ferme Sahel',
        localisation: 'Sikasso',
        telephone: '+223 76 12 34 56',
        statut: 'actif',
        typeClient: 'regulier',
        premierAchat: '2024-08-15',
        dernierAchat: '2025-01-18',
        nombreCommandes: 12,
        montantTotal: 185000,
        moyenneCommande: 15400,
        produitsPreferes: ['Maïs concassé', 'Tourteau soja', 'Concentré ponte'],
        tailleElevage: '150-300 volailles',
        specialiteElevage: 'Poulets de chair',
        frequenceAchat: 'Bi-mensuelle',
        modePaiementPrefere: 'Orange Money',
        evaluationFournisseur: 4.8,
        fidelite: 92,
        dernieresCommandes: [
          { date: '2025-01-18', produits: 'Maïs + Soja', montant: 26500, statut: 'confirmée' },
          { date: '2025-01-05', produits: 'Concentré ponte', montant: 15600, statut: 'livrée' },
          { date: '2024-12-20', produits: 'Maïs concassé', montant: 17500, statut: 'livrée' }
        ],
        besoinsEstimes: {
          mensuel: '45000 FCFA',
          produitsPrincipaux: 'Maïs (60%), Protéines (30%), Compléments (10%)',
          periodesFortes: 'Janvier-Mars, Septembre-Novembre'
        },
        notes: 'Client très fiable, paiements ponctuels. Elevage moderne avec bonnes pratiques.',
        contact: {
          preference: 'WhatsApp matin',
          langues: ['Français', 'Bambara'],
          disponibilite: 'Tous les jours 7h-18h'
        }
      },
      {
        id: '2',
        nom: 'Fatoumata Diarra',
        ferme: 'Élevage Baobab',
        localisation: 'Ségou',
        telephone: '+223 65 43 21 98',
        statut: 'actif',
        typeClient: 'occasionnel',
        premierAchat: '2024-11-10',
        dernierAchat: '2025-01-17',
        nombreCommandes: 6,
        montantTotal: 78000,
        moyenneCommande: 13000,
        produitsPreferes: ['Concentré ponte', 'Prémix vitamines', 'Son de blé'],
        tailleElevage: '50-100 volailles',
        specialiteElevage: 'Pintades et canards',
        frequenceAchat: 'Mensuelle',
        modePaiementPrefere: 'Mobile Money',
        evaluationFournisseur: 4.5,
        fidelite: 78,
        dernieresCommandes: [
          { date: '2025-01-17', produits: 'Concentré + Vitamines', montant: 21600, statut: 'livrée' },
          { date: '2024-12-28', produits: 'Son de blé', montant: 14000, statut: 'livrée' },
          { date: '2024-12-10', produits: 'Concentré ponte', montant: 15600, statut: 'livrée' }
        ],
        besoinsEstimes: {
          mensuel: '18000 FCFA',
          produitsPrincipaux: 'Compléments (50%), Céréales (30%), Vitamines (20%)',
          periodesFortes: 'Décembre-Février (ponte)'
        },
        notes: 'Spécialisée volailles rustiques. Besoins spécifiques pour pintades.',
        contact: {
          preference: 'Appel téléphonique',
          langues: ['Bambara', 'Français'],
          disponibilite: 'Matin 8h-12h, soir 16h-19h'
        }
      },
      {
        id: '3',
        nom: 'Ibrahim Coulibaly',
        ferme: 'Ranch Moderne',
        localisation: 'Bamako',
        telephone: '+223 78 87 65 43',
        statut: 'actif',
        typeClient: 'premium',
        premierAchat: '2024-06-20',
        dernierAchat: '2025-01-16',
        nombreCommandes: 18,
        montantTotal: 385000,
        moyenneCommande: 21400,
        produitsPreferes: ['Farine de poisson', 'Maïs bio', 'Compléments premium'],
        tailleElevage: '500+ volailles',
        specialiteElevage: 'Poulets bio certifiés',
        frequenceAchat: 'Hebdomadaire',
        modePaiementPrefere: 'Virement bancaire',
        evaluationFournisseur: 4.9,
        fidelite: 96,
        dernieresCommandes: [
          { date: '2025-01-16', produits: 'Farine poisson + Son', montant: 46750, statut: 'en cours' },
          { date: '2025-01-08', produits: 'Maïs bio premium', montant: 35000, statut: 'livrée' },
          { date: '2024-12-30', produits: 'Mix complet bio', montant: 52000, statut: 'livrée' }
        ],
        besoinsEstimes: {
          mensuel: '85000 FCFA',
          produitsPrincipaux: 'Protéines premium (40%), Céréales bio (35%), Compléments (25%)',
          periodesFortes: 'Toute l\'année (production continue)'
        },
        notes: 'Client premium, volumes importants. Exigences qualité très élevées.',
        contact: {
          preference: 'WhatsApp ou email',
          langues: ['Français', 'Anglais'],
          disponibilite: 'Bureau 9h-17h, urgences 24h'
        }
      },
      {
        id: '4',
        nom: 'Aminata Touré',
        ferme: 'Volailles du Fleuve',
        localisation: 'Mopti',
        telephone: '+223 69 78 45 12',
        statut: 'inactif',
        typeClient: 'occasionnel',
        premierAchat: '2024-09-05',
        dernierAchat: '2024-12-15',
        nombreCommandes: 4,
        montantTotal: 52000,
        moyenneCommande: 13000,
        produitsPreferes: ['Maïs local', 'Son de blé', 'Concentré ponte'],
        tailleElevage: '80-150 volailles',
        specialiteElevage: 'Poulets fermiers',
        frequenceAchat: 'Irrégulière',
        modePaiementPrefere: 'Espèces',
        evaluationFournisseur: 4.2,
        fidelite: 65,
        dernieresCommandes: [
          { date: '2024-12-15', produits: 'Maïs + Concentré', montant: 16400, statut: 'livrée' },
          { date: '2024-11-20', produits: 'Son de blé', montant: 14000, statut: 'livrée' },
          { date: '2024-10-10', produits: 'Concentré ponte', montant: 10400, statut: 'livrée' }
        ],
        besoinsEstimes: {
          mensuel: '12000 FCFA',
          produitsPrincipaux: 'Céréales locales (60%), Compléments (40%)',
          periodesFortes: 'Saison sèche (élevage intensif)'
        },
        notes: 'Cliente irrégulière, budget limité. À relancer pour réactivation.',
        contact: {
          preference: 'Appel après 17h',
          langues: ['Peulh', 'Français'],
          disponibilite: 'Soir 17h-20h'
        }
      },
      {
        id: '5',
        nom: 'Sekou Traoré',
        ferme: 'Aviculture Moderne Kayes',
        localisation: 'Kayes',
        telephone: '+223 72 85 96 30',
        statut: 'probleme',
        typeClient: 'regulier',
        premierAchat: '2024-07-10',
        dernierAchat: '2025-01-14',
        nombreCommandes: 8,
        montantTotal: 125000,
        moyenneCommande: 15600,
        produitsPreferes: ['Concentré ponte', 'Son de blé', 'Vitamines'],
        tailleElevage: '200-400 volailles',
        specialiteElevage: 'Coqs et poules locales',
        frequenceAchat: 'Mensuelle',
        modePaiementPrefere: 'Orange Money',
        evaluationFournisseur: 3.2,
        fidelite: 58,
        dernieresCommandes: [
          { date: '2025-01-14', produits: 'Concentré + Son', montant: 21800, statut: 'problème' },
          { date: '2024-12-05', produits: 'Vitamines', montant: 12000, statut: 'livrée' },
          { date: '2024-11-15', produits: 'Son de blé', montant: 16800, statut: 'livrée' }
        ],
        besoinsEstimes: {
          mensuel: '20000 FCFA',
          produitsPrincipaux: 'Compléments (45%), Céréales (35%), Vitamines (20%)',
          periodesFortes: 'Octobre-Décembre (reproduction)'
        },
        notes: 'Problème qualité récent à résoudre. Client habituellement satisfait.',
        contact: {
          preference: 'WhatsApp uniquement',
          langues: ['Français', 'Soninké'],
          disponibilite: 'Après-midi 14h-18h'
        }
      }
    ];

    setTimeout(() => {
      setEleveurs(mockEleveurs);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEleveurs = eleveurs.filter(eleveur => {
    if (filter === 'tous') return true;
    if (filter === 'inactifs') return eleveur.statut === 'inactif';
    if (filter === 'premium') return eleveur.typeClient === 'premium';
    if (filter === 'problemes') return eleveur.statut === 'probleme';
    return eleveur.typeClient === filter;
  });

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'actif': return colors.success;
      case 'inactif': return colors.warning;
      case 'probleme': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getTypeClientColor = (type) => {
    switch (type) {
      case 'premium': return colors.primary;
      case 'regulier': return colors.success;
      case 'occasionnel': return colors.info;
      default: return colors.textSecondary;
    }
  };

  const getTypeClientText = (type) => {
    switch (type) {
      case 'premium': return 'Premium';
      case 'regulier': return 'Régulier';
      case 'occasionnel': return 'Occasionnel';
      default: return type;
    }
  };

  const getFideliteColor = (fidelite) => {
    if (fidelite >= 90) return colors.success;
    if (fidelite >= 70) return colors.info;
    if (fidelite >= 50) return colors.warning;
    return colors.error;
  };

  const handleContacterEleveur = (eleveur) => {
    alert(
      `📞 Contacter ${eleveur.nom}\n\n` +
      `🏡 Ferme : ${eleveur.ferme}\n` +
      `📍 Localisation : ${eleveur.localisation}\n` +
      `📱 Téléphone : ${eleveur.telephone}\n` +
      `🐔 Élevage : ${eleveur.specialiteElevage} (${eleveur.tailleElevage})\n` +
      `💰 Montant total achats : ${eleveur.montantTotal.toLocaleString()} FCFA\n` +
      `📋 Commandes : ${eleveur.nombreCommandes}\n\n` +
      `📞 Contact préféré : ${eleveur.contact.preference}\n` +
      `🌍 Langues : ${eleveur.contact.langues.join(', ')}\n` +
      `⏰ Disponibilité : ${eleveur.contact.disponibilite}\n\n` +
      `💬 Message suggéré :\n"Bonjour ${eleveur.nom}, comment va votre élevage ?"`
    );
  };

  const handleVoirProfil = (eleveur) => {
    alert(
      `👨‍🌾 Profil Client - ${eleveur.nom}\n\n` +
      `📊 Statistiques :\n` +
      `• Premier achat : ${eleveur.premierAchat}\n` +
      `• Dernier achat : ${eleveur.dernierAchat}\n` +
      `• Fréquence : ${eleveur.frequenceAchat}\n` +
      `• Fidélité : ${eleveur.fidelite}%\n` +
      `• Évaluation : ${eleveur.evaluationFournisseur}/5\n\n` +
      `🐔 Élevage :\n` +
      `• Spécialité : ${eleveur.specialiteElevage}\n` +
      `• Taille : ${eleveur.tailleElevage}\n\n` +
      `💰 Besoins estimés :\n` +
      `• Budget mensuel : ${eleveur.besoinsEstimes.mensuel}\n` +
      `• Répartition : ${eleveur.besoinsEstimes.produitsPrincipaux}\n` +
      `• Périodes fortes : ${eleveur.besoinsEstimes.periodesFortes}\n\n` +
      `📝 Notes : ${eleveur.notes}`
    );
  };

  const handleAnalyserVentes = (eleveur) => {
    const derniereMoyenne = eleveur.dernieresCommandes.slice(0, 3).reduce((sum, cmd) => sum + cmd.montant, 0) / 3;
    const tendance = derniereMoyenne > eleveur.moyenneCommande ? 'Hausse' : 'Baisse';

    alert(
      `📈 Analyse Ventes - ${eleveur.nom}\n\n` +
      `💰 Performances :\n` +
      `• Montant total : ${eleveur.montantTotal.toLocaleString()} FCFA\n` +
      `• Moyenne/commande : ${eleveur.moyenneCommande.toLocaleString()} FCFA\n` +
      `• Dernières commandes : ${derniereMoyenne.toLocaleString()} FCFA\n` +
      `• Tendance : ${tendance}\n\n` +
      `🌾 Produits préférés :\n` +
      eleveur.produitsPreferes.map(p => `• ${p}`).join('\n') +
      `\n\n📅 Historique récent :\n` +
      eleveur.dernieresCommandes.map(cmd => 
        `• ${cmd.date} : ${cmd.montant.toLocaleString()} FCFA (${cmd.statut})`
      ).join('\n') +
      `\n\n💡 Recommandations :\n` +
      `• Proposer des offres sur ses produits préférés\n` +
      `• Ajuster les quantités selon ses besoins\n` +
      `• Contacter avant ses périodes d'achat habituelles`
    );
  };

  const handleProposerOffre = (eleveur) => {
    alert(
      `💰 Proposer Offre - ${eleveur.nom}\n\n` +
      `🎯 Offre personnalisée basée sur :\n` +
      `• Historique d'achats : ${eleveur.nombreCommandes} commandes\n` +
      `• Budget habituel : ${eleveur.moyenneCommande.toLocaleString()} FCFA\n` +
      `• Produits préférés : ${eleveur.produitsPreferes.slice(0, 2).join(', ')}\n\n` +
      `💡 Suggestions d'offres :\n` +
      `• Remise 5% sur lot ${eleveur.produitsPreferes[0]}\n` +
      `• Livraison gratuite (achat > ${Math.round(eleveur.moyenneCommande * 1.5).toLocaleString()} FCFA)\n` +
      `• Pack fidélité ${eleveur.typeClient}\n` +
      `• Paiement échelonné\n\n` +
      `📞 Contacter ${eleveur.nom} pour présenter l'offre`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p style={{ color: colors.text }}>Chargement de vos clients...</p>
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
              👨‍🌾 Mes Clients Éleveurs
            </h1>
            <div></div>
          </div>
        </div>

        {/* Résumé clients */}
        <div className="px-4 pb-2">
          <div className="max-w-md mx-auto">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: colors.card }}
            >
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <p className="font-bold text-lg" style={{ color: colors.success }}>
                    {filteredEleveurs.filter(e => e.statut === 'actif').length}
                  </p>
                  <p style={{ color: colors.textSecondary }}>Actifs</p>
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: colors.primary }}>
                    {filteredEleveurs.filter(e => e.typeClient === 'premium').length}
                  </p>
                  <p style={{ color: colors.textSecondary }}>Premium</p>
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: colors.warning }}>
                    {filteredEleveurs.filter(e => e.statut === 'inactif').length}
                  </p>
                  <p style={{ color: colors.textSecondary }}>Inactifs</p>
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: colors.text }}>
                    {filteredEleveurs.reduce((sum, e) => sum + e.montantTotal, 0).toLocaleString()}
                  </p>
                  <p style={{ color: colors.textSecondary }}>FCFA Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="px-4 pb-4">
          <div className="max-w-md mx-auto">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'tous', label: 'Tous', icon: '👨‍🌾' },
                { key: 'premium', label: 'Premium', icon: '⭐' },
                { key: 'regulier', label: 'Réguliers', icon: '🔄' },
                { key: 'occasionnel', label: 'Occasionnels', icon: '📅' },
                { key: 'inactifs', label: 'Inactifs', icon: '😴' },
                { key: 'problemes', label: 'Problèmes', icon: '⚠️' }
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

      {/* Liste des éleveurs */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-4">
          {filteredEleveurs.map(eleveur => (
            <div
              key={eleveur.id}
              className="p-4 rounded-xl shadow-lg border"
              style={{
                backgroundColor: colors.card,
                borderColor: eleveur.statut === 'probleme' ? colors.error : 
                           eleveur.typeClient === 'premium' ? colors.primary : colors.border,
                borderWidth: eleveur.typeClient === 'premium' || eleveur.statut === 'probleme' ? '2px' : '1px'
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
                    {eleveur.typeClient === 'premium' && (
                      <span className="text-lg">⭐</span>
                    )}
                  </div>
                  <p className="text-sm font-medium" style={{ color: colors.primary }}>
                    {eleveur.ferme}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    📍 {eleveur.localisation} • {eleveur.specialiteElevage}
                  </p>
                </div>
                <div className="text-right">
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getStatutColor(eleveur.statut) }}
                  >
                    {eleveur.statut}
                  </span>
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    Fidélité {eleveur.fidelite}%
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getTypeClientColor(eleveur.typeClient) }}
                >
                  🏆 {getTypeClientText(eleveur.typeClient)}
                </span>
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getFideliteColor(eleveur.fidelite) }}
                >
                  🎯 {eleveur.fidelite}% fidèle
                </span>
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: colors.surface,
                    color: colors.textSecondary 
                  }}
                >
                  {eleveur.tailleElevage}
                </span>
              </div>

              {/* Statistiques client */}
              <div className="mb-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span style={{ color: colors.textSecondary }}>Commandes :</span>
                    <p className="font-medium" style={{ color: colors.text }}>
                      {eleveur.nombreCommandes}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: colors.textSecondary }}>Total achats :</span>
                    <p className="font-medium" style={{ color: colors.success }}>
                      {eleveur.montantTotal.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div>
                    <span style={{ color: colors.textSecondary }}>Moyenne :</span>
                    <p className="font-medium" style={{ color: colors.text }}>
                      {eleveur.moyenneCommande.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div>
                    <span style={{ color: colors.textSecondary }}>Fréquence :</span>
                    <p className="font-medium" style={{ color: colors.text }}>
                      {eleveur.frequenceAchat}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dernière commande */}
              <div className="mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.surface }}
                >
                  <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                    Dernière commande :
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    📅 {eleveur.dernierAchat} • 
                    💰 {eleveur.dernieresCommandes[0]?.montant.toLocaleString()} FCFA
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    🌾 {eleveur.dernieresCommandes[0]?.produits}
                  </p>
                </div>
              </div>

              {/* Produits préférés */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                  🌾 Produits préférés :
                </p>
                <div className="flex flex-wrap gap-1">
                  {eleveur.produitsPreferes.slice(0, 3).map((produit, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded text-xs"
                      style={{ 
                        backgroundColor: colors.surface,
                        color: colors.textSecondary 
                      }}
                    >
                      {produit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleContacterEleveur(eleveur)}
                  className="py-2 rounded-lg font-medium text-white transition-colors text-sm"
                  style={{ backgroundColor: colors.primary }}
                >
                  📞 Contacter
                </button>
                <button
                  onClick={() => handleProposerOffre(eleveur)}
                  className="py-2 rounded-lg font-medium text-white transition-colors text-sm"
                  style={{ backgroundColor: colors.success }}
                >
                  💰 Offre
                </button>
                <button
                  onClick={() => handleVoirProfil(eleveur)}
                  className="py-2 rounded-lg font-medium transition-colors text-sm"
                  style={{ 
                    backgroundColor: colors.info,
                    color: 'white'
                  }}
                >
                  👤 Profil
                </button>
                <button
                  onClick={() => handleAnalyserVentes(eleveur)}
                  className="py-2 rounded-lg font-medium transition-colors text-sm"
                  style={{ 
                    backgroundColor: colors.surface,
                    color: colors.text,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  📈 Analyser
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
              👨‍🌾 Relation Client
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Entretenez de bonnes relations avec vos éleveurs pour développer votre business
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerContactsPage;