import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const FeedMarketPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [aliments, setAliments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');
  const [sortBy, setSortBy] = useState('prix-asc');

  // Simulation données aliments pour volailles
  useEffect(() => {
    const mockAliments = [
      {
        id: '1',
        titre: 'Maïs concassé premium',
        fournisseur: 'Aliments Manding',
        prix: 350,
        unite: 'kg',
        quantite: 500,
        localisation: 'Bamako',
        composition: 'Maïs jaune 100%, protéines 8%',
        type: 'cereales',
        qualite: 'Premium',
        certification: 'Bio Mali',
        description: 'Maïs de haute qualité pour volailles pondeuses et de chair'
      },
      {
        id: '2',
        titre: 'Tourteau de soja',
        fournisseur: 'Feed Solutions Mali',
        prix: 450,
        unite: 'kg',
        quantite: 200,
        localisation: 'Sikasso',
        composition: 'Soja déshuilé, protéines 45%',
        type: 'proteines',
        qualite: 'Standard',
        certification: 'Certifié AAFCO',
        description: 'Source de protéines végétales pour croissance rapide'
      },
      {
        id: '3',
        titre: 'Farine de poisson',
        fournisseur: 'Maritime Feed Mali',
        prix: 750,
        unite: 'kg',
        quantite: 150,
        localisation: 'Mopti',
        composition: 'Poisson 95%, protéines 60%',
        type: 'proteines',
        qualite: 'Premium',
        certification: 'Export Grade',
        description: 'Farine de poisson pour ponte et croissance musculaire'
      },
      {
        id: '4',
        titre: 'Concentré ponte spécial',
        fournisseur: 'Aviculture Plus',
        prix: 520,
        unite: 'kg',
        quantite: 300,
        localisation: 'Kayes',
        composition: 'Vitamines, minéraux, calcium',
        type: 'complements',
        qualite: 'Premium',
        certification: 'Vétérinaire approuvé',
        description: 'Stimule la ponte et améliore la qualité des œufs'
      },
      {
        id: '5',
        titre: 'Son de blé',
        fournisseur: 'Minoterie Sahel',
        prix: 280,
        unite: 'kg',
        quantite: 800,
        localisation: 'Ségou',
        composition: 'Son de blé 100%, fibres 12%',
        type: 'fibres',
        qualite: 'Standard',
        certification: 'Local Mali',
        description: 'Source de fibres et énergie pour la digestion'
      },
      {
        id: '6',
        titre: 'Prémix vitamines A-Z',
        fournisseur: 'Santé Volaille Mali',
        prix: 1200,
        unite: 'kg',
        quantite: 50,
        localisation: 'Bamako',
        composition: 'Vitamines A,D,E,K,B complexe',
        type: 'vitamines',
        qualite: 'Premium',
        certification: 'Pharmaceutique',
        description: 'Complément vitaminique complet pour santé optimale'
      }
    ];

    setTimeout(() => {
      setAliments(mockAliments);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAliments = aliments.filter(aliment => {
    if (filter === 'tous') return true;
    return aliment.type === filter;
  });

  const sortedAliments = [...filteredAliments].sort((a, b) => {
    switch (sortBy) {
      case 'prix-asc':
        return a.prix - b.prix;
      case 'prix-desc':
        return b.prix - a.prix;
      case 'quantite':
        return b.quantite - a.quantite;
      case 'localisation':
        return a.localisation.localeCompare(b.localisation);
      default:
        return 0;
    }
  });

  const handleCommander = (aliment) => {
    alert(
      `📞 Contacter ${aliment.fournisseur}\n\n` +
      `🌾 Produit : ${aliment.titre}\n` +
      `💰 Prix : ${aliment.prix} FCFA/${aliment.unite}\n` +
      `📍 Localisation : ${aliment.localisation}\n` +
      `📦 Stock : ${aliment.quantite} ${aliment.unite}\n\n` +
      `☎️ Appeler maintenant :\n+223 XX XX XX XX\n\n` +
      `💬 Message WhatsApp :\n"Salut, je veux commander ${aliment.titre}"`
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      cereales: '🌾',
      proteines: '🐟',
      complements: '💊',
      fibres: '🌾',
      vitamines: '💉'
    };
    return icons[type] || '🌾';
  };

  const getQualiteColor = (qualite) => {
    return qualite === 'Premium' ? colors.success : colors.info;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p style={{ color: colors.text }}>Chargement du marché des aliments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: colors.surface }}>
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.card }}
            >
              <span className="text-xl">←</span>
            </button>
            <h1 className="text-lg font-bold" style={{ color: colors.text }}>
              🌾 Marché des Aliments
            </h1>
            <div></div>
          </div>
        </div>

        {/* Filtres et tri */}
        <div className="px-4 pb-4">
          <div className="max-w-md mx-auto space-y-3">
            {/* Filtres par type */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'tous', label: 'Tous', icon: '🌾' },
                { key: 'cereales', label: 'Céréales', icon: '🌾' },
                { key: 'proteines', label: 'Protéines', icon: '🐟' },
                { key: 'complements', label: 'Compléments', icon: '💊' },
                { key: 'vitamines', label: 'Vitamines', icon: '💉' }
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="px-3 py-2 rounded-full text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: filter === f.key ? colors.primary : colors.card,
                    color: filter === f.key ? 'white' : colors.text,
                    border: `1px solid ${filter === f.key ? colors.primary : colors.border}`
                  }}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 rounded-lg border text-sm"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text
              }}
            >
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
              <option value="quantite">Stock disponible</option>
              <option value="localisation">Localisation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des aliments */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-4">
          {sortedAliments.map(aliment => (
            <div
              key={aliment.id}
              className="p-4 rounded-xl shadow-lg border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border
              }}
            >
              {/* En-tête */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{getTypeIcon(aliment.type)}</span>
                    <h3 className="font-bold text-base" style={{ color: colors.text }}>
                      {aliment.titre}
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    📍 {aliment.localisation} • {aliment.fournisseur}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getQualiteColor(aliment.qualite) }}
                    >
                      {aliment.qualite}
                    </span>
                    <span className="text-xs" style={{ color: colors.textMuted }}>
                      {aliment.certification}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: colors.primary }}>
                    {aliment.prix}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    FCFA/{aliment.unite}
                  </p>
                </div>
              </div>

              {/* Composition */}
              <div className="mb-3">
                <p className="text-sm" style={{ color: colors.text }}>
                  <span className="font-medium">Composition :</span> {aliment.composition}
                </p>
                <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                  {aliment.description}
                </p>
              </div>

              {/* Stock et action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="font-medium" style={{ color: colors.text }}>Stock :</span>
                    <span className="ml-1" style={{ color: colors.success }}>
                      {aliment.quantite} {aliment.unite}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCommander(aliment)}
                  className="px-4 py-2 rounded-lg font-medium text-white transition-colors text-sm"
                  style={{ backgroundColor: colors.primary }}
                >
                  📞 Commander
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message d'aide */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-lg text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <p className="text-sm font-medium" style={{ color: colors.text }}>
              💡 Conseil Éleveur
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Comparez les prix et privilégiez les fournisseurs locaux pour réduire les coûts de transport
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedMarketPage;