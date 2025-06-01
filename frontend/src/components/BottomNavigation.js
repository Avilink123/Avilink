import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BottomNavigation = ({ currentPage, onNavigate }) => {
  const { colors } = useTheme();

  const navItems = [
    {
      id: 'home',
      label: 'Accueil',
      icon: '🏠',
      page: 'home'
    },
    {
      id: 'marketplace',
      label: 'Marché',
      icon: '🛒',
      page: 'marketplace'
    },
    {
      id: 'prices',
      label: 'Prix',
      icon: '💰',
      page: 'prices'
    },
    {
      id: 'health',
      label: 'Santé',
      icon: '🏥',
      page: 'health'
    },
    {
      id: 'more',
      label: 'Plus',
      icon: '⋯',
      page: 'more'
    }
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 px-2 py-2 shadow-lg"
      style={{ 
        backgroundColor: colors.card,
        borderTop: `1px solid ${colors.border}`
      }}
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.page)}
              className="flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1"
              style={{
                backgroundColor: isActive ? colors.primary : 'transparent',
                color: isActive ? 'white' : colors.textSecondary
              }}
            >
              <span className="text-xl" role="img" aria-label={item.label}>
                {item.icon}
              </span>
              <span 
                className="text-xs font-medium truncate w-full text-center"
                style={{ color: isActive ? 'white' : colors.textSecondary }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;