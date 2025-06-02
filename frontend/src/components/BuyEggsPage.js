import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BuyEggsPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [selectedType, setSelectedType] = useState('tous');
  const [selectedRegion, setSelectedRegion] = useState('toutes');

  // Simulation annonces œufs postées par éleveurs
  const eggListings = [
    {
      id: '1',
      eleveur: 'Amadou Traoré',
      telephone: '+223 76 12 34 56',
      type: 'Œufs de consommation',
      source: 'Poules pondeuses',
      quantite: 120,
      prix_unitaire: 125,
      description: 'Œufs frais, collectés chaque matin',
      localisation: 'Bamako, Commune III',
      date_post: '2024-01-15',
      fraicheur: 'Moins de 24h',
      image: '🥚',
      couleur: '#FFB74D',
      taille: 'Moyen'
    },
    {
      id: '2',
      eleveur: 'Fatoumata Diallo',
      telephone: '+223 65 43 21 87',
      type: 'Œufs fécondés',
      source: 'Poules locales',
      quantite: 48,
      prix_unitaire: 350,
      description: 'Œufs fécondés pour couvaison',
      localisation: 'Bamako, Commune IV',
      date_post: '2024-01-15',
      fraicheur: 'Moins de 48h',
      image: '🥚',
      couleur: '#4CAF50',
      taille: 'Gros'
    },
    {
      id: '3',
      eleveur: 'Ibrahim Keita',
      telephone: '+223 78 87 65 43',
      type: 'Œufs de consommation',
      source: 'Poules améliorées',
      quantite: 200,
      prix_unitaire: 140,
      description: 'Œufs bio, poules nourries au maïs',
      localisation: 'Kati',
      date_post: '2024-01-14',
      fraicheur: 'Moins de 12h',
      image: '🥚',
      couleur: '#FFB74D',
      taille: 'Gros'
    },
    {
      id: '4',
      eleveur: 'Mariam Coulibaly',
      telephone: '+223 90 11 22 33',
      type: 'Œufs de pintades',
      source: 'Pintades locales',
      quantite: 60,
      prix_unitaire: 180,
      description: 'Œufs de pintades, goût authentique',
      localisation: 'Bamako, Commune II',
      date_post: '2024-01-14',
      fraicheur: 'Moins de 36h',
      image: '🥚',
      couleur: '#FF9800',
      taille: 'Petit'
    },
    {
      id: '5',
      eleveur: 'Sekou Sanogo',
      telephone: '+223 76 98 76 54',
      type: 'Œufs fécondés',
      source: 'Race améliorée',
      quantite: 24,
      prix_unitaire: 450,
      description: 'Œufs fécondés race Sussex',
      localisation: 'Koulikoro',
      date_post: '2024-01-13',
      fraicheur: 'Moins de 24h',
      image: '🥚',
      couleur: '#4CAF50',
      taille: 'Très gros'
    },
    {
      id: '6',
      eleveur: 'Awa Traore',
      telephone: '+223 65 43 21 09',
      type: 'Œufs de consommation',
      source: 'Élevage familial',
      quantite: 80,
      prix_unitaire: 115,
      description: 'Œufs villageois, poules élevées au sol',
      localisation: 'Bamako, Commune V',
      date_post: '2024-01-13',
      fraicheur: 'Moins de 18h',
      image: '🥚',
      couleur: '#FFB74D',
      taille: 'Moyen'
    }
  ];

  const eggTypes = [
    { value: 'tous', label: 'Tous les œufs', icon: '🥚🥚' },
    { value: 'consommation', label: 'Œufs consommation', icon: '🥚' },
    { value: 'fecondes', label: 'Œufs fécondés', icon: '🐣' },
    { value: 'pintades', label: 'Œufs de pintades', icon: '🦃' }
  ];

  const regions = [
    { value: 'toutes', label: 'Toutes régions' },
    { value: 'bamako', label: 'Bamako' },
    { value: 'kati', label: 'Kati' },
    { value: 'koulikoro', label: 'Koulikoro' }
  ];

  const filteredListings = eggListings.filter(listing => {
    const typeMatch = selectedType === 'tous' || 
      (selectedType === 'consommation' && listing.type.includes('consommation')) ||
      (selectedType === 'fecondes' && listing.type.includes('fécondés')) ||
      (selectedType === 'pintades' && listing.type.includes('pintades'));

    const regionMatch = selectedRegion === 'toutes' || 
      listing.localisation.toLowerCase().includes(selectedRegion);

    return typeMatch && regionMatch;
  });

  const handleContact = (listing) => {
    alert(
      `💬 Contacter ${listing.eleveur}\n\n` +
      `🥚 ${listing.type} - ${listing.quantite} disponibles\n` +
      `💰 ${listing.prix_unitaire.toLocaleString()}F par œuf\n` +
      `📍 ${listing.localisation}\n` +
      `⏰ Fraîcheur: ${listing.fraicheur}\n` +
      `📞 ${listing.telephone}\n\n` +
      `Actions disponibles :\n` +
      `• Appeler directement\n` +
      `• Envoyer WhatsApp\n` +
      `• Message via AviMarché`
    );
  };

  const handleOrder = (listing) => {
    const totalPossible = listing.quantite * listing.prix_unitaire;
    alert(
      `🛒 Commander chez ${listing.eleveur}\n\n` +
      `🥚 ${listing.type}\n` +
      `💰 ${listing.prix_unitaire.toLocaleString()}F par œuf\n` +
      `📦 ${listing.quantite} disponibles\n` +
      `⏰ ${listing.fraicheur}\n\n` +
      `💡 Si vous prenez tout : ${totalPossible.toLocaleString()}F\n\n` +
      `Combien d'œufs voulez-vous ?\n` +
      `📞 Contact : ${listing.telephone}`
    );
  };

  const getFraicheurColor = (fraicheur) => {
    if (fraicheur.includes('12h')) return '#4CAF50';
    if (fraicheur.includes('24h')) return '#8BC34A';
    if (fraicheur.includes('36h')) return '#FF9800';
    return '#FF5722';
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
          <div className="text-6xl mb-4">🥚</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Acheter Œufs
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Œufs frais directement des éleveurs
          </p>
        </div>
      </div>

      {/* Filtres simples */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Filtre type œufs */}
          <div>
            <h3 className="font-bold mb-3 text-center" style={{ color: colors.text }}>
              🥚 Quel type d'œufs ?
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {eggTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    selectedType === type.value ? 'scale-105 shadow-lg' : ''
                  }`}
                  style={{ 
                    backgroundColor: selectedType === type.value ? colors.warning : colors.card,
                    color: selectedType === type.value ? 'white' : colors.text,
                    border: selectedType === type.value ? 'none' : `1px solid ${colors.border}`
                  }}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <p className="text-xs font-bold">{type.label}</p>
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
              🥚 {filteredListings.length} lots d'œufs trouvés
            </h2>
            <div 
              className="px-3 py-1 rounded-full text-sm font-bold"
              style={{ backgroundColor: colors.warning, color: 'white' }}
            >
              Frais du jour
            </div>
          </div>
          
          {filteredListings.length === 0 ? (
            <div 
              className="p-6 rounded-xl text-center"
              style={{ backgroundColor: colors.card }}
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-bold mb-2" style={{ color: colors.text }}>
                Aucun œuf trouvé
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
                          {listing.prix_unitaire}F
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <p className="font-bold" style={{ color: colors.primary }}>
                            👨‍🌾 {listing.eleveur}
                          </p>
                          <p style={{ color: colors.textSecondary }}>Source: {listing.source}</p>
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: colors.warning }}>
                            📦 {listing.quantite} œufs
                          </p>
                          <p style={{ color: colors.textSecondary }}>Taille: {listing.taille}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span 
                            className="text-xs font-bold px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: getFraicheurColor(listing.fraicheur) }}
                          >
                            ⏰ {listing.fraicheur}
                          </span>
                          <span 
                            className="text-xs font-bold px-2 py-1 rounded-full"
                            style={{ backgroundColor: colors.surface, color: colors.text }}
                          >
                            📏 {listing.taille}
                          </span>
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
                            📅 Posté: {listing.date_post}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: colors.success }}>
                            💰 Total: {(listing.quantite * listing.prix_unitaire).toLocaleString()}F
                          </p>
                          <p style={{ color: colors.textMuted }}>
                            Si vous prenez tout
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
            style={{ backgroundColor: '#fff3e0' }}
          >
            <div className="text-4xl mb-2">💡</div>
            <p className="text-sm font-bold text-orange-800 mb-1">
              Conseils œufs frais
            </p>
            <p className="text-xs text-orange-700">
              Plus l'œuf est frais, meilleur il est ! Préférez les œufs de moins de 24h. Pour les œufs fécondés, vérifiez qu'ils n'ont pas été secoués.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyEggsPage;