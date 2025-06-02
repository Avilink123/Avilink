import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ReceivedOrdersPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('toutes');

  useEffect(() => {
    // Simulation données commandes reçues
    const mockCommandes = [
      {
        id: 'CMD001',
        date: '2025-01-18',
        eleveur: 'Mamadou Keita',
        ferme: 'Ferme Sahel',
        localisation: 'Sikasso',
        statut: 'livree',
        dateLivraison: '2025-01-18',
        produits: [
          { nom: 'Poulets de chair', quantite: 20, prixUnitaire: 2500, total: 50000 },
          { nom: 'Œufs frais', quantite: 30, prixUnitaire: 120, total: 3600 }
        ],
        montantTotal: 53600,
        modePaiement: 'Orange Money',
        evaluationClient: 5,
        commentaire: 'Excellent service, volailles en parfait état',
        stockActuel: {
          'Poulets de chair': { quantite: 18, vendu: 2, pertes: 0 },
          'Œufs frais': { quantite: 25, vendu: 5, pertes: 0 }
        },
        transporteur: 'Livraison directe éleveur',
        telephone: '+223 76 12 34 56'
      },
      {
        id: 'CMD002',
        date: '2025-01-15',
        eleveur: 'Ibrahim Coulibaly',
        ferme: 'Ranch Moderne',
        localisation: 'Bamako',
        statut: 'livree',
        dateLivraison: '2025-01-16',
        produits: [
          { nom: 'Poulets bio', quantite: 25, prixUnitaire: 3200, total: 80000 }
        ],
        montantTotal: 80000,
        modePaiement: 'Mobile Money',
        evaluationClient: 5,
        commentaire: 'Qualité premium, certification bio respectée',
        stockActuel: {
          'Poulets bio': { quantite: 20, vendu: 5, pertes: 0 }
        },
        transporteur: 'Transport Sahel Express',
        telephone: '+223 78 87 65 43'
      },
      {
        id: 'CMD003',
        date: '2025-01-12',
        eleveur: 'Fatoumata Diarra',
        ferme: 'Élevage Baobab',
        localisation: 'Ségou',
        statut: 'en_transit',
        dateLivraison: '2025-01-20',
        produits: [
          { nom: 'Pintades', quantite: 15, prixUnitaire: 2800, total: 42000 },
          { nom: 'Canards', quantite: 10, prixUnitaire: 3000, total: 30000 }
        ],
        montantTotal: 72000,
        modePaiement: 'Espèces à la livraison',
        evaluationClient: null,
        commentaire: null,
        stockActuel: {},
        transporteur: 'Mali Transport',
        telephone: '+223 65 43 21 98'
      },
      {
        id: 'CMD004',
        date: '2025-01-10',
        eleveur: 'Aminata Touré',
        ferme: 'Volailles du Fleuve',
        localisation: 'Mopti',
        statut: 'livree',
        dateLivraison: '2025-01-13',
        produits: [
          { nom: 'Poulets fermiers', quantite: 12, prixUnitaire: 2200, total: 26400 },
          { nom: 'Œufs bio', quantite: 24, prixUnitaire: 150, total: 3600 }
        ],
        montantTotal: 30000,
        modePaiement: 'Virement bancaire',
        evaluationClient: 4,
        commentaire: 'Bonne qualité, léger retard de livraison',
        stockActuel: {
          'Poulets fermiers': { quantite: 8, vendu: 4, pertes: 0 },
          'Œufs bio': { quantite: 20, vendu: 4, pertes: 0 }
        },
        transporteur: 'Livraison directe éleveur',
        telephone: '+223 69 78 45 12'
      },
      {
        id: 'CMD005',
        date: '2025-01-08',
        eleveur: 'Sekou Traoré',
        ferme: 'Aviculture Moderne',
        localisation: 'Kayes',
        statut: 'probleme',
        dateLivraison: '2025-01-09',
        produits: [
          { nom: 'Coqs locaux', quantite: 8, prixUnitaire: 4000, total: 32000 }
        ],
        montantTotal: 32000,
        modePaiement: 'Orange Money',
        evaluationClient: 2,
        commentaire: 'Deux coqs malades à l\'arrivée, remboursement partiel demandé',
        stockActuel: {
          'Coqs locaux': { quantite: 6, vendu: 0, pertes: 2 }
        },
        transporteur: 'Transport Express Mali',
        telephone: '+223 72 85 96 30'
      }
    ];

    setTimeout(() => {
      setCommandes(mockCommandes);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCommandes = commandes.filter(commande => {
    if (filter === 'toutes') return true;
    return commande.statut === filter;
  });

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'livree': return colors.success;
      case 'en_transit': return colors.warning;
      case 'probleme': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'livree': return 'Livrée';
      case 'en_transit': return 'En transit';
      case 'probleme': return 'Problème';
      default: return statut;
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'livree': return '✅';
      case 'en_transit': return '🚛';
      case 'probleme': return '⚠️';
      default: return '📦';
    }
  };

  const handleVoirStock = (commande) => {
    if (Object.keys(commande.stockActuel).length === 0) {
      alert('📦 Stock non encore reçu\n\nCette commande est encore en transit.');
      return;
    }

    const stockInfo = Object.entries(commande.stockActuel)
      .map(([produit, stock]) => 
        `• ${produit}:\n  Reçu: ${stock.quantite + stock.vendu + stock.pertes}\n  En stock: ${stock.quantite}\n  Vendu: ${stock.vendu}\n  Pertes: ${stock.pertes}`
      ).join('\n\n');

    alert(
      `📦 État du Stock - Commande ${commande.id}\n\n` +
      `📅 Livrée le : ${commande.dateLivraison}\n` +
      `👨‍🌾 Éleveur : ${commande.eleveur}\n\n` +
      `📊 Détail du stock :\n\n${stockInfo}\n\n` +
      `💡 Conseil : Surveillez les pertes et optimisez vos ventes`
    );
  };

  const handleContacterEleveur = (commande) => {
    // Rediriger directement vers la messagerie avec l'éleveur
    alert(
      `💬 Ouvrir conversation avec ${commande.eleveur}\n\n` +
      `🏡 Ferme : ${commande.ferme}\n` +
      `📱 Téléphone : ${commande.telephone}\n` +
      `📅 Commande : ${commande.id}\n\n` +
      `Vous allez être redirigé vers la messagerie pour discuter avec cet éleveur.`
    );
    onNavigate('messages');
  };

  const handleEvaluer = (commande) => {
    if (commande.evaluationClient) {
      alert(
        `⭐ Évaluation déjà donnée\n\n` +
        `Note : ${commande.evaluationClient}/5\n` +
        `Commentaire : "${commande.commentaire}"`
      );
    } else {
      alert(
        `⭐ Évaluer la commande ${commande.id}\n\n` +
        `Donnez votre avis sur :\n` +
        `• Qualité des produits\n` +
        `• Respect des délais\n` +
        `• Service client\n\n` +
        `Votre évaluation aide à améliorer le service !`
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p style={{ color: colors.text }}>Chargement de vos commandes...</p>
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
              📦 Stock Reçu
            </h1>
            <div></div>
          </div>
        </div>

        {/* Filtres */}
        <div className="px-4 pb-4">
          <div className="max-w-md mx-auto">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'toutes', label: 'Toutes', icon: '📦' },
                { key: 'livree', label: 'Livrées', icon: '✅' },
                { key: 'en_transit', label: 'En transit', icon: '🚛' },
                { key: 'probleme', label: 'Problèmes', icon: '⚠️' }
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
                borderColor: colors.border
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
                  🐔 Produits commandés :
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

              {/* Informations livraison */}
              <div className="mb-3">
                {commande.statut === 'en_transit' && (
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      🚛 <span className="font-medium">Livraison prévue :</span> {commande.dateLivraison}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      🚚 <span className="font-medium">Transporteur :</span> {commande.transporteur}
                    </p>
                  </div>
                )}

                {commande.statut === 'livree' && (
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      ✅ <span className="font-medium">Livrée le :</span> {commande.dateLivraison}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      💳 <span className="font-medium">Paiement :</span> {commande.modePaiement}
                    </p>
                  </div>
                )}

                {commande.statut === 'probleme' && (
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: '#ffebee' }}
                  >
                    <p className="text-xs text-red-700">
                      ⚠️ <span className="font-medium">Problème :</span> {commande.commentaire}
                    </p>
                  </div>
                )}
              </div>

              {/* Évaluation */}
              {commande.evaluationClient && (
                <div className="mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm" style={{ color: colors.text }}>Votre évaluation :</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < commande.evaluationClient ? 'text-yellow-500' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  {commande.commentaire && (
                    <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                      "{commande.commentaire}"
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                {commande.statut === 'livree' && (
                  <button
                    onClick={() => handleVoirStock(commande)}
                    className="flex-1 py-2 rounded-lg font-medium text-white transition-colors text-sm"
                    style={{ backgroundColor: colors.success }}
                  >
                    📦 Voir Stock
                  </button>
                )}

                <button
                  onClick={() => handleContacterEleveur(commande)}
                  className="flex-1 py-2 rounded-lg font-medium transition-colors text-sm"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: 'white'
                  }}
                >
                  📞 Contacter
                </button>

                {commande.statut === 'livree' && (
                  <button
                    onClick={() => handleEvaluer(commande)}
                    className="px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                    style={{ 
                      backgroundColor: colors.surface,
                      color: colors.text,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    ⭐
                  </button>
                )}
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
              📦 Gestion de Stock
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Suivez vos commandes et gérez votre stock pour optimiser vos ventes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivedOrdersPage;