import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const QuickActionsGrid = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  const getQuickActionsForRole = () => {
    if (currentUser?.role === 'aviculteur') {
      return [
        {
          id: 'create-product',
          title: 'Créer annonce',
          subtitle: 'Vendre volailles',
          icon: '➕',
          action: () => onNavigate('myproducts'),
          color: colors.primary
        },
        {
          id: 'my-products',
          title: 'Mes annonces',
          subtitle: 'Gérer stock',
          icon: '📦',
          action: () => onNavigate('myproducts'),
          color: colors.info
        },
        {
          id: 'check-prices',
          title: 'Prix marché',
          subtitle: 'Surveiller',
          icon: '📈',
          action: () => onNavigate('prices'),
          color: colors.warning
        },
        {
          id: 'health-guide',
          title: 'Guide santé',
          subtitle: 'Soigner animaux',
          icon: '🏥',
          action: () => onNavigate('health'),
          color: colors.success
        }
      ];
    } else if (currentUser?.role === 'acheteur') {
      return [
        {
          id: 'browse-market',
          title: 'Voir marché',
          subtitle: 'Acheter volailles',
          icon: '🛒',
          action: () => onNavigate('marketplace'),
          color: colors.primary
        },
        {
          id: 'saved-favorites',
          title: 'Mes favoris',
          subtitle: 'Annonces sauvées',
          icon: '❤️',
          action: () => onNavigate('marketplace'),
          color: colors.error
        },
        {
          id: 'price-alerts',
          title: 'Alertes prix',
          subtitle: 'Suivre évolution',
          icon: '🔔',
          action: () => onNavigate('prices'),
          color: colors.warning
        },
        {
          id: 'contact-sellers',
          title: 'Mes messages',
          subtitle: 'Vendeurs contactés',
          icon: '💬',
          action: () => onNavigate('more'),
          color: colors.info
        }
      ];
    } else {
      return [
        {
          id: 'explore-market',
          title: 'Explorer',
          subtitle: 'Découvrir marché',
          icon: '🔍',
          action: () => onNavigate('marketplace'),
          color: colors.primary
        },
        {
          id: 'view-prices',
          title: 'Prix du jour',
          subtitle: 'Cours actuels',
          icon: '💰',
          action: () => onNavigate('prices'),
          color: colors.warning
        },
        {
          id: 'health-tips',
          title: 'Conseils santé',
          subtitle: 'Guides élevage',
          icon: '📚',
          action: () => onNavigate('health'),
          color: colors.success
        },
        {
          id: 'register',
          title: 'S\'inscrire',
          subtitle: 'Créer compte',
          icon: '👤',
          action: () => onNavigate('login'),
          color: colors.info
        }
      ];
    }
  };

  const quickActions = getQuickActionsForRole();

  return (
    <section className="px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Titre de section */}
        <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
          ⭐ Mes favoris
        </h2>

        {/* Grid d'actions rapides */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="p-4 rounded-xl shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: colors.card, 
                border: `1px solid ${colors.borderLight}` 
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                {/* Icône */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                  style={{ backgroundColor: action.color }}
                >
                  {action.icon}
                </div>
                
                {/* Texte */}
                <div className="text-center">
                  <p className="text-sm font-semibold" style={{ color: colors.text }}>
                    {action.title}
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    {action.subtitle}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActionsGrid;