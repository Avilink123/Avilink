import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const DashboardSection = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  const getRelevantStatsForRole = () => {
    if (currentUser?.role === 'aviculteur') {
      // Stats QUI COMPTENT pour un éleveur malien - Ordre repensé pour faciliter l'accès
      return [
        { 
          label: 'Prix moyen poule', 
          value: '2500', 
          icon: '📊', 
          color: colors.warning,
          subtitle: 'FCFA sur marché'
        },
        { 
          label: 'Vendeurs Aliments', 
          value: '8', 
          icon: '🌾', 
          color: colors.success,
          subtitle: 'Fournisseurs actifs',
          action: () => onNavigate('feed-market') // Vers marché aliments
        },
        { 
          label: 'Volailles à vendre', 
          value: '45', 
          icon: '🐔', 
          color: colors.primary,
          subtitle: 'Stock disponible'
        },
        { 
          label: 'Appels reçus', 
          value: '12', 
          icon: '📞', 
          color: colors.info,
          subtitle: 'Acheteurs intéressés'
        }
      ];
    } else if (currentUser?.role === 'acheteur') {
      // Stats pour acheteurs
      return [
        { 
          label: 'Volailles vues', 
          value: '23', 
          icon: '👀', 
          color: colors.info,
          subtitle: 'Annonces consultées'
        },
        { 
          label: 'Achats ce mois', 
          value: '3', 
          icon: '🛍️', 
          color: colors.success,
          subtitle: 'Transactions'
        },
        { 
          label: 'Économisé', 
          value: '15k', 
          icon: '💵', 
          color: colors.warning,
          subtitle: 'FCFA vs prix magasin'
        },
        { 
          label: 'Vendeurs contactés', 
          value: '5', 
          icon: '🤝', 
          color: colors.primary,
          subtitle: 'Éleveurs'
        }
      ];
    } else {
      // Stats générales pour invités - encourager inscription
      return [
        { 
          label: 'Volailles disponibles', 
          value: '234', 
          icon: '🐔', 
          color: colors.primary,
          subtitle: 'Sur le marché'
        },
        { 
          label: 'Vendeurs actifs', 
          value: '18', 
          icon: '👨‍🌾', 
          color: colors.success,
          subtitle: 'Éleveurs en ligne'
        },
        { 
          label: 'Prix moyen', 
          value: '2300', 
          icon: '💰', 
          color: colors.warning,
          subtitle: 'FCFA par poule'
        },
        { 
          label: 'Nouveaux aujourd\'hui', 
          value: '12', 
          icon: '🆕', 
          color: colors.info,
          subtitle: 'Annonces fraîches'
        }
      ];
    }
  };

  const stats = getRelevantStatsForRole();

  return (
    <section className="px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Titre contextualisé */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
            {currentUser?.role === 'aviculteur' ? '📊 Mon Élevage' : 
             currentUser?.role === 'acheteur' ? '📊 Mes Achats' : 
             '📊 Marché Aujourd\'hui'}
          </h2>
          
          {/* Indicateur de fraîcheur des données */}
          <span 
            className="text-xs px-2 py-1 rounded-full"
            style={{ backgroundColor: colors.success, color: 'white' }}
          >
            🔄 Mis à jour
          </span>
        </div>

        {/* Grid de statistiques - plus espacé */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl p-4 shadow-lg"
              style={{ 
                backgroundColor: colors.card, 
                border: `2px solid ${stat.color}` 
              }}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                {/* Icône plus visible */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: stat.color }}
                >
                  <span>{stat.icon}</span>
                </div>
                
                {/* Valeur principale - plus grande */}
                <div>
                  <p className="text-2xl font-bold" style={{ color: colors.text }}>
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                    {stat.label}
                  </p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message contextuel et encourageant */}
        <div 
          className="mt-4 p-4 rounded-lg text-center"
          style={{ backgroundColor: colors.surface }}
        >
          <p className="text-sm font-medium" style={{ color: colors.text }}>
            {currentUser?.role === 'aviculteur' 
              ? '🌟 Excellent travail ! Votre élevage progresse bien' 
              : currentUser?.role === 'acheteur'
              ? '🎯 Vous trouvez de bonnes affaires sur AviMarché !'
              : '🚀 Rejoignez AviMarché pour suivre vos stats !'}
          </p>
          
          {!currentUser && (
            <button
              onClick={() => onNavigate('login')}
              className="mt-2 px-4 py-2 rounded-lg text-white font-bold text-sm"
              style={{ backgroundColor: colors.primary }}
            >
              Commencer maintenant
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;