import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const FeedOrdersPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('nouvelles');

  // Simulation commandes reçues
  const orders = {
    nouvelles: [
      {
        id: '1',
        client: 'Amadou Traoré',
        telephone: '+223 76 12 34 56',
        produit: 'Maïs Concassé',
        quantite: 50,
        unite: 'kg',
        prix_unitaire: 280,
        prix_total: 14000,
        date: '2024-01-15',
        heure: '14:30',
        statut: 'nouveau',
        icon: '🌽',
        localisation: 'Bamako, Commune III'
      },
      {
        id: '2',
        client: 'Fatoumata Diallo',
        telephone: '+223 65 43 21 87',
        produit: 'Poussins 1 jour',
        quantite: 25,
        unite: 'unités',
        prix_unitaire: 650,
        prix_total: 16250,
        date: '2024-01-15',
        heure: '11:45',
        statut: 'nouveau',
        icon: '🐤',
        localisation: 'Bamako, Commune IV'
      },
      {
        id: '3',
        client: 'Ibrahim Keita',
        telephone: '+223 78 87 65 43',
        produit: 'Concentré Ponte',
        quantite: 30,
        unite: 'kg',
        prix_unitaire: 380,
        prix_total: 11400,
        date: '2024-01-15',
        heure: '09:20',
        statut: 'nouveau',
        icon: '🥣',
        localisation: 'Kati'
      }
    ],
    en_cours: [
      {
        id: '4',
        client: 'Mariam Coulibaly',
        telephone: '+223 90 11 22 33',
        produit: 'Tourteau Soja',
        quantite: 40,
        unite: 'kg',
        prix_unitaire: 420,
        prix_total: 16800,
        date: '2024-01-14',
        heure: '16:00',
        statut: 'confirme',
        icon: '🫘',
        localisation: 'Bamako, Commune II'
      },
      {
        id: '5',
        client: 'Sekou Sanogo',
        telephone: '+223 76 98 76 54',
        produit: 'Œufs Fécondés',
        quantite: 20,
        unite: 'unités',
        prix_unitaire: 350,
        prix_total: 7000,
        date: '2024-01-14',
        heure: '13:15',
        statut: 'confirme',
        icon: '🥚',
        localisation: 'Koulikoro'
      }
    ],
    terminees: [
      {
        id: '6',
        client: 'Awa Traore',
        telephone: '+223 65 43 21 09',
        produit: 'Maïs Concassé',
        quantite: 100,
        unite: 'kg',
        prix_unitaire: 275,
        prix_total: 27500,
        date: '2024-01-13',
        heure: '10:30',
        statut: 'livree',
        icon: '🌽',
        localisation: 'Bamako, Commune V'
      },
      {
        id: '7',
        client: 'Moussa Dembele',
        telephone: '+223 78 12 34 56',
        produit: 'Prémix Vitamines',
        quantite: 15,
        unite: 'kg',
        prix_unitaire: 850,
        prix_total: 12750,
        date: '2024-01-12',
        heure: '14:45',
        statut: 'livree',
        icon: '💊',
        localisation: 'Sikasso'
      }
    ]
  };

  const handleConfirmOrder = (orderId) => {
    alert(
      `✅ Commande #${orderId} confirmée !\n\n` +
      `Actions suivantes :\n` +
      `• Préparer la commande\n` +
      `• Contacter le client pour la livraison\n` +
      `• Confirmer le paiement\n\n` +
      `La commande apparaîtra dans "En cours"`
    );
  };

  const handleRejectOrder = (orderId) => {
    alert(
      `❌ Commande #${orderId} refusée\n\n` +
      `Le client sera automatiquement notifié.\n` +
      `Raison commune : Stock insuffisant`
    );
  };

  const handleMessageClient = (client, telephone) => {
    alert(
      `💬 Contacter ${client}\n\n` +
      `📞 Téléphone : ${telephone}\n\n` +
      `Actions rapides :\n` +
      `• Appeler directement\n` +
      `• Envoyer WhatsApp\n` +
      `• Discussion via AviMarché`
    );
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'nouveau': return '#FF9800';
      case 'confirme': return '#2196F3';
      case 'livree': return '#4CAF50';
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'nouveau': return '🆕 Nouvelle';
      case 'confirme': return '✅ Confirmée';
      case 'livree': return '🚚 Livrée';
      default: return statut;
    }
  };

  const getTabStats = () => {
    return {
      nouvelles: orders.nouvelles.length,
      en_cours: orders.en_cours.length,
      terminees: orders.terminees.length
    };
  };

  const stats = getTabStats();
  const currentOrders = orders[activeTab] || [];

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
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Mes Commandes
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Gérez vos commandes facilement
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('nouvelles')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeTab === 'nouvelles' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeTab === 'nouvelles' ? colors.warning : colors.card,
                color: activeTab === 'nouvelles' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">🆕</div>
              <p className="text-sm">Nouvelles</p>
              {stats.nouvelles > 0 && (
                <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mt-1 mx-auto">
                  {stats.nouvelles}
                </div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('en_cours')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeTab === 'en_cours' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeTab === 'en_cours' ? colors.primary : colors.card,
                color: activeTab === 'en_cours' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">⏳</div>
              <p className="text-sm">En cours</p>
              {stats.en_cours > 0 && (
                <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mt-1 mx-auto">
                  {stats.en_cours}
                </div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('terminees')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeTab === 'terminees' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeTab === 'terminees' ? colors.success : colors.card,
                color: activeTab === 'terminees' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">✅</div>
              <p className="text-sm">Terminées</p>
              {stats.terminees > 0 && (
                <div className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center mt-1 mx-auto">
                  {stats.terminees}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Résumé */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div 
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.card }}
          >
            <h3 className="font-bold mb-3" style={{ color: colors.text }}>
              📊 Aujourd'hui
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.warning }}>
                  {stats.nouvelles}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Nouvelles</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                  {stats.en_cours}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>En cours</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.success }}>
                  {currentOrders.reduce((sum, order) => sum + order.prix_total, 0).toLocaleString()}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>CFA ({activeTab})</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            {activeTab === 'nouvelles' && '🆕 Nouvelles Commandes'}
            {activeTab === 'en_cours' && '⏳ Commandes en Cours'}
            {activeTab === 'terminees' && '✅ Commandes Terminées'}
          </h2>
          
          {currentOrders.length === 0 ? (
            <div 
              className="p-6 rounded-xl text-center"
              style={{ backgroundColor: colors.card }}
            >
              <div className="text-5xl mb-4">📭</div>
              <p className="font-bold" style={{ color: colors.text }}>
                Aucune commande
              </p>
              <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
                {activeTab === 'nouvelles' && 'Pas de nouvelles commandes pour le moment'}
                {activeTab === 'en_cours' && 'Aucune commande en cours'}
                {activeTab === 'terminees' && 'Aucune commande terminée aujourd\'hui'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentOrders.map(order => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl shadow-sm border-l-4"
                  style={{ 
                    backgroundColor: colors.card,
                    borderLeftColor: getStatusColor(order.statut)
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: getStatusColor(order.statut), color: 'white' }}
                    >
                      {order.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                          {order.client}
                        </h3>
                        <span 
                          className="text-xs font-bold px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: getStatusColor(order.statut),
                            color: 'white'
                          }}
                        >
                          {getStatusText(order.statut)}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="font-bold text-sm" style={{ color: colors.primary }}>
                          📦 {order.produit}
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {order.quantite} {order.unite} × {order.prix_unitaire}F = <span className="font-bold">{order.prix_total.toLocaleString()}F</span>
                        </p>
                        <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                          📍 {order.localisation} • 🕐 {order.date} {order.heure}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMessageClient(order.client, order.telephone)}
                          className="flex-1 p-2 rounded-lg text-sm font-bold"
                          style={{ backgroundColor: colors.primary, color: 'white' }}
                        >
                          💬 Message
                        </button>
                        
                        {order.statut === 'nouveau' && (
                          <>
                            <button
                              onClick={() => handleConfirmOrder(order.id)}
                              className="flex-1 p-2 rounded-lg text-sm font-bold text-white"
                              style={{ backgroundColor: colors.success }}
                            >
                              ✅ Accepter
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order.id)}
                              className="p-2 rounded-lg text-sm font-bold text-white"
                              style={{ backgroundColor: colors.error }}
                            >
                              ❌
                            </button>
                          </>
                        )}
                        
                        {order.statut === 'confirme' && (
                          <button
                            onClick={() => alert(`📞 Appeler ${order.client}\n${order.telephone}`)}
                            className="p-2 rounded-lg text-sm font-bold"
                            style={{ backgroundColor: colors.warning, color: 'white' }}
                          >
                            📞
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message d'aide */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e8f5e8' }}
          >
            <div className="text-4xl mb-2">💡</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              Conseil
            </p>
            <p className="text-xs text-green-700">
              Répondez rapidement aux nouvelles commandes pour fidéliser vos clients !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedOrdersPage;