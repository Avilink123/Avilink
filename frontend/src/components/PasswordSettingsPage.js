import React, { useState } from 'react';

const PasswordSettingsPage = ({ onBack, currentUser }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const hasPassword = currentUser.password ? true : false;

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (!/[0-9]/.test(password)) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validations
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (hasPassword && !currentPassword) {
      setError('Veuillez entrer votre mot de passe actuel');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        new_password: newPassword
      };
      
      if (hasPassword) {
        requestData.current_password = currentPassword;
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/set-password?user_id=${currentUser.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        }
      );

      if (response.ok) {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Erreur lors de la configuration du mot de passe');
      }
    } catch (error) {
      setError('Erreur de connexion. Vérifiez votre internet.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = () => {
    switch (currentUser.role) {
      case 'aviculteur': return 'blue';
      case 'acheteur': return 'green';
      case 'fournisseur': return 'purple';
      default: return 'gray';
    }
  };

  const color = getRoleColor();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-${color}-600 text-white p-4`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className={`p-2 hover:bg-${color}-700 rounded-lg transition-colors text-2xl`}
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold">Configuration Mot de Passe</h1>
            <p className={`text-${color}-100`}>
              {hasPassword ? 'Modifier votre mot de passe' : 'Créer un mot de passe'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Message de succès */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            ✅
            <div>
              <p className="font-semibold">Mot de passe configuré avec succès !</p>
              <p className="text-sm">Vous pouvez maintenant utiliser ce mot de passe pour vous connecter.</p>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Erreur</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Informations actuelles */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className={`text-${color}-600`} size={24} />
            État Actuel
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">Mot de passe</p>
                <p className="text-sm text-gray-600">
                  {hasPassword ? 'Configuré' : 'Non configuré'}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${hasPassword ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">Connexion SMS</p>
                <p className="text-sm text-gray-600">Toujours disponible</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>

        {/* Formulaire de configuration */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {hasPassword ? 'Changer le Mot de Passe' : 'Créer un Mot de Passe'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mot de passe actuel (si existe) */}
            {hasPassword && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Lock className="inline w-4 h-4 mr-1" />
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe actuel"
                    className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Nouveau mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Lock className="inline w-4 h-4 mr-1" />
                {hasPassword ? 'Nouveau mot de passe' : 'Mot de passe'}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Entrez votre nouveau mot de passe"
                  className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirmer nouveau mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Lock className="inline w-4 h-4 mr-1" />
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre nouveau mot de passe"
                  className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Critères de mot de passe */}
            <div className={`bg-${color}-50 p-4 rounded-lg`}>
              <h3 className={`font-semibold text-${color}-800 mb-2`}>Critères du mot de passe :</h3>
              <ul className="text-sm space-y-1">
                <li className={`flex items-center gap-2 ${newPassword.length >= 6 ? 'text-green-600' : 'text-gray-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  Au moins 6 caractères
                </li>
                <li className={`flex items-center gap-2 ${/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  Au moins un chiffre
                </li>
                <li className={`flex items-center gap-2 ${newPassword === confirmPassword && newPassword ? 'text-green-600' : 'text-gray-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${newPassword === confirmPassword && newPassword ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  Les mots de passe correspondent
                </li>
              </ul>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              className={`w-full py-4 rounded-lg text-white font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                loading || !newPassword || !confirmPassword || newPassword !== confirmPassword
                  ? 'bg-gray-400 cursor-not-allowed'
                  : `bg-${color}-600 hover:bg-${color}-700`
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Configuration...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  {hasPassword ? 'Changer le Mot de Passe' : 'Créer le Mot de Passe'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Avantages du mot de passe */}
        <div className={`bg-${color}-50 rounded-xl p-6 shadow-lg`}>
          <h2 className={`text-xl font-bold text-${color}-800 mb-4`}>
            💡 Avantages d'un Mot de Passe
          </h2>
          <div className="space-y-2 text-sm">
            <p>• <strong>Connexion plus rapide :</strong> Pas besoin d'attendre le SMS</p>
            <p>• <strong>Plus de sécurité :</strong> Protection supplémentaire de votre compte</p>
            <p>• <strong>Fonctionnement hors ligne :</strong> Connexion même sans réseau</p>
            <p>• <strong>SMS toujours disponible :</strong> Option de secours si vous oubliez</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSettingsPage;