import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MessagesPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Simulation conversations (simple pour illettrés)
    const mockConversations = [
      {
        id: '1',
        contact: 'Mamadou Keita',
        role: 'Acheteur',
        dernierMessage: 'Je veux 10 poules pondeuses',
        heure: '10:30',
        nonLu: true,
        telephone: '+223 76 12 34 56',
        messages: [
          { id: '1', texte: 'Bonjour, avez-vous des poules pondeuses ?', expediteur: 'Mamadou Keita', heure: '10:25' },
          { id: '2', texte: 'Oui, j\'ai de belles poules qui pondent bien', expediteur: 'Moi', heure: '10:27' },
          { id: '3', texte: 'Je veux 10 poules pondeuses', expediteur: 'Mamadou Keita', heure: '10:30' }
        ]
      },
      {
        id: '2',
        contact: 'Fatoumata Diarra',
        role: 'Fournisseur',
        dernierMessage: 'Votre commande de maïs est prête',
        heure: 'Hier',
        nonLu: false,
        telephone: '+223 65 43 21 98',
        messages: [
          { id: '1', texte: 'Bonjour, je veux commander du maïs', expediteur: 'Moi', heure: 'Hier 15:00' },
          { id: '2', texte: 'Combien de kg voulez-vous ?', expediteur: 'Fatoumata Diarra', heure: 'Hier 15:10' },
          { id: '3', texte: '50 kg de maïs s\'il vous plaît', expediteur: 'Moi', heure: 'Hier 15:12' },
          { id: '4', texte: 'Votre commande de maïs est prête', expediteur: 'Fatoumata Diarra', heure: 'Hier 16:00' }
        ]
      },
      {
        id: '3',
        contact: 'Ibrahim Coulibaly',
        role: 'Acheteur',
        dernierMessage: 'Merci pour les belles pintades',
        heure: 'Lundi',
        nonLu: false,
        telephone: '+223 78 87 65 43',
        messages: [
          { id: '1', texte: 'Vos pintades sont-elles disponibles ?', expediteur: 'Ibrahim Coulibaly', heure: 'Lundi 09:00' },
          { id: '2', texte: 'Oui, j\'ai 5 pintades à vendre', expediteur: 'Moi', heure: 'Lundi 09:30' },
          { id: '3', texte: 'Je viens les chercher cet après-midi', expediteur: 'Ibrahim Coulibaly', heure: 'Lundi 10:00' },
          { id: '4', texte: 'Merci pour les belles pintades', expediteur: 'Ibrahim Coulibaly', heure: 'Lundi 17:00' }
        ]
      }
    ];

    setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
    }, 800);
  }, []);

  const handleEnvoyerMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg = {
      id: Date.now().toString(),
      texte: newMessage,
      expediteur: 'Moi',
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          dernierMessage: newMessage,
          heure: 'Maintenant'
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg]
    }));
    setNewMessage('');
  };

  const handleAppeler = (conversation) => {
    alert(
      `📞 Appeler ${conversation.contact}\n\n` +
      `👤 ${conversation.role}\n` +
      `☎️ ${conversation.telephone}\n\n` +
      `Appuyez sur le numéro pour composer`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-xl" style={{ color: colors.text }}>Chargement messages...</p>
        </div>
      </div>
    );
  }

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

        {/* Messages */}
        <div className="px-4 py-4 space-y-3" style={{ minHeight: 'calc(100vh - 200px)' }}>
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
          <div className="max-w-md mx-auto flex space-x-2">
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
    );
  }

  // Vue liste des conversations
  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="px-4 py-6" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => onNavigate('home')}
            className="text-2xl mb-4"
          >
            ← 
          </button>
          <h1 className="text-2xl font-bold text-center" style={{ color: colors.text }}>
            💬 Mes Messages
          </h1>
          <p className="text-center mt-2" style={{ color: colors.textSecondary }}>
            Parlez avec vos clients et fournisseurs
          </p>
        </div>
      </div>

      {/* Liste conversations */}
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
              Répondez rapidement à vos messages pour faire de bons affaires
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;