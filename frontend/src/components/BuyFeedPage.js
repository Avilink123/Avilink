import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BuyFeedPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [aliments, setAliments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');

  useEffect(() => {
    // Simulation données aliments pour volailles (simple pour illettrés)
    const mockAliments = [
      {
        id: '1',
        nom: 'Maïs pour volailles',
        fournisseur: 'Mamadou Keita',
        prix: 300,
        stock: 100,
        localisation: 'Sikasso',
        telephone: '+223 76 12 34 56',
        type: 'cereales',
        description: 'Maïs de qualité pour vos volailles'
      },
      {
        id: '2',
        nom: 'Nourriture complète',
        fournisseur: 'Fatoumata Diarra',
        prix: 450,
        stock: 50,
        localisation: 'Bamako',
        telephone: '+223 65 43 21 98',
        type: 'complet',
        description: 'Nourriture complète riche en vitamines'
      },
      {
        id: '3',
        nom: 'Son de blé',
        fournisseur: 'Ibrahim Coulibaly',
        prix: 250,
        stock: 200,
        localisation: 'Ségou',
        telephone: '+223 78 87 65 43',
        type: 'cereales',
        description: 'Son de blé pour bien nourrir vos poules'
      },
      {
        id: '4',
        nom: 'Vitamines pour ponte',
        fournisseur: 'Aminata Touré',
        prix: 800,
        stock: 30,
        localisation: 'Mopti',
        telephone: '+223 69 78 45 12',
        type: 'vitamines',
        description: 'Aide vos poules à pondre plus d\'œufs'
      },
      {
        id: '5',
        nom: 'Protéines poisson',
        fournisseur: 'Sekou Traoré',
        prix: 600,
        stock: 80,
        localisation: 'Kayes',
        telephone: '+223 72 85 96 30',
        type: 'proteines',
        description: 'Protéines de poisson pour volailles fortes'
      },
      {
        id: '6',
        nom: 'Mélange complet poulets',
        fournisseur: 'Mariam Sidibé',
        prix: 400,
        stock: 120,
        localisation: 'Bamako',
        telephone: '+223 77 99 88 77',
        type: 'complet',
        description: 'Tout ce qu\'il faut pour vos poulets'
      }
    ];

    setTimeout(() => {
      setAliments(mockAliments);
      setLoading(false);
    }, 800);
  }, []);

  const filteredAliments = aliments.filter(aliment => {
    if (filter === 'tous') return true;
    return aliment.type === filter;
  });

  const handleCommander = (aliment) => {
    alert(
      `📞 Appeler ${aliment.fournisseur}\n\n` +
      `🌾 ${aliment.nom}\n` +
      `💰 ${aliment.prix} FCFA/kg\n` +
      `📍 ${aliment.localisation}\n` +
      `📦 Stock : ${aliment.stock} kg\n\n` +
      `☎️ Téléphone :\n${aliment.telephone}\n\n` +
      `💬 Dire : "Je veux acheter ${aliment.nom}"`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🌾</div>
          <p className="text-xl" style={{ color: colors.text }}>Chargement des aliments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header simple */}
      <div className="px-4 py-6" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => onNavigate('home')}
            className="text-2xl mb-4"
          >
            ← 
          </button>
          <h1 className="text-2xl font-bold text-center" style={{ color: colors.text }}>
            🌾 Acheter Aliments Volailles
          </h1>
          <p className="text-center mt-2" style={{ color: colors.textSecondary }}>
            Trouvez de la bonne nourriture pour vos volailles
          </p>
        </div>
      </div>

      {/* Filtres simples */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { key: 'tous', label: 'Tout', icon: '🌾' },
              { key: 'cereales', label: 'Grains', icon: '🌾' },
              { key: 'complet', label: 'Complet', icon: '🍽️' },
              { key: 'vitamines', label: 'Vitamines', icon: '💊' }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="p-3 rounded-xl font-bold text-lg"
                style={{
                  backgroundColor: filter === f.key ? colors.primary : colors.card,
                  color: filter === f.key ? 'white' : colors.text
                }}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des aliments */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-4">
          {filteredAliments.map(aliment => (
            <div
              key={aliment.id}
              className="p-4 rounded-xl shadow-lg"
              style={{ backgroundColor: colors.card }}
            >
              {/* En-tête produit */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                    🌾 {aliment.nom}
                  </h3>
                  <p className="text-sm" style={{ color: colors.primary }}>
                    👨‍🌾 {aliment.fournisseur}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    📍 {aliment.localisation}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: colors.success }}>
                    {aliment.prix}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    FCFA/kg
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <p className="text-sm" style={{ color: colors.text }}>
                  {aliment.description}
                </p>
              </div>

              {/* Stock */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    📦 Stock disponible :
                  </span>
                  <span className="font-bold text-sm" style={{ color: colors.success }}>
                    {aliment.stock} kg
                  </span>
                </div>
              </div>

              {/* Bouton commander */}
              <button
                onClick={() => handleCommander(aliment)}
                className="w-full py-3 rounded-xl font-bold text-lg text-white"
                style={{ backgroundColor: colors.primary }}
              >
                📞 Appeler pour commander
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Message d'aide */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <p className="text-lg font-bold" style={{ color: colors.text }}>
              💡 Conseil
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              Choisissez des aliments de qualité pour avoir des volailles en bonne santé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyFeedPage;