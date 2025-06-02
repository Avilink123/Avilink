import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BuyPoultryPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [selectedRegion, setSelectedRegion] = useState('toutes');

  // Simulation annonces volailles postées par éleveurs
  const poultryListings = [
    {
      id: '1',
      eleveur: 'Amadou Traoré',
      telephone: '+223 76 12 34 56',
      type: 'Poules pondeuses',
      age: '5 mois',
      quantite: 15,
      prix_unitaire: 3500,
      description: 'Poules en excellente santé, pond bien',
      localisation: 'Bamako, Commune III',
      date_post: '2024-01-15',
      image: '🐔',
      couleur: '#4CAF50',
      race: 'Locale',
      vaccination: 'Complète'
    },
    {
      id: '2',
      eleveur: 'Fatoumata Diallo',
      telephone: '+223 65 43 21 87',
      type: 'Pintades',
      age: '3 mois',
      quantite: 8,
      prix_unitaire: 4200,
      description: 'Pintades grasses et saines',
      localisation: 'Bamako, Commune IV',
      date_post: '2024-01-15',
      image: '🦃',
      couleur: '#FF9800',
      race: 'Locale',
      vaccination: 'Complète'
    },
    {
      id: '3',
      eleveur: 'Ibrahim Keita',
      telephone: '+223 78 87 65 43',
      type: 'Poulets de chair',
      age: '2 mois',
      quantite: 20,
      prix_unitaire: 2800,
      description: 'Poulets bien nourris, prêts à l\'abattage',
      localisation: 'Kati',
      date_post: '2024-01-14',
      image: '🐓',
      couleur: '#2196F3',
      race: 'Améliorer',
      vaccination: 'Partielle'
    },
    {
      id: '4',
      eleveur: 'Mariam Coulibaly',
      telephone: '+223 90 11 22 33',
      type: 'Poules pondeuses',
      age: '6 mois',
      quantite: 12,
      prix_unitaire: 3800,
      description: 'Poules expérimentées, ponte quotidienne',
      localisation: 'Bamako, Commune II',
      date_post: '2024-01-14',
      image: '🐔',
      couleur: '#4CAF50',
      race: 'Améliorer',
      vaccination: 'Complète'
    },
    {
      id: '5',
      eleveur: 'Sekou Sanogo',
      telephone: '+223 76 98 76 54',
      type: 'Coqs reproducteurs',
      age: '8 mois',
      quantite: 3,
      prix_unitaire: 5500,
      description: 'Coqs forts pour reproduction',
      localisation: 'Koulikoro',
      date_post: '2024-01-13',
      image: '🐓',
      couleur: '#E91E63',
      race: 'Locale',
      vaccination: 'Complète'
    },
    {
      id: '6',
      eleveur: 'Awa Traore',
      telephone: '+223 65 43 21 09',
      type: 'Pintades',
      age: '4 mois',
      quantite: 6,
      prix_unitaire: 4500,
      description: 'Pintades prêtes pour fêtes',
      localisation: 'Bamako, Commune V',
      date_post: '2024-01-13',
      image: '🦃',
      couleur: '#FF9800',
      race: 'Locale',
      vaccination: 'Complète'
    }
  ];

  const categories = [
    { value: 'tous', label: 'Toutes volailles', icon: '🐔🦃' },
    { value: 'poules', label: 'Poules pondeuses', icon: '🐔' },
    { value: 'pintades', label: 'Pintades', icon: '🦃' },
    { value: 'poulets', label: 'Poulets de chair', icon: '🐓' },
    { value: 'coqs', label: 'Coqs reproducteurs', icon: '🐓' }
  ];

  const regions = [
    { value: 'toutes', label: 'Toutes régions' },
    { value: 'bamako', label: 'Bamako' },
    { value: 'kati', label: 'Kati' },
    { value: 'koulikoro', label: 'Koulikoro' }
  ];

  const filteredListings = poultryListings.filter(listing => {
    const categoryMatch = selectedCategory === 'tous' || 
      (selectedCategory === 'poules' && listing.type.includes('Poules')) ||
      (selectedCategory === 'pintades' && listing.type.includes('Pintades')) ||
      (selectedCategory === 'poulets' && listing.type.includes('Poulets')) ||
      (selectedCategory === 'coqs' && listing.type.includes('Coqs'));

    const regionMatch = selectedRegion === 'toutes' || 
      listing.localisation.toLowerCase().includes(selectedRegion);

    return categoryMatch && regionMatch;
  });

  const handleContact = (listing) => {
    alert(
      `💬 Contacter ${listing.eleveur}\n\n` +
      `📦 ${listing.type} - ${listing.quantite} disponibles\n` +
      `💰 ${listing.prix_unitaire.toLocaleString()}F par volaille\n` +
      `📍 ${listing.localisation}\n` +
      `📞 ${listing.telephone}\n\n` +
      `Actions disponibles :\n` +
      `• Appeler directement\n` +
      `• Envoyer WhatsApp\n` +
      `• Message via AviMarché`
    );
  };

  const handleOrder = (listing) => {
    alert(
      `🛒 Commander chez ${listing.eleveur}\n\n` +
      `📦 ${listing.type}\n` +
      `💰 ${listing.prix_unitaire.toLocaleString()}F par volaille\n` +
      `📦 ${listing.quantite} disponibles\n\n` +
      `Combien voulez-vous commander ?\n` +
      `(Tapez le nombre dans la prochaine étape)\n\n` +
      `📞 Contact : ${listing.telephone}`
    );
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="px-4 py-6" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-md mx-auto text-center">
          <button 
            onClick={() => onNavigate('home')}
            className="text-3xl mb-4"
          >
            ← 
          </button>
          <div className="text-6xl mb-4">🐔</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Acheter Volailles
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Marché direct avec les éleveurs
          </p>
        </div>
      </div>

      {/* Filtres simples */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Filtre catégorie */}
          <div>
            <h3 className="font-bold mb-3 text-center" style={{ color: colors.text }}>
              🐔 Que cherchez-vous ?
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    selectedCategory === category.value ? 'scale-105 shadow-lg' : ''
                  }`}
                  style={{ 
                    backgroundColor: selectedCategory === category.value ? colors.primary : colors.card,
                    color: selectedCategory === category.value ? 'white' : colors.text,
                    border: selectedCategory === category.value ? 'none' : `1px solid ${colors.border}`
                  }}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <p className="text-xs font-bold">{category.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Filtre région */}
          <div>
            <h3 className="font-bold mb-3 text-center" style={{ color: colors.text }}>
              📍 Où chercher ?
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {regions.map(region => (
                <button
                  key={region.value}
                  onClick={() => setSelectedRegion(region.value)}
                  className={`p-2 rounded-xl text-center transition-all ${
                    selectedRegion === region.value ? 'scale-105' : ''
                  }`}
                  style={{ 
                    backgroundColor: selectedRegion === region.value ? colors.success : colors.card,
                    color: selectedRegion === region.value ? 'white' : colors.text,
                    border: selectedRegion === region.value ? 'none' : `1px solid ${colors.border}`
                  }}
                >
                  <p className="text-sm font-bold">{region.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: colors.text }}>
              🛒 {filteredListings.length} volailles trouvées
            </h2>
            <div 
              className="px-3 py-1 rounded-full text-sm font-bold"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              Mis à jour aujourd'hui
            </div>
          </div>
          
          {filteredListings.length === 0 ? (
            <div 
              className="p-6 rounded-xl text-center"
              style={{ backgroundColor: colors.card }}
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-bold mb-2" style={{ color: colors.text }}>
                Aucune volaille trouvée
              </p>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Essayez de changer les filtres ou revenez plus tard
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredListings.map(listing => (
                <div
                  key={listing.id}
                  className="p-4 rounded-xl shadow-sm border-l-4"
                  style={{ 
                    backgroundColor: colors.card,
                    borderLeftColor: listing.couleur
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ backgroundColor: listing.couleur, color: 'white' }}
                    >
                      {listing.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                          {listing.type}
                        </h3>
                        <div 
                          className="text-xl font-bold"
                          style={{ color: listing.couleur }}
                        >
                          {listing.prix_unitaire.toLocaleString()}F
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <p className="font-bold" style={{ color: colors.primary }}>
                            👨‍🌾 {listing.eleveur}
                          </p>
                          <p style={{ color: colors.textSecondary }}>Éleveur</p>
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: colors.warning }}>
                            📦 {listing.quantite} disponibles
                          </p>
                          <p style={{ color: colors.textSecondary }}>Age: {listing.age}</p>
                        </div>
                      </div>

                      <p className="text-sm mb-3 italic" style={{ color: colors.textSecondary }}>
                        "{listing.description}"
                      </p>

                      <div className="flex items-center justify-between text-xs mb-3">
                        <div>
                          <p style={{ color: colors.textMuted }}>
                            📍 {listing.localisation}
                          </p>
                          <p style={{ color: colors.textMuted }}>
                            🩺 Vaccination: {listing.vaccination}
                          </p>
                        </div>
                        <div className="text-right">
                          <p style={{ color: colors.textMuted }}>
                            📅 {listing.date_post}
                          </p>
                          <p style={{ color: colors.textMuted }}>
                            🧬 Race: {listing.race}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleContact(listing)}
                          className="flex-1 p-3 rounded-lg font-bold text-white"
                          style={{ backgroundColor: colors.primary }}
                        >
                          💬 Contact
                        </button>
                        <button
                          onClick={() => handleOrder(listing)}
                          className="flex-1 p-3 rounded-lg font-bold text-white"
                          style={{ backgroundColor: colors.success }}
                        >
                          🛒 Commander
                        </button>
                        <button
                          onClick={() => alert(`📞 Appeler ${listing.eleveur}\n${listing.telephone}`)}
                          className="p-3 rounded-lg font-bold text-white"
                          style={{ backgroundColor: colors.warning }}
                        >
                          📞
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message d'aide */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e8f5e8' }}
          >
            <div className="text-4xl mb-2">💡</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              Conseil d'achat
            </p>
            <p className="text-xs text-green-700">
              Contactez toujours l'éleveur avant de commander. Vérifiez la santé des volailles sur place si possible !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyPoultryPage;