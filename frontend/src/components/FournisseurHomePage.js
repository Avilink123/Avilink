import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const FournisseurHomePage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  // Section 1: Actions Rapides (Priorité #1 pour fournisseurs)
  const actionsRapides = [
    {
      id: 'publier-stock',
      title: 'Publier stock disponible',
      icon: '🌾📦',
      action: () => onNavigate('my-feed-products'),
      color: colors.primary
    },
    {
      id: 'voir-commandes',
      title: 'Voir commandes reçues',
      icon: '📋✅',
      action: () => onNavigate('feed-orders'),
      color: colors.success
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: '💬📩',
      action: () => onNavigate('farmer-contacts'),
      color: colors.info
    },
    {
      id: 'produits-demandes',
      title: 'Produits les plus demandés sur le marché',
      subtitle: 'Voir les aliments les plus recherchés',
      icon: '📊🔥',
      action: () => alert('Produits les plus demandés cette semaine :\n\n🌾 Maïs concassé - 45 commandes\n🌱 Tourteau de soja - 38 commandes\n🐟 Farine de poisson - 32 commandes\n🥬 Concentré ponte - 28 commandes\n💊 Prémix vitamines - 25 commandes\n\nAdaptez votre stock en conséquence !'),
      color: colors.warning
    }
  ];

  // Section 2: Mon Business (Suivi des activités)
  const monBusiness = [
    {
      id: 'mon-inventaire',
      title: 'Mon inventaire',
      value: '1.2T',
      subtitle: 'Stock aliments total',
      icon: '🌾📦',
      action: () => onNavigate('my-feed-products'),
      color: colors.primary
    },
    {
      id: 'mes-ventes',
      title: 'Mes ventes',
      value: '285k',
      subtitle: 'FCFA ce mois',
      icon: '💰📈',
      action: () => onNavigate('financial'),
      color: colors.success
    },
    {
      id: 'mes-clients',
      title: 'Mes clients',
      value: '28',
      subtitle: 'Éleveurs fidèles',
      icon: '👨‍🌾🤝',
      action: () => onNavigate('farmer-contacts'),
      color: colors.info
    },
    {
      id: 'performance',
      title: 'Performance',
      value: '92%',
      subtitle: 'Satisfaction client',
      icon: '📊⭐',
      action: () => onNavigate('performance-dashboard'),
      color: colors.warning
    }
  ];

  // Section 3: Tendance (Informations de marché)
  const tendance = [
    {
      id: 'prix-marche',
      title: 'Prix du marché',
      subtitle: 'Évolution prix aliments volailles',
      icon: '📈💰',
      action: () => onNavigate('feed-prices'),
      color: colors.primary
    },
    {
      id: 'demande-marche',
      title: 'Demande du marché',
      subtitle: 'Besoins des éleveurs maliens',
      icon: '📊📈',
      action: () => alert('Demande du marché - Semaine actuelle :\n\n📈 En hausse :\n🌾 Maïs (+15%) - Saison sèche\n🐟 Farine poisson (+8%) - Ponte\n\n📉 En baisse :\n🌱 Son de blé (-5%)\n🥬 Verdure (-12%) - Disponible localement\n\n💡 Conseil : Stockez plus de maïs et farine de poisson'),
      color: colors.warning
    },
    {
      id: 'conseils-fournisseurs',
      title: 'Conseils fournisseurs',
      subtitle: 'Guide business aliments volailles',
      icon: '📚💡',
      action: () => alert('Conseils Fournisseurs AviMarché :\n\n✅ Bonnes pratiques :\n• Stockage au sec (< 12% humidité)\n• Rotation des stocks (FIFO)\n• Contrôle qualité régulier\n• Prix compétitifs vs marché\n\n📞 Formation gratuite :\n+223 XX XX XX XX\nTous les jeudis 14h-16h'),
      color: colors.success
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      icon: '📞🆘',
      action: () => alert('Support AviMarché Mali - Fournisseurs\n📞 +223 XX XX XX XX\n📧 fournisseurs@avimarche.ml\n\nServices spécialisés :\n🌾 Conseils stockage aliments\n📊 Analyse demande marché\n💰 Optimisation prix vente\n🚛 Support logistique\n\nHeures : Lundi-Samedi 8h-18h'),
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

  const renderBusinessCard = (item) => (
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
              🌾 Bienvenue Fournisseur !
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Bonjour {currentUser?.nom || 'Fournisseur'} - Approvisionnez les éleveurs maliens
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

      {/* SECTION 2: MON BUSINESS */}
      <section className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 px-2" style={{ color: colors.text }}>
            📊 Mon Business
          </h2>
          <div 
            className="p-4 rounded-xl shadow-sm"
            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
          >
            <div className="grid grid-cols-2 gap-4">
              {monBusiness.map(renderBusinessCard)}
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
              🌾 Vous nourrissez l'aviculture malienne !
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Continuez à bien servir nos éleveurs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FournisseurHomePage;