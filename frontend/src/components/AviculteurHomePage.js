import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AviculteurHomePage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  // Section 1: Actions Rapides (Priorité #1)
  const actionsRapides = [
    {
      id: 'vendre-volailles',
      title: 'Vendre volailles',
      icon: '🐔💰',
      action: () => onNavigate('myproducts'),
      color: colors.primary
    },
    {
      id: 'acheter-aliments',
      title: 'acheter aliments volailles',
      icon: '🌾🛒',
      action: () => onNavigate('feed-market'),
      color: colors.success
    },
    {
      id: 'rappel-vaccin',
      title: 'Rappel vaccin',
      icon: '💉⏰',
      action: () => alert('Prochaine vaccination prévue : Jeudi 15 Juin 2025\n\nVaccin Newcastle + Gumboro\nContactez votre vétérinaire'),
      color: colors.warning
    },
    {
      id: 'appeler-veterinaire',
      title: 'Appeler vétérinaire',
      icon: '📞👨‍⚕️',
      action: () => onNavigate('health'),
      color: colors.error
    }
  ];

  // Section 2: Mon Élevage (Suivi de l'activité)
  const monElevage = [
    {
      id: 'stock-volailles',
      title: 'Mon stock de volailles',
      value: '45',
      subtitle: 'Têtes disponibles',
      icon: '🐔📦',
      action: () => onNavigate('myproducts'),
      color: colors.primary
    },
    {
      id: 'appels-recus',
      title: 'Appels reçus',
      value: '12',
      subtitle: 'Acheteurs intéressés',
      icon: '📞📈',
      action: () => onNavigate('contacts'),
      color: colors.info
    },
    {
      id: 'outils-financiers',
      title: 'Outils financiers',
      value: '125k',
      subtitle: 'FCFA ce mois',
      icon: '💰📊',
      action: () => onNavigate('financial'),
      color: colors.success
    },
    {
      id: 'sante-animale',
      title: 'Santé animale',
      value: '98%',
      subtitle: 'Taux santé',
      icon: '🏥💚',
      action: () => onNavigate('health'),
      color: colors.warning
    }
  ];

  // Section 3: Tendance (Informations de marché et support)
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
      title: 'Suivi prix des aliments pour volailles sur le marché',
      icon: '📊🌾',
      action: () => onNavigate('feed-prices'),
      color: colors.warning
    },
    {
      id: 'conseils-guides',
      title: 'Conseils et guide pratiques pour aviculteurs',
      icon: '📚🎓',
      action: () => onNavigate('health'),
      color: colors.info
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      icon: '📞🆘',
      action: () => alert('Support AviMarché Mali\n📞 +223 XX XX XX XX\n📧 support@avimarche.ml\n\nHeures : Lundi-Samedi 8h-18h'),
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
      <div className="flex flex-col items-center space-y-2">
        <div 
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg"
          style={{ backgroundColor: action.color }}
        >
          <span className="text-xl">{action.icon}</span>
        </div>
        <p className="text-sm font-bold text-center leading-tight" style={{ color: colors.text }}>
          {action.title}
        </p>
      </div>
    </button>
  );

  const renderElevageCard = (item) => (
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
        <p className="text-sm font-bold text-center leading-tight" style={{ color: colors.text }}>
          {item.title}
        </p>
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
              🐔 Bienvenue Éleveur !
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Bonjour {currentUser?.nom || 'Éleveur'} - Gérez votre élevage efficacement
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

      {/* SECTION 2: MON ÉLEVAGE */}
      <section className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 px-2" style={{ color: colors.text }}>
            📊 Mon élevage
          </h2>
          <div 
            className="p-4 rounded-xl shadow-sm"
            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
          >
            <div className="grid grid-cols-2 gap-4">
              {monElevage.map(renderElevageCard)}
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
              🌟 Votre élevage Mali prospère !
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Continuez votre excellent travail d'éleveur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AviculteurHomePage;