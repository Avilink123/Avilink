import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AcheteurHomePage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  // Section 1: Actions Rapides (Priorité #1 pour acheteurs)
  const actionsRapides = [
    {
      id: 'acheter-volailles',
      title: 'Acheter volailles',
      icon: '🐔🛍️',
      action: () => onNavigate('buy-poultry'),
      color: colors.primary
    },
    {
      id: 'acheter-oeufs',
      title: 'Acheter œufs',
      icon: '🥚🛒',
      action: () => onNavigate('buy-eggs'),
      color: colors.success
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: '💬📩',
      action: () => onNavigate('buyer-messages'),
      color: colors.info
    },
    {
      id: 'calculateur',
      title: 'Calculateur',
      subtitle: 'Calculer les coûts d\'achat\nEstimer les bénéfices',
      icon: '🧮💰',
      action: () => onNavigate('calculateur'),
      color: colors.warning
    }
  ];

  // Section 2: Mes Achats (Suivi des achats)
  const mesAchats = [
    {
      id: 'mes-commandes',
      title: 'Mes commandes',
      value: '3',
      subtitle: 'Commandes actives',
      icon: '📦✅',
      action: () => onNavigate('buyer-orders'),
      color: colors.primary
    },
    {
      id: 'mes-depenses',
      title: 'Mes dépenses',
      value: '85k',
      subtitle: 'FCFA ce mois',
      icon: '💸📊',
      action: () => onNavigate('financial'),
      color: colors.error
    },
    {
      id: 'eleveurs-favoris',
      title: 'Mes éleveurs favoris',
      value: '7',
      subtitle: 'Éleveurs fiables',
      icon: '👨‍🌾⭐',
      action: () => onNavigate('favorite-sellers'),
      color: colors.success
    },
    {
      id: 'stock-recu',
      title: 'Stock reçu',
      value: '25',
      subtitle: 'Volailles livrées',
      icon: '🚛📦',
      action: () => onNavigate('received-orders'),
      color: colors.info
    }
  ];

  // Section 3: Tendance (Informations de marché)
  const tendance = [
    {
      id: 'prix-volailles',
      title: 'Prix volailles',
      subtitle: 'Évolution des prix de volailles',
      icon: '📈🐔',
      action: () => onNavigate('prices'),
      color: colors.primary
    },
    {
      id: 'prix-oeufs',
      title: 'Prix œufs',
      subtitle: 'Évolution des prix des œufs',
      icon: '📈🥚',
      action: () => onNavigate('prices'),
      color: colors.warning
    },
    {
      id: 'meilleurs-eleveurs',
      title: 'Meilleurs éleveurs',
      subtitle: 'Classement par qualité/prix',
      icon: '🏆👨‍🌾',
      action: () => onNavigate('top-sellers'),
      color: colors.success
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      icon: '📞🆘',
      action: () => alert('Support AviMarché Mali - Acheteurs\n📞 +223 XX XX XX XX\n📧 acheteurs@avimarche.ml\n\nServices :\n🛒 Aide aux achats\n💰 Conseils prix\n🚛 Support livraison\n\nHeures : Lundi-Samedi 8h-18h'),
      color: colors.info
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
      <div className="flex flex-col items-center space-y-2">
        <div 
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg"
          style={{ backgroundColor: action.color }}
        >
          <span className="text-xl">{action.icon}</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold leading-tight" style={{ color: colors.text }}>
            {action.title}
          </p>
          {action.subtitle && (
            <p className="text-xs mt-1 leading-tight" style={{ color: colors.textSecondary }}>
              {action.subtitle}
            </p>
          )}
        </div>
      </div>
    </button>
  );

  const renderAchatCard = (item) => (
    <button
      key={item.id}
      onClick={item.action}
      className="p-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
      style={{ 
        backgroundColor: colors.card, 
        border: `2px solid ${item.color}`,
        minHeight: '100px'
      }}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
          style={{ backgroundColor: item.color }}
        >
          <span>{item.icon}</span>
        </div>
        <div>
          <p className="text-xl font-bold" style={{ color: colors.text }}>
            {item.value}
          </p>
          <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>
            {item.title}
          </p>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            {item.subtitle}
          </p>
        </div>
      </div>
    </button>
  );

  const renderTendanceCard = (item) => (
    <button
      key={item.id}
      onClick={item.action}
      className="p-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
      style={{ 
        backgroundColor: colors.card, 
        border: `2px solid ${item.color}`,
        minHeight: '100px'
      }}
    >
      <div className="flex flex-col items-center space-y-2">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
          style={{ backgroundColor: item.color }}
        >
          <span className="text-lg">{item.icon}</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold leading-tight" style={{ color: colors.text }}>
            {item.title}
          </p>
          {item.subtitle && (
            <p className="text-xs mt-1 leading-tight" style={{ color: colors.textSecondary }}>
              {item.subtitle}
            </p>
          )}
        </div>
      </div>
    </button>
  );

  return (
    <div 
      className="min-h-screen pb-24" 
      style={{ backgroundColor: colors.background }}
    >
      {/* Header de bienvenue */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
              🛒 Bienvenue Acheteur !
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Bonjour {currentUser?.nom || 'Acheteur'} - Trouvez les meilleures volailles
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: ACTION RAPIDE */}
      <section className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 px-2" style={{ color: colors.text }}>
            🔥 Action rapide
          </h2>
          <div 
            className="p-4 rounded-xl shadow-sm"
            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
          >
            <div className="grid grid-cols-2 gap-4">
              {actionsRapides.map(renderActionButton)}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MES ACHATS */}
      <section className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 px-2" style={{ color: colors.text }}>
            📊 Mes Achats
          </h2>
          <div 
            className="p-4 rounded-xl shadow-sm"
            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
          >
            <div className="grid grid-cols-2 gap-4">
              {mesAchats.map(renderAchatCard)}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TENDANCE */}
      <section className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 px-2" style={{ color: colors.text }}>
            📈 Tendance
          </h2>
          <div 
            className="p-4 rounded-xl shadow-sm"
            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
          >
            <div className="grid grid-cols-2 gap-4">
              {tendance.map(renderTendanceCard)}
            </div>
          </div>
        </div>
      </section>

      {/* Message d'encouragement */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div 
            className="p-4 rounded-lg text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <p className="text-sm font-medium" style={{ color: colors.text }}>
              🎯 Trouvez les meilleures volailles au Mali !
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Faites de bonnes affaires avec AviMarché
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcheteurHomePage;