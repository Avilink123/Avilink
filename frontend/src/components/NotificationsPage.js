import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NotificationsPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    }
  }, [currentUser]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API}/notifications?user_id=${currentUser.id}`);
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Erreur lors du chargement des notifications');
      // Demo notifications in case of error
      setNotifications([
        {
          id: '1',
          type: 'new_order',
          title: 'Nouvelle commande reçue',
          message: 'Mamadou Keita veut commander 5 x Poules pondeuses',
          read: false,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          type: 'order_accepted',
          title: 'Commande acceptée',
          message: 'Votre commande pour Maïs concassé a été acceptée',
          read: true,
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`${API}/notifications/${notificationId}/mark-read?user_id=${currentUser.id}`);
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_order': return '🛒';
      case 'order_accepted': return '✅';
      case 'order_rejected': return '❌';
      case 'order_status_update': return '📋';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type, read) => {
    if (read) return colors.textSecondary;
    
    switch (type) {
      case 'new_order': return '#16a34a';
      case 'order_accepted': return '#2563eb';
      case 'order_rejected': return '#dc2626';
      default: return colors.primary;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Maintenant';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h`;
    return `${Math.floor(diffMinutes / 1440)}j`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🔔</div>
          <p className="text-xl" style={{ color: colors.text }}>Chargement notifications...</p>
          <div className="mt-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

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
            🔔 Notifications
          </h1>
          <p className="text-center mt-2" style={{ color: colors.textSecondary }}>
            Vos commandes et messages importants
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 mb-4">
          <div className="max-w-md mx-auto p-3 bg-orange-100 border border-orange-300 rounded-lg text-orange-700 text-sm">
            ⚠️ {error} - Affichage des données de démonstration
          </div>
        </div>
      )}

      {/* Notifications list */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-lg" style={{ color: colors.text }}>Aucune notification</p>
              <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
                Vous recevrez ici vos commandes et messages importants
              </p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-4 rounded-xl shadow-sm cursor-pointer transition-all duration-200 ${
                  !notification.read ? 'border-l-4' : ''
                }`}
                style={{ 
                  backgroundColor: colors.card,
                  borderLeftColor: !notification.read ? getNotificationColor(notification.type, false) : 'transparent'
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 
                        className={`font-bold text-sm ${!notification.read ? 'font-extrabold' : ''}`}
                        style={{ color: getNotificationColor(notification.type, notification.read) }}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      )}
                    </div>
                    <p 
                      className="text-sm leading-relaxed"
                      style={{ color: notification.read ? colors.textSecondary : colors.text }}
                    >
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs" style={{ color: colors.textSecondary }}>
                        {formatTimeAgo(notification.created_at)}
                      </span>
                      {!notification.read && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Nouveau
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-3">
          <button
            onClick={() => onNavigate('orders-received')}
            className="w-full p-4 rounded-xl text-left transition-colors"
            style={{ backgroundColor: colors.card }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📦</span>
              <div>
                <h3 className="font-bold" style={{ color: colors.text }}>
                  Mes commandes reçues
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Gérer les commandes de vos clients
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('orders-sent')}
            className="w-full p-4 rounded-xl text-left transition-colors"
            style={{ backgroundColor: colors.card }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🛒</span>
              <div>
                <h3 className="font-bold" style={{ color: colors.text }}>
                  Mes commandes envoyées
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Suivre vos commandes en cours
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;