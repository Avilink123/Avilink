import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const PracticalAdvicePage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('conseils');

  const conseilsPratiques = [
    {
      id: '1',
      titre: 'Nourrir correctement ses volailles',
      icon: '🌾',
      conseils: [
        'Donnez à manger 2 fois par jour : matin et soir',
        'Mélangez différents aliments : maïs, soja, vitamines',
        'Laissez toujours de l\'eau propre',
        'Un poulet mange environ 100g par jour',
        'Augmentez la nourriture si elles pondent beaucoup'
      ]
    },
    {
      id: '2',
      titre: 'Garder ses volailles en bonne santé',
      icon: '❤️',
      conseils: [
        'Nettoyez le poulailler toutes les semaines',
        'Regardez vos volailles tous les jours',
        'Séparez les volailles malades rapidement',
        'Vaccinez selon les conseils du vétérinaire',
        'Donnez des vitamines une fois par semaine'
      ]
    },
    {
      id: '3',
      titre: 'Construire un bon poulailler',
      icon: '🏠',
      conseils: [
        'Protégez du soleil et de la pluie',
        'Laissez circuler l\'air mais pas le vent fort',
        'Comptez 4 volailles par mètre carré maximum',
        'Mettez des perchoirs à 50cm du sol',
        'Fermez la nuit pour éviter les voleurs'
      ]
    },
    {
      id: '4',
      titre: 'Améliorer la ponte des œufs',
      icon: '🥚',
      conseils: [
        'Donnez du concentré ponte une fois par semaine',
        'Laissez 14 heures de lumière par jour',
        'Mettez des pondoirs confortables',
        'Ramassez les œufs 2 fois par jour',
        'Poules pondent mieux entre 6 mois et 2 ans'
      ]
    },
    {
      id: '5',
      titre: 'Élever des poussins',
      icon: '🐣',
      conseils: [
        'Gardez les poussins au chaud (30°C)',
        'Nourriture spéciale poussin les 8 premières semaines',
        'Eau dans des petits abreuvoirs',
        'Vaccinez à 1 semaine (Newcastle)',
        'Séparez des grandes volailles'
      ]
    },
    {
      id: '6',
      titre: 'Vendre au bon prix',
      icon: '💰',
      conseils: [
        'Pesez vos volailles avant de vendre',
        'Vendez les poulets à 2-3 kg pour bon prix',
        'Vendez les œufs frais (maximum 7 jours)',
        'Négociez les prix selon la saison',
        'Fidélisez vos bons clients'
      ]
    }
  ];

  const maladiesCommunes = [
    {
      id: '1',
      maladie: 'Newcastle (maladie mortelle)',
      icon: '🦠',
      symptomes: [
        'Volailles qui toussent et éternuent',
        'Difficultés à respirer',
        'Tête tordue, ne tiennent pas debout',
        'Diarrhée verte',
        'Mort rapide (1-2 jours)'
      ],
      queFaire: [
        '🚨 URGENCE ! Appelez vétérinaire immédiatement',
        'Séparez toutes les volailles malades',
        'Ne touchez pas sans gants',
        'Brûlez les volailles mortes',
        'Vaccinez les volailles saines'
      ],
      prevention: 'Vaccination obligatoire tous les 6 mois'
    },
    {
      id: '2',
      maladie: 'Coccidiose (parasites intestinaux)',
      icon: '🐛',
      symptomes: [
        'Diarrhée avec du sang',
        'Volailles fatiguées et tristes',
        'Mangent moins',
        'Maigrissent rapidement',
        'Poussins plus touchés'
      ],
      queFaire: [
        'Donnez des médicaments anti-coccidies',
        'Nettoyez le poulailler à fond',
        'Changez l\'eau tous les jours',
        'Séparez les malades',
        'Consultez vétérinaire si ça continue'
      ],
      prevention: 'Garder poulailler propre et sec'
    },
    {
      id: '3',
      maladie: 'Gumboro (maladie des poussins)',
      icon: '🐣',
      symptomes: [
        'Poussins de 3-6 semaines touchés',
        'Diarrhée blanche',
        'Tremblements',
        'Se cachent et mangent peu',
        'Mort en 3-4 jours'
      ],
      queFaire: [
        'Appelez vétérinaire rapidement',
        'Donnez vitamines dans l\'eau',
        'Gardez au chaud',
        'Nourriture facile à digérer',
        'Désinfectez tout'
      ],
      prevention: 'Vaccination à 2-3 semaines'
    },
    {
      id: '4',
      maladie: 'Bronchite infectieuse',
      icon: '😤',
      symptomes: [
        'Toux et difficultés respiratoires',
        'Écoulement nasal',
        'Baisse de ponte chez poules',
        'Œufs déformés',
        'Volailles fatiguées'
      ],
      queFaire: [
        'Isolez les volailles malades',
        'Donnez vitamines C et E',
        'Gardez au chaud et au sec',
        'Antibiotiques si prescrit par vétérinaire',
        'Aérez bien le poulailler'
      ],
      prevention: 'Éviter courants d\'air froids'
    },
    {
      id: '5',
      maladie: 'Poux et puces',
      icon: '🕷️',
      symptomes: [
        'Volailles se grattent beaucoup',
        'Plumes abîmées',
        'Irritations sur la peau',
        'Baisse de ponte',
        'Petites bêtes dans plumes'
      ],
      queFaire: [
        'Poudrez avec poudre anti-poux',
        'Nettoyez tout le poulailler',
        'Changez la litière',
        'Brûlez ancienne litière',
        'Répétez traitement après 15 jours'
      ],
      prevention: 'Nettoyage régulier et litière propre'
    }
  ];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header simple */}
      <div className="px-4 py-6" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => onNavigate('home')}
            className="text-2xl mb-4"
          >
            ← 
          </button>
          <h1 className="text-2xl font-bold text-center" style={{ color: colors.text }}>
            📚 Conseils Pratiques
          </h1>
          <p className="text-center mt-2" style={{ color: colors.textSecondary }}>
            Tout savoir pour bien élever
          </p>
        </div>
      </div>

      {/* Sélecteur de catégorie */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setSelectedCategory('conseils')}
              className="p-3 rounded-xl font-bold text-lg"
              style={{
                backgroundColor: selectedCategory === 'conseils' ? colors.primary : colors.card,
                color: selectedCategory === 'conseils' ? 'white' : colors.text
              }}
            >
              💡 Conseils Pratiques
            </button>
            <button
              onClick={() => setSelectedCategory('maladies')}
              className="p-3 rounded-xl font-bold text-lg"
              style={{
                backgroundColor: selectedCategory === 'maladies' ? colors.primary : colors.card,
                color: selectedCategory === 'maladies' ? 'white' : colors.text
              }}
            >
              🦠 Maladies Courantes
            </button>
          </div>
        </div>
      </div>

      {/* Contenu des conseils */}
      {selectedCategory === 'conseils' && (
        <div className="px-4">
          <div className="max-w-md mx-auto space-y-4">
            {conseilsPratiques.map(conseil => (
              <div
                key={conseil.id}
                className="p-4 rounded-xl shadow-sm"
                style={{ backgroundColor: colors.card }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">{conseil.icon}</div>
                  <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                    {conseil.titre}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {conseil.conseils.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✅</span>
                      <p className="text-sm flex-1" style={{ color: colors.text }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenu des maladies */}
      {selectedCategory === 'maladies' && (
        <div className="px-4">
          <div className="max-w-md mx-auto space-y-4">
            {maladiesCommunes.map(maladie => (
              <div
                key={maladie.id}
                className="p-4 rounded-xl shadow-sm border-l-4"
                style={{ 
                  backgroundColor: colors.card,
                  borderLeftColor: colors.error
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">{maladie.icon}</div>
                  <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                    {maladie.maladie}
                  </h3>
                </div>
                
                {/* Symptômes */}
                <div className="mb-4">
                  <h4 className="font-bold mb-2 text-red-600">🚨 Symptômes :</h4>
                  <div className="space-y-1">
                    {maladie.symptomes.map((symptome, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">•</span>
                        <p className="text-sm flex-1" style={{ color: colors.text }}>
                          {symptome}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Que faire */}
                <div className="mb-4">
                  <h4 className="font-bold mb-2 text-orange-600">🔧 Que faire :</h4>
                  <div className="space-y-1">
                    {maladie.queFaire.map((action, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-orange-500 mt-1">→</span>
                        <p className="text-sm flex-1" style={{ color: colors.text }}>
                          {action}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prévention */}
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: colors.surface }}
                >
                  <h4 className="font-bold mb-1 text-green-600">🛡️ Prévention :</h4>
                  <p className="text-sm" style={{ color: colors.text }}>
                    {maladie.prevention}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message d'aide */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <p className="text-lg font-bold" style={{ color: colors.text }}>
              📚 Apprenez Toujours
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              Plus vous savez, mieux vous élevez vos volailles et plus vous gagnez
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticalAdvicePage;