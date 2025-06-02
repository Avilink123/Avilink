import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MyFeedProductsPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Simulation données stock aliments du fournisseur
    const mockProduits = [
      {
        id: '1',
        titre: 'Maïs concassé premium',
        type: 'cereales',
        stockTotal: 500,
        stockDisponible: 450,
        stockReserve: 50,
        prixUnitaire: 350,
        unite: 'kg',
        dateAjout: '2025-01-10',
        derniereVente: '2025-01-18',
        ventesTotales: 1250,
        ventesRecentes: 75,
        statut: 'disponible',
        composition: 'Maïs jaune 100%, protéines 8%',
        certification: 'Bio Mali',
        commandesEnCours: [
          { client: 'Mamadou K.', quantite: 25, date: '2025-01-19' },
          { client: 'Fatoumata D.', quantite: 15, date: '2025-01-20' }
        ],
        alerteStock: false,
        seuilAlerte: 100
      },
      {
        id: '2',
        titre: 'Tourteau de soja',
        type: 'proteines',
        stockTotal: 200,
        stockDisponible: 15,
        stockReserve: 25,
        prixUnitaire: 450,
        unite: 'kg',
        dateAjout: '2025-01-12',
        derniereVente: '2025-01-17',
        ventesTotales: 680,
        ventesRecentes: 40,
        statut: 'stock_bas',
        composition: 'Soja déshuilé, protéines 45%',
        certification: 'Certifié AAFCO',
        commandesEnCours: [
          { client: 'Ibrahim C.', quantite: 20, date: '2025-01-21' }
        ],
        alerteStock: true,
        seuilAlerte: 50
      },
      {
        id: '3',
        titre: 'Farine de poisson',
        type: 'proteines',
        stockTotal: 150,
        stockDisponible: 120,
        stockReserve: 30,
        prixUnitaire: 750,
        unite: 'kg',
        dateAjout: '2025-01-08',
        derniereVente: '2025-01-16',
        ventesTotales: 450,
        ventesRecentes: 30,
        statut: 'disponible',
        composition: 'Poisson 95%, protéines 60%',
        certification: 'Export Grade',
        commandesEnCours: [
          { client: 'Aminata T.', quantite: 15, date: '2025-01-20' },
          { client: 'Sekou T.', quantite: 10, date: '2025-01-22' }
        ],
        alerteStock: false,
        seuilAlerte: 30
      },
      {
        id: '4',
        titre: 'Concentré ponte spécial',
        type: 'complements',
        stockTotal: 300,
        stockDisponible: 280,
        stockReserve: 20,
        prixUnitaire: 520,
        unite: 'kg',
        dateAjout: '2025-01-15',
        derniereVente: '2025-01-18',
        ventesTotales: 340,
        ventesRecentes: 20,
        statut: 'disponible',
        composition: 'Vitamines, minéraux, calcium',
        certification: 'Vétérinaire approuvé',
        commandesEnCours: [
          { client: 'Mariam S.', quantite: 12, date: '2025-01-19' }
        ],
        alerteStock: false,
        seuilAlerte: 50
      },
      {
        id: '5',
        titre: 'Prémix vitamines A-Z',
        type: 'vitamines',
        stockTotal: 50,
        stockDisponible: 0,
        stockReserve: 8,
        prixUnitaire: 1200,
        unite: 'kg',
        dateAjout: '2025-01-05',
        derniereVente: '2025-01-17',
        ventesTotales: 120,
        ventesRecentes: 15,
        statut: 'rupture',
        composition: 'Vitamines A,D,E,K,B complexe',
        certification: 'Pharmaceutique',
        commandesEnCours: [
          { client: 'Boubacar K.', quantite: 5, date: '2025-01-25' }
        ],
        alerteStock: true,
        seuilAlerte: 10
      },
      {
        id: '6',
        titre: 'Son de blé',
        type: 'fibres',
        stockTotal: 800,
        stockDisponible: 720,
        stockReserve: 80,
        prixUnitaire: 280,
        unite: 'kg',
        dateAjout: '2025-01-01',
        derniereVente: '2025-01-18',
        ventesTotales: 2100,
        ventesRecentes: 150,
        statut: 'disponible',
        composition: 'Son de blé 100%, fibres 12%',
        certification: 'Local Mali',
        commandesEnCours: [
          { client: 'Moussa S.', quantite: 30, date: '2025-01-20' },
          { client: 'Djénéba K.', quantite: 25, date: '2025-01-21' }
        ],
        alerteStock: false,
        seuilAlerte: 200
      }
    ];

    setTimeout(() => {
      setProduits(mockProduits);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProduits = produits.filter(produit => {
    if (filter === 'tous') return true;
    if (filter === 'alerte') return produit.alerteStock;
    if (filter === 'rupture') return produit.statut === 'rupture';
    if (filter === 'disponible') return produit.statut === 'disponible';
    return produit.type === filter;
  });

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'disponible': return colors.success;
      case 'stock_bas': return colors.warning;
      case 'rupture': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'disponible': return 'Disponible';
      case 'stock_bas': return 'Stock bas';
      case 'rupture': return 'Rupture';
      default: return statut;
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'disponible': return '✅';
      case 'stock_bas': return '⚠️';
      case 'rupture': return '❌';
      default: return '📦';
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      cereales: '🌾',
      proteines: '🐟',
      complements: '💊',
      fibres: '🌾',
      vitamines: '💉'
    };
    return icons[type] || '🌾';
  };

  const handleModifierStock = (produit) => {
    alert(
      `📦 Modifier Stock - ${produit.titre}\n\n` +
      `📊 Stock actuel :\n` +
      `• Total : ${produit.stockTotal} ${produit.unite}\n` +
      `• Disponible : ${produit.stockDisponible} ${produit.unite}\n` +
      `• Réservé : ${produit.stockReserve} ${produit.unite}\n\n` +
      `💰 Prix : ${produit.prixUnitaire} FCFA/${produit.unite}\n\n` +
      `🔄 Actions possibles :\n` +
      `• Ajouter du stock\n` +
      `• Modifier le prix\n` +
      `• Ajuster seuil d'alerte\n` +
      `• Mettre en pause les ventes`
    );
  };

  const handleVoirCommandes = (produit) => {
    if (produit.commandesEnCours.length === 0) {
      alert('📋 Aucune commande en cours pour ce produit');
      return;
    }

    const commandesText = produit.commandesEnCours
      .map(cmd => `• ${cmd.client} : ${cmd.quantite} ${produit.unite} (${cmd.date})`)
      .join('\n');

    alert(
      `📋 Commandes en cours - ${produit.titre}\n\n` +
      `${commandesText}\n\n` +
      `📦 Total réservé : ${produit.stockReserve} ${produit.unite}\n` +
      `🚚 Stock à préparer pour livraison`
    );
  };

  const handleAnalyserVentes = (produit) => {
    const tauxRotation = ((produit.ventesTotales / produit.stockTotal) * 100).toFixed(1);
    const joursStock = Math.round(produit.stockDisponible / (produit.ventesRecentes / 30));

    alert(
      `📈 Analyse Ventes - ${produit.titre}\n\n` +
      `📊 Performances :\n` +
      `• Ventes totales : ${produit.ventesTotales} ${produit.unite}\n` +
      `• Ventes récentes : ${produit.ventesRecentes} ${produit.unite} (30j)\n` +
      `• Taux rotation : ${tauxRotation}%\n` +
      `• Stock restant : ${joursStock} jours\n\n` +
      `💰 Revenus :\n` +
      `• Total : ${(produit.ventesTotales * produit.prixUnitaire).toLocaleString()} FCFA\n` +
      `• Récent : ${(produit.ventesRecentes * produit.prixUnitaire).toLocaleString()} FCFA\n\n` +
      `📅 Dernière vente : ${produit.derniereVente}`
    );
  };

  const handleAjouterProduit = () => {
    alert(
      `➕ Ajouter Nouveau Produit\n\n` +
      `📝 Informations requises :\n` +
      `• Nom du produit\n` +
      `• Type (céréales, protéines, etc.)\n` +
      `• Quantité en stock\n` +
      `• Prix par unité\n` +
      `• Composition\n` +
      `• Certifications\n\n` +
      `📋 Le produit sera ajouté à votre catalogue et visible par les éleveurs`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p style={{ color: colors.text }}>Chargement de votre stock...</p>
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
              📦 Mon Stock Aliments
            </h1>
            <button
              onClick={handleAjouterProduit}
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            >
              <span className="text-xl text-white">+</span>
            </button>
          </div>
        </div>

        {/* Résumé stock */}
        <div className="px-4 pb-2">
          <div className="max-w-md mx-auto">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: colors.card }}
            >
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <p className="font-bold text-lg" style={{ color: colors.success }}>
                    {filteredProduits.filter(p => p.statut === 'disponible').length}
                  </p>
                  <p style={{ color: colors.textSecondary }}>Disponibles</p>
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: colors.warning }}>
                    {filteredProduits.filter(p => p.alerteStock).length}
                  </p>
                  <p style={{ color: colors.textSecondary }}>Alertes</p>
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: colors.error }}>
                    {filteredProduits.filter(p => p.statut === 'rupture').length}
                  </p>
                  <p style={{ color: colors.textSecondary }}>Ruptures</p>
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: colors.primary }}>
                    {filteredProduits.reduce((sum, p) => sum + p.commandesEnCours.length, 0)}
                  </p>
                  <p style={{ color: colors.textSecondary }}>Commandes</p>
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
                { key: 'tous', label: 'Tous', icon: '📦' },
                { key: 'disponible', label: 'Disponibles', icon: '✅' },
                { key: 'alerte', label: 'Alertes', icon: '⚠️' },
                { key: 'rupture', label: 'Ruptures', icon: '❌' },
                { key: 'cereales', label: 'Céréales', icon: '🌾' },
                { key: 'proteines', label: 'Protéines', icon: '🐟' }
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

      {/* Liste des produits */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-4">
          {filteredProduits.map(produit => (
            <div
              key={produit.id}
              className="p-4 rounded-xl shadow-lg border"
              style={{
                backgroundColor: colors.card,
                borderColor: produit.alerteStock ? colors.warning : colors.border,
                borderWidth: produit.alerteStock ? '2px' : '1px'
              }}
            >
              {/* En-tête */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{getTypeIcon(produit.type)}</span>
                    <h3 className="font-bold text-base" style={{ color: colors.text }}>
                      {produit.titre}
                    </h3>
                    {produit.alerteStock && (
                      <span className="text-lg">⚠️</span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    {produit.composition}
                  </p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>
                    {produit.certification}
                  </p>
                </div>
                <div className="text-right">
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getStatutColor(produit.statut) }}
                  >
                    {getStatutIcon(produit.statut)} {getStatutText(produit.statut)}
                  </span>
                  <p className="text-sm font-bold mt-1" style={{ color: colors.primary }}>
                    {produit.prixUnitaire} FCFA/{produit.unite}
                  </p>
                </div>
              </div>

              {/* Stock */}
              <div className="mb-3">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <p className="font-bold" style={{ color: colors.success }}>
                      {produit.stockDisponible}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>Disponible</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold" style={{ color: colors.warning }}>
                      {produit.stockReserve}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>Réservé</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold" style={{ color: colors.text }}>
                      {produit.stockTotal}
                    </p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>Total</p>
                  </div>
                </div>

                {/* Barre de progression stock */}
                <div className="mt-2">
                  <div 
                    className="w-full bg-gray-200 rounded-full h-2"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(produit.stockDisponible / produit.stockTotal) * 100}%`,
                        backgroundColor: getStatutColor(produit.statut)
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Commandes en cours */}
              {produit.commandesEnCours.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                    📋 Commandes en cours : {produit.commandesEnCours.length}
                  </p>
                  <div className="space-y-1">
                    {produit.commandesEnCours.slice(0, 2).map((commande, index) => (
                      <p key={index} className="text-xs" style={{ color: colors.textSecondary }}>
                        • {commande.client} : {commande.quantite} {produit.unite} ({commande.date})
                      </p>
                    ))}
                    {produit.commandesEnCours.length > 2 && (
                      <p className="text-xs" style={{ color: colors.textMuted }}>
                        ... et {produit.commandesEnCours.length - 2} autres
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Ventes récentes */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: colors.textSecondary }}>Ventes récentes :</span>
                  <span className="font-medium" style={{ color: colors.text }}>
                    {produit.ventesRecentes} {produit.unite}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: colors.textSecondary }}>Revenus générés :</span>
                  <span className="font-medium" style={{ color: colors.success }}>
                    {(produit.ventesRecentes * produit.prixUnitaire).toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleModifierStock(produit)}
                  className="flex-1 py-2 rounded-lg font-medium text-white transition-colors text-sm"
                  style={{ backgroundColor: colors.primary }}
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleVoirCommandes(produit)}
                  className="px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                  style={{ 
                    backgroundColor: colors.info,
                    color: 'white'
                  }}
                >
                  📋
                </button>
                <button
                  onClick={() => handleAnalyserVentes(produit)}
                  className="px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                  style={{ 
                    backgroundColor: colors.surface,
                    color: colors.text,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  📈
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
              📦 Gestion de Stock
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Surveillez vos stocks et anticipez les ruptures pour maximiser vos ventes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFeedProductsPage;