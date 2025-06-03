import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const useMessages = (currentUser) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useRef(new Map());
  const { fallbackMode, isConnected } = useWebSocket();
  const pollIntervalRef = useRef(null);
  const lastPollTime = useRef(new Date());

  // Start polling for new messages in fallback mode
  const startMessagePolling = useCallback(() => {
    if (pollIntervalRef.current || !fallbackMode || !currentUser) return;
    
    console.log('Starting message polling in fallback mode');
    pollIntervalRef.current = setInterval(async () => {
      try {
        // Poll for new conversations
        const response = await axios.get(`${API}/conversations?user_id=${currentUser.id}`);
        const updatedConversations = response.data;
        
        // Check for new messages in each conversation
        for (const conv of updatedConversations) {
          if (conv.last_message_timestamp && new Date(conv.last_message_timestamp) > lastPollTime.current) {
            // New message detected, refresh this conversation's messages
            if (messages[conv.id]) {
              const messagesResponse = await axios.get(
                `${API}/conversations/${conv.id}/messages?user_id=${currentUser.id}&limit=50`
              );
              const newMessages = messagesResponse.data;
              
              setMessages(prev => ({
                ...prev,
                [conv.id]: newMessages
              }));
            }
          }
        }
        
        setConversations(updatedConversations);
        lastPollTime.current = new Date();
        
      } catch (error) {
        console.error('Error polling for messages:', error);
      }
    }, 3000); // Poll every 3 seconds in fallback mode
  }, [fallbackMode, currentUser, messages]);

  const stopMessagePolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
      console.log('Stopped message polling');
    }
  }, []);

  // Load conversations with caching
  const loadConversations = useCallback(async () => {
    if (!currentUser) return;

    const cacheKey = `conversations_${currentUser.id}`;
    if (cache.current.has(cacheKey)) {
      setConversations(cache.current.get(cacheKey));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API}/conversations?user_id=${currentUser.id}`);
      const conversationsData = response.data;
      
      setConversations(conversationsData);
      cache.current.set(cacheKey, conversationsData);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setError('Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load messages for a conversation with caching
  const loadMessages = useCallback(async (conversationId) => {
    if (!currentUser || !conversationId) return;

    const cacheKey = `messages_${conversationId}`;
    if (cache.current.has(cacheKey)) {
      setMessages(prev => ({
        ...prev,
        [conversationId]: cache.current.get(cacheKey)
      }));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${API}/conversations/${conversationId}/messages?user_id=${currentUser.id}&limit=50`
      );
      const messagesData = response.data;

      setMessages(prev => ({
        ...prev,
        [conversationId]: messagesData
      }));
      cache.current.set(cacheKey, messagesData);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Send a message
  const sendMessage = useCallback(async (conversationId, recipientId, content) => {
    if (!currentUser || !content.trim()) return null;

    try {
      const response = await axios.post(`${API}/messages?sender_id=${currentUser.id}`, {
        conversation_id: conversationId,
        recipient_id: recipientId,
        content: content.trim()
      });

      const newMessage = response.data;

      // Update local messages
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMessage]
      }));

      // Update cache
      const cacheKey = `messages_${conversationId}`;
      const cachedMessages = cache.current.get(cacheKey) || [];
      cache.current.set(cacheKey, [...cachedMessages, newMessage]);

      // Update conversations list
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? {
              ...conv,
              last_message: content,
              last_message_timestamp: newMessage.timestamp,
              last_message_sender: currentUser.id,
              updated_at: newMessage.timestamp
            }
          : conv
      ));

      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Erreur lors de l\'envoi du message');
      return null;
    }
  }, [currentUser]);

  // Create a new conversation
  const createConversation = useCallback(async (participantId, initialMessage = null) => {
    if (!currentUser) return null;

    try {
      const response = await axios.post(`${API}/conversations?sender_id=${currentUser.id}`, {
        participant_id: participantId,
        initial_message: initialMessage
      });

      const newConversation = response.data;
      
      // Update conversations list
      setConversations(prev => [newConversation, ...prev]);
      
      // Clear cache to force refresh
      cache.current.delete(`conversations_${currentUser.id}`);

      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Erreur lors de la création de la conversation');
      return null;
    }
  }, [currentUser]);

  // Mark messages as read
  const markAsRead = useCallback(async (conversationId) => {
    if (!currentUser) return;

    try {
      await axios.post(`${API}/conversations/${conversationId}/mark-read?user_id=${currentUser.id}`);
      
      // Update unread count in conversations
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? {
              ...conv,
              unread_count: { ...conv.unread_count, [currentUser.id]: 0 }
            }
          : conv
      ));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [currentUser]);

  // Handle real-time message updates
  useEffect(() => {
    const handleNewMessage = (event) => {
      const { message, conversation_id } = event.detail;
      
      // Update messages
      setMessages(prev => ({
        ...prev,
        [conversation_id]: [...(prev[conversation_id] || []), message]
      }));

      // Update conversations
      setConversations(prev => prev.map(conv => 
        conv.id === conversation_id 
          ? {
              ...conv,
              last_message: message.content,
              last_message_timestamp: message.timestamp,
              last_message_sender: message.sender_id,
              updated_at: message.timestamp,
              unread_count: {
                ...conv.unread_count,
                [message.recipient_id]: (conv.unread_count[message.recipient_id] || 0) + 1
              }
            }
          : conv
      ));

      // Update cache
      const cacheKey = `messages_${conversation_id}`;
      const cachedMessages = cache.current.get(cacheKey) || [];
      cache.current.set(cacheKey, [...cachedMessages, message]);
    };

    const handleMessagesRead = (event) => {
      const { conversation_id, reader_id } = event.detail;
      
      // Update message status
      setMessages(prev => ({
        ...prev,
        [conversation_id]: (prev[conversation_id] || []).map(msg => 
          msg.recipient_id === reader_id ? { ...msg, status: 'read' } : msg
        )
      }));
    };

    window.addEventListener('newMessage', handleNewMessage);
    window.addEventListener('messagesRead', handleMessagesRead);

    return () => {
      window.removeEventListener('newMessage', handleNewMessage);
      window.removeEventListener('messagesRead', handleMessagesRead);
    };
  }, []);

  // Load conversations when component mounts
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    messages,
    loading,
    error,
    loadConversations,
    loadMessages,
    sendMessage,
    createConversation,
    markAsRead
  };
};