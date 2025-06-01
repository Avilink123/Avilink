import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BottomNavigation = ({ currentPage, onNavigate }) => {
  const { colors } = useTheme();

  // Navigation SIMPLE et ESSENTIELLE pour aviculteurs maliens
  const navItems = [
    {
      id: 'home',
      label: 'Accueil',
      icon: '🏠',
      page: 'home',
      priority: 1
    },
    {
      id: 'sell',
      label: 'Vendre',
      icon: '🐔💰',
      page: 'myproducts',
      priority: 1,
      roleRequired: 'aviculteur'
    },
    {
      id: 'buy',
      label: 'Acheter', 
      icon: '🛒',
      page: 'marketplace',
      priority: 1
    },
    {
      id: 'prices',
      label: 'Prix',
      icon: '💵',
      page: 'prices',
      priority: 1
    },
    {
      id: 'help',
      label: 'Aide',
      icon: '🆘',
      page: 'health',
      priority: 1
    }
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 px-2 py-2 shadow-xl"
      style={{ 
        backgroundColor: colors.card,
        borderTop: `3px solid ${colors.primary}`
      }}
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.page)}
              className="flex flex-col items-center space-y-1 py-3 px-2 rounded-lg transition-all duration-200 min-w-0 flex-1"
              style={{
                backgroundColor: isActive ? colors.primary : 'transparent',
                transform: isActive ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <span 
                className="text-lg font-bold" 
                role="img" 
                aria-label={item.label}
                style={{ filter: isActive ? 'none' : 'grayscale(50%)' }}
              >
                {item.icon}
              </span>
              <span 
                className="text-xs font-bold truncate w-full text-center"
                style={{ 
                  color: isActive ? 'white' : colors.textSecondary,
                  fontSize: '11px'
                }}
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