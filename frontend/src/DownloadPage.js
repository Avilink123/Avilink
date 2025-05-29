import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DownloadPage = () => {
  const [downloadInfo, setDownloadInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDownloadInfo();
  }, []);

  const loadDownloadInfo = async () => {
    try {
      const response = await axios.get(`${API}/download/`);
      setDownloadInfo(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des infos de téléchargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (type) => {
    try {
      const response = await axios.get(`${API}/download/${type}`, {
        responseType: 'blob'
      });
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `avimarche-${type}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Erreur lors du téléchargement du ${type}: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-gray-600">Chargement des fichiers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📦 Téléchargement AviMarché
          </h1>
          <p className="text-xl text-gray-600">
            Télécharge les fichiers pour déployer ton site sur Internet
          </p>
        </div>

        {/* Cards de téléchargement */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Frontend Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🎨</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Frontend</h2>
                <p className="text-blue-600 font-medium">Pour Netlify.com</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Taille:</span>
                <span className="font-medium">{downloadInfo?.files?.frontend?.size_kb} KB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contenu:</span>
                <span className="font-medium">Interface React</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${downloadInfo?.files?.frontend?.available ? 'text-green-600' : 'text-red-600'}`}>
                  {downloadInfo?.files?.frontend?.available ? '✅ Prêt' : '❌ Indisponible'}
                </span>
              </div>
            </div>

            <button
              onClick={() => downloadFile('frontend')}
              disabled={!downloadInfo?.files?.frontend?.available}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors"
            >
              📥 Télécharger Frontend
            </button>
            
            <p className="text-sm text-gray-500 mt-3">
              {downloadInfo?.files?.frontend?.description}
            </p>
          </div>

          {/* Backend Fixed Card (RECOMMANDÉ) */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Backend Corrigé</h2>
                <p className="text-green-600 font-medium">Pour Render.com ⭐</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded p-2 mb-4">
                <span className="text-green-800 font-medium text-sm">⭐ RECOMMANDÉ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taille:</span>
                <span className="font-medium">{downloadInfo?.files?.backend_fixed?.size_kb} KB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contenu:</span>
                <span className="font-medium">API FastAPI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${downloadInfo?.files?.backend_fixed?.available ? 'text-green-600' : 'text-red-600'}`}>
                  {downloadInfo?.files?.backend_fixed?.available ? '✅ Prêt' : '❌ Indisponible'}
                </span>
              </div>
            </div>

            <button
              onClick={() => downloadFile('backend-fixed')}
              disabled={!downloadInfo?.files?.backend_fixed?.available}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors"
            >
              📥 Télécharger Backend Corrigé
            </button>
            
            <p className="text-sm text-gray-500 mt-3">
              {downloadInfo?.files?.backend_fixed?.description}
            </p>
          </div>

          {/* Backend Original Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-gray-400 opacity-75">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Backend Original</h2>
                <p className="text-gray-600 font-medium">Pour Railway.app</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-4">
                <span className="text-yellow-800 font-medium text-sm">⚠️ Problèmes sur Render</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taille:</span>
                <span className="font-medium">{downloadInfo?.files?.backend?.size_kb} KB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contenu:</span>
                <span className="font-medium">API FastAPI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${downloadInfo?.files?.backend?.available ? 'text-green-600' : 'text-red-600'}`}>
                  {downloadInfo?.files?.backend?.available ? '✅ Prêt' : '❌ Indisponible'}
                </span>
              </div>
            </div>

            <button
              onClick={() => downloadFile('backend')}
              disabled={!downloadInfo?.files?.backend?.available}
              className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors"
            >
              📥 Télécharger Backend Original
            </button>
            
            <p className="text-sm text-gray-500 mt-3">
              {downloadInfo?.files?.backend?.description}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            📋 Instructions de Déploiement
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-blue-600 mb-4">🎨 Frontend (Netlify)</h4>
              <ol className="space-y-2 text-gray-700">
                <li><span className="font-medium">1.</span> Télécharge le ZIP Frontend ci-dessus</li>
                <li><span className="font-medium">2.</span> Va sur <a href="https://netlify.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">netlify.com</a></li>
                <li><span className="font-medium">3.</span> Crée un compte gratuit</li>
                <li><span className="font-medium">4.</span> Glisse le ZIP dans la zone de déploiement</li>
                <li><span className="font-medium">5.</span> Configure la variable d'environnement</li>
              </ol>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-green-600 mb-4">⚙️ Backend (Railway)</h4>
              <ol className="space-y-2 text-gray-700">
                <li><span className="font-medium">1.</span> Télécharge le ZIP Backend ci-dessus</li>
                <li><span className="font-medium">2.</span> Va sur <a href="https://railway.app" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">railway.app</a></li>
                <li><span className="font-medium">3.</span> Crée un compte gratuit</li>
                <li><span className="font-medium">4.</span> Déploie le ZIP</li>
                <li><span className="font-medium">5.</span> Configure MongoDB Atlas</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Note importante */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mt-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">Important</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>• Télécharge les <strong>DEUX</strong> fichiers pour avoir un site complet</p>
                <p>• Le Frontend seul ne suffit pas (pas de données)</p>
                <p>• Le Backend seul ne suffit pas (pas d'interface)</p>
                <p>• Tu auras besoin de MongoDB Atlas (gratuit) pour les données</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;