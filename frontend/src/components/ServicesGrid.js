import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ServicesGrid = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  const getAllServices = () => {
    const commonServices = [
      {
        id: 'financial-tools',
        title: 'Outils financiers',
        subtitle: 'Gérer budget élevage',
        icon: '💳',
        action: () => onNavigate('financial'),
        color: colors.success,
        roles: ['aviculteur', 'acheteur']
      },
      {
        id: 'market-analysis',
        title: 'Analyse marché',
        subtitle: 'Tendances et stats',
        icon: '📊',
        action: () => onNavigate('prices'),
        color: colors.info,
        roles: ['all']
      },
      {
        id: 'veterinary-contact',
        title: 'Vétérinaires',
        subtitle: 'Contacts directs',
        icon: '👨‍⚕️',
        action: () => onNavigate('health'),
        color: colors.warning,
        roles: ['all']
      },
      {
        id: 'weather-info',
        title: 'Météo élevage',
        subtitle: 'Conditions climatiques',
        icon: '🌤️',
        action: () => alert('Fonctionnalité météo bientôt disponible !'),
        color: colors.primary,
        roles: ['aviculteur']
      },
      {
        id: 'transport-logistics',
        title: 'Transport',
        subtitle: 'Livraison volailles',
        icon: '🚛',
        action: () => alert('Service transport bientôt disponible !'),
        color: colors.error,
        roles: ['acheteur', 'aviculteur']
      },
      {
        id: 'insurance-info',
        title: 'Assurance',
        subtitle: 'Protéger élevage',
        icon: '🛡️',
        action: () => alert('Informations assurance bientôt disponibles !'),
        color: colors.secondary,
        roles: ['aviculteur']
      },
      {
        id: 'training-resources',
        title: 'Formation',
        subtitle: 'Techniques élevage',
        icon: '🎓',
        action: () => onNavigate('health'),
        color: colors.info,
        roles: ['all']
      },
      {
        id: 'admin-panel',
        title: 'Administration',
        subtitle: 'Panneau admin',
        icon: '⚙️',
        action: () => onNavigate('admin'),
        color: colors.error,
        roles: ['admin']
      }
    ];

    // Filtrer selon le rôle utilisateur
    return commonServices.filter(service => {
      if (service.roles.includes('all')) return true;
      if (!currentUser) return service.roles.includes('guest');
      return service.roles.includes(currentUser.role);
    });
  };

  const services = getAllServices();

  return (
    <section className="px-4 py-6 pb-24"> {/* pb-24 pour éviter overlap avec bottom nav */}
      <div className="max-w-md mx-auto">
        {/* Titre de section */}
        <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
          🛠️ Services
        </h2>

        {/* Grid de services */}
        <div className="grid grid-cols-2 gap-3">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={service.action}
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
                  style={{ backgroundColor: service.color }}
                >
                  {service.icon}
                </div>
                
                {/* Texte */}
                <div className="text-center">
                  <p className="text-sm font-semibold" style={{ color: colors.text }}>
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

        {/* Message de pied */}
        <div 
          className="mt-6 p-3 rounded-lg text-center"
          style={{ backgroundColor: colors.surface }}
        >
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            💚 AviMarché Mali - Votre partenaire aviculture
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;