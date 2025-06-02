import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BuyerOrdersPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('en_cours');

  // Simulation commandes d'achats (volailles + œufs uniquement)
  const orders = {
    en_cours: [
      {
        id: '1',
        eleveur: 'Amadou Traoré',
        telephone: '+223 76 12 34 56',
        type_produit: 'volaille',
        produit: 'Poules pondeuses',
        quantite: 15,
        prix_unitaire: 3500,
        prix_total: 52500,
        date_commande: '2024-01-15',
        heure: '14:30',
        statut: 'confirmee',
        localisation: 'Bamako, Commune III',
        livraison_prevue: '2024-01-16',
        icon: '🐔',
        age: '5 mois',
        race: 'Locale'
      },
      {
        id: '2',
        eleveur: 'Ibrahim Keita',
        telephone: '+223 78 87 65 43',
        type_produit: 'volaille',
        produit: 'Poulets de chair',
        quantite: 20,
        prix_unitaire: 2800,
        prix_total: 56000,
        date_commande: '2024-01-14',
        heure: '15:15',
        statut: 'en_preparation',
        localisation: 'Kati',
        livraison_prevue: '2024-01-17',
        icon: '🐓',
        age: '2 mois',
        race: 'Améliorée'
      },
      {
        id: '3',
        eleveur: 'Mariam Coulibaly',
        telephone: '+223 90 11 22 33',
        type_produit: 'oeuf',
        produit: 'Œufs de consommation',
        quantite: 120,
        prix_unitaire: 140,
        prix_total: 16800,
        date_commande: '2024-01-14',
        heure: '09:30',
        statut: 'confirmee',
        localisation: 'Bamako, Commune II',
        livraison_prevue: '2024-01-15',
        icon: '🥚',
        fraicheur: 'Moins de 12h',
        source: 'Poules améliorées'
      }
    ],
    livrees: [
      {
        id: '4',
        eleveur: 'Fatoumata Diallo',
        telephone: '+223 65 43 21 87',
        type_produit: 'volaille',
        produit: 'Pintades',
        quantite: 8,
        prix_unitaire: 4200,
        prix_total: 33600,
        date_commande: '2024-01-13',
        heure: '11:30',
        statut: 'livree',
        localisation: 'Bamako, Commune IV',
        date_livraison: '2024-01-13',
        icon: '🦃',
        age: '3 mois',
        race: 'Locale',
        note_satisfaction: 5
      },
      {
        id: '5',
        eleveur: 'Sekou Sanogo',
        telephone: '+223 76 98 76 54',
        type_produit: 'oeuf',
        produit: 'Œufs fécondés',
        quantite: 24,
        prix_unitaire: 450,
        prix_total: 10800,
        date_commande: '2024-01-12',
        heure: '16:00',
        statut: 'livree',
        localisation: 'Koulikoro',
        date_livraison: '2024-01-12',
        icon: '🥚',
        fraicheur: 'Moins de 24h',
        source: 'Race Sussex',
        note_satisfaction: 4
      },
      {
        id: '6',
        eleveur: 'Awa Traore',
        telephone: '+223 65 43 21 09',
        type_produit: 'oeuf',
        produit: 'Œufs de consommation',
        quantite: 80,
        prix_unitaire: 115,
        prix_total: 9200,
        date_commande: '2024-01-11',
        heure: '08:45',
        statut: 'livree',
        localisation: 'Bamako, Commune V',
        date_livraison: '2024-01-11',
        icon: '🥚',
        fraicheur: 'Moins de 18h',
        source: 'Élevage familial',
        note_satisfaction: 5
      }
    ],
    annulees: [
      {
        id: '7',
        eleveur: 'Moussa Dembele',
        telephone: '+223 78 12 34 56',
        type_produit: 'volaille',
        produit: 'Coqs reproducteurs',
        quantite: 3,
        prix_unitaire: 5500,
        prix_total: 16500,
        date_commande: '2024-01-10',
        heure: '10:20',
        statut: 'annulee',
        localisation: 'Sikasso',
        raison_annulation: 'Coqs vendus à un autre client',
        icon: '🐓',
        age: '8 mois',
        race: 'Locale'
      }
    ]
  };

  const handleContact = (order) => {
    alert(
      `💬 Contacter ${order.eleveur}\n\n` +
      `📦 Commande #${order.id}\n` +
      `🛒 ${order.produit} - ${order.quantite} ${order.type_produit === 'volaille' ? 'volailles' : 'œufs'}\n` +
      `💰 ${order.prix_total.toLocaleString()}F\n` +
      `📍 ${order.localisation}\n` +
      `📞 ${order.telephone}\n\n` +
      `Actions disponibles :\n` +
      `• Appeler pour suivi\n` +
      `• Message WhatsApp\n` +
      `• Discussion AviMarché`
    );
  };

  const handleTrackOrder = (order) => {
    let statusMessage = '';
    switch (order.statut) {
      case 'confirmee':
        statusMessage = `✅ Commande confirmée par ${order.eleveur}\n📅 Livraison prévue: ${order.livraison_prevue}\n📍 Préparez-vous à recevoir à ${order.localisation}`;
        break;
      case 'en_preparation':
        statusMessage = `⏳ ${order.eleveur} prépare votre commande\n📅 Livraison prévue: ${order.livraison_prevue}\n💡 Vous pouvez l'appeler pour plus d'infos`;
        break;
      case 'livree':
        statusMessage = `🎉 Commande livrée le ${order.date_livraison}\n⭐ Satisfaction: ${order.note_satisfaction}/5 étoiles\n💡 Merci pour votre achat !`;
        break;
      case 'annulee':
        statusMessage = `❌ Commande annulée\n📝 Raison: ${order.raison_annulation}\n💡 Vous pouvez chercher d'autres éleveurs`;
        break;
      default:
        statusMessage = 'Statut inconnu';
    }
    
    alert(
      `📦 Suivi Commande #${order.id}\n\n` +
      `🛒 ${order.produit}\n` +
      `👨‍🌾 ${order.eleveur}\n\n` +
      statusMessage
    );
  };

  const handleRateOrder = (order) => {
    alert(
      `⭐ Noter ${order.eleveur}\n\n` +
      `📦 ${order.produit} - ${order.quantite} ${order.type_produit === 'volaille' ? 'volailles' : 'œufs'}\n` +
      `💰 ${order.prix_total.toLocaleString()}F\n\n` +
      `Comment évaluez-vous :\n` +
      `• Qualité des ${order.type_produit === 'volaille' ? 'volailles' : 'œufs'}\n` +
      `• Respect des délais\n` +
      `• Service de ${order.eleveur}\n\n` +
      `Votre note aide les autres acheteurs !`
    );
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'confirmee': return '#4CAF50';
      case 'en_preparation': return '#FF9800';
      case 'livree': return '#2196F3';
      case 'annulee': return '#F44336';
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'confirmee': return '✅ Confirmée';
      case 'en_preparation': return '⏳ En préparation';
      case 'livree': return '🎉 Livrée';
      case 'annulee': return '❌ Annulée';
      default: return statut;
    }
  };

  const getTabStats = () => {
    return {
      en_cours: orders.en_cours.length,
      livrees: orders.livrees.length,
      annulees: orders.annulees.length
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
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Mes Commandes
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Volailles et œufs commandés
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('en_cours')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeTab === 'en_cours' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeTab === 'en_cours' ? colors.warning : colors.card,
                color: activeTab === 'en_cours' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">⏳</div>
              <p className="text-sm">En cours</p>
              {stats.en_cours > 0 && (
                <div className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center mt-1 mx-auto">
                  {stats.en_cours}
                </div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('livrees')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeTab === 'livrees' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeTab === 'livrees' ? colors.success : colors.card,
                color: activeTab === 'livrees' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">✅</div>
              <p className="text-sm">Livrées</p>
              {stats.livrees > 0 && (
                <div className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center mt-1 mx-auto">
                  {stats.livrees}
                </div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('annulees')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeTab === 'annulees' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeTab === 'annulees' ? colors.error : colors.card,
                color: activeTab === 'annulees' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">❌</div>
              <p className="text-sm">Annulées</p>
              {stats.annulees > 0 && (
                <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mt-1 mx-auto">
                  {stats.annulees}
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
              📊 Résumé de mes achats
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.warning }}>
                  {stats.en_cours}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>En cours</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.success }}>
                  {stats.livrees}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Livrées</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                  {currentOrders.reduce((sum, order) => sum + order.prix_total, 0).toLocaleString()}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>F total ({activeTab})</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            {activeTab === 'en_cours' && '⏳ Commandes en Cours'}
            {activeTab === 'livrees' && '✅ Commandes Livrées'}
            {activeTab === 'annulees' && '❌ Commandes Annulées'}
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
                {activeTab === 'en_cours' && 'Aucune commande en cours'}
                {activeTab === 'livrees' && 'Aucune commande livrée récemment'}
                {activeTab === 'annulees' && 'Aucune commande annulée'}
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
                          {order.produit}
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
                          👨‍🌾 {order.eleveur}
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {order.quantite} {order.type_produit === 'volaille' ? 'volailles' : 'œufs'} × {order.prix_unitaire}F = <span className="font-bold">{order.prix_total.toLocaleString()}F</span>
                        </p>
                        {order.type_produit === 'volaille' ? (
                          <p className="text-xs" style={{ color: colors.textMuted }}>
                            📅 Age: {order.age} • 🧬 Race: {order.race}
                          </p>
                        ) : (
                          <p className="text-xs" style={{ color: colors.textMuted }}>
                            ⏰ {order.fraicheur} • 🐔 {order.source}
                          </p>
                        )}
                        <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                          📍 {order.localisation} • 🕐 {order.date_commande} {order.heure}
                        </p>
                      </div>

                      {order.statut === 'livree' && order.note_satisfaction && (
                        <div className="mb-3 text-center">
                          <p className="text-sm font-bold" style={{ color: colors.success }}>
                            ⭐ Votre note: {order.note_satisfaction}/5 étoiles
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleContact(order)}
                          className="flex-1 p-2 rounded-lg text-sm font-bold text-white"
                          style={{ backgroundColor: colors.primary }}
                        >
                          💬 Contact
                        </button>
                        
                        <button
                          onClick={() => handleTrackOrder(order)}
                          className="flex-1 p-2 rounded-lg text-sm font-bold text-white"
                          style={{ backgroundColor: colors.info }}
                        >
                          📦 Suivi
                        </button>
                        
                        {order.statut === 'livree' && (
                          <button
                            onClick={() => handleRateOrder(order)}
                            className="p-2 rounded-lg text-sm font-bold text-white"
                            style={{ backgroundColor: colors.success }}
                          >
                            ⭐
                          </button>
                        )}
                        
                        <button
                          onClick={() => alert(`📞 Appeler ${order.eleveur}\n${order.telephone}`)}
                          className="p-2 rounded-lg text-sm font-bold text-white"
                          style={{ backgroundColor: colors.warning }}
                        >
                          📞
                        </button>
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
              Conseil achat
            </p>
            <p className="text-xs text-green-700">
              Notez vos éleveurs après chaque livraison pour aider les autres acheteurs et fidéliser les meilleurs !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerOrdersPage;