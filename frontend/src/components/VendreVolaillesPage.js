import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const VendreVolaillesPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    type: 'poules',
    quantite: '',
    prix: '',
    description: '',
    localisation: currentUser?.localisation || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`✅ Annonce publiée avec succès !\n\n📦 ${formData.quantite} ${formData.type}\n💰 ${formData.prix} FCFA\n📍 ${formData.localisation}\n\nVos annonces sont maintenant visibles aux acheteurs !`);
    onNavigate('home');
  };

  const typesVolailles = [
    { value: 'poules', label: '🐔 Poules pondeuses', icon: '🐔' },
    { value: 'pintades', label: '🦃 Pintades', icon: '🦃' },
    { value: 'poussins', label: '🐣 Poussins', icon: '🐣' },
    { value: 'oeufs', label: '🥚 Œufs frais', icon: '🥚' },
    { value: 'oeufs-fecondes', label: '🐣 Œufs fécondés', icon: '🐣' }
  ];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <button onClick={() => onNavigate('home')} className="mb-4 text-blue-600 font-medium">
            ← Retour à l'accueil
          </button>
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
            🐔 Vendre Volailles/Œufs
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Créez votre annonce en quelques clics
          </p>
        </div>
      </div>

      {/* Formulaire simple */}
      <div className="px-4">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Type de volaille */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: colors.card }}>
              <h3 className="font-bold mb-3" style={{ color: colors.text }}>
                Que voulez-vous vendre ?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {typesVolailles.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({...formData, type: type.value})}
                    className={`p-3 rounded-lg border-2 transition-all ${formData.type === type.value ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-xs font-medium">{type.label.split(' ')[1]}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantité */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: colors.card }}>
              <label className="block font-bold mb-2" style={{ color: colors.text }}>
                📊 Combien ?
              </label>
              <input
                type="number"
                value={formData.quantite}
                onChange={(e) => setFormData({...formData, quantite: e.target.value})}
                className="w-full p-3 text-xl border rounded-lg"
                placeholder="Ex: 10"
                required
              />
            </div>

            {/* Prix */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: colors.card }}>
              <label className="block font-bold mb-2" style={{ color: colors.text }}>
                💰 Prix unitaire (FCFA)
              </label>
              <input
                type="number"
                value={formData.prix}
                onChange={(e) => setFormData({...formData, prix: e.target.value})}
                className="w-full p-3 text-xl border rounded-lg"
                placeholder="Ex: 25000"
                required
              />
            </div>

            {/* Description */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: colors.card }}>
              <label className="block font-bold mb-2" style={{ color: colors.text }}>
                📝 Description (optionnel)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: Poules en bonne santé, ponte régulière..."
                rows="3"
              />
            </div>

            {/* Bouton publier */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl text-white font-bold text-lg"
              style={{ backgroundColor: colors.primary }}
            >
              🚀 Publier mon annonce
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendreVolaillesPage;