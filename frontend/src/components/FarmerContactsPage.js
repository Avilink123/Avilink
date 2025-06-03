import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import EnhancedMessagesPage from './EnhancedMessagesPage';

const FarmerContactsPage = ({ currentUser, onNavigate }) => {
  // Les fournisseurs utilisent maintenant la même messagerie temps réel que tous les autres utilisateurs
  return (
    <EnhancedMessagesPage 
      currentUser={currentUser} 
      onNavigate={onNavigate}
      params={{ 
        title: '👥 Mes Clients Éleveurs',
        subtitle: 'Discutez avec vos clients éleveurs'
      }}
    />
  );
};

export default FarmerContactsPage;
