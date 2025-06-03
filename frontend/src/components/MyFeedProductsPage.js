import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MyFeedProductsPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  // Produits que les fournisseurs peuvent vendre rapidement
  const produitsAVendre = [
    {
      id: 'mais',
      nom: 'Maïs concassé',
      icon: '🌽',
      description: 'Vendez votre maïs pour volailles',
      action: () => onNavigate('vendre-volailles')
    },
    {
      id: 'soja',
      nom: 'Tourteau de soja',
      icon: '🫘',
      description: 'Vendez votre tourteau de soja',
      action: () => onNavigate('vendre-volailles')
    },
    {
      id: 'concentre',
      nom: 'Concentré ponte',
      icon: '🥣',
      description: 'Vendez vos concentrés alimentaires',
      action: () => onNavigate('vendre-volailles')
    },
    {
      id: 'vitamines',
      nom: 'Vitamines',
      icon: '💊',
      description: 'Vendez vos compléments vitaminés',
      action: () => onNavigate('vendre-volailles')
    },
    {
      id: 'poussins',
      nom: 'Poussins 1 jour',
      icon: '🐤',
      description: 'Vendez vos jeunes poussins',
      action: () => onNavigate('vendre-volailles')
    },
    {
      id: 'oeufs_fecondes',
      nom: 'Œufs fécondés',
      icon: '🥚',
      description: 'Vendez vos œufs à couver',
      action: () => onNavigate('vendre-volailles')
    }
  ];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* VERSION SIMPLIFIÉE FOURNISSEUR V2.0 */}
      {/* Header ultra-simple */}
      <div className="px-4 py-6" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => onNavigate('home')}
            className="text-2xl mb-4"
          >
            ← 
          </button>
          <h1 className="text-3xl font-bold text-center" style={{ color: colors.text }}>
            💰 Vendre mes produits
          </h1>
          <p className="text-center mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Choisissez ce que vous voulez vendre
          </p>
        </div>
      </div>

      {/* Action principale : Vendre tout type */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => onNavigate('vendre-volailles')}
            className="w-full p-6 rounded-2xl shadow-lg text-white font-bold text-xl"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="text-5xl mb-3">🌾💰</div>
            <div>PUBLIER UNE ANNONCE</div>
            <div className="text-sm mt-2 opacity-90">
              Vendez vos produits rapidement
            </div>
          </button>
        </div>
      </div>

      {/* Produits spécifiques - Interface simplifiée */}
      <div className="px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            🔗 Ou choisissez le type de produit :
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {produitsAVendre.map(produit => (
              <button
                key={produit.id}
                onClick={produit.action}
                className="p-4 rounded-xl shadow-sm text-center transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: colors.card }}
              >
                <div className="text-4xl mb-2">{produit.icon}</div>
                <h3 className="font-bold text-sm mb-1" style={{ color: colors.text }}>
                  {produit.nom}
                </h3>
                <p className="text-xs leading-tight" style={{ color: colors.textSecondary }}>
                  {produit.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guide simple */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e8f5e8' }}
          >
            <div className="text-4xl mb-3">📸</div>
            <p className="text-lg font-bold text-green-800 mb-2">
              C'est très simple !
            </p>
            <div className="text-sm text-green-700 space-y-1">
              <p>1️⃣ Cliquez sur "PUBLIER UNE ANNONCE"</p>
              <p>2️⃣ Prenez une photo de vos produits</p>
              <p>3️⃣ Écrivez le prix et la quantité</p>
              <p>4️⃣ Publiez pour vendre !</p>
            </div>
          </div>
        </div>
      </div>

      {/* Aide supplémentaire */}
      <div className="px-4 pb-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <p className="text-lg font-bold" style={{ color: colors.text }}>
              ❓ Besoin d'aide ?
            </p>
            <button
              onClick={() => onNavigate('contact-support')}
              className="mt-2 px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: colors.success }}
            >
              📞 Contacter le support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFeedProductsPage;