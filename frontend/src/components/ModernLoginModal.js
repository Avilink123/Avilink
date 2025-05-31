import React, { useState } from 'react';
import ModernCard from './ModernCard';
import ModernButton from './ModernButton';
import { BACKGROUND_IMAGES, REGIONS_MALI } from '../constants';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ModernLoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    role: 'acheteur',
    localisation: 'Bamako'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isRegistering) {
        const response = await axios.post(`${API}/users/register`, formData);
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setIsRegistering(false);
        setFormData({ nom: '', telephone: '', role: 'acheteur', localisation: 'Bamako' });
      } else {
        const response = await axios.post(`${API}/users/login`, {
          telephone: formData.telephone
        });
        onLogin(response.data.user, response.data.token);
        onClose();
      }
    } catch (error) {
      alert(error.response?.data?.detail || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Section Image */}
          <div 
            className="hidden lg:block bg-cover bg-center relative"
            style={{ backgroundImage: `url(${BACKGROUND_IMAGES.chickens})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-green-800/90 flex flex-col justify-center items-center text-white p-8">
              <div className="text-center">
                <div className="text-6xl mb-6">🐔</div>
                <h2 className="text-3xl font-bold mb-4">AviMarché Mali</h2>
                <p className="text-lg opacity-90 mb-8">
                  Rejoignez la première plateforme numérique dédiée à l'aviculture au Mali
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🛍️</div>
                    <div>Marché en ligne</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">💰</div>
                    <div>Suivi des prix</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">🩺</div>
                    <div>Santé animale</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">📊</div>
                    <div>Gestion financière</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Formulaire */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {isRegistering ? 'Créer un compte' : 'Se connecter'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Logo mobile */}
            <div className="lg:hidden text-center mb-6">
              <div className="text-5xl mb-2">🐔</div>
              <h3 className="text-xl font-bold text-green-700">AviMarché Mali</h3>
              <p className="text-gray-600 text-sm">Plateforme Avicole</p>
            </div>

            {/* Toggle entre connexion et inscription */}
            <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
              <ModernButton
                title="Connexion"
                onClick={() => setIsRegistering(false)}
                variant={!isRegistering ? 'primary' : 'ghost'}
                size="small"
                className="flex-1 rounded-md"
              />
              <ModernButton
                title="Inscription"
                onClick={() => setIsRegistering(true)}
                variant={isRegistering ? 'primary' : 'ghost'}
                size="small"
                className="flex-1 rounded-md"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vous êtes :
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, role: 'acheteur'})}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          formData.role === 'acheteur'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">🛒</div>
                        <div className="font-medium">Acheteur</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, role: 'aviculteur'})}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          formData.role === 'aviculteur'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">🚜</div>
                        <div className="font-medium">Aviculteur</div>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Région *
                    </label>
                    <select
                      value={formData.localisation}
                      onChange={(e) => setFormData({...formData, localisation: e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
                    >
                      {REGIONS_MALI.map((region) => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="Ex: +223 70 12 34 56"
                />
              </div>
              
              <ModernButton
                title={loading ? 'Chargement...' : (isRegistering ? "S'inscrire" : 'Se connecter')}
                type="submit"
                disabled={loading}
                loading={loading}
                fullWidth
                size="large"
                className="mt-6"
              />
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                {isRegistering ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLoginModal;