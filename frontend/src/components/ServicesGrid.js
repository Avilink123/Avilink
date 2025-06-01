import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ServicesGrid = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  const getEssentialServices = () => {
    const coreServices = [
      {
        id: 'finances-track',
        title: 'Mes Gains',
        subtitle: 'Compter argent',
        icon: '💰📱',
        action: () => onNavigate('financial'),
        color: colors.success,
        roles: ['aviculteur', 'acheteur'],
        priority: 1
      },
      {
        id: 'vet-contacts',
        title: 'Appeler Vétérinaire',
        subtitle: 'Contact direct',
        icon: '📞🩺',
        action: () => onNavigate('health'),
        color: colors.error,
        roles: ['all'],
        priority: 1
      },
      {
        id: 'feed-suppliers',
        title: 'Vendeurs Aliments',
        subtitle: 'Acheter nourriture',
        icon: '🌾📋',
        action: () => onNavigate('marketplace'),
        color: colors.warning,
        roles: ['aviculteur'],
        priority: 1
      },
      {
        id: 'market-news',
        title: 'Infos Marché',
        subtitle: 'Nouvelles prix',
        icon: '📺📈',
        action: () => onNavigate('prices'),
        color: colors.info,
        roles: ['all'],
        priority: 1
      },
      {
        id: 'weather-alert',
        title: 'Météo Élevage',
        subtitle: 'Protéger volailles',
        icon: '🌤️⚠️',
        action: () => alert('Météo: Température 28°C, Humidité 65% - Conditions bonnes pour élevage'),
        color: colors.primary,
        roles: ['aviculteur'],
        priority: 2
      },
      {
        id: 'emergency-numbers',
        title: 'Numéros Urgence',
        subtitle: 'Aide rapide',
        icon: '🚨📞',
        action: () => alert('Urgences:\n🩺 Vétérinaire: +223 XX XX XX XX\n🚓 Police: 17\n🚑 SAMU: 15'),
        color: colors.error,
        roles: ['all'],
        priority: 2
      }
    ];

    // Filtrer selon le rôle - seulement l'essentiel
    return coreServices.filter(service => {
      if (service.roles.includes('all')) return true;
      if (!currentUser) return false; // Invités voient seulement actions rapides
      return service.roles.includes(currentUser.role);
    }).slice(0, 4); // Maximum 4 services pour simplicité
  };

  const services = getEssentialServices();

  // Si pas d'utilisateur connecté, encourager connexion
  if (!currentUser) {
    return (
      <section className="px-4 py-6 pb-24">
        <div className="max-w-md mx-auto">
          <div 
            className="p-6 rounded-xl text-center"
            style={{ backgroundColor: colors.card, border: `2px solid ${colors.primary}` }}
          >
            <div className="text-4xl mb-3">🔐</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
              Connectez-vous pour plus !
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              Accédez à vos finances, contacts vétérinaires et bien plus
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3 px-4 rounded-lg text-white font-bold"
              style={{ backgroundColor: colors.primary }}
            >
              Se connecter maintenant
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-6 pb-24">
      <div className="max-w-md mx-auto">
        {/* Titre contextuel simple */}
        <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
          🛠️ Services Essentiels
        </h2>

        {/* Grid 2x2 pour simplicité */}
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={service.action}
              className="p-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: colors.card, 
                border: `2px solid ${service.color}`,
                minHeight: '100px'
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                {/* Icônes contextuelles et compréhensibles */}
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: service.color }}
                >
                  <span className="text-xl">{service.icon}</span>
                </div>
                
                {/* Texte clair et direct */}
                <div className="text-center">
                  <p className="text-sm font-bold" style={{ color: colors.text }}>
                    {service.title}
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    {service.subtitle}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Aide contextuelle */}
        <div 
          className="mt-6 p-4 rounded-lg text-center"
          style={{ backgroundColor: colors.surface }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: colors.text }}>
            💡 Besoin d'aide ?
          </p>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            Appelez notre support : +223 XX XX XX XX
          </p>
          <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
            Lundi-Samedi : 8h-18h
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;