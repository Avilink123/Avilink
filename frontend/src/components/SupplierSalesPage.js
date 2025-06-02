import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SupplierSalesPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('mois');

  // Simulation données de ventes
  const salesData = {
    aujourd_hui: {
      ventes: 3,
      montant: 28500,
      clients: 3
    },
    cette_semaine: {
      ventes: 18,
      montant: 156000,
      clients: 12
    },
    ce_mois: {
      ventes: 67,
      montant: 650000,
      clients: 28
    }
  };

  const ventesRecentes = [
    {
      id: '1',
      date: '2024-01-15',
      heure: '14:30',
      client: 'Amadou Traoré',
      produit: 'Maïs Concassé',
      quantite: 50,
      unite: 'kg',
      prix_unitaire: 280,
      montant_total: 14000,
      statut: 'livree',
      localisation: 'Bamako, Commune III',
      icon: '🌽'
    },
    {
      id: '2',
      date: '2024-01-15',
      heure: '11:45',
      client: 'Fatoumata Diallo',
      produit: 'Poussins 1 jour',
      quantite: 25,
      unite: 'unités',
      prix_unitaire: 650,
      montant_total: 16250,
      statut: 'livree',
      localisation: 'Bamako, Commune IV',
      icon: '🐤'
    },
    {
      id: '3',
      date: '2024-01-14',
      heure: '16:20',
      client: 'Ibrahim Keita',
      produit: 'Concentré Ponte',
      quantite: 30,
      unite: 'kg',
      prix_unitaire: 380,
      montant_total: 11400,
      statut: 'livree',
      localisation: 'Kati',
      icon: '🥣'
    },
    {
      id: '4',
      date: '2024-01-14',
      heure: '13:15',
      client: 'Mariam Coulibaly',
      produit: 'Tourteau Soja',
      quantite: 40,
      unite: 'kg',
      prix_unitaire: 420,
      montant_total: 16800,
      statut: 'livree',
      localisation: 'Bamako, Commune II',
      icon: '🫘'
    },
    {
      id: '5',
      date: '2024-01-13',
      heure: '10:30',
      client: 'Sekou Sanogo',
      produit: 'Œufs Fécondés',
      quantite: 20,
      unite: 'unités',
      prix_unitaire: 350,
      montant_total: 7000,
      statut: 'livree',
      localisation: 'Koulikoro',
      icon: '🥚'
    },
    {
      id: '6',
      date: '2024-01-12',
      heure: '15:45',
      client: 'Awa Traore',
      produit: 'Son de Blé',
      quantite: 60,
      unite: 'kg',
      prix_unitaire: 195,
      montant_total: 11700,
      statut: 'livree',
      localisation: 'Bamako, Commune V',
      icon: '🌾'
    },
    {
      id: '7',
      date: '2024-01-11',
      heure: '09:00',
      client: 'Moussa Dembele',
      produit: 'Prémix Vitamines',
      quantite: 15,
      unite: 'kg',
      prix_unitaire: 820,
      montant_total: 12300,
      statut: 'livree',
      localisation: 'Sikasso',
      icon: '💊'
    }
  ];

  // Ventes par produit
  const ventesProduits = [
    {
      produit: 'Maïs Concassé',
      icon: '🌽',
      color: '#FFB74D',
      quantite_vendue: 450,
      unite: 'kg',
      montant: 126000,
      ventes_count: 18,
      prix_moyen: 280
    },
    {
      produit: 'Tourteau Soja',
      icon: '🫘',
      color: '#8BC34A',
      quantite_vendue: 320,
      unite: 'kg',
      montant: 134400,
      ventes_count: 12,
      prix_moyen: 420
    },
    {
      produit: 'Poussins 1 jour',
      icon: '🐤',
      color: '#FFC107',
      quantite_vendue: 275,
      unite: 'unités',
      montant: 176000,
      ventes_count: 11,
      prix_moyen: 640
    },
    {
      produit: 'Concentré Ponte',
      icon: '🥣',
      color: '#AB47BC',
      quantite_vendue: 180,
      unite: 'kg',
      montant: 68400,
      ventes_count: 8,
      prix_moyen: 380
    },
    {
      produit: 'Œufs Fécondés',
      icon: '🥚',
      color: '#FF7043',
      quantite_vendue: 140,
      unite: 'unités',
      montant: 49000,
      ventes_count: 7,
      prix_moyen: 350
    },
    {
      produit: 'Prémix Vitamines',
      icon: '💊',
      color: '#E91E63',
      quantite_vendue: 85,
      unite: 'kg',
      montant: 69700,
      ventes_count: 6,
      prix_moyen: 820
    }
  ];

  const topClients = [
    {
      nom: 'Ibrahim Keita',
      commandes: 8,
      montant_total: 89000,
      derniere_commande: '2 jours',
      fidelite: 'excellent',
      localisation: 'Kati'
    },
    {
      nom: 'Amadou Traoré',
      commandes: 6,
      montant_total: 67500,
      derniere_commande: '1 jour',
      fidelite: 'bon',
      localisation: 'Bamako, Commune III'
    },
    {
      nom: 'Mariam Coulibaly',
      commandes: 5,
      montant_total: 52000,
      derniere_commande: '3 jours',
      fidelite: 'bon',
      localisation: 'Bamako, Commune II'
    },
    {
      nom: 'Fatoumata Diallo',
      commandes: 4,
      montant_total: 38500,
      derniere_commande: '1 jour',
      fidelite: 'nouveau',
      localisation: 'Bamako, Commune IV'
    }
  ];

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'jour': return salesData.aujourd_hui;
      case 'semaine': return salesData.cette_semaine;
      case 'mois': return salesData.ce_mois;
      default: return salesData.ce_mois;
    }
  };

  const currentData = getCurrentData();

  const getFideliteColor = (fidelite) => {
    switch (fidelite) {
      case 'excellent': return '#4CAF50';
      case 'bon': return '#FF9800';
      case 'nouveau': return '#2196F3';
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
          <div className="text-6xl mb-4">💰</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Mes Ventes
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Suivez vos performances commerciales
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeTab === 'overview' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeTab === 'overview' ? colors.primary : colors.card,
                color: activeTab === 'overview' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">📊</div>
              <p className="text-sm">Vue d'ensemble</p>
            </button>
            
            <button
              onClick={() => setActiveTab('produits')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeTab === 'produits' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeTab === 'produits' ? colors.warning : colors.card,
                color: activeTab === 'produits' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">📦</div>
              <p className="text-sm">Par produit</p>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeTab === 'clients' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeTab === 'clients' ? colors.success : colors.card,
                color: activeTab === 'clients' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">👨‍🌾</div>
              <p className="text-sm">Top clients</p>
            </button>
          </div>
        </div>
      </div>

      {/* Section Vue d'ensemble */}
      {activeTab === 'overview' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto space-y-4">
            {/* Sélecteur de période */}
            <div className="flex space-x-2">
              {['jour', 'semaine', 'mois'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`flex-1 p-2 rounded-xl text-sm font-bold transition-all ${
                    selectedPeriod === period ? 'scale-105' : ''
                  }`}
                  style={{ 
                    backgroundColor: selectedPeriod === period ? colors.primary : colors.card,
                    color: selectedPeriod === period ? 'white' : colors.text
                  }}
                >
                  {period === 'jour' && '📅 Aujourd\'hui'}
                  {period === 'semaine' && '📅 Cette semaine'}
                  {period === 'mois' && '📅 Ce mois'}
                </button>
              ))}
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-3 gap-3">
              <div 
                className="p-4 rounded-xl text-center"
                style={{ backgroundColor: colors.card }}
              >
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold" style={{ color: colors.success }}>
                  {Math.round(currentData.montant / 1000)}K
                </div>
                <p className="text-xs font-bold" style={{ color: colors.text }}>Chiffre d'affaires</p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>CFA</p>
              </div>

              <div 
                className="p-4 rounded-xl text-center"
                style={{ backgroundColor: colors.card }}
              >
                <div className="text-3xl mb-2">📦</div>
                <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                  {currentData.ventes}
                </div>
                <p className="text-xs font-bold" style={{ color: colors.text }}>Commandes</p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>livrées</p>
              </div>

              <div 
                className="p-4 rounded-xl text-center"
                style={{ backgroundColor: colors.card }}
              >
                <div className="text-3xl mb-2">👨‍🌾</div>
                <div className="text-2xl font-bold" style={{ color: colors.info }}>
                  {currentData.clients}
                </div>
                <p className="text-xs font-bold" style={{ color: colors.text }}>Clients</p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>différents</p>
              </div>
            </div>

            {/* Ventes récentes */}
            <div>
              <h3 className="text-lg font-bold mb-3 text-center" style={{ color: colors.text }}>
                🕐 Ventes Récentes
              </h3>
              
              <div className="space-y-3">
                {ventesRecentes.slice(0, 5).map(vente => (
                  <div
                    key={vente.id}
                    className="p-4 rounded-xl shadow-sm border-l-4"
                    style={{ 
                      backgroundColor: colors.card,
                      borderLeftColor: colors.success
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: colors.success, color: 'white' }}
                      >
                        {vente.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-sm" style={{ color: colors.text }}>
                            {vente.client}
                          </h4>
                          <span className="text-lg font-bold" style={{ color: colors.success }}>
                            {vente.montant_total.toLocaleString()}F
                          </span>
                        </div>
                        
                        <p className="text-sm mb-1" style={{ color: colors.primary }}>
                          📦 {vente.produit}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <p style={{ color: colors.textSecondary }}>
                            {vente.quantite} {vente.unite} × {vente.prix_unitaire}F
                          </p>
                          <p style={{ color: colors.textMuted }}>
                            📅 {vente.date} {vente.heure}
                          </p>
                        </div>
                        
                        <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                          📍 {vente.localisation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Par produit */}
      {activeTab === 'produits' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              📦 Ventes par Produit (Ce mois)
            </h2>
            
            <div className="space-y-4">
              {ventesProduits.map(produit => (
                <div
                  key={produit.produit}
                  className="p-4 rounded-xl shadow-sm border-l-4"
                  style={{ 
                    backgroundColor: colors.card,
                    borderLeftColor: produit.color
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: produit.color, color: 'white' }}
                    >
                      {produit.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2" style={{ color: colors.text }}>
                        {produit.produit}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                        <div>
                          <p className="font-bold" style={{ color: colors.success }}>
                            {produit.montant.toLocaleString()}F
                          </p>
                          <p style={{ color: colors.textSecondary }}>Chiffre d'affaires</p>
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: colors.primary }}>
                            {produit.quantite_vendue} {produit.unite}
                          </p>
                          <p style={{ color: colors.textSecondary }}>Quantité vendue</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="font-bold" style={{ color: colors.warning }}>
                            {produit.ventes_count} ventes
                          </p>
                          <p style={{ color: colors.textSecondary }}>Nombre de commandes</p>
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: colors.info }}>
                            {produit.prix_moyen}F/{produit.unite === 'kg' ? 'kg' : 'unité'}
                          </p>
                          <p style={{ color: colors.textSecondary }}>Prix moyen</p>
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

      {/* Section Top clients */}
      {activeTab === 'clients' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              👨‍🌾 Mes Meilleurs Clients
            </h2>
            
            <div className="space-y-4">
              {topClients.map((client, index) => (
                <div
                  key={client.nom}
                  className="p-4 rounded-xl shadow-sm border-l-4"
                  style={{ 
                    backgroundColor: colors.card,
                    borderLeftColor: getFideliteColor(client.fidelite)
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: getFideliteColor(client.fidelite), color: 'white' }}
                    >
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👨‍🌾'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                          {client.nom}
                        </h3>
                        <span 
                          className="text-xs font-bold px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: getFideliteColor(client.fidelite) }}
                        >
                          {client.fidelite.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                        <div>
                          <p className="font-bold" style={{ color: colors.success }}>
                            {client.montant_total.toLocaleString()}F
                          </p>
                          <p style={{ color: colors.textSecondary }}>Total achats</p>
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: colors.primary }}>
                            {client.commandes} commandes
                          </p>
                          <p style={{ color: colors.textSecondary }}>Fidélité</p>
                        </div>
                      </div>

                      <div className="text-xs">
                        <p style={{ color: colors.textMuted }}>
                          📍 {client.localisation} • 🕐 Dernière commande: il y a {client.derniere_commande}
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
            <div className="text-4xl mb-2">📈</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              Excellentes performances !
            </p>
            <p className="text-xs text-green-700">
              Continuez à offrir des produits de qualité pour fidéliser vos clients éleveurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierSalesPage;