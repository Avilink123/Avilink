import React from 'react';
import ModernCard from '../components/ModernCard';
import StatCard from '../components/StatCard';
import ModernButton from '../components/ModernButton';
import { BACKGROUND_IMAGES } from '../constants';

const ModernHomePage = ({ stats, currentUser, onNavigate }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  // Calculer les stats spécifiques au rôle
  const getUserStats = () => {
    if (currentUser?.role === 'aviculteur') {
      return {
        myProducts: stats.stats_par_vendeur?.[currentUser.telephone] || 0,
        totalValue: 0, // À calculer depuis les produits de l'utilisateur
        categories: Object.keys(stats.stats_par_type || {}).length,
        activeProducts: stats.total_produits || 0
      };
    } else {
      return {
        totalProducts: stats.total_produits || 0,
        activeVendors: Object.keys(stats.stats_par_vendeur || {}).length,
        categories: Object.keys(stats.stats_par_type || {}).length,
        regions: 11
      };
    }
  };

  const userStats = getUserStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section moderne */}
      <div className="relative">
        <ModernCard
          backgroundImage={BACKGROUND_IMAGES.chickens}
          gradient
          className="mx-4 mt-6 md:mx-8 min-h-[300px] md:min-h-[400px]"
        >
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              AviMarché Mali
            </h1>
            <p className="text-base md:text-xl mb-8 opacity-90 text-white">
              Première plateforme numérique dédiée à l'aviculture au Mali
            </p>
            
            {currentUser ? (
              <div className="space-y-4">
                <p className="text-lg md:text-xl text-white">
                  {getGreeting()} {currentUser.nom} ! 👋
                </p>
                <p className="text-sm md:text-base opacity-80 text-white">
                  {currentUser.role === 'aviculteur' ? '🚜 Aviculteur' : '🛒 Acheteur'} • {currentUser.localisation}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-base md:text-lg opacity-90 text-white">
                  Connectez-vous avec des aviculteurs et acheteurs dans tout le pays
                </p>
                <ModernButton
                  title="Rejoindre AviMarché"
                  size="large"
                  className="bg-white text-green-700 hover:bg-gray-100 shadow-lg"
                  onClick={() => window.location.reload()}
                />
              </div>
            )}
          </div>
        </ModernCard>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Statistiques selon le rôle */}
        <h2 className="text-xl md:text-2xl font-bold text-center mb-8 text-gray-800">
          {currentUser?.role === 'aviculteur' ? 'Mon Activité Avicole' : 'AviMarché en Chiffres'}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {currentUser?.role === 'aviculteur' ? (
            <>
              <StatCard
                title="Mes Annonces"
                value={userStats.myProducts}
                icon="📦"
                color="#16a34a"
              />
              <StatCard
                title="Produits Disponibles"
                value={userStats.activeProducts}
                icon="🛍️"
                color="#3b82f6"
              />
              <StatCard
                title="Catégories"
                value={userStats.categories}
                icon="🏷️"
                color="#f59e0b"
              />
              <StatCard
                title="Ma Région"
                value={currentUser.localisation}
                icon="📍"
                color="#8b5cf6"
              />
            </>
          ) : (
            <>
              <StatCard
                title="Annonces Actives"
                value={userStats.totalProducts}
                icon="📦"
                color="#16a34a"
              />
              <StatCard
                title="Vendeurs Actifs"
                value={userStats.activeVendors}
                icon="👥"
                color="#3b82f6"
              />
              <StatCard
                title="Catégories"
                value={userStats.categories}
                icon="🏷️"
                color="#f59e0b"
              />
              <StatCard
                title="Régions"
                value={userStats.regions}
                icon="🗺️"
                color="#8b5cf6"
              />
            </>
          )}
        </div>

        {/* Actions rapides pour utilisateurs connectés */}
        {currentUser && (
          <div className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">Actions Rapides</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <ModernCard
                backgroundImage={BACKGROUND_IMAGES.marketplace}
                gradient
                className="h-24 md:h-32 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => onNavigate('marketplace')}
              >
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="text-xl md:text-3xl mb-1">🛍️</div>
                  <div className="text-sm md:text-base font-semibold text-white">Marché</div>
                  <div className="text-xs opacity-80 text-white">{stats.total_produits || 0} produits</div>
                </div>
              </ModernCard>

              <ModernCard
                backgroundImage={BACKGROUND_IMAGES.money}
                gradient
                className="h-24 md:h-32 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => onNavigate('prices')}
              >
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="text-xl md:text-3xl mb-1">💰</div>
                  <div className="text-sm md:text-base font-semibold text-white">Prix</div>
                  <div className="text-xs opacity-80 text-white">Tendances</div>
                </div>
              </ModernCard>

              <ModernCard
                backgroundImage={BACKGROUND_IMAGES.veterinarian}
                gradient
                className="h-24 md:h-32 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => onNavigate('health')}
              >
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="text-xl md:text-3xl mb-1">🩺</div>
                  <div className="text-sm md:text-base font-semibold text-white">Santé</div>
                  <div className="text-xs opacity-80 text-white">Guide vétérinaire</div>
                </div>
              </ModernCard>

              {currentUser.role === 'aviculteur' && (
                <ModernCard
                  backgroundImage={BACKGROUND_IMAGES.financial}
                  gradient
                  className="h-24 md:h-32 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => onNavigate('finances')}
                >
                  <div className="text-center h-full flex flex-col justify-center">
                    <div className="text-xl md:text-3xl mb-1">📊</div>
                    <div className="text-sm md:text-base font-semibold text-white">Finances</div>
                    <div className="text-xs opacity-80 text-white">Gestion</div>
                  </div>
                </ModernCard>
              )}
            </div>
          </div>
        )}

        {/* Fonctionnalités principales */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-8 text-gray-800">
            Que pouvez-vous faire sur AviMarché ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <ModernCard className="text-center p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl md:text-3xl">🐔</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Vendre vos Produits</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                Créez des annonces pour vos volailles, œufs et produits dérivés. 
                Atteignez des acheteurs dans tout le Mali.
              </p>
              {currentUser?.role === 'aviculteur' && (
                <ModernButton
                  title="Créer une annonce"
                  variant="outline"
                  size="small"
                  onClick={() => onNavigate('myproducts')}
                />
              )}
            </ModernCard>
            
            <ModernCard className="text-center p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl md:text-3xl">🛒</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Acheter Facilement</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                Trouvez les meilleurs produits avicoles près de chez vous. 
                Contactez directement les vendeurs.
              </p>
              <ModernButton
                title="Voir le marché"
                variant="outline"
                size="small"
                onClick={() => onNavigate('marketplace')}
              />
            </ModernCard>
            
            <ModernCard className="text-center p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl md:text-3xl">🤝</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Réseau Professionnel</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                Connectez-vous avec d'autres professionnels de l'aviculture 
                et développez votre réseau.
              </p>
              <ModernButton
                title="Explorer"
                variant="outline"
                size="small"
                onClick={() => onNavigate('health')}
              />
            </ModernCard>
          </div>
        </div>

        {/* Call to action pour non-connectés */}
        {!currentUser && (
          <ModernCard
            backgroundImage={BACKGROUND_IMAGES.community}
            gradient
            className="text-center py-8 md:py-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Rejoignez la communauté AviMarché
            </h2>
            <p className="text-base md:text-lg mb-8 opacity-90 text-white px-4">
              Connectez-vous dès maintenant et découvrez toutes les opportunités du secteur avicole malien
            </p>
            <ModernButton
              title="S'inscrire gratuitement"
              size="large"
              className="bg-white text-green-700 hover:bg-gray-100 shadow-lg"
              onClick={() => window.location.reload()}
            />
          </ModernCard>
        )}

        {/* Avantages spécifiques au rôle */}
        {currentUser && (
          <div className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
              {currentUser.role === 'aviculteur' ? 'Outils pour Aviculteurs' : 'Outils pour Acheteurs'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentUser.role === 'aviculteur' ? (
                <>
                  <ModernCard className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl md:text-4xl">📋</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base md:text-lg text-gray-800">Gérez vos annonces</h3>
                        <p className="text-gray-600 text-sm">Créez, modifiez et suivez vos annonces de produits</p>
                        <ModernButton
                          title="Mes annonces"
                          variant="ghost"
                          size="small"
                          className="mt-2"
                          onClick={() => onNavigate('myproducts')}
                        />
                      </div>
                    </div>
                  </ModernCard>
                  
                  <ModernCard className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl md:text-4xl">📊</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base md:text-lg text-gray-800">Suivez vos finances</h3>
                        <p className="text-gray-600 text-sm">Gérez revenus, dépenses et analysez votre rentabilité</p>
                        <ModernButton
                          title="Voir finances"
                          variant="ghost"
                          size="small"
                          className="mt-2"
                          onClick={() => onNavigate('finances')}
                        />
                      </div>
                    </div>
                  </ModernCard>
                </>
              ) : (
                <>
                  <ModernCard className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl md:text-4xl">🔍</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base md:text-lg text-gray-800">Recherche avancée</h3>
                        <p className="text-gray-600 text-sm">Filtrez par type, localisation et prix</p>
                        <ModernButton
                          title="Rechercher"
                          variant="ghost"
                          size="small"
                          className="mt-2"
                          onClick={() => onNavigate('marketplace')}
                        />
                      </div>
                    </div>
                  </ModernCard>
                  
                  <ModernCard className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl md:text-4xl">💰</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base md:text-lg text-gray-800">Comparez les prix</h3>
                        <p className="text-gray-600 text-sm">Consultez les tendances en temps réel</p>
                        <ModernButton
                          title="Voir prix"
                          variant="ghost"
                          size="small"
                          className="mt-2"
                          onClick={() => onNavigate('prices')}
                        />
                      </div>
                    </div>
                  </ModernCard>
                </>
              )}
            </div>
          </div>
        )}

        {/* Footer informatif */}
        <div className="mt-12 md:mt-16 text-center">
          <ModernCard className="bg-green-50 border border-green-200 p-6">
            <h3 className="font-semibold text-green-900 mb-2">💡 Le saviez-vous ?</h3>
            <p className="text-green-800 text-sm">
              {currentUser?.role === 'aviculteur' 
                ? `AviMarché vous connecte avec des acheteurs dans tout le Mali. Créez vos annonces et développez votre activité !`
                : `AviMarché connecte des professionnels de l'aviculture à travers le Mali. Trouvez les meilleurs produits près de chez vous !`
              }
            </p>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default ModernHomePage;