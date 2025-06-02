import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const PracticalAdvicePage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [activeSection, setActiveSection] = useState('conseils');

  // Conseils pratiques ultra-simples
  const practicalAdvice = [
    {
      id: 1,
      title: 'Nourrir ses volailles',
      icon: '🍽️',
      color: '#4CAF50',
      advice: 'Donnez à manger 2 fois par jour : matin et soir. Toujours de l\'eau propre. 120g par poule par jour.'
    },
    {
      id: 2,
      title: 'Garder ses volailles en santé',
      icon: '💊',
      color: '#2196F3',
      advice: 'Nettoyez le poulailler chaque semaine. Vaccinez au bon moment. Séparez les poules malades.'
    },
    {
      id: 3,
      title: 'Construire un bon poulailler',
      icon: '🏠',
      color: '#FF9800',
      advice: 'Protégez du vent et de la pluie. 4 poules maximum par m². Pondoirs propres et sombres.'
    },
    {
      id: 4,
      title: 'Améliorer la ponte',
      icon: '🥚',
      color: '#9C27B0',
      advice: 'Lumière 14h par jour. Alimentation riche en calcium. Pondoirs confortables et calmes.'
    },
    {
      id: 5,
      title: 'Élever les poussins',
      icon: '🐤',
      color: '#FFC107',
      advice: 'Température 32°C la première semaine. Puis diminuer de 3°C chaque semaine. Nourriture spéciale poussin.'
    },
    {
      id: 6,
      title: 'Bien vendre ses volailles',
      icon: '💰',
      color: '#795548',
      advice: 'Vendez les coqs à 2-3 mois. Les poules pondeuses à 5 mois. Pesez toujours avant de vendre.'
    }
  ];

  // Maladies courantes - Très simplifié
  const commonDiseases = [
    {
      id: 1,
      name: 'Diarrhée',
      icon: '💧',
      color: '#F44336',
      symptoms: 'Selles liquides, volaille faible',
      action: 'Isoler la volaille. Donner de l\'eau avec du sel et du sucre',
      prevention: 'Eau propre toujours. Poulailler sec.'
    },
    {
      id: 2,
      name: 'Toux / Rhume',
      icon: '🤧',
      color: '#3F51B5',
      symptoms: 'Volaille tousse, nez qui coule',
      action: 'Mettre au chaud. Isoler des autres',
      prevention: 'Éviter les courants d\'air froid'
    },
    {
      id: 3,
      name: 'Parasites externes',
      icon: '🐛',
      color: '#607D8B',
      symptoms: 'Volaille se gratte beaucoup, plumes abîmées',
      action: 'Poudrer avec de la terre de diatomée',
      prevention: 'Nettoyer le poulailler souvent'
    },
    {
      id: 4,
      name: 'Arrêt de ponte',
      icon: '🚫',
      color: '#FF5722',
      symptoms: 'Poule ne pond plus',
      action: 'Vérifier alimentation et stress',
      prevention: 'Bon pondoir, alimentation équilibrée'
    },
    {
      id: 5,
      name: 'Blessures aux pattes',
      icon: '🦶',
      color: '#8BC34A',
      symptoms: 'Volaille boite, pattes gonflées',
      action: 'Nettoyer la blessure, isoler',
      prevention: 'Sol propre, pas d\'objets pointus'
    }
  ];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header ultra-simple */}
      <div className="px-4 py-6" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-md mx-auto text-center">
          <button 
            onClick={() => onNavigate('home')}
            className="text-3xl mb-4"
          >
            ← 
          </button>
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Conseils Pratiques
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Tout pour réussir en aviculture
          </p>
        </div>
      </div>

      {/* Navigation simple entre conseils et maladies */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveSection('conseils')}
              className={`flex-1 p-4 rounded-xl font-bold text-center transition-all ${
                activeSection === 'conseils' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeSection === 'conseils' ? colors.primary : colors.card,
                color: activeSection === 'conseils' ? 'white' : colors.text
              }}
            >
              <div className="text-3xl mb-2">✅</div>
              <p>Conseils Pratiques</p>
            </button>
            
            <button
              onClick={() => setActiveSection('maladies')}
              className={`flex-1 p-4 rounded-xl font-bold text-center transition-all ${
                activeSection === 'maladies' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeSection === 'maladies' ? colors.error : colors.card,
                color: activeSection === 'maladies' ? 'white' : colors.text
              }}
            >
              <div className="text-3xl mb-2">🩺</div>
              <p>Maladies Courantes</p>
            </button>
          </div>
        </div>
      </div>

      {/* Section Conseils Pratiques */}
      {activeSection === 'conseils' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              ✅ 6 Conseils Essentiels
            </h2>
            
            <div className="space-y-4">
              {practicalAdvice.map(advice => (
                <div
                  key={advice.id}
                  className="p-4 rounded-xl shadow-sm"
                  style={{ backgroundColor: colors.card }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: advice.color, color: 'white' }}
                    >
                      {advice.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2" style={{ color: colors.text }}>
                        {advice.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                        {advice.advice}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section Maladies Courantes */}
      {activeSection === 'maladies' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              🩺 5 Maladies Fréquentes
            </h2>
            
            <div className="space-y-4">
              {commonDiseases.map(disease => (
                <div
                  key={disease.id}
                  className="p-4 rounded-xl shadow-sm border-2"
                  style={{ 
                    backgroundColor: colors.card,
                    borderColor: disease.color
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: disease.color, color: 'white' }}
                    >
                      {disease.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2" style={{ color: colors.text }}>
                        {disease.name}
                      </h3>
                      
                      {/* Symptômes */}
                      <div className="mb-3">
                        <p className="font-bold text-sm text-red-600 mb-1">🔍 Symptômes :</p>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {disease.symptoms}
                        </p>
                      </div>
                      
                      {/* Que faire */}
                      <div className="mb-3">
                        <p className="font-bold text-sm text-blue-600 mb-1">💊 Que faire :</p>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {disease.action}
                        </p>
                      </div>
                      
                      {/* Prévention */}
                      <div>
                        <p className="font-bold text-sm text-green-600 mb-1">🛡️ Prévention :</p>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {disease.prevention}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message important */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#fff3e0' }}
          >
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-sm font-bold text-orange-800 mb-1">
              Important !
            </p>
            <p className="text-xs text-orange-700">
              Si votre volaille est très malade, contactez rapidement un vétérinaire. Ces conseils sont pour les cas légers.
            </p>
          </div>
        </div>
      </div>

      {/* Encouragement */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e8f5e8' }}
          >
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              Avec ces conseils, vous allez réussir !
            </p>
            <p className="text-xs text-green-700">
              La pratique rend parfait. Commencez doucement et apprenez chaque jour.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticalAdvicePage;