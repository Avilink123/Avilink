import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const QuickActionsGrid = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  const getQuickActionsForRole = () => {
    if (currentUser?.role === 'aviculteur') {
      // Actions PRIORITAIRES pour aviculteurs maliens - pensées pour illettré
      return [
        {
          id: 'sell-chicken',
          title: 'Vendre Volailles',
          subtitle: 'Gagner argent',
          icon: '🐔💰', // Combinaison visuelle claire
          action: () => onNavigate('myproducts'),
          color: colors.primary,
          priority: 1
        },
        {
          id: 'emergency-vet',
          title: 'SOS Vétérinaire',
          subtitle: 'Urgence maladie',
          icon: '🚨👨‍⚕️',
          action: () => onNavigate('health'),
          color: colors.error,
          priority: 1
        },
        {
          id: 'market-prices',
          title: 'Prix Marché',
          subtitle: 'Voir cours',
          icon: '📊💵',
          action: () => onNavigate('prices'),
          color: colors.warning,
          priority: 1
        },
        {
          id: 'buy-feed',
          title: 'Acheter Aliments',
          subtitle: 'Nourrir volailles',
          icon: '🌾🛒',
          action: () => onNavigate('marketplace'),
          color: colors.success,
          priority: 2
        }
      ];
    } else if (currentUser?.role === 'acheteur') {
      // Actions pour acheteurs - simplicité maximale
      return [
        {
          id: 'buy-chickens',
          title: 'Acheter Volailles',
          subtitle: 'Voir disponible',
          icon: '🐔🛍️',
          action: () => onNavigate('marketplace'),
          color: colors.primary,
          priority: 1
        },
        {
          id: 'check-prices',
          title: 'Comparer Prix',
          subtitle: 'Meilleur marché',
          icon: '💰⚖️',
          action: () => onNavigate('prices'),
          color: colors.warning,
          priority: 1
        },
        {
          id: 'contact-sellers',
          title: 'Appeler Vendeur',
          subtitle: 'Parler direct',
          icon: '📞👨‍🌾',
          action: () => onNavigate('marketplace'),
          color: colors.info,
          priority: 1
        },
        {
          id: 'transport-help',
          title: 'Transport',
          subtitle: 'Livraison aide',
          icon: '🚛📍',
          action: () => alert('Service transport - Appelez : +223 XX XX XX XX'),
          color: colors.secondary,
          priority: 2
        }
      ];
    } else {
      // Utilisateur non connecté - actions d'invitation
      return [
        {
          id: 'discover-market',
          title: 'Voir Marché',
          subtitle: 'Explorer offres',
          icon: '🐔👀',
          action: () => onNavigate('marketplace'),
          color: colors.primary,
          priority: 1
        },
        {
          id: 'join-sellers',
          title: 'Devenir Vendeur',
          subtitle: 'Créer compte',
          icon: '💼🤝',
          action: () => onNavigate('login'),
          color: colors.success,
          priority: 1
        },
        {
          id: 'check-prices',
          title: 'Prix du Jour',
          subtitle: 'Info gratuite',
          icon: '📊🆓',
          action: () => onNavigate('prices'),
          color: colors.warning,
          priority: 1
        },
        {
          id: 'health-guide',
          title: 'Guide Santé',
          subtitle: 'Soins gratuits',
          icon: '📚🏥',
          action: () => onNavigate('health'),
          color: colors.info,
          priority: 2
        }
      ];
    }
  };

  const quickActions = getQuickActionsForRole();

  return (
    <section className="px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Titre plus contextualisé */}
        <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
          {currentUser?.role === 'aviculteur' ? '🔥 Actions Rapides Éleveur' : 
           currentUser?.role === 'acheteur' ? '🛒 Actions Rapides Acheteur' : 
           '⭐ Commencer Maintenant'}
        </h2>

        {/* Grid d'actions - 2x2 pour simplicité */}
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="p-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: colors.card, 
                border: `2px solid ${action.color}`,
                minHeight: '100px' // Plus grande zone tactile
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                {/* Icônes plus grandes et contextuelles */}
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: action.color }}
                >
                  <span className="text-xl">{action.icon}</span>
                </div>
                
                {/* Texte adapté */}
                <div className="text-center">
                  <p className="text-sm font-bold" style={{ color: colors.text }}>
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

        {/* Message d'encouragement contextuel */}
        <div 
          className="mt-4 p-3 rounded-lg text-center"
          style={{ backgroundColor: colors.surface }}
        >
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {currentUser?.role === 'aviculteur' 
              ? '🌱 Bonne vente ! Votre élevage Mali prospère !' 
              : currentUser?.role === 'acheteur'
              ? '🤝 Trouvez les meilleures volailles au Mali !'
              : '💚 Bienvenue sur AviMarché - Simple et efficace !'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuickActionsGrid;