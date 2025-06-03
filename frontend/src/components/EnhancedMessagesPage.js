import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useMessages } from '../hooks/useMessages';

// Optimized conversation item component
const ConversationItem = React.memo(({ conversation, onSelect, currentUser }) => {
  const { colors } = useTheme();
  const { onlineUsers } = useWebSocket();
  
  const otherParticipant = useMemo(() => {
    return conversation.participants_details?.find(p => p.id !== currentUser?.id);
  }, [conversation.participants_details, currentUser?.id]);

  const isOnline = useMemo(() => {
    return otherParticipant ? onlineUsers.some(u => u.user_id === otherParticipant.id) : false;
  }, [onlineUsers, otherParticipant]);

  const unreadCount = useMemo(() => {
    return currentUser ? conversation.unread_count?.[currentUser.id] || 0 : 0;
  }, [conversation.unread_count, currentUser]);

  const lastMessageTime = useMemo(() => {
    if (!conversation.last_message_timestamp) return '';
    const date = new Date(conversation.last_message_timestamp);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'Maintenant';
    if (diffHours < 24) return `${Math.floor(diffHours)}h`;
    return date.toLocaleDateString('fr-FR');
  }, [conversation.last_message_timestamp]);

  return (
    <div
      onClick={() => onSelect(conversation)}
      className="p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
      style={{ 
        backgroundColor: conversation.isSupport ? '#e8f5e8' : colors.card,
        border: conversation.isSupport ? '2px solid #4caf50' : 'none'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            {conversation.isSupport && <span className="text-xl">🛡️</span>}
            {isOnline && !conversation.isSupport && (
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            )}
            <h3 className="font-bold text-lg truncate" style={{ color: colors.text }}>
              {otherParticipant?.nom || 'Support AviMarché'}
            </h3>
            {unreadCount > 0 && (
              <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
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
            {otherParticipant?.role || 'Équipe Support'}
          </p>
          <p className="text-sm mt-1 truncate" style={{ color: colors.textSecondary }}>
            {conversation.last_message || 'Commencer une conversation...'}
          </p>
        </div>
        <div className="text-right ml-2">
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {lastMessageTime}
          </p>
          {isOnline && !conversation.isSupport && (
            <p className="text-xs text-green-600 font-medium mt-1">🟢 En ligne</p>
          )}
        </div>
      </div>
    </div>
  );
});

// Optimized message component
const MessageBubble = React.memo(({ message, isOwnMessage, showStatus }) => {
  const statusIcon = useMemo(() => {
    if (!showStatus || !isOwnMessage) return '';
    switch (message.status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓';
      default: return '';
    }
  }, [message.status, showStatus, isOwnMessage]);

  const statusColor = useMemo(() => {
    if (!showStatus || !isOwnMessage) return '';
    return message.status === 'read' ? 'text-blue-400' : 'text-gray-400';
  }, [message.status, showStatus, isOwnMessage]);

  return (
    <div className={`mb-3 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block p-3 rounded-xl max-w-xs break-words ${
          isOwnMessage
            ? 'bg-blue-500 text-white'
            : message.sender_nom === 'Support AviMarché'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        {message.sender_nom === 'Support AviMarché' && (
          <div className="flex items-center space-x-1 mb-1">
            <span className="text-xs">🛡️</span>
            <span className="text-xs font-bold">Support officiel</span>
          </div>
        )}
        <p className="text-sm">{message.content}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs opacity-70">
            {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
          {statusIcon && (
            <span className={`text-xs ml-2 ${statusColor}`}>
              {statusIcon}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

// Typing indicator component
const TypingIndicator = React.memo(({ typingUsers, conversationId }) => {
  const typingInConversation = useMemo(() => {
    const typing = typingUsers[conversationId];
    if (!typing) return [];
    return Object.values(typing).filter(Boolean);
  }, [typingUsers, conversationId]);

  if (typingInConversation.length === 0) return null;

  return (
    <div className="text-left mb-3">
      <div className="inline-block p-2 bg-gray-100 rounded-xl">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-gray-600 ml-2">
            {typingInConversation[0]} écrit...
          </span>
        </div>
      </div>
    </div>
  );
});

const EnhancedMessagesPage = ({ currentUser, onNavigate, params = {} }) => {
  const { colors } = useTheme();
  const { isConnected, typingUsers, sendTypingIndicator, fallbackMode } = useWebSocket();
  const { 
    conversations, 
    messages, 
    loading, 
    error,
    loadMessages, 
    sendMessage, 
    markAsRead 
  } = useMessages(currentUser);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation?.id, scrollToBottom]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation, loadMessages, markAsRead]);

  // Handle typing indicators
  const handleTyping = useCallback((value) => {
    setNewMessage(value);
    
    if (selectedConversation && isConnected) {
      // Send typing indicator
      sendTypingIndicator(selectedConversation.id, true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing indicator after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(selectedConversation.id, false);
      }, 3000);
    }
  }, [selectedConversation, isConnected, sendTypingIndicator]);

  const handleSendMessage = useCallback(async () => {
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
      // Stop typing indicator
      if (isConnected) {
        sendTypingIndicator(selectedConversation.id, false);
      }
    }
  }, [newMessage, selectedConversation, currentUser, sendMessage, isConnected, sendTypingIndicator]);

  const conversationMessages = useMemo(() => {
    return selectedConversation ? messages[selectedConversation.id] || [] : [];
  }, [messages, selectedConversation]);

  if (loading && conversations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-xl" style={{ color: colors.text }}>Chargement des messages...</p>
          {!isConnected && (
            <p className="text-sm text-orange-600 mt-2">Connexion en temps réel en cours...</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Conversation view
  if (selectedConversation) {
    const otherParticipant = selectedConversation.participants_details?.find(
      p => p.id !== currentUser?.id
    );

    return (
      <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <div className="px-4 py-4 sticky top-0 z-10" style={{ 
          backgroundColor: selectedConversation.isSupport ? '#e3f2fd' : colors.surface 
        }}>
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
                  {otherParticipant?.nom || 'Support AviMarché'}
                </h2>
              </div>
              <p className="text-sm" style={{ 
                color: selectedConversation.isSupport ? '#1976d2' : colors.textSecondary 
              }}>
                {otherParticipant?.role || 'Équipe Support'}
              </p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                {!isConnected && (
                  <span className="text-xs text-orange-600">⚠️ Hors ligne</span>
                )}
                {isConnected && (
                  <span className="text-xs text-green-600">🟢 En ligne</span>
                )}
              </div>
            </div>
            <button 
              onClick={() => {
                const phone = otherParticipant?.telephone || '+223 20 22 44 55';
                window.open(`tel:${phone}`, '_self');
              }}
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
            {conversationMessages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.sender_id === currentUser?.id}
                showStatus={index === conversationMessages.length - 1}
              />
            ))}
            
            <TypingIndicator 
              typingUsers={typingUsers} 
              conversationId={selectedConversation.id} 
            />
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message input */}
        <div className="fixed bottom-0 left-0 right-0 p-4" style={{ backgroundColor: colors.surface }}>
          <div className="max-w-md mx-auto">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                placeholder={selectedConversation.isSupport ? "Décrivez votre problème..." : "Tapez votre message..."}
                className="flex-1 p-3 rounded-xl border"
                style={{ backgroundColor: colors.card }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={!isConnected}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="px-4 py-3 rounded-xl text-white font-bold disabled:opacity-50"
                style={{ 
                  backgroundColor: selectedConversation.isSupport ? '#4caf50' : colors.primary 
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Conversations list view
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
            💬 Messages
          </h1>
          <p className="text-center mt-2" style={{ color: colors.textSecondary }}>
            {fallbackMode ? 'Messages synchronisés' : 'Conversations en temps réel'}
          </p>
          <div className="text-center mt-2">
            {!isConnected ? (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                ⚠️ Reconnexion en cours...
              </span>
            ) : fallbackMode ? (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                📱 Mode compatible
              </span>
            ) : (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                ⚡ Temps réel activé
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conversations list */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-3">
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg" style={{ color: colors.text }}>Aucune conversation</p>
              <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
                Commencez à discuter avec d'autres utilisateurs !
              </p>
            </div>
          ) : (
            conversations.map(conversation => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onSelect={setSelectedConversation}
                currentUser={currentUser}
              />
            ))
          )}
        </div>
      </div>

      {/* Help section */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <p className="text-lg font-bold" style={{ color: colors.text }}>
              💡 Messagerie en temps réel
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              Discutez instantanément avec les éleveurs, acheteurs et notre équipe support. 
              Les messages sont synchronisés en temps réel !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessagesPage;