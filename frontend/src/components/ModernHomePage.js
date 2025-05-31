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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section moderne */}
      <ModernCard
        backgroundImage={BACKGROUND_IMAGES.chickens}
        gradient
        className="mx-4 mt-6 md:mx-8 min-h-[400px]"
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            AviMarché Mali
          </h1>
          <p className="text-lg md:text-2xl mb-8 opacity-90">
            Première plateforme numérique dédiée à l'aviculture au Mali
          </p>
          
          {currentUser ? (
            <div className="space-y-4">
              <p className="text-xl">
                {getGreeting()} {currentUser.nom} ! 👋
              </p>
              <p className="text-base opacity-80">
                {currentUser.role === 'aviculteur' ? '🚜 Aviculteur' : '🛒 Acheteur'} • {currentUser.localisation}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-lg opacity-90">
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

      {/* Statistiques modernes */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
          AviMarché en Chiffres
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Annonces Actives"
            value={stats.total_produits || 0}
            icon="📦"
            color="#16a34a"
          />
          <StatCard
            title="Utilisateurs Inscrits"
            value={stats.total_utilisateurs || 0}
            icon="👥"
            color="#3b82f6"
          />
          <StatCard
            title="Catégories"
            value={Object.keys(stats.stats_par_type || {}).length}
            icon="🏷️"
            color="#f59e0b"
          />
          <StatCard
            title="Régions Couvertes"
            value="11"
            icon="🗺️"
            color="#8b5cf6"
          />
        </div>

        {/* Actions rapides pour utilisateurs connectés */}
        {currentUser && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Actions Rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ModernCard
                backgroundImage={BACKGROUND_IMAGES.marketplace}
                gradient
                className="h-32 cursor-pointer"
                onClick={() => onNavigate('marketplace')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🛍️</div>
                  <div className="font-semibold">Marché</div>
                  <div className="text-sm opacity-80">{stats.total_produits || 0} produits</div>
                </div>
              </ModernCard>

              <ModernCard
                backgroundImage={BACKGROUND_IMAGES.money}
                gradient
                className="h-32 cursor-pointer"
                onClick={() => onNavigate('prices')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="font-semibold">Prix</div>
                  <div className="text-sm opacity-80">Tendances du marché</div>
                </div>
              </ModernCard>

              <ModernCard
                backgroundImage={BACKGROUND_IMAGES.veterinarian}
                gradient
                className="h-32 cursor-pointer"
                onClick={() => onNavigate('health')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🩺</div>
                  <div className="font-semibold">Santé</div>
                  <div className="text-sm opacity-80">Guide vétérinaire</div>
                </div>
              </ModernCard>

              {currentUser.role === 'aviculteur' && (
                <ModernCard
                  backgroundImage={BACKGROUND_IMAGES.financial}
                  gradient
                  className="h-32 cursor-pointer"
                  onClick={() => onNavigate('finances')}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="font-semibold">Finances</div>
                    <div className="text-sm opacity-80">Gestion comptable</div>
                  </div>
                </ModernCard>
              )}
            </div>
          </div>
        )}

        {/* Fonctionnalités principales */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
            Que pouvez-vous faire sur AviMarché ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ModernCard className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🐔</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Vendre vos Produits</h3>
              <p className="text-gray-600">
                Créez des annonces pour vos volailles, œufs et produits dérivés. 
                Atteignez des acheteurs dans tout le Mali.
              </p>
              {currentUser?.role === 'aviculteur' && (
                <ModernButton
                  title="Créer une annonce"
                  variant="outline"
                  className="mt-4"
                  onClick={() => onNavigate('myproducts')}
                />
              )}
            </ModernCard>
            
            <ModernCard className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Acheter Facilement</h3>
              <p className="text-gray-600">
                Trouvez les meilleurs produits avicoles près de chez vous. 
                Contactez directement les vendeurs.
              </p>
              <ModernButton
                title="Voir le marché"
                variant="outline"
                className="mt-4"
                onClick={() => onNavigate('marketplace')}
              />
            </ModernCard>
            
            <ModernCard className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Réseau Professionnel</h3>
              <p className="text-gray-600">
                Connectez-vous avec d'autres professionnels de l'aviculture 
                et développez votre réseau.
              </p>
              <ModernButton
                title="Explorer"
                variant="outline"
                className="mt-4"
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
            className="text-center py-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Rejoignez la communauté AviMarché
            </h2>
            <p className="text-lg mb-8 opacity-90">
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {currentUser.role === 'aviculteur' ? 'Outils pour Aviculteurs' : 'Outils pour Acheteurs'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentUser.role === 'aviculteur' ? (
                <>
                  <ModernCard>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">📋</div>
                      <div>
                        <h3 className="font-semibold text-lg">Gérez vos annonces</h3>
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
                  
                  <ModernCard>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">📊</div>
                      <div>
                        <h3 className="font-semibold text-lg">Suivez vos finances</h3>
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
                  <ModernCard>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">🔍</div>
                      <div>
                        <h3 className="font-semibold text-lg">Recherche avancée</h3>
                        <p className="text-gray-600 text-sm">Filtrez par type, localisation et prix pour trouver ce que vous cherchez</p>
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
                  
                  <ModernCard>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">💰</div>
                      <div>
                        <h3 className="font-semibold text-lg">Comparez les prix</h3>
                        <p className="text-gray-600 text-sm">Consultez les tendances et prix du marché en temps réel</p>
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
        <div className="mt-16 text-center">
          <ModernCard className="bg-green-50 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">💡 Le saviez-vous ?</h3>
            <p className="text-green-800 text-sm">
              AviMarché connecte plus de {stats.total_utilisateurs || 0} professionnels de l'aviculture à travers le Mali. 
              Rejoignez cette communauté dynamique et développez votre activité !
            </p>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default ModernHomePage;