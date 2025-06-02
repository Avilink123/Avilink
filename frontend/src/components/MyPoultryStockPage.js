import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MyPoultryStockPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');

  useEffect(() => {
    // Simulation stock volailles (simple pour illettrés)
    const mockStock = [
      {
        id: '1',
        type: 'Poules pondeuses',
        quantite: 25,
        age: '8 mois',
        sante: 'Bonne',
        ponte: '20 œufs/jour',
        icon: '🐔',
        valeur: 75000,
        problemes: []
      },
      {
        id: '2',
        type: 'Poulets de chair',
        quantite: 30,
        age: '3 mois',
        sante: 'Excellente',
        ponte: '-',
        icon: '🐓',
        valeur: 90000,
        problemes: []
      },
      {
        id: '3',
        type: 'Pintades',
        quantite: 15,
        age: '6 mois',
        sante: 'Bonne',
        ponte: '8 œufs/semaine',
        icon: '🦃',
        valeur: 45000,
        problemes: []
      },
      {
        id: '4',
        type: 'Poussins',
        quantite: 50,
        age: '2 semaines',
        sante: 'Fragile',
        ponte: '-',
        icon: '🐣',
        valeur: 25000,
        problemes: ['Besoin de chaleur', 'Vaccination nécessaire']
      },
      {
        id: '5',
        type: 'Canards',
        quantite: 8,
        age: '1 an',
        sante: 'Très bonne',
        ponte: '6 œufs/semaine',
        icon: '🦆',
        valeur: 24000,
        problemes: []
      }
    ];

    setTimeout(() => {
      setStock(mockStock);
      setLoading(false);
    }, 800);
  }, []);

  const totalVolailles = stock.reduce((sum, item) => sum + item.quantite, 0);
  const valeurTotale = stock.reduce((sum, item) => sum + item.valeur, 0);

  const filteredStock = stock.filter(item => {
    if (filter === 'tous') return true;
    if (filter === 'problemes') return item.problemes.length > 0;
    if (filter === 'ponte') return item.ponte !== '-';
    return false;
  });

  const handleVoirDetails = (item) => {
    const problemesText = item.problemes.length > 0 
      ? `\n⚠️ À surveiller :\n${item.problemes.map(p => `• ${p}`).join('\n')}`
      : '\n✅ Aucun problème signalé';

    alert(
      `📊 Détails ${item.type}\n\n` +
      `🔢 Quantité : ${item.quantite}\n` +
      `📅 Âge : ${item.age}\n` +
      `❤️ Santé : ${item.sante}\n` +
      `🥚 Ponte : ${item.ponte}\n` +
      `💰 Valeur estimée : ${item.valeur.toLocaleString()} FCFA\n` +
      problemesText
    );
  };

  const handleAjouterVolaille = () => {
    alert(
      `➕ Ajouter des volailles\n\n` +
      `Vous pouvez :\n` +
      `• Acheter des poussins\n` +
      `• Acheter des œufs fécondés\n` +
      `• Enregistrer une nouvelle naissance\n\n` +
      `Utilisez le menu principal pour faire vos achats`
    );
  };

  const handleVendreVolaille = (item) => {
    alert(
      `💰 Vendre ${item.type}\n\n` +
      `Stock disponible : ${item.quantite}\n` +
      `Valeur estimée : ${(item.valeur / item.quantite).toLocaleString()} FCFA/pièce\n\n` +
      `Voulez-vous créer une annonce de vente ?\n` +
      `Cela vous dirigera vers la page "Vendre volailles"`
    );
    onNavigate('vendre-volailles');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-xl" style={{ color: colors.text }}>Chargement de votre stock...</p>
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
            📦 Mon Stock de Volailles
          </h1>
          <p className="text-center mt-2" style={{ color: colors.textSecondary }}>
            Gérez vos volailles facilement
          </p>
        </div>
      </div>

      {/* Résumé du stock */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="p-4 rounded-xl" style={{ backgroundColor: colors.card }}>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                  {totalVolailles}
                </p>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Total volailles
                </p>
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: colors.success }}>
                  {valeurTotale.toLocaleString()}
                </p>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  FCFA - Valeur totale
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres simples */}
      <div className="px-4 py-2">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { key: 'tous', label: 'Tout', icon: '📦' },
              { key: 'ponte', label: 'Qui pondent', icon: '🥚' },
              { key: 'problemes', label: 'À surveiller', icon: '⚠️' }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="p-2 rounded-xl font-bold text-sm"
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

      {/* Liste du stock */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-3">
          {filteredStock.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl shadow-sm"
              style={{ 
                backgroundColor: colors.card,
                borderLeft: item.problemes.length > 0 ? `4px solid ${colors.warning}` : 'none'
              }}
            >
              {/* En-tête */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                      {item.type}
                    </h3>
                    <p className="text-sm" style={{ color: colors.primary }}>
                      {item.quantite} volailles
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg" style={{ color: colors.success }}>
                    {item.valeur.toLocaleString()}
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    FCFA
                  </p>
                </div>
              </div>

              {/* Informations */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <span style={{ color: colors.textSecondary }}>Âge :</span>
                  <p className="font-medium" style={{ color: colors.text }}>{item.age}</p>
                </div>
                <div>
                  <span style={{ color: colors.textSecondary }}>Santé :</span>
                  <p className="font-medium" style={{ color: colors.text }}>{item.sante}</p>
                </div>
                {item.ponte !== '-' && (
                  <div className="col-span-2">
                    <span style={{ color: colors.textSecondary }}>Ponte :</span>
                    <p className="font-medium" style={{ color: colors.success }}>{item.ponte}</p>
                  </div>
                )}
              </div>

              {/* Alertes */}
              {item.problemes.length > 0 && (
                <div className="mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#fff3cd' }}>
                    <p className="text-sm font-medium text-orange-800">
                      ⚠️ À surveiller :
                    </p>
                    {item.problemes.map((probleme, index) => (
                      <p key={index} className="text-xs text-orange-700">
                        • {probleme}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleVoirDetails(item)}
                  className="py-2 rounded-lg font-medium text-sm"
                  style={{ 
                    backgroundColor: colors.surface,
                    color: colors.text
                  }}
                >
                  👁️ Voir
                </button>
                <button
                  onClick={() => handleVendreVolaille(item)}
                  className="py-2 rounded-lg font-medium text-sm text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  💰 Vendre
                </button>
                <button
                  onClick={() => handleVoirDetails(item)}
                  className="py-2 rounded-lg font-medium text-sm"
                  style={{ 
                    backgroundColor: colors.info,
                    color: 'white'
                  }}
                >
                  📊 Stats
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton ajouter */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleAjouterVolaille}
            className="w-full py-4 rounded-xl font-bold text-lg text-white"
            style={{ backgroundColor: colors.success }}
          >
            ➕ Ajouter des volailles
          </button>
        </div>
      </div>

      {/* Message d'aide */}
      <div className="px-4 pb-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <p className="text-lg font-bold" style={{ color: colors.text }}>
              💡 Conseil
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              Surveillez la santé de vos volailles tous les jours pour éviter les maladies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPoultryStockPage;