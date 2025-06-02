import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const FeedOrdersPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('toutes');

  useEffect(() => {
    // Simulation données commandes d'aliments reçues
    const mockCommandes = [
      {
        id: 'ALI001',
        date: '2025-01-18',
        eleveur: 'Mamadou Keita',
        ferme: 'Ferme Sahel',
        localisation: 'Sikasso',
        telephone: '+223 76 12 34 56',
        statut: 'confirmee',
        dateLivraison: '2025-01-20',
        urgence: false,
        produits: [
          { nom: 'Maïs concassé premium', quantite: 50, prixUnitaire: 350, total: 17500 },
          { nom: 'Tourteau de soja', quantite: 20, prixUnitaire: 450, total: 9000 }
        ],
        montantTotal: 26500,
        modePaiement: 'Orange Money',
        avance: 10000,
        reste: 16500,
        commentaire: 'Livraison urgente pour démarrage élevage',
        transportSuggere: 'Mali Express',
        coutTransport: 3000,
        preparationStatus: 'en_cours',
        evaluationFournisseur: null
      },
      {
        id: 'ALI002',
        date: '2025-01-17',
        eleveur: 'Fatoumata Diarra',
        ferme: 'Élevage Baobab',
        localisation: 'Ségou',
        telephone: '+223 65 43 21 98',
        statut: 'livree',
        dateLivraison: '2025-01-18',
        urgence: false,
        produits: [
          { nom: 'Concentré ponte spécial', quantite: 30, prixUnitaire: 520, total: 15600 },
          { nom: 'Prémix vitamines A-Z', quantite: 5, prixUnitaire: 1200, total: 6000 }
        ],
        montantTotal: 21600,
        modePaiement: 'Mobile Money',
        avance: 21600,
        reste: 0,
        commentaire: 'Améliorer la ponte de mes poules locales',
        transportSuggere: 'Livraison directe',
        coutTransport: 2500,
        preparationStatus: 'livree',
        evaluationFournisseur: 5,
        commentaireClient: 'Excellent service, produits de qualité'
      },
      {
        id: 'ALI003',
        date: '2025-01-16',
        eleveur: 'Ibrahim Coulibaly',
        ferme: 'Ranch Moderne',
        localisation: 'Bamako',
        telephone: '+223 78 87 65 43',
        statut: 'en_preparation',
        dateLivraison: '2025-01-19',
        urgence: true,
        produits: [
          { nom: 'Farine de poisson', quantite: 25, prixUnitaire: 750, total: 18750 },
          { nom: 'Son de blé', quantite: 100, prixUnitaire: 280, total: 28000 }
        ],
        montantTotal: 46750,
        modePaiement: 'Virement bancaire',
        avance: 20000,
        reste: 26750,
        commentaire: 'Commande urgente pour mes 500 poulets bio',
        transportSuggere: 'Transport Express',
        coutTransport: 5000,
        preparationStatus: 'en_cours',
        evaluationFournisseur: null
      },
      {
        id: 'ALI004',
        date: '2025-01-15',
        eleveur: 'Aminata Touré',
        ferme: 'Volailles du Fleuve',
        localisation: 'Mopti',
        telephone: '+223 69 78 45 12',
        statut: 'nouvelle',
        dateLivraison: '2025-01-22',
        urgence: false,
        produits: [
          { nom: 'Maïs concassé premium', quantite: 40, prixUnitaire: 350, total: 14000 }
        ],
        montantTotal: 14000,
        modePaiement: 'Espèces à la livraison',
        avance: 0,
        reste: 14000,
        commentaire: 'Première commande, merci de bien emballer',
        transportSuggere: 'Transport Mali',
        coutTransport: 4000,
        preparationStatus: 'attente',
        evaluationFournisseur: null
      },
      {
        id: 'ALI005',
        date: '2025-01-14',
        eleveur: 'Sekou Traoré',
        ferme: 'Aviculture Moderne Kayes',
        localisation: 'Kayes',
        telephone: '+223 72 85 96 30',
        statut: 'probleme',
        dateLivraison: '2025-01-16',
        urgence: false,
        produits: [
          { nom: 'Concentré ponte spécial', quantite: 15, prixUnitaire: 520, total: 7800 },
          { nom: 'Son de blé', quantite: 50, prixUnitaire: 280, total: 14000 }
        ],
        montantTotal: 21800,
        modePaiement: 'Orange Money',
        avance: 10000,
        reste: 11800,
        commentaire: 'Produit non conforme, demande remboursement partiel',
        transportSuggere: 'Livraison directe',
        coutTransport: 3500,
        preparationStatus: 'litige',
        evaluationFournisseur: 2,
        commentaireClient: 'Son de blé moisi, problème de stockage'
      }
    ];

    setTimeout(() => {
      setCommandes(mockCommandes);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCommandes = commandes.filter(commande => {
    if (filter === 'toutes') return true;
    if (filter === 'urgentes') return commande.urgence;
    if (filter === 'impayees') return commande.reste > 0;
    return commande.statut === filter;
  });

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'nouvelle': return colors.info;
      case 'confirmee': return colors.primary;
      case 'en_preparation': return colors.warning;
      case 'livree': return colors.success;
      case 'probleme': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'nouvelle': return 'Nouvelle';
      case 'confirmee': return 'Confirmée';
      case 'en_preparation': return 'En préparation';
      case 'livree': return 'Livrée';
      case 'probleme': return 'Problème';
      default: return statut;
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'nouvelle': return '🆕';
      case 'confirmee': return '✅';
      case 'en_preparation': return '📦';
      case 'livree': return '🚚';
      case 'probleme': return '⚠️';
      default: return '📋';
    }
  };

  const handleTraiterCommande = (commande) => {
    if (commande.statut === 'nouvelle') {
      alert(
        `📋 Traiter Commande ${commande.id}\n\n` +
        `👨‍🌾 Client : ${commande.eleveur}\n` +
        `📍 Livraison : ${commande.localisation}\n` +
        `💰 Montant : ${commande.montantTotal.toLocaleString()} FCFA\n` +
        `📅 Date souhaitée : ${commande.dateLivraison}\n\n` +
        `🔄 Actions possibles :\n` +
        `• Confirmer la commande\n` +
        `• Modifier les prix\n` +
        `• Négocier les délais\n` +
        `• Refuser si rupture stock`
      );
    } else if (commande.statut === 'confirmee' || commande.statut === 'en_preparation') {
      alert(
        `📦 Préparer Commande ${commande.id}\n\n` +
        `🎯 Produits à préparer :\n` +
        commande.produits.map(p => `• ${p.nom} : ${p.quantite} kg`).join('\n') +
        `\n\n🚚 Transport : ${commande.transportSuggere}\n` +
        `💰 Coût transport : ${commande.coutTransport} FCFA\n\n` +
        `✅ Marquer comme "Prêt pour livraison" quand terminé`
      );
    } else {
      alert(`ℹ️ Commande déjà ${getStatutText(commande.statut).toLowerCase()}`);
    }
  };

  const handleContacterClient = (commande) => {
    alert(
      `📞 Contacter ${commande.eleveur}\n\n` +
      `🏡 Ferme : ${commande.ferme}\n` +
      `📍 Localisation : ${commande.localisation}\n` +
      `📱 Téléphone : ${commande.telephone}\n` +
      `📋 Commande : ${commande.id}\n` +
      `💰 Montant : ${commande.montantTotal.toLocaleString()} FCFA\n` +
      `💳 Reste à payer : ${commande.reste.toLocaleString()} FCFA\n\n` +
      `💬 Message suggéré :\n` +
      `"Bonjour ${commande.eleveur}, concernant votre commande ${commande.id} d'aliments..."`
    );
  };

  const handleGererPaiement = (commande) => {
    alert(
      `💰 Gestion Paiement - ${commande.id}\n\n` +
      `💳 Montant total : ${commande.montantTotal.toLocaleString()} FCFA\n` +
      `✅ Avance reçue : ${commande.avance.toLocaleString()} FCFA\n` +
      `⏳ Reste à payer : ${commande.reste.toLocaleString()} FCFA\n` +
      `💳 Mode : ${commande.modePaiement}\n\n` +
      `🔄 Actions :\n` +
      `• Confirmer réception avance\n` +
      `• Demander solde avant livraison\n` +
      `• Envoyer rappel de paiement\n` +
      `• Modifier mode de paiement`
    );
  };

  const handleSuivreTransport = (commande) => {
    if (commande.statut !== 'en_preparation' && commande.statut !== 'livree') {
      alert('🚚 Transport non encore organisé pour cette commande');
      return;
    }

    alert(
      `🚚 Suivi Transport - ${commande.id}\n\n` +
      `📦 Produits : ${commande.produits.length} articles\n` +
      `📍 Destination : ${commande.localisation}\n` +
      `🚛 Transporteur : ${commande.transportSuggere}\n` +
      `💰 Coût : ${commande.coutTransport.toLocaleString()} FCFA\n` +
      `📅 Livraison prévue : ${commande.dateLivraison}\n\n` +
      `📞 Contact transporteur :\n+223 XX XX XX XX\n\n` +
      `📋 Statut : ${commande.statut === 'livree' ? 'Livré ✅' : 'En transit 🚛'}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p style={{ color: colors.text }}>Chargement des commandes...</p>
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
              📋 Commandes Aliments
            </h1>
            <div></div>
          </div>
        </div>

        {/* Résumé commandes */}
        <div className="px-4 pb-2">
          <div className="max-w-md mx-auto">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: colors.card }}
            >
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <p className="font-bold text-lg" style={{ color: colors.info }}>
                    {filteredCommandes.filter(c => c.statut === 'nouvelle').length}
                  </p>
                  <p style={{ color: colors.textSecondary }}>Nouvelles</p>
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: colors.warning }}>
                    {filteredCommandes.filter(c => c.statut === 'en_preparation').length}
                  </p>
                  <p style={{ color: colors.textSecondary }}>En cours</p>
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: colors.error }}>
                    {filteredCommandes.filter(c => c.urgence).length}
                  </p>
                  <p style={{ color: colors.textSecondary }}>Urgentes</p>
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: colors.primary }}>
                    {filteredCommandes.reduce((sum, c) => sum + c.reste, 0).toLocaleString()}
                  </p>
                  <p style={{ color: colors.textSecondary }}>FCFA à recevoir</p>
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
                { key: 'toutes', label: 'Toutes', icon: '📋' },
                { key: 'nouvelle', label: 'Nouvelles', icon: '🆕' },
                { key: 'en_preparation', label: 'En cours', icon: '📦' },
                { key: 'urgentes', label: 'Urgentes', icon: '🚨' },
                { key: 'impayees', label: 'Impayées', icon: '💰' },
                { key: 'livree', label: 'Livrées', icon: '✅' }
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

      {/* Liste des commandes */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-4">
          {filteredCommandes.map(commande => (
            <div
              key={commande.id}
              className="p-4 rounded-xl shadow-lg border"
              style={{
                backgroundColor: colors.card,
                borderColor: commande.urgence ? colors.error : colors.border,
                borderWidth: commande.urgence ? '2px' : '1px'
              }}
            >
              {/* En-tête */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{getStatutIcon(commande.statut)}</span>
                    <h3 className="font-bold text-base" style={{ color: colors.text }}>
                      {commande.id}
                    </h3>
                    {commande.urgence && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-red-500">
                        🚨 URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium" style={{ color: colors.primary }}>
                    {commande.eleveur} • {commande.ferme}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    📍 {commande.localisation} • {commande.date}
                  </p>
                </div>
                <div className="text-right">
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getStatutColor(commande.statut) }}
                  >
                    {getStatutText(commande.statut)}
                  </span>
                  <p className="text-sm font-bold mt-1" style={{ color: colors.text }}>
                    {commande.montantTotal.toLocaleString()} FCFA
                  </p>
                </div>
              </div>

              {/* Produits */}
              <div className="mb-3">
                <p className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                  🌾 Produits commandés :
                </p>
                <div className="space-y-1">
                  {commande.produits.map((produit, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span style={{ color: colors.textSecondary }}>
                        • {produit.nom} x{produit.quantite}
                      </span>
                      <span className="font-medium" style={{ color: colors.text }}>
                        {produit.total.toLocaleString()} FCFA
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paiement */}
              <div className="mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.surface }}
                >
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span style={{ color: colors.textSecondary }}>Avance reçue :</span>
                      <p className="font-medium" style={{ color: colors.success }}>
                        {commande.avance.toLocaleString()} FCFA
                      </p>
                    </div>
                    <div>
                      <span style={{ color: colors.textSecondary }}>Reste à payer :</span>
                      <p className="font-medium" style={{ color: commande.reste > 0 ? colors.warning : colors.success }}>
                        {commande.reste.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    💳 {commande.modePaiement} • 📅 Livraison : {commande.dateLivraison}
                  </p>
                </div>
              </div>

              {/* Commentaire client */}
              {commande.commentaire && (
                <div className="mb-3">
                  <p className="text-xs" style={{ color: colors.textMuted }}>
                    💬 <span className="font-medium">Note :</span> {commande.commentaire}
                  </p>
                </div>
              )}

              {/* Évaluation */}
              {commande.evaluationFournisseur && (
                <div className="mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm" style={{ color: colors.text }}>Évaluation client :</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < commande.evaluationFournisseur ? 'text-yellow-500' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  {commande.commentaireClient && (
                    <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                      "{commande.commentaireClient}"
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTraiterCommande(commande)}
                  className="py-2 rounded-lg font-medium text-white transition-colors text-sm"
                  style={{ backgroundColor: colors.primary }}
                >
                  {commande.statut === 'nouvelle' ? '✅ Traiter' : '📦 Préparer'}
                </button>
                <button
                  onClick={() => handleContacterClient(commande)}
                  className="py-2 rounded-lg font-medium transition-colors text-sm"
                  style={{ 
                    backgroundColor: colors.info,
                    color: 'white'
                  }}
                >
                  📞 Contacter
                </button>
                <button
                  onClick={() => handleGererPaiement(commande)}
                  className="py-2 rounded-lg font-medium transition-colors text-sm"
                  style={{ 
                    backgroundColor: colors.warning,
                    color: 'white'
                  }}
                >
                  💰 Paiement
                </button>
                <button
                  onClick={() => handleSuivreTransport(commande)}
                  className="py-2 rounded-lg font-medium transition-colors text-sm"
                  style={{ 
                    backgroundColor: colors.surface,
                    color: colors.text,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  🚚 Transport
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
              📋 Gestion Commandes
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Traitez rapidement les commandes pour fidéliser vos clients éleveurs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedOrdersPage;