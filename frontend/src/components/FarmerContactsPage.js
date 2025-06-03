import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import EnhancedMessagesPage from './EnhancedMessagesPage';

const FarmerContactsPage = ({ currentUser, onNavigate }) => {
  // Les fournisseurs utilisent maintenant la même messagerie temps réel que tous les autres utilisateurs
  return (
    <EnhancedMessagesPage 
      currentUser={currentUser} 
      onNavigate={onNavigate}
      params={{ 
        title: '👥 Mes Clients Éleveurs',
        subtitle: 'Discutez avec vos clients éleveurs'
      }}
    />
  );
};

export default FarmerContactsPage;
    {
      id: '1',
      contact: 'Amadou Traoré',
      role: 'Éleveur - Poules pondeuses',
      dernierMessage: 'Merci pour le maïs de qualité !',
      heure: '14:30',
      nonLu: false,
      telephone: '+223 76 12 34 56',
      localisation: 'Bamako, Commune III',
      client_depuis: '2023-08-15',
      commandes_total: 12,
      montant_total: 340000,
      messages: [
        { id: '1', texte: 'Bonjour, avez-vous du maïs en stock ?', expediteur: 'Amadou Traoré', heure: '14:20' },
        { id: '2', texte: 'Oui, j\'ai du maïs de qualité à 280F/kg', expediteur: 'Moi', heure: '14:22' },
        { id: '3', texte: 'Parfait ! Je veux 50kg', expediteur: 'Amadou Traoré', heure: '14:25' },
        { id: '4', texte: 'Commande confirmée. Livraison demain matin', expediteur: 'Moi', heure: '14:27' },
        { id: '5', texte: 'Merci pour le maïs de qualité !', expediteur: 'Amadou Traoré', heure: '14:30' }
      ]
    },
    {
      id: '2',
      contact: 'Fatoumata Diallo',
      role: 'Éleveur - Pintades',
      dernierMessage: 'Vos poussins sont-ils disponibles ?',
      heure: '11:45',
      nonLu: true,
      telephone: '+223 65 43 21 87',
      localisation: 'Bamako, Commune IV',
      client_depuis: '2024-01-10',
      commandes_total: 3,
      montant_total: 45000,
      messages: [
        { id: '1', texte: 'Bonjour ! Vos poussins sont-ils disponibles ?', expediteur: 'Fatoumata Diallo', heure: '11:45' }
      ]
    },
    {
      id: '3',
      contact: 'Ibrahim Keita',
      role: 'Éleveur - Poulets de chair',
      dernierMessage: 'Commande livrée, parfait !',
      heure: 'Hier',
      nonLu: false,
      telephone: '+223 78 87 65 43',
      localisation: 'Kati',
      client_depuis: '2023-05-20',
      commandes_total: 28,
      montant_total: 890000,
      messages: [
        { id: '1', texte: 'Concentré ponte disponible ?', expediteur: 'Ibrahim Keita', heure: 'Hier 09:00' },
        { id: '2', texte: 'Oui, 30kg à 380F/kg', expediteur: 'Moi', heure: 'Hier 09:15' },
        { id: '3', texte: 'Je prends ! Livraison possible ?', expediteur: 'Ibrahim Keita', heure: 'Hier 09:20' },
        { id: '4', texte: 'Commande livrée, parfait !', expediteur: 'Ibrahim Keita', heure: 'Hier 17:00' }
      ]
    },
    {
      id: '4',
      contact: 'Mariam Coulibaly',
      role: 'Éleveur - Élevage mixte',
      dernierMessage: 'À bientôt pour la prochaine commande',
      heure: 'Lundi',
      nonLu: false,
      telephone: '+223 90 11 22 33',
      localisation: 'Bamako, Commune II',
      client_depuis: '2023-11-03',
      commandes_total: 15,
      montant_total: 520000,
      messages: [
        { id: '1', texte: 'Livraison effectuée. Merci !', expediteur: 'Moi', heure: 'Lundi 16:30' },
        { id: '2', texte: 'À bientôt pour la prochaine commande', expediteur: 'Mariam Coulibaly', heure: 'Lundi 17:00' }
      ]
    }
  ];

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Simulation clients fidèles pour onglet "Mes clients"
  const topClients = conversations
    .sort((a, b) => b.montant_total - a.montant_total)
    .map(client => ({
      ...client,
      fidelite: client.commandes_total > 20 ? 'excellent' : client.commandes_total > 10 ? 'bon' : 'nouveau',
      derniere_commande: client.id === '2' ? 'Jamais' : `${Math.floor(Math.random() * 30)} jours`
    }));

  const handleEnvoyerMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg = {
      id: Date.now().toString(),
      texte: newMessage,
      expediteur: 'Moi',
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    // Mettre à jour la conversation
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
      dernierMessage: newMessage,
      heure: 'Maintenant'
    };
    
    setSelectedConversation(updatedConversation);
    setNewMessage('');
  };

  const handleAppeler = (client) => {
    alert(
      `📞 Appeler ${client.contact}\n\n` +
      `👤 ${client.role}\n` +
      `☎️ ${client.telephone}\n` +
      `📍 ${client.localisation}\n\n` +
      `💰 Total achats : ${client.montant_total.toLocaleString()}F\n` +
      `📋 ${client.commandes_total} commandes\n\n` +
      `Appuyez sur le numéro pour composer`
    );
  };

  const getFideliteColor = (fidelite) => {
    switch (fidelite) {
      case 'excellent': return '#4CAF50';
      case 'bon': return '#FF9800';
      case 'nouveau': return '#2196F3';
      default: return colors.textSecondary;
    }
  };

  const getFideliteText = (fidelite) => {
    switch (fidelite) {
      case 'excellent': return '⭐ Excellent';
      case 'bon': return '👍 Bon client';
      case 'nouveau': return '🆕 Nouveau';
      default: return fidelite;
    }
  };

  // Vue conversation sélectionnée
  if (selectedConversation) {
    return (
      <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
        {/* Header conversation */}
        <div className="px-4 py-4" style={{ backgroundColor: colors.surface }}>
          <div className="max-w-md mx-auto flex items-center justify-between">
            <button 
              onClick={() => setSelectedConversation(null)}
              className="text-2xl"
            >
              ← 
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                {selectedConversation.contact}
              </h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {selectedConversation.role}
              </p>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                📍 {selectedConversation.localisation}
              </p>
            </div>
            <button 
              onClick={() => handleAppeler(selectedConversation)}
              className="text-2xl"
              style={{ color: colors.primary }}
            >
              📞
            </button>
          </div>
        </div>

        {/* Info client */}
        <div className="px-4 py-2">
          <div className="max-w-md mx-auto">
            <div 
              className="p-3 rounded-xl text-center"
              style={{ backgroundColor: colors.card }}
            >
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="font-bold" style={{ color: colors.primary }}>{selectedConversation.commandes_total}</p>
                  <p style={{ color: colors.textSecondary }}>Commandes</p>
                </div>
                <div>
                  <p className="font-bold" style={{ color: colors.success }}>{Math.round(selectedConversation.montant_total / 1000)}K</p>
                  <p style={{ color: colors.textSecondary }}>CFA total</p>
                </div>
                <div>
                  <p className="font-bold" style={{ color: colors.info }}>
                    {new Date(selectedConversation.client_depuis).getFullYear()}
                  </p>
                  <p style={{ color: colors.textSecondary }}>Client depuis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="px-4 py-4 space-y-3" style={{ minHeight: 'calc(100vh - 300px)' }}>
          <div className="max-w-md mx-auto">
            {selectedConversation.messages.map(message => (
              <div
                key={message.id}
                className={`mb-3 ${message.expediteur === 'Moi' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-3 rounded-xl max-w-xs ${
                    message.expediteur === 'Moi'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.texte}</p>
                  <p className="text-xs mt-1 opacity-70">{message.heure}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone de saisie */}
        <div className="fixed bottom-0 left-0 right-0 p-4" style={{ backgroundColor: colors.surface }}>
          <div className="max-w-md mx-auto">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tapez votre message..."
                className="flex-1 p-3 rounded-xl border"
                style={{ backgroundColor: colors.card }}
                onKeyPress={(e) => e.key === 'Enter' && handleEnvoyerMessage()}
              />
              <button
                onClick={handleEnvoyerMessage}
                className="px-4 py-3 rounded-xl text-white font-bold"
                style={{ backgroundColor: colors.primary }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="text-6xl mb-4">👨‍🌾</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            {activeTab === 'messages' ? 'Mes Messages' : 'Mes Clients'}
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            {activeTab === 'messages' ? 'Discussions avec éleveurs' : 'Clients fidèles'}
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 p-4 rounded-xl font-bold text-center transition-all ${
                activeTab === 'messages' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeTab === 'messages' ? colors.primary : colors.card,
                color: activeTab === 'messages' ? 'white' : colors.text
              }}
            >
              <div className="text-3xl mb-2">💬</div>
              <p>Messages</p>
              <p className="text-xs mt-1">Discussions</p>
            </button>
            
            <button
              onClick={() => setActiveTab('clients')}
              className={`flex-1 p-4 rounded-xl font-bold text-center transition-all ${
                activeTab === 'clients' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeTab === 'clients' ? colors.success : colors.card,
                color: activeTab === 'clients' ? 'white' : colors.text
              }}
            >
              <div className="text-3xl mb-2">🤝</div>
              <p>Mes Clients</p>
              <p className="text-xs mt-1">Contacts fidèles</p>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu Messages */}
      {activeTab === 'messages' && (
        <div className="px-4">
          <div className="max-w-md mx-auto space-y-3">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className="p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                style={{ backgroundColor: colors.card }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                        {conversation.contact}
                      </h3>
                      {conversation.nonLu && (
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: colors.primary }}>
                      {conversation.role}
                    </p>
                    <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                      {conversation.dernierMessage}
                    </p>
                    <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                      📍 {conversation.localisation}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {conversation.heure}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAppeler(conversation);
                      }}
                      className="text-xl mt-2"
                      style={{ color: colors.primary }}
                    >
                      📞
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenu Clients */}
      {activeTab === 'clients' && (
        <div className="px-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              🤝 Mes Meilleurs Clients
            </h2>
            
            <div className="space-y-4">
              {topClients.map(client => (
                <div
                  key={client.id}
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
                      👨‍🌾
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                          {client.contact}
                        </h3>
                        <span 
                          className="text-xs font-bold px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: getFideliteColor(client.fidelite),
                            color: 'white'
                          }}
                        >
                          {getFideliteText(client.fidelite)}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-2" style={{ color: colors.primary }}>
                        {client.role}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                        <div>
                          <p className="font-bold" style={{ color: colors.success }}>
                            {client.montant_total.toLocaleString()}F
                          </p>
                          <p style={{ color: colors.textSecondary }}>Total achats</p>
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: colors.primary }}>
                            {client.commandes_total} commandes
                          </p>
                          <p style={{ color: colors.textSecondary }}>Depuis {new Date(client.client_depuis).getFullYear()}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedConversation(client)}
                          className="flex-1 p-2 rounded-lg text-sm font-bold text-white"
                          style={{ backgroundColor: colors.primary }}
                        >
                          💬 Message
                        </button>
                        <button
                          onClick={() => handleAppeler(client)}
                          className="p-2 rounded-lg text-sm font-bold text-white"
                          style={{ backgroundColor: colors.success }}
                        >
                          📞
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message d'aide */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <p className="text-lg font-bold" style={{ color: colors.text }}>
              💡 Conseil
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              {activeTab === 'messages' 
                ? 'Répondez rapidement pour fidéliser vos clients éleveurs !'
                : 'Contactez régulièrement vos meilleurs clients pour maintenir la relation !'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerContactsPage;