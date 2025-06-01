import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const RegistrationPage = ({ onNavigate, onRegister }) => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    role: 'aviculteur',
    localisation: '',
    motDePasse: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🐔</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
            Bienvenue sur AviMarché Mali
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Votre plateforme aviculture 100% malienne
          </p>
        </div>

        {/* Formulaire d'inscription */}
        <div 
          className="rounded-xl p-6 shadow-lg"
          style={{ backgroundColor: colors.card, border: `2px solid ${colors.primary}` }}
        >
          <h2 className="text-xl font-semibold mb-6 text-center" style={{ color: colors.text }}>
            Créer votre compte
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                👤 Votre nom complet
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 text-lg"
                style={{ 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
                placeholder="Ex: Amadou Diallo"
                required
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                📞 Numéro de téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 text-lg"
                style={{ 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
                placeholder="Ex: +223 XX XX XX XX"
                required
              />
            </div>

            {/* Rôle */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                💼 Votre activité
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 text-lg"
                style={{ 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
                required
              >
                <option value="aviculteur">🐔 Éleveur de volailles</option>
                <option value="acheteur">🛒 Acheteur de volailles</option>
                <option value="fournisseur">🌾 Fournisseur d'aliments</option>
              </select>
            </div>

            {/* Localisation */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                📍 Votre localisation
              </label>
              <select
                name="localisation"
                value={formData.localisation}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 text-lg"
                style={{ 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
                required
              >
                <option value="">Choisir votre région</option>
                <option value="Bamako">Bamako</option>
                <option value="Kayes">Kayes</option>
                <option value="Koulikoro">Koulikoro</option>
                <option value="Sikasso">Sikasso</option>
                <option value="Ségou">Ségou</option>
                <option value="Mopti">Mopti</option>
                <option value="Tombouctou">Tombouctou</option>
                <option value="Gao">Gao</option>
                <option value="Kidal">Kidal</option>
              </select>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                🔒 Mot de passe
              </label>
              <input
                type="password"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 text-lg"
                style={{ 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text
                }}
                placeholder="Choisir un mot de passe"
                required
              />
            </div>

            {/* Bouton inscription */}
            <button
              type="submit"
              className="w-full py-4 rounded-lg text-white font-bold text-lg transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: colors.primary }}
            >
              🚀 Créer mon compte
            </button>
          </form>

          {/* Lien connexion */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Vous avez déjà un compte ?
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="text-sm font-medium underline"
              style={{ color: colors.primary }}
            >
              Se connecter maintenant
            </button>
          </div>
        </div>

        {/* Footer d'aide */}
        <div className="mt-6 text-center">
          <p className="text-xs" style={{ color: colors.textMuted }}>
            Besoin d'aide ? Appelez : +223 XX XX XX XX
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;