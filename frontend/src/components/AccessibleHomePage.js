import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import DashboardSection from './DashboardSection';
import QuickActionsGrid from './QuickActionsGrid';
import ServicesGrid from './ServicesGrid';

const AccessibleHomePage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  return (
    <div 
      className="min-h-screen pb-20" 
      style={{ backgroundColor: colors.background }}
    >
      {/* Section Dashboard */}
      <DashboardSection currentUser={currentUser} onNavigate={onNavigate} />
      
      {/* Section Actions Rapides */}
      <QuickActionsGrid currentUser={currentUser} onNavigate={onNavigate} />
      
      {/* Section Services */}
      <ServicesGrid currentUser={currentUser} onNavigate={onNavigate} />
    </div>
  );
};

export default AccessibleHomePage;