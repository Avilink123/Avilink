import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children, currentUser }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    if (!currentUser || socket) return;

    try {
      // Use WebSocket instead of Socket.IO for simpler implementation
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const wsUrl = backendUrl.replace('https://', 'wss://').replace('http://', 'ws://');
      const ws = new WebSocket(`${wsUrl}/ws/${currentUser.id}`);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setSocket(ws);
        reconnectAttempts.current = 0;
        
        // Send ping to keep connection alive
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          } else {
            clearInterval(pingInterval);
          }
        }, 30000); // Ping every 30 seconds
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setSocket(null);
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnecting... Attempt ${reconnectAttempts.current}`);
            connect();
          }, Math.pow(2, reconnectAttempts.current) * 1000); // Exponential backoff
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socket) {
      socket.close();
      setSocket(null);
      setIsConnected(false);
    }
  };

  const sendMessage = (message) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  };

  const sendTypingIndicator = (conversationId, isTyping) => {
    sendMessage({
      type: 'typing',
      conversation_id: conversationId,
      is_typing: isTyping
    });
  };

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'pong':
        // Keep-alive response
        break;

      case 'new_message':
        // Handle new message - will be processed by message components
        window.dispatchEvent(new CustomEvent('newMessage', { detail: data }));
        break;

      case 'typing':
        // Handle typing indicator
        setTypingUsers(prev => ({
          ...prev,
          [data.conversation_id]: {
            ...prev[data.conversation_id],
            [data.user_id]: data.is_typing ? data.user_nom : null
          }
        }));
        
        // Clear typing indicator after timeout
        if (data.is_typing) {
          setTimeout(() => {
            setTypingUsers(prev => ({
              ...prev,
              [data.conversation_id]: {
                ...prev[data.conversation_id],
                [data.user_id]: null
              }
            }));
          }, 3000);
        }
        break;

      case 'user_presence':
        // Handle user presence updates
        if (data.status === 'online') {
          setOnlineUsers(prev => [...prev.filter(u => u.user_id !== data.user_id), {
            user_id: data.user_id,
            status: 'online'
          }]);
        } else {
          setOnlineUsers(prev => prev.filter(u => u.user_id !== data.user_id));
        }
        break;

      case 'messages_read':
        // Handle read receipts
        window.dispatchEvent(new CustomEvent('messagesRead', { detail: data }));
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  };

  useEffect(() => {
    if (currentUser) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [currentUser]);

  const value = {
    socket,
    isConnected,
    onlineUsers,
    typingUsers,
    sendMessage,
    sendTypingIndicator,
    connect,
    disconnect
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};