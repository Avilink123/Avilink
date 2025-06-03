import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AviculteurHomePage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  // Section 1: Actions principales pour éleveurs - INTERFACE ULTRA-SIMPLE
  const actions = [
    {
      id: 'vendre',
      title: 'Vendre volailles/œufs',
      icon: '🐔💰',
      action: () => onNavigate('vendre-volailles'),
      color: colors.primary
    },
    {
      id: 'acheter-aliments',
      title: 'Acheter aliments volailles',
      icon: '🌾🛒',
      action: () => onNavigate('buy-feed'),
      color: colors.warning
    },
    {
      id: 'acheter-poussins',
      title: 'Acheter poussins/œufs fécondés',
      icon: '🐣🛒',
      action: () => onNavigate('buy-chicks'),
      color: colors.info
    },
    {
      id: 'messages',
      title: 'Mes messages',
      icon: '💬📱',
      action: () => onNavigate('messages'),
      color: colors.success
    }
  ];

  // Section 2: Mon élevage - DONNÉES SIMULÉES SIMPLES
  const monElevage = [
    {
      id: 'stock',
      title: 'Mon stock',
      value: '47',
      subtitle: 'Volailles au total',
      icon: '📦🐔',
      action: () => onNavigate('my-poultry-stock'),
      color: colors.primary
    },
    {
      id: 'valeur',
      title: 'Valeur stock',
      value: '185,000',
      subtitle: 'CFA estimé',
      icon: '💰📊',
      action: () => onNavigate('my-poultry-stock'),
      color: colors.success
    },
    {
      id: 'veterinaire',
      title: 'Vétérinaire',
      value: '3',
      subtitle: 'Contacts disponibles',
      icon: '👨‍⚕️🩺',
      action: () => onNavigate('veterinaire-contacts'),
      color: colors.error
    }
  ];

  // Section 3: Tendance - CONTENU EXACT DEMANDÉ
  const tendance = [
    {
      id: 'prix-volailles',
      title: 'Suivi des prix de volailles sur le marché',
      icon: '📊🐔',
      action: () => onNavigate('prices'),
      color: colors.primary
    },
    {
      id: 'prix-aliments',
      title: 'Suivi des prix des aliments pour volailles sur le marché',
      icon: '📊🌾',
      action: () => onNavigate('feed-prices'),
      color: colors.warning
    },
    {
      id: 'conseils-guides',
      title: 'Conseils et guides pratiques pour aviculteurs',
      icon: '📚🎓',
      action: () => onNavigate('health'),
      color: colors.info
    },
    {
      id: 'noter-fournisseur',
      title: 'Noter un fournisseur d\'aliments',
      icon: '⭐📝',
      action: () => onNavigate('rate-supplier'),
      color: colors.primary
    },
    {
      id: 'mes-evaluations',
      title: 'Voir mes évaluations reçues',
      icon: '📊⭐',
      action: () => onNavigate('my-ratings'),
      color: colors.warning
    },
    {
      id: 'contact-support',
      title: 'Contact support',
      icon: '📞🆘',
      action: () => onNavigate('contact-support'),
      color: colors.success
    }
  ];

  const renderActionButton = (action) => (
    <button
      key={action.id}
      onClick={action.action}
      className="p-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
      style={{ 
        backgroundColor: colors.card, 
        border: `2px solid ${action.color}`,
        minHeight: '100px'
      }}
    >
      <div className="text-4xl mb-2">{action.icon}</div>
      <h3 className="font-bold text-sm text-center leading-tight" style={{ color: colors.text }}>
        {action.title}
      </h3>
    </button>
  );

  const renderStatsCard = (stat) => (
    <button
      key={stat.id}
      onClick={stat.action}
      className="p-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
      style={{ backgroundColor: colors.card }}
    >
      <div className="text-center">
        <div className="text-3xl mb-2">{stat.icon}</div>
        <div className="text-2xl font-bold" style={{ color: stat.color }}>
          {stat.value}
        </div>
        <h4 className="font-bold text-sm mt-1" style={{ color: colors.text }}>
          {stat.title}
        </h4>
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          {stat.subtitle}
        </p>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header accueil éleveur */}
      <div className="px-4 py-6" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">🐔</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Bonjour {currentUser?.prenom || 'Éleveur'} !
          </h1>
          <p className="mt-2" style={{ color: colors.textSecondary }}>
            Votre espace aviculture Mali
          </p>
        </div>
      </div>

      {/* Section 1: Actions principales */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.text }}>
            🎯 Actions Rapides
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {actions.map(renderActionButton)}
          </div>
        </div>
      </div>

      {/* Section 2: Mon élevage */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.text }}>
            🏠 Mon Élevage
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {monElevage.map(renderStatsCard)}
          </div>
        </div>
      </div>

      {/* Section 3: Tendances et outils */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.text }}>
            📈 Outils & Conseils
          </h2>
          <div className="space-y-3">
            {tendance.map(action => (
              <button
                key={action.id}
                onClick={action.action}
                className="w-full p-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 text-left"
                style={{ backgroundColor: colors.card }}
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: action.color, color: 'white' }}
                  >
                    {action.icon.split('')[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm" style={{ color: colors.text }}>
                      {action.title}
                    </h3>
                  </div>
                  <div className="text-2xl" style={{ color: colors.textMuted }}>
                    →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message d'encouragement */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e8f5e8' }}
          >
            <div className="text-4xl mb-2">🌟</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              Bonne journée d'élevage !
            </p>
            <p className="text-xs text-green-700">
              Utilisez AviMarché pour développer votre activité
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AviculteurHomePage;