import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const VeterinairePage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  const veterinaires = [
    {
      id: 1,
      nom: "Dr. Amadou Sangaré",
      specialite: "Aviculture",
      localisation: "Bamako",
      telephone: "+223 76 45 23 12",
      experience: "15 ans",
      disponible: true,
      tarif: "5,000 FCFA"
    },
    {
      id: 2,
      nom: "Dr. Fatoumata Keita",
      specialite: "Santé animale",
      localisation: "Koulikoro", 
      telephone: "+223 65 78 45 23",
      experience: "12 ans",
      disponible: true,
      tarif: "4,500 FCFA"
    },
    {
      id: 3,
      nom: "Dr. Mamadou Traoré",
      specialite: "Volailles & Vaccination",
      localisation: "Sikasso",
      telephone: "+223 78 12 34 56",
      experience: "20 ans",
      disponible: false,
      tarif: "6,000 FCFA"
    },
    {
      id: 4,
      nom: "Dr. Mariam Diallo",
      specialite: "Médecine vétérinaire",
      localisation: "Ségou",
      telephone: "+223 69 87 65 43",
      experience: "8 ans",
      disponible: true,
      tarif: "4,000 FCFA"
    }
  ];

  const handleCall = (nom, telephone) => {
    if (window.confirm(`Appeler ${nom} ?\n📞 ${telephone}\n\nCet appel peut engendrer des frais selon votre opérateur.`)) {
      window.open(`tel:${telephone}`, '_self');
    }
  };

  const handleEmergency = () => {
    alert('🚨 URGENCE VÉTÉRINAIRE 24h/24\n\n📞 Ligne d\'urgence : +223 XX XX XX XX\n\n⚠️ En cas d\'urgence grave :\n• Isolez l\'animal malade\n• Notez les symptômes\n• Appelez immédiatement\n\n💡 Consultation d\'urgence : 10,000 FCFA');
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <button onClick={() => onNavigate('home')} className="mb-4 text-blue-600 font-medium">
            ← Retour à l'accueil
          </button>
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
            👨‍⚕️ Vétérinaires Région
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Carnet d'adresses vétérinaires de votre région
          </p>
        </div>
      </div>

      {/* Bouton urgence */}
      <div className="px-4 mb-6">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleEmergency}
            className="w-full p-4 rounded-xl text-white font-bold"
            style={{ backgroundColor: colors.error }}
          >
            🚨 URGENCE 24h/24
          </button>
        </div>
      </div>

      {/* Liste des vétérinaires */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-lg font-bold" style={{ color: colors.text }}>
            📋 Vétérinaires disponibles
          </h2>
          
          {veterinaires.map((vet) => (
            <div
              key={vet.id}
              className="p-4 rounded-xl shadow-sm"
              style={{ 
                backgroundColor: colors.card,
                border: `2px solid ${vet.disponible ? colors.success : colors.textMuted}`
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                    {vet.nom}
                  </h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    {vet.specialite}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${vet.disponible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {vet.disponible ? '🟢 Disponible' : '🔴 Occupé'}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <span>📍</span>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    {vet.localisation}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🕐</span>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    {vet.experience} d'expérience
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>💰</span>
                  <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                    Consultation : {vet.tarif}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleCall(vet.nom, vet.telephone)}
                disabled={!vet.disponible}
                className={`w-full py-3 rounded-lg font-bold text-white ${vet.disponible ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
                style={{ backgroundColor: vet.disponible ? colors.primary : colors.textMuted }}
              >
                📞 Appeler maintenant
              </button>
            </div>
          ))}

          {/* Conseils pratiques */}
          <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
            <h3 className="font-bold mb-2" style={{ color: colors.text }}>
              💡 Conseils avant l'appel
            </h3>
            <div className="text-sm space-y-1" style={{ color: colors.textSecondary }}>
              <p>• Préparez la description des symptômes</p>
              <p>• Notez depuis quand l'animal est malade</p>
              <p>• Ayez le nombre d'animaux affectés</p>
              <p>• Mentionnez les traitements déjà donnés</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeterinairePage;