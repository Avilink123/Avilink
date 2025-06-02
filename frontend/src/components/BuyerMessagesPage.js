import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BuyerMessagesPage = ({ currentUser, onNavigate, params = {} }) => {
  const { colors } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Conversation Support spéciale pour contacter l'admin
    const supportConversation = {
      id: 'support',
      contact: 'Support AviMarché',
      role: 'Équipe Support Acheteurs',
      dernierMessage: 'Bonjour ! Comment pouvons-nous vous aider avec vos achats ?',
      heure: 'Maintenant',
      nonLu: false,
      telephone: '+223 20 22 44 88',
      isSupport: true,
      messages: [
        { 
          id: '1', 
          texte: 'Bonjour ! Je suis votre assistant support pour tous vos achats de volailles et œufs. N\'hésitez pas à me poser vos questions !', 
          expediteur: 'Support AviMarché', 
          heure: 'Maintenant' 
        }
      ]
    };

    // Simulation conversations avec éleveurs
    const mockConversations = [
      supportConversation,
      {
        id: '1',
        contact: 'Amadou Traoré',
        role: 'Éleveur - Poules pondeuses',
        dernierMessage: 'Mes poules sont disponibles demain matin',
        heure: '14:30',
        nonLu: true,
        telephone: '+223 76 12 34 56',
        localisation: 'Bamako, Commune III',
        specialite: 'Poules pondeuses, Œufs',
        depuis: '2023-05',
        messages: [
          { id: '1', texte: 'Bonjour, vos poules pondeuses sont-elles disponibles ?', expediteur: 'Moi', heure: '14:20' },
          { id: '2', texte: 'Oui ! J\'ai 15 poules en excellente santé', expediteur: 'Amadou Traoré', heure: '14:22' },
          { id: '3', texte: 'Quel est votre prix ?', expediteur: 'Moi', heure: '14:25' },
          { id: '4', texte: '3500F par poule. Très bonne qualité !', expediteur: 'Amadou Traoré', heure: '14:27' },
          { id: '5', texte: 'Mes poules sont disponibles demain matin', expediteur: 'Amadou Traoré', heure: '14:30' }
        ]
      },
      {
        id: '2',
        contact: 'Fatoumata Diallo',
        role: 'Éleveur - Pintades',
        dernierMessage: 'Merci pour votre achat !',
        heure: '11:45',
        nonLu: false,
        telephone: '+223 65 43 21 87',
        localisation: 'Bamako, Commune IV',
        specialite: 'Pintades, Œufs fécondés',
        depuis: '2024-01',
        messages: [
          { id: '1', texte: 'Bonjour, j\'ai vu votre annonce de pintades', expediteur: 'Moi', heure: '11:30' },
          { id: '2', texte: 'Bonjour ! Oui, j\'ai 8 belles pintades', expediteur: 'Fatoumata Diallo', heure: '11:35' },
          { id: '3', texte: 'Je viens les chercher cet après-midi', expediteur: 'Moi', heure: '11:40' },
          { id: '4', texte: 'Merci pour votre achat !', expediteur: 'Fatoumata Diallo', heure: '11:45' }
        ]
      },
      {
        id: '3',
        contact: 'Ibrahim Keita',
        role: 'Éleveur - Poulets de chair',
        dernierMessage: 'Commande prête pour livraison',
        heure: 'Hier',
        nonLu: false,
        telephone: '+223 78 87 65 43',
        localisation: 'Kati',
        specialite: 'Poulets de chair, Coqs',
        depuis: '2023-08',
        messages: [
          { id: '1', texte: 'Vos poulets de 2 mois sont-ils prêts ?', expediteur: 'Moi', heure: 'Hier 15:00' },
          { id: '2', texte: 'Oui, 20 poulets de belle taille', expediteur: 'Ibrahim Keita', heure: 'Hier 15:10' },
          { id: '3', texte: 'Je prends les 20. Livraison possible ?', expediteur: 'Moi', heure: 'Hier 15:15' },
          { id: '4', texte: 'Commande prête pour livraison', expediteur: 'Ibrahim Keita', heure: 'Hier 16:00' }
        ]
      },
      {
        id: '4',
        contact: 'Mariam Coulibaly',
        role: 'Éleveur - Œufs bio',
        dernierMessage: 'Nouveaux œufs frais disponibles',
        heure: 'Lundi',
        nonLu: true,
        telephone: '+223 90 11 22 33',
        localisation: 'Bamako, Commune II',
        specialite: 'Œufs bio, Poules locales',
        depuis: '2023-11',
        messages: [
          { id: '1', texte: 'Avez-vous des œufs frais ?', expediteur: 'Moi', heure: 'Lundi 09:00' },
          { id: '2', texte: 'Nouveaux œufs frais disponibles', expediteur: 'Mariam Coulibaly', heure: 'Lundi 09:30' }
        ]
      }
    ];

    setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
      
      // Si redirection depuis ContactSupportPage, ouvrir directement conversation support
      if (params.openSupport) {
        setSelectedConversation(supportConversation);
      }
    }, 800);
  }, [params]);

  const handleEnvoyerMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg = {
      id: Date.now().toString(),
      texte: newMessage,
      expediteur: 'Moi',
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    // Réponse automatique du support
    let supportResponse = null;
    if (selectedConversation.isSupport) {
      const responses = [
        "Merci pour votre message ! Notre équipe acheteurs va vous répondre très bientôt.",
        "Nous avons bien reçu votre demande. Notre équipe étudie votre problème et vous répond rapidement.",
        "Votre satisfaction est notre priorité ! Nous vous contactons dans les plus brefs délais.",
        "Merci de nous faire confiance pour vos achats ! Notre équipe traite votre demande en priorité."
      ];
      
      supportResponse = {
        id: (Date.now() + 1).toString(),
        texte: responses[Math.floor(Math.random() * responses.length)],
        expediteur: 'Support AviMarché',
        heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
    }

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        const newMessages = supportResponse 
          ? [...conv.messages, newMsg, supportResponse]
          : [...conv.messages, newMsg];
        
        return {
          ...conv,
          messages: newMessages,
          dernierMessage: supportResponse ? supportResponse.texte : newMessage,
          heure: 'Maintenant'
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    
    const updatedSelectedConv = {
      ...selectedConversation,
      messages: supportResponse 
        ? [...selectedConversation.messages, newMsg, supportResponse]
        : [...selectedConversation.messages, newMsg]
    };
    
    setSelectedConversation(updatedSelectedConv);
    setNewMessage('');
  };

  const handleAppeler = (conversation) => {
    alert(
      `📞 Appeler ${conversation.contact}\n\n` +
      `👤 ${conversation.role}\n` +
      `☎️ ${conversation.telephone}\n` +
      `📍 ${conversation.localisation || 'Support AviMarché'}\n` +
      `🏷️ Spécialité: ${conversation.specialite || 'Support client'}\n\n` +
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
        <div className="px-4 py-4" style={{ backgroundColor: selectedConversation.isSupport ? '#e3f2fd' : colors.surface }}>
          <div className="max-w-md mx-auto flex items-center justify-between">
            <button 
              onClick={() => setSelectedConversation(null)}
              className="text-2xl"
            >
              ← 
            </button>
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center space-x-2">
                {selectedConversation.isSupport && <span className="text-2xl">🛡️</span>}
                <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                  {selectedConversation.contact}
                </h2>
              </div>
              <p className="text-sm" style={{ color: selectedConversation.isSupport ? '#1976d2' : colors.textSecondary }}>
                {selectedConversation.role}
              </p>
              {selectedConversation.isSupport && (
                <p className="text-xs text-green-600 font-medium">🟢 En ligne - Support dédié acheteurs</p>
              )}
              {!selectedConversation.isSupport && (
                <p className="text-xs" style={{ color: colors.textMuted }}>
                  📍 {selectedConversation.localisation} • Depuis {selectedConversation.depuis}
                </p>
              )}
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

        {/* Info éleveur */}
        {!selectedConversation.isSupport && (
          <div className="px-4 py-2">
            <div className="max-w-md mx-auto">
              <div 
                className="p-3 rounded-xl text-center"
                style={{ backgroundColor: colors.card }}
              >
                <div className="text-sm">
                  <span className="font-bold" style={{ color: colors.primary }}>
                    🏷️ Spécialité: {selectedConversation.specialite}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="px-4 py-4 space-y-3" style={{ minHeight: 'calc(100vh - 250px)' }}>
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
                      : message.expediteur === 'Support AviMarché'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.expediteur === 'Support AviMarché' && (
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-xs">🛡️</span>
                      <span className="text-xs font-bold">Support acheteurs</span>
                    </div>
                  )}
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
            {selectedConversation.isSupport && (
              <div className="text-center mb-2">
                <p className="text-xs text-green-600 font-medium">
                  ✨ Vous parlez avec l'équipe support acheteurs
                </p>
              </div>
            )}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={selectedConversation.isSupport ? "Décrivez votre problème d'achat..." : "Tapez votre message..."}
                className="flex-1 p-3 rounded-xl border"
                style={{ backgroundColor: colors.card }}
                onKeyPress={(e) => e.key === 'Enter' && handleEnvoyerMessage()}
              />
              <button
                onClick={handleEnvoyerMessage}
                className="px-4 py-3 rounded-xl text-white font-bold"
                style={{ backgroundColor: selectedConversation.isSupport ? '#4caf50' : colors.primary }}
              >
                ➤
              </button>
            </div>
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
            Discussions avec les éleveurs et notre équipe
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
              style={{ 
                backgroundColor: conversation.isSupport ? '#e8f5e8' : colors.card,
                border: conversation.isSupport ? '2px solid #4caf50' : 'none'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {conversation.isSupport && <span className="text-xl">🛡️</span>}
                    <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                      {conversation.contact}
                    </h3>
                    {conversation.nonLu && (
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    )}
                    {conversation.isSupport && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        SUPPORT
                      </span>
                    )}
                  </div>
                  <p 
                    className="text-sm" 
                    style={{ color: conversation.isSupport ? '#2e7d32' : colors.primary }}
                  >
                    {conversation.role}
                  </p>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    {conversation.dernierMessage}
                  </p>
                  {!conversation.isSupport && (
                    <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                      📍 {conversation.localisation} • 🏷️ {conversation.specialite}
                    </p>
                  )}
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
                    style={{ color: conversation.isSupport ? '#4caf50' : colors.primary }}
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
              Contactez directement les éleveurs pour négocier les prix et vérifier la qualité. Notre équipe support est là pour vous aider !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerMessagesPage;