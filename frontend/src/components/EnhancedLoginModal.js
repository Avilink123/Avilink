import React, { useState } from 'react';
import ModernCard from './ModernCard';
import ModernButton from './ModernButton';
import { BACKGROUND_IMAGES, REGIONS_MALI } from '../constants';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EnhancedLoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginMethod, setLoginMethod] = useState('simple'); // 'simple', 'password', 'sms'
  const [showPassword, setShowPassword] = useState(false);
  const [awaitingSms, setAwaitingSms] = useState(false);
  const [smsData, setSmsData] = useState(null);
  
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    role: 'acheteur',
    localisation: 'Bamako',
    password: '',
    sms_code: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isRegistering) {
        const registerData = { ...formData };
        if (registerData.password === '') {
          delete registerData.password; // Ne pas envoyer mot de passe vide
        }
        
        const response = await axios.post(`${API}/users/register`, registerData);
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setIsRegistering(false);
        setFormData({ nom: '', telephone: '', role: 'acheteur', localisation: 'Bamako', password: '', sms_code: '' });
      } else {
        // Connexion
        const loginData = {
          telephone: formData.telephone
        };

        if (loginMethod === 'password') {
          loginData.password = formData.password;
          loginData.use_sms = false;
        } else if (loginMethod === 'sms') {
          loginData.use_sms = true;
        }

        const response = await axios.post(`${API}/users/login`, loginData);
        
        if (response.data.require_sms_verification) {
          // SMS envoyé, attendre la vérification
          setAwaitingSms(true);
          setSmsData({
            user_id: response.data.user_id,
            method: response.data.method
          });
          alert(`Code SMS envoyé au ${formData.telephone}`);
        } else {
          // Connexion réussie
          onLogin(response.data.user, response.data.token);
          onClose();
        }
      }
    } catch (error) {
      alert(error.response?.data?.detail || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleSmsVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/users/verify-sms`, {
        user_id: smsData.user_id,
        sms_code: formData.sms_code
      });
      
      onLogin(response.data.user, response.data.token);
      onClose();
    } catch (error) {
      alert(error.response?.data?.detail || 'Code SMS incorrect');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ nom: '', telephone: '', role: 'acheteur', localisation: 'Bamako', password: '', sms_code: '' });
    setLoginMethod('simple');
    setAwaitingSms(false);
    setSmsData(null);
    setShowPassword(false);
  };

  if (!isOpen) return null;

  // Interface de vérification SMS
  if (awaitingSms) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Vérification SMS
              </h2>
              
              <form onSubmit={handleSmsVerification} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code reçu par SMS
                  </label>
                  <input
                    type="text"
                    value={formData.sms_code}
                    onChange={(e) => setFormData({...formData, sms_code: e.target.value})}
                    placeholder="Entrez le code à 6 chiffres"
                    maxLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                    required
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAwaitingSms(false);
                      resetForm();
                    }}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading || formData.sms_code.length !== 6}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Vérification...' : 'Vérifier'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Section Image */}
          <div className="relative lg:block hidden">
            <img 
              src={BACKGROUND_IMAGES.marketplace}
              alt="AviMarché Mali"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-blue-600/90 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h2 className="text-3xl font-bold mb-4">Bienvenue sur AviMarché Mali</h2>
                <p className="text-lg mb-6">
                  La plateforme qui connecte éleveurs, acheteurs et fournisseurs
                </p>
                <div className="space-y-2 text-sm">
                  <p>🐔 Volailles de qualité</p>
                  <p>🥚 Œufs frais</p>
                  <p>🌾 Aliments pour animaux</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Formulaire */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {isRegistering ? 'Créer un compte' : 'Se connecter'}
              </h1>
              <button
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom (inscription uniquement) */}
              {isRegistering && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    placeholder="Votre nom complet"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  placeholder="Ex: 70123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Rôle et Localisation (inscription uniquement) */}
              {isRegistering && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vous êtes
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="acheteur">Acheteur</option>
                      <option value="aviculteur">Éleveur</option>
                      <option value="fournisseur">Fournisseur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Région
                    </label>
                    <select
                      value={formData.localisation}
                      onChange={(e) => setFormData({...formData, localisation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {REGIONS_MALI.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  {/* Mot de passe optionnel à l'inscription */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Lock className="inline w-4 h-4 mr-1" />
                      Mot de passe (optionnel)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Laissez vide pour connexion par SMS uniquement"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.password && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Si vous configurez un mot de passe, vous pourrez vous connecter plus rapidement
                    </p>
                  </div>
                </>
              )}

              {/* Options de connexion (connexion uniquement) */}
              {!isRegistering && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Méthode de connexion
                  </label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('simple')}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        loginMethod === 'simple' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <div>
                          <div className="font-medium">Connexion simple</div>
                          <div className="text-xs text-gray-500">Avec votre numéro de téléphone uniquement</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLoginMethod('password')}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        loginMethod === 'password' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Lock size={16} />
                        <div>
                          <div className="font-medium">Connexion par mot de passe</div>
                          <div className="text-xs text-gray-500">Plus rapide si vous avez configuré un mot de passe</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLoginMethod('sms')}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        loginMethod === 'sms' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} />
                        <div>
                          <div className="font-medium">Connexion par SMS</div>
                          <div className="text-xs text-gray-500">Recevoir un code de vérification par SMS</div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Champ mot de passe si méthode password */}
                  {loginMethod === 'password' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          placeholder="Votre mot de passe"
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
              >
                {loading ? 'Chargement...' : isRegistering ? 'Créer le compte' : 'Se connecter'}
              </button>
            </form>

            {/* Lien pour basculer inscription/connexion */}
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  resetForm();
                }}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                {isRegistering 
                  ? 'Déjà un compte ? Se connecter' 
                  : 'Pas de compte ? S\'inscrire'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoginModal;