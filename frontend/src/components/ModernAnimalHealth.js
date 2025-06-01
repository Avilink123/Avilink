import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModernCard from './ModernCard';
import StatCard from './StatCard';
import ModernButton from './ModernButton';
import { BACKGROUND_IMAGES, REGIONS_MALI } from '../constants';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ModernAnimalHealth = ({ currentUser, onNavigate }) => {
  const [diseases, setDiseases] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('diseases');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [reportData, setReportData] = useState({
    symptoms: [],
    location: currentUser?.localisation || '',
    description: ''
  });

  const availableSymptoms = [
    { text: 'Perte d\'appétit', icon: '🥱' },
    { text: 'Diarrhée', icon: '💧' },
    { text: 'Difficultés respiratoires', icon: '😮‍💨' },
    { text: 'Toux', icon: '😷' },
    { text: 'Éternuements', icon: '🤧' },
    { text: 'Léthargie', icon: '😴' },
    { text: 'Plumes ébouriffées', icon: '🪶' },
    { text: 'Chute de production d\'œufs', icon: '🥚' },
    { text: 'Paralysie', icon: '🦴' },
    { text: 'Tremblements', icon: '🫨' },
    { text: 'Écoulement nasal', icon: '👃' },
    { text: 'Gonflement des yeux', icon: '👁️' },
  ];

  useEffect(() => {
    loadHealthData();
  }, [selectedLocation]);

  const loadHealthData = async () => {
    try {
      const [diseasesResponse, vetsResponse] = await Promise.all([
        axios.get(`${API}/diseases`),
        axios.get(`${API}/veterinaires${selectedLocation ? `?localisation=${selectedLocation}` : ''}`)
      ]);
      
      setDiseases(diseasesResponse.data);
      setVeterinarians(vetsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading health data:', error);
      setLoading(false);
    }
  };

  const handleSymptomToggle = (symptom) => {
    const symptoms = reportData.symptoms.includes(symptom)
      ? reportData.symptoms.filter(s => s !== symptom)
      : [...reportData.symptoms, symptom];
    
    setReportData({ ...reportData, symptoms });
  };

  const handleReportSubmit = async () => {
    if (reportData.symptoms.length === 0 || !reportData.location) {
      alert('Veuillez sélectionner au moins un symptôme et une localisation');
      return;
    }

    try {
      await axios.post(`${API}/symptoms/report`, {
        symptoms: reportData.symptoms,
        location: reportData.location,
        description: reportData.description,
        user_phone: currentUser?.telephone || 'anonymous'
      });
      
      alert('Signalement envoyé avec succès ! Un vétérinaire vous contactera si nécessaire.');
      setReportData({ symptoms: [], location: currentUser?.localisation || '', description: '' });
    } catch (error) {
      alert('Erreur lors de l\'envoi du signalement');
    }
  };

  const handleCallVet = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const filteredDiseases = diseases.filter(disease =>
    searchTerm === '' || disease.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVeterinarians = veterinarians.filter(vet =>
    searchTerm === '' || vet.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données de santé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Hero */}
      <ModernCard
        backgroundImage={BACKGROUND_IMAGES.veterinarian}
        gradient
        className="mx-4 mt-6 md:mx-8"
      >
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Santé Animale
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Guide vétérinaire pour un élevage sain
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{diseases.length}</div>
              <div className="text-sm">Maladies</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{veterinarians.length}</div>
              <div className="text-sm">Vétérinaires</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{availableSymptoms.length}</div>
              <div className="text-sm">Symptômes</div>
            </div>
          </div>
        </div>
      </ModernCard>

      <div className="container mx-auto px-4 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Maladies Répertoriées"
            value={diseases.length}
            icon="🦠"
            color="#ef4444"
          />
          <StatCard
            title="Vétérinaires Disponibles"
            value={veterinarians.length}
            icon="👨‍⚕️"
            color="#3b82f6"
          />
          <StatCard
            title="Maladies Urgentes"
            value={diseases.filter(d => d.urgent).length}
            icon="🚨"
            color="#f59e0b"
          />
          <StatCard
            title="Régions Couvertes"
            value={new Set(veterinarians.map(v => v.localisation)).size}
            icon="🗺️"
            color="#8b5cf6"
          />
        </div>

        {/* Navigation par onglets */}
        <ModernCard className="mb-8">
          <div className="grid grid-cols-3 gap-2">
            <ModernButton
              title="🦠 Maladies"
              onClick={() => setActiveTab('diseases')}
              variant={activeTab === 'diseases' ? 'primary' : 'ghost'}
              size="medium"
            />
            <ModernButton
              title="👨‍⚕️ Vétérinaires"
              onClick={() => setActiveTab('vets')}
              variant={activeTab === 'vets' ? 'primary' : 'ghost'}
              size="medium"
            />
            <ModernButton
              title="🚨 Signaler"
              onClick={() => setActiveTab('report')}
              variant={activeTab === 'report' ? 'primary' : 'ghost'}
              size="medium"
            />
          </div>
        </ModernCard>

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'diseases' && (
          <div>
            {/* Recherche */}
            <ModernCard className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une maladie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </ModernCard>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">Maladies Communes</h2>
            
            {filteredDiseases.length === 0 ? (
              <ModernCard className="text-center py-12">
                <div className="text-6xl mb-4">🦠</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune maladie trouvée</h3>
                <p className="text-gray-600">Aucune maladie ne correspond à votre recherche.</p>
              </ModernCard>
            ) : (
              <div className="space-y-6">
                {filteredDiseases.map((disease) => (
                  <ModernCard key={disease.id}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🦠</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-800">{disease.nom}</h3>
                        </div>
                      </div>
                      {disease.urgent && (
                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                          🚨 URGENT
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                          <span className="mr-2">🩺</span>
                          Symptômes
                        </h4>
                        <ul className="space-y-1">
                          {disease.symptomes?.map((symptom, index) => (
                            <li key={index} className="text-sm text-gray-600">• {symptom}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                          <span className="mr-2">🛡️</span>
                          Prévention
                        </h4>
                        <ul className="space-y-1">
                          {disease.prevention?.map((prevention, index) => (
                            <li key={index} className="text-sm text-gray-600">• {prevention}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                          <span className="mr-2">💊</span>
                          Traitement
                        </h4>
                        <ul className="space-y-1">
                          {disease.traitement?.map((treatment, index) => (
                            <li key={index} className="text-sm text-gray-600">• {treatment}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </ModernCard>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vets' && (
          <div>
            {/* Recherche et filtres */}
            <ModernCard className="mb-6">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un vétérinaire..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Filtrer par région:</h3>
                  <div className="flex flex-wrap gap-2">
                    <ModernButton
                      title="Toutes les régions"
                      onClick={() => setSelectedLocation('')}
                      variant={!selectedLocation ? 'primary' : 'outline'}
                      size="small"
                    />
                    {REGIONS_MALI.slice(0, 6).map((region) => (
                      <ModernButton
                        key={region}
                        title={region}
                        onClick={() => setSelectedLocation(selectedLocation === region ? '' : region)}
                        variant={selectedLocation === region ? 'primary' : 'outline'}
                        size="small"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ModernCard>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">Vétérinaires Disponibles</h2>

            {filteredVeterinarians.length === 0 ? (
              <ModernCard className="text-center py-12">
                <div className="text-6xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun vétérinaire trouvé</h3>
                <p className="text-gray-600">Aucun vétérinaire ne correspond à vos critères.</p>
              </ModernCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVeterinarians.map((vet) => (
                  <ModernCard key={vet.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👨‍⚕️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">{vet.nom}</h3>
                        <p className="text-sm text-gray-600">🎯 {vet.specialite}</p>
                        <p className="text-sm text-gray-600">📍 {vet.localisation}</p>
                      </div>
                    </div>

                    <ModernButton
                      title="Appeler le vétérinaire"
                      icon="📞"
                      onClick={() => handleCallVet(vet.telephone)}
                      fullWidth
                      variant="outline"
                    />
                  </ModernCard>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'report' && (
          <div>
            <ModernCard
              backgroundImage={BACKGROUND_IMAGES.chickens}
              gradient
              className="mb-8"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Signaler des Symptômes</h2>
                <p className="text-lg opacity-90">
                  Aidez-nous à surveiller la santé de votre élevage
                </p>
              </div>
            </ModernCard>

            <ModernCard>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Symptômes observés</h3>
                  <p className="text-gray-600 mb-4">
                    Sélectionnez les symptômes que vous avez observés chez vos volailles
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableSymptoms.map((symptom) => (
                      <button
                        key={symptom.text}
                        onClick={() => handleSymptomToggle(symptom.text)}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          reportData.symptoms.includes(symptom.text)
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{symptom.icon}</div>
                        <div className="text-xs font-medium">{symptom.text}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Localisation</h3>
                  <select
                    value={reportData.location}
                    onChange={(e) => setReportData({...reportData, location: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="">Sélectionnez votre région</option>
                    {REGIONS_MALI.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Description additionnelle (optionnel)</h3>
                  <textarea
                    value={reportData.description}
                    onChange={(e) => setReportData({...reportData, description: e.target.value})}
                    rows={4}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="Décrivez plus en détail ce que vous observez..."
                  />
                </div>

                <ModernButton
                  title="Envoyer le signalement"
                  icon="🚨"
                  onClick={handleReportSubmit}
                  fullWidth
                  size="large"
                  disabled={reportData.symptoms.length === 0 || !reportData.location}
                />
              </div>
            </ModernCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernAnimalHealth;