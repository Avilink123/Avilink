import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const DashboardSection = ({ currentUser }) => {
  const { colors } = useTheme();

  const getStatsForRole = () => {
    if (currentUser?.role === 'aviculteur') {
      return [
        { label: 'Mes annonces', value: '12', icon: '📝', color: colors.primary },
        { label: 'Vues cette semaine', value: '248', icon: '👁️', color: colors.info },
        { label: 'Messages reçus', value: '15', icon: '💬', color: colors.warning },
        { label: 'Ventes ce mois', value: '8', icon: '💰', color: colors.success }
      ];
    } else if (currentUser?.role === 'acheteur') {
      return [
        { label: 'Favoris sauvés', value: '7', icon: '❤️', color: colors.error },
        { label: 'Achats ce mois', value: '3', icon: '🛍️', color: colors.success },
        { label: 'Messages envoyés', value: '12', icon: '📩', color: colors.info },
        { label: 'Budget dépensé', value: '425k', icon: '💳', color: colors.warning }
      ];
    } else {
      return [
        { label: 'Annonces vues', value: '89', icon: '👀', color: colors.info },
        { label: 'Recherches', value: '15', icon: '🔍', color: colors.primary },
        { label: 'Prix consultés', value: '32', icon: '📊', color: colors.warning },
        { label: 'Vétérinaires', value: '5', icon: '👨‍⚕️', color: colors.success }
      ];
    }
  };

  const stats = getStatsForRole();

  return (
    <section className="px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Titre de section */}
        <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
          📊 Mon tableau de bord
        </h2>

        {/* Grid de statistiques */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl p-4 shadow-sm"
              style={{ backgroundColor: colors.card, border: `1px solid ${colors.borderLight}` }}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: stat.color }}
                >
                  <span className="text-lg">{stat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-bold" style={{ color: colors.text }}>
                    {stat.value}
                  </p>
                  <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message de statut */}
        <div 
          className="mt-4 p-3 rounded-lg"
          style={{ backgroundColor: colors.surface }}
        >
          <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
            {currentUser?.role === 'aviculteur' 
              ? '🌱 Continuez à bien gérer votre élevage !' 
              : currentUser?.role === 'acheteur'
              ? '🛒 Trouvez les meilleures offres pour vos achats !'
              : '👋 Bienvenue sur AviMarché Mali !'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;