import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MessagesPage = ({ currentUser, onNavigate, params = {} }) => {
  const { colors } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  // Load conversations from backend
  const loadConversations = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API}/conversations?user_id=${currentUser.id}`);
      const realConversations = response.data || [];
      
      // Add support conversation as first item
      const supportConversation = {
        id: 'support',
        type: 'support',
        participants: [currentUser.id, 'support'],
        participants_details: [
          { id: currentUser.id, nom: currentUser.nom, role: currentUser.role },
          { id: 'support', nom: 'Support AviMarché', role: 'Équipe Support' }
        ],
        last_message: 'Bonjour ! Comment pouvons-nous vous aider ?',
        last_message_timestamp: new Date().toISOString(),
        last_message_sender: 'support',
        unread_count: { [currentUser.id]: 0 },
        isSupport: true
      };

      const allConversations = [supportConversation, ...realConversations];
      setConversations(allConversations);
      
    } catch (error) {
      console.error('Error loading conversations:', error);
      // Fallback to demo data if backend fails
      setConversations(getDemoConversations());
    } finally {
      setLoading(false);
    }
  };

  // Load messages for a specific conversation
  const loadMessages = async (conversationId) => {
    if (!currentUser || !conversationId) return;

    // Handle support conversation with demo messages
    if (conversationId === 'support') {
      const supportMessages = [
        {
          id: '1',
          conversation_id: 'support',
          sender_id: 'support',
          sender_nom: 'Support AviMarché',
          recipient_id: currentUser.id,
          recipient_nom: currentUser.nom,
          content: 'Bonjour ! Je suis là pour vous aider avec toutes vos questions sur AviMarché. N\'hésitez pas à me poser vos questions !',
          status: 'read',
          timestamp: new Date().toISOString()
        }
      ];
      setMessages(prev => ({ ...prev, [conversationId]: supportMessages }));
      return;
    }

    try {
      const response = await axios.get(`${API}/conversations/${conversationId}/messages?user_id=${currentUser.id}&limit=50`);
      const conversationMessages = response.data || [];
      setMessages(prev => ({ ...prev, [conversationId]: conversationMessages }));
      
      // Mark messages as read
      await axios.post(`${API}/conversations/${conversationId}/mark-read?user_id=${currentUser.id}`);
      
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages(prev => ({ ...prev, [conversationId]: [] }));
    }
  };

  // Send a message
  const sendMessage = async (conversationId, recipientId, content) => {
    if (!currentUser || !content.trim()) return;

    try {
      // Handle support messages
      if (conversationId === 'support') {
        const newMsg = {
          id: Date.now().toString(),
          conversation_id: 'support',
          sender_id: currentUser.id,
          sender_nom: currentUser.nom,
          recipient_id: 'support',
          recipient_nom: 'Support AviMarché',
          content: content.trim(),
          status: 'sent',
          timestamp: new Date().toISOString()
        };

        // Add user message
        setMessages(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), newMsg]
        }));

        // Auto-response from support
        setTimeout(() => {
          const responses = [
            "Merci pour votre message ! Un membre de notre équipe va vous répondre très bientôt.",
            "Nous avons bien reçu votre demande. Notre équipe étudie votre problème et vous répond rapidement.",
            "Votre message est important pour nous. Nous vous contactons dans les plus brefs délais.",
            "Merci de nous faire confiance ! Notre équipe technique traite votre demande en priorité."
          ];
          
          const supportResponse = {
            id: (Date.now() + 1).toString(),
            conversation_id: 'support',
            sender_id: 'support',
            sender_nom: 'Support AviMarché',
            recipient_id: currentUser.id,
            recipient_nom: currentUser.nom,
            content: responses[Math.floor(Math.random() * responses.length)],
            status: 'sent',
            timestamp: new Date().toISOString()
          };

          setMessages(prev => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), supportResponse]
          }));
        }, 2000);

        return newMsg;
      }

      // Real conversation
      const response = await axios.post(`${API}/messages?sender_id=${currentUser.id}`, {
        conversation_id: conversationId,
        recipient_id: recipientId,
        content: content.trim()
      });

      const newMessage = response.data;
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMessage]
      }));

      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      setIsConnected(false);
      return null;
    }
  };

  // Get demo conversations for fallback
  const getDemoConversations = () => {
    return [
      {
        id: 'support',
        type: 'support',
        participants: [currentUser.id, 'support'],
        participants_details: [
          { id: currentUser.id, nom: currentUser.nom, role: currentUser.role },
          { id: 'support', nom: 'Support AviMarché', role: 'Équipe Support' }
        ],
        last_message: 'Bonjour ! Comment pouvons-nous vous aider ?',
        last_message_timestamp: new Date().toISOString(),
        last_message_sender: 'support',
        unread_count: { [currentUser.id]: 0 },
        isSupport: true
      },
      {
        id: 'demo1',
        type: 'direct',
        participants: [currentUser.id, 'demo1'],
        participants_details: [
          { id: currentUser.id, nom: currentUser.nom, role: currentUser.role },
          { id: 'demo1', nom: 'Mamadou Keita', role: 'Acheteur' }
        ],
        last_message: 'Je veux 10 poules pondeuses',
        last_message_timestamp: new Date(Date.now() - 3600000).toISOString(),
        last_message_sender: 'demo1',
        unread_count: { [currentUser.id]: 1 }
      }
    ];
  };

  useEffect(() => {
    if (currentUser) {
      loadConversations();
      
      // If redirected from support page, open support conversation
      if (params.openSupport) {
        const supportConv = {
          id: 'support',
          type: 'support',
          participants_details: [
            { id: 'support', nom: 'Support AviMarché', role: 'Équipe Support' }
          ],
          isSupport: true
        };
        setSelectedConversation(supportConv);
        loadMessages('support');
      }
    }
  }, [currentUser, params]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    const otherParticipant = selectedConversation.participants_details?.find(
      p => p.id !== currentUser.id
    );
    
    if (!otherParticipant) return;

    const success = await sendMessage(
      selectedConversation.id, 
      otherParticipant.id, 
      newMessage
    );

    if (success) {
      setNewMessage('');
    }
  };

  const handleCall = (conversation) => {
    const participant = conversation.participants_details?.find(p => p.id !== currentUser?.id);
    const phone = participant?.telephone || '+223 20 22 44 55';
    window.open(`tel:${phone}`, '_self');
  };

  // Handle message selection for conversation
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-xl" style={{ color: colors.text }}>Chargement conversations...</p>
          <div className="mt-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
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
                  {selectedConversation.participants_details.find(p => p.id !== currentUser?.id)?.nom}
                </h2>
              </div>
              <p className="text-sm" style={{ color: selectedConversation.isSupport ? '#1976d2' : colors.textSecondary }}>
                {selectedConversation.participants_details.find(p => p.id !== currentUser?.id)?.role}
              </p>
              {selectedConversation.isSupport && (
                <p className="text-xs text-green-600 font-medium">🟢 En ligne - Réponse rapide</p>
              )}
            </div>
            <button 
              onClick={() => handleCall(selectedConversation)}
              className="text-2xl"
              style={{ color: colors.primary }}
            >
              📞
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="px-4 py-4 space-y-3 pb-40" style={{ minHeight: 'calc(100vh - 280px)' }}>
          <div className="max-w-md mx-auto">
            {messages[selectedConversation.id]?.map(message => (
              <div
                key={message.id}
                className={`mb-3 ${message.sender_id === currentUser?.id ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-3 rounded-xl max-w-xs ${
                    message.sender_id === currentUser?.id
                      ? 'bg-blue-500 text-white'
                      : message.sender_id === 'support'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.sender_id === 'support' && (
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-xs">🛡️</span>
                      <span className="text-xs font-bold">Support officiel</span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {message.sender_id === currentUser?.id && (
                      <span className={`text-xs ml-2 ${
                        message.status === 'read' ? 'text-blue-400' : 
                        message.status === 'delivered' ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {message.status === 'read' ? '✓✓' : 
                         message.status === 'delivered' ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone de saisie */}
        <div className="fixed bottom-16 left-0 right-0 p-4 z-20 shadow-2xl border-t-2 border-gray-200" 
             style={{ backgroundColor: colors.surface, boxShadow: '0 -4px 12px rgba(0,0,0,0.15)' }}>
          <div className="max-w-md mx-auto">
            {selectedConversation.isSupport && (
              <div className="text-center mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">
                  ✨ Vous parlez avec l'équipe officielle AviMarché
                </p>
              </div>
            )}
            <div className="flex space-x-3 items-end">
              <div className="flex-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={selectedConversation.isSupport ? "Décrivez votre problème..." : "Tapez votre message..."}
                  className="w-full p-4 text-base rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 shadow-lg transition-all"
                  style={{ 
                    backgroundColor: '#ffffff',
                    fontSize: '16px',
                    minHeight: '56px'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  autoFocus
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-6 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                style={{ 
                  backgroundColor: selectedConversation.isSupport ? '#4caf50' : colors.primary,
                  minHeight: '56px',
                  minWidth: '56px'
                }}
              >
                ➤
              </button>
            </div>
            {/* Indicateur de frappe */}
            <div className="text-center mt-2">
              <p className="text-xs text-gray-500">
                Appuyez sur Entrée pour envoyer • Messages en temps réel
              </p>
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
            💬 Messages Temps Réel
          </h1>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <p className="text-center text-sm" style={{ color: colors.textSecondary }}>
              {isConnected ? '🟢 Connecté - Messages instantanés' : '🔴 Mode hors ligne'}
            </p>
          </div>
        </div>
      </div>

      {/* Liste conversations */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-3">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation)}
              className="p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
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
                      {conversation.participants_details.find(p => p.id !== currentUser?.id)?.nom}
                    </h3>
                    {conversation.unread_count?.[currentUser?.id] > 0 && (
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    )}
                    {conversation.isSupport && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        OFFICIEL
                      </span>
                    )}
                  </div>
                  <p 
                    className="text-sm" 
                    style={{ color: conversation.isSupport ? '#2e7d32' : colors.primary }}
                  >
                    {conversation.participants_details.find(p => p.id !== currentUser?.id)?.role}
                  </p>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    {conversation.last_message}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    {new Date(conversation.last_message_timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCall(conversation);
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
              💡 Messagerie Moderne
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              • Messages instantanés en temps réel<br/>
              • Statut de lecture des messages<br/>
              • Support client 24h/7j<br/>
              • Compatible réseau Mali
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;