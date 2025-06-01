import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AccessibleHeader = ({ currentUser, onNavigate, onLogout }) => {
  const { isDark, toggleTheme, colors } = useTheme();

  const getUserGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getUserRoleText = () => {
    if (currentUser?.role === 'aviculteur') return 'Éleveur';
    if (currentUser?.role === 'acheteur') return 'Acheteur';
    return 'Utilisateur';
  };

  return (
    <header 
      className="sticky top-0 z-50 px-4 py-3 shadow-sm"
      style={{ backgroundColor: colors.card, borderBottom: `1px solid ${colors.border}` }}
    >
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Profil utilisateur */}
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: colors.primary }}
          >
            {currentUser ? (currentUser.nom?.[0] || currentUser.telephone?.[0] || 'U') : '👤'}
          </div>
          
          <div>
            <p className="text-sm font-medium" style={{ color: colors.text }}>
              {getUserGreeting()} !
            </p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              {currentUser ? `${getUserRoleText()} ${currentUser.nom || currentUser.telephone}` : 'Invité'}
            </p>
          </div>
        </div>

        {/* Actions header */}
        <div className="flex items-center space-x-2">
          {/* Toggle Dark/Light Mode */}
          <button
            onClick={toggleTheme}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ backgroundColor: colors.surface }}
            title={isDark ? 'Mode clair' : 'Mode sombre'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Notifications */}
          <button
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 relative"
            style={{ backgroundColor: colors.surface }}
            title="Notifications"
          >
            🔔
            {/* Badge de notification */}
            <span 
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold text-white flex items-center justify-center"
              style={{ backgroundColor: colors.error }}
            >
              3
            </span>
          </button>

          {/* Menu utilisateur */}
          {currentUser && (
            <button
              onClick={onLogout}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ backgroundColor: colors.surface }}
              title="Déconnexion"
            >
              🚪
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AccessibleHeader;