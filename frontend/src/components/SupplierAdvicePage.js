import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SupplierAdvicePage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [activeSection, setActiveSection] = useState('business');

  // Conseils business pour fournisseurs
  const businessAdvice = [
    {
      id: 1,
      title: 'Gérer son stock intelligemment',
      icon: '📦',
      color: '#4CAF50',
      category: 'Stock',
      conseil: 'Stockez selon la demande : plus de maïs en saison sèche, plus de concentré en période de ponte. Rotation FIFO obligatoire.',
      action: 'Vérifiez vos stocks chaque semaine et anticipez les commandes selon le calendrier agricole malien.'
    },
    {
      id: 2,
      title: 'Fixer des prix compétitifs',
      icon: '💰',
      color: '#FF9800',
      category: 'Prix',
      conseil: 'Surveillez les prix du marché hebdomadairement. Restez 5-10F en dessous pour attirer les clients, mais préservez vos marges.',
      action: 'Utilisez l\'outil "Prix du marché" pour ajuster vos tarifs chaque lundi matin.'
    },
    {
      id: 3,
      title: 'Livrer rapidement et bien',
      icon: '🚛',
      color: '#2196F3',
      category: 'Livraison',
      conseil: 'Livraison rapide = client fidèle. Promettez ce que vous pouvez tenir. Bamako sous 24h, périphérie sous 48h.',
      action: 'Planifiez vos tournées par zone géographique pour optimiser les coûts et délais.'
    },
    {
      id: 4,
      title: 'Maintenir la qualité constante',
      icon: '⭐',
      color: '#9C27B0',
      category: 'Qualité',
      conseil: 'Un seul lot de mauvaise qualité peut perdre un client. Contrôlez : humidité, fraîcheur, absence de moisissures.',
      action: 'Vérifiez chaque livraison et formez vos équipes aux standards qualité.'
    },
    {
      id: 5,
      title: 'Fidéliser ses clients éleveurs',
      icon: '🤝',
      color: '#FF5722',
      category: 'Relation client',
      conseil: 'Un éleveur fidèle vaut 10 nouveaux clients. Offrez : conseil, crédit ponctuel, bonus quantité, service après-vente.',
      action: 'Contactez vos top 10 clients chaque mois pour prendre des nouvelles et proposer vos nouveautés.'
    },
    {
      id: 6,
      title: 'Diversifier sa gamme produits',
      icon: '🌱',
      color: '#795548',
      category: 'Produits',
      conseil: 'Ne vendez pas que du maïs ! Concentré, vitamines, poussins... Plus votre gamme est large, plus vous vendez.',
      action: 'Ajoutez 1 nouveau produit par trimestre selon la demande observée dans votre zone.'
    }
  ];

  // Conseils techniques stockage
  const technicalAdvice = [
    {
      id: 1,
      title: 'Stockage des aliments',
      icon: '🏪',
      color: '#607D8B',
      details: [
        '🌡️ Température : Moins de 25°C si possible',
        '💧 Humidité : Maximum 12% pour éviter moisissures',
        '🚫 Protection : Contre rongeurs, insectes, pluie',
        '📅 Rotation : Premier entré, premier sorti (FIFO)',
        '🧹 Nettoyage : Balayage quotidien, désinfection mensuelle'
      ]
    },
    {
      id: 2,
      title: 'Transport et livraison',
      icon: '🚛',
      color: '#3F51B5',
      details: [
        '📦 Emballage : Sacs propres, étiquetés, fermés',
        '🛡️ Protection : Bâches contre poussière et pluie',
        '⚖️ Pesage : Vérifier le poids avant départ',
        '📋 Documentation : Bon de livraison avec détails',
        '🕐 Horaires : Respecter les créneaux convenus'
      ]
    },
    {
      id: 3,
      title: 'Gestion des poussins',
      icon: '🐤',
      color: '#FFC107',
      details: [
        '🌡️ Température : 32°C pour poussins 1 jour',
        '💨 Ventilation : Air frais mais sans courants d\'air',
        '🍼 Alimentation : Démarrage spécial poussins',
        '💊 Santé : Vaccination selon programme',
        '⏰ Timing : Livraison rapide après éclosion'
      ]
    },
    {
      id: 4,
      title: 'Contrôle qualité',
      icon: '🔍',
      color: '#E91E63',
      details: [
        '👁️ Inspection : Visuelle quotidienne des stocks',
        '🏷️ Étiquetage : Dates de production et expiration',
        '📊 Tests : Humidité, pureté, contamination',
        '📝 Traçabilité : Origine et lot de chaque produit',
        '🚨 Alertes : Procédure si problème détecté'
      ]
    }
  ];

  // Conseils calendrier saisonnier
  const seasonalCalendar = [
    {
      mois: 'Janvier-Février',
      icon: '🌵',
      color: '#FF7043',
      periode: 'Saison sèche',
      demande_forte: ['Maïs', 'Tourteau soja', 'Vitamines'],
      conseils: 'Stockez massivement le maïs. Les éleveurs préparent la saison sèche.',
      opportunites: 'Prix du maïs en hausse. Négociez des contrats annuels.'
    },
    {
      mois: 'Mars-Mai',
      icon: '🔥',
      color: '#F44336',
      periode: 'Fin saison sèche',
      demande_forte: ['Concentré ponte', 'Poussins', 'Œufs fécondés'],
      conseils: 'Période de reproduction. Concentrez-vous sur les produits ponte.',
      opportunites: 'Nouveau cycle d\'élevage commence. Proposez packages complets.'
    },
    {
      mois: 'Juin-Septembre',
      icon: '🌧️',
      color: '#2196F3',
      periode: 'Saison pluies',
      demande_forte: ['Son de blé', 'Compléments', 'Poussins'],
      conseils: 'Protégez vos stocks de l\'humidité. Demande diversifiée.',
      opportunites: 'Expansion des élevages. Nouveaux clients potentiels.'
    },
    {
      mois: 'Octobre-Décembre',
      icon: '🌾',
      color: '#4CAF50',
      periode: 'Post-récolte',
      demande_forte: ['Maïs frais', 'Préparation stocks', 'Vitamines'],
      conseils: 'Approvisionnez-vous en maïs frais. Préparez la saison sèche.',
      opportunites: 'Période d\'investissement. Éleveurs renouvellent leurs stocks.'
    }
  ];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header */}
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
            Conseils Fournisseurs
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Guide business aliments volailles
          </p>
        </div>
      </div>

      {/* Navigation sections */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveSection('business')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeSection === 'business' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeSection === 'business' ? colors.primary : colors.card,
                color: activeSection === 'business' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">💼</div>
              <p className="text-sm">Business</p>
            </button>
            
            <button
              onClick={() => setActiveSection('technique')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeSection === 'technique' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeSection === 'technique' ? colors.warning : colors.card,
                color: activeSection === 'technique' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">🔧</div>
              <p className="text-sm">Technique</p>
            </button>

            <button
              onClick={() => setActiveSection('calendrier')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeSection === 'calendrier' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeSection === 'calendrier' ? colors.success : colors.card,
                color: activeSection === 'calendrier' ? 'white' : colors.text
              }}
            >
              <div className="text-xl mb-1">📅</div>
              <p className="text-sm">Saisons</p>
            </button>
          </div>
        </div>
      </div>

      {/* Section Conseils Business */}
      {activeSection === 'business' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              💼 6 Clés du Succès
            </h2>
            
            <div className="space-y-4">
              {businessAdvice.map(conseil => (
                <div
                  key={conseil.id}
                  className="p-4 rounded-xl shadow-sm border-l-4"
                  style={{ 
                    backgroundColor: colors.card,
                    borderLeftColor: conseil.color
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: conseil.color, color: 'white' }}
                    >
                      {conseil.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                          {conseil.title}
                        </h3>
                        <span 
                          className="text-xs px-2 py-1 rounded-full font-bold text-white"
                          style={{ backgroundColor: conseil.color }}
                        >
                          {conseil.category}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-bold mb-1" style={{ color: colors.info }}>
                          💡 Le conseil :
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {conseil.conseil}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-bold mb-1" style={{ color: colors.success }}>
                          ✅ Action concrète :
                        </p>
                        <p className="text-sm font-medium" style={{ color: colors.text }}>
                          {conseil.action}
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

      {/* Section Conseils Techniques */}
      {activeSection === 'technique' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              🔧 Guide Technique
            </h2>
            
            <div className="space-y-4">
              {technicalAdvice.map(technique => (
                <div
                  key={technique.id}
                  className="p-4 rounded-xl shadow-sm"
                  style={{ backgroundColor: colors.card }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: technique.color, color: 'white' }}
                    >
                      {technique.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-3" style={{ color: colors.text }}>
                        {technique.title}
                      </h3>
                      
                      <div className="space-y-2">
                        {technique.details.map((detail, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="text-sm" style={{ color: colors.textSecondary }}>
                              {detail}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section Calendrier Saisonnier */}
      {activeSection === 'calendrier' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              📅 Calendrier Saisonnier Mali
            </h2>
            
            <div className="space-y-4">
              {seasonalCalendar.map((saison, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl shadow-sm border-l-4"
                  style={{ 
                    backgroundColor: colors.card,
                    borderLeftColor: saison.color
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: saison.color, color: 'white' }}
                    >
                      {saison.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                          {saison.mois}
                        </h3>
                        <span 
                          className="text-xs px-2 py-1 rounded-full font-bold text-white"
                          style={{ backgroundColor: saison.color }}
                        >
                          {saison.periode}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-bold mb-1" style={{ color: colors.primary }}>
                          🔥 Forte demande :
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {saison.demande_forte.map((produit, idx) => (
                            <span 
                              key={idx}
                              className="text-xs px-2 py-1 rounded-full font-bold"
                              style={{ backgroundColor: colors.surface, color: colors.text }}
                            >
                              {produit}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-bold mb-1" style={{ color: colors.success }}>
                          💡 Conseils :
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {saison.conseils}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-bold mb-1" style={{ color: colors.warning }}>
                          🎯 Opportunités :
                        </p>
                        <p className="text-sm font-medium" style={{ color: colors.text }}>
                          {saison.opportunites}
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

      {/* Formation et support */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-4">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e3f2fd' }}
          >
            <div className="text-4xl mb-2">🎓</div>
            <p className="text-sm font-bold text-blue-800 mb-1">
              Formation Gratuite
            </p>
            <p className="text-xs text-blue-700">
              Tous les jeudis 14h-16h à Bamako. Formation techniques fournisseurs, gestion stock, relation client. Inscription gratuite !
            </p>
          </div>

          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e8f5e8' }}
          >
            <div className="text-4xl mb-2">📞</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              Support Fournisseurs
            </p>
            <p className="text-xs text-green-700">
              Équipe dédiée fournisseurs : +223 70 11 22 33. Conseils personnalisés, aide technique, résolution problèmes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierAdvicePage;