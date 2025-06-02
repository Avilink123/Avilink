import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BuyerContactSupportPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  const supportOptions = [
    {
      id: 'message',
      title: 'Envoyer un message',
      icon: '💬',
      description: 'Contactez notre équipe acheteurs',
      color: colors.primary,
      action: () => {
        // Rediriger vers messagerie avec conversation support
        onNavigate('buyer-messages', { openSupport: true });
      }
    },
    {
      id: 'call',
      title: 'Appeler directement',
      icon: '📞',
      description: 'Support acheteurs spécialisé',
      color: colors.success,
      action: () => {
        alert(
          `📞 Support AviMarché - Acheteurs\n\n` +
          `📱 Ligne directe : +223 20 22 44 88\n\n` +
          `⏰ Horaires spécialisés :\n` +
          `Lundi - Vendredi : 7h - 19h\n` +
          `Samedi : 8h - 16h\n` +
          `Dimanche : 10h - 14h (urgences)\n\n` +
          `🗣️ Langues : Français, Bambara\n` +
          `🎯 Équipe dédiée aux acheteurs`
        );
      }
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Acheteurs',
      icon: '💚',
      description: 'Chat rapide pour vos achats',
      color: '#25D366',
      action: () => {
        alert(
          `💚 WhatsApp Acheteurs AviMarché\n\n` +
          `📱 Numéro WhatsApp : +223 91 22 33 55\n\n` +
          `💬 Message suggéré :\n` +
          `"Bonjour équipe AviMarché,\n` +
          `Je suis ${currentUser?.nom || '[Votre nom]'}, acheteur de volailles.\n` +
          `J'ai besoin d'aide avec : [décrivez votre problème]"\n\n` +
          `⚡ Réponse sous 15 minutes en heures de bureau !`
        );
      }
    },
    {
      id: 'urgent',
      title: 'Problème urgent',
      icon: '🚨',
      description: 'Problème bloquant vos achats',
      color: colors.error,
      action: () => {
        alert(
          `🚨 URGENCE ACHETEURS\n\n` +
          `Pour les problèmes urgents qui bloquent vos achats :\n\n` +
          `📞 Ligne urgence : +223 66 77 88 77\n` +
          `💬 WhatsApp urgence : +223 66 77 88 11\n\n` +
          `⏰ Disponible 24h/24 - 7j/7\n\n` +
          `🚨 Exemples d'urgences :\n` +
          `• Éleveur ne répond plus après commande\n` +
          `• Problème avec livraison\n` +
          `• Volailles/œufs non conformes\n` +
          `• Litige avec un éleveur`
        );
      }
    }
  ];

  const buyerProblems = [
    {
      id: '1',
      question: 'Comment trouver des volailles ?',
      icon: '🐔',
      answer: 'Allez dans "Acheter volailles" depuis votre page d\'accueil. Filtrez par type et région pour trouver les éleveurs près de chez vous.'
    },
    {
      id: '2',
      question: 'Comment acheter des œufs frais ?',
      icon: '🥚',
      answer: 'Cliquez sur "Acheter œufs" depuis l\'accueil. Vous verrez tous les œufs disponibles avec leur fraîcheur indiquée.'
    },
    {
      id: '3',
      question: 'Comment contacter un éleveur ?',
      icon: '💬',
      answer: 'Sur chaque annonce, cliquez sur "Contact" ou "📞" pour appeler directement l\'éleveur ou lui envoyer un message.'
    },
    {
      id: '4',
      question: 'Comment suivre mes commandes ?',
      icon: '📦',
      answer: 'Allez dans "Mes commandes" pour voir toutes vos commandes en cours, livrées ou annulées avec le suivi détaillé.'
    },
    {
      id: '5',
      question: 'Comment évaluer un éleveur ?',
      icon: '⭐',
      answer: 'Après livraison, cliquez sur "⭐" dans "Mes commandes" pour noter l\'éleveur et aider les autres acheteurs.'
    },
    {
      id: '6',
      question: 'Comment payer un éleveur ?',
      icon: '💰',
      answer: 'AviMarché facilite le contact. Le paiement se fait directement avec l\'éleveur (cash, Orange Money, mobile banking).'
    }
  ];

  const servicesSupport = [
    {
      id: '1',
      titre: 'Aide aux Achats',
      description: 'Conseils choix, négociation prix, qualité',
      icon: '🛒',
      color: colors.primary
    },
    {
      id: '2',
      titre: 'Support Technique',
      description: 'Aide utilisation app, commandes, suivi',
      icon: '🔧',
      color: colors.warning
    },
    {
      id: '3',
      titre: 'Médiation Litiges',
      description: 'Résolution conflits avec éleveurs',
      icon: '⚖️',
      color: colors.error
    },
    {
      id: '4',
      titre: 'Conseils Qualité',
      description: 'Comment reconnaître bonnes volailles/œufs',
      icon: '🏆',
      color: colors.success
    },
    {
      id: '5',
      titre: 'Alertes Bonnes Affaires',
      description: 'Notification prix avantageux',
      icon: '💰',
      color: colors.info
    },
    {
      id: '6',
      titre: 'Formation Gratuite',
      description: 'Sessions acheteurs chaque mardi',
      icon: '🎓',
      color: colors.primary
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
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Support Acheteurs
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Équipe dédiée à vos achats !
          </p>
        </div>
      </div>

      {/* Options de contact */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            📞 Comment nous contacter ?
          </h2>
          
          <div className="space-y-3">
            {supportOptions.map(option => (
              <button
                key={option.id}
                onClick={option.action}
                className="w-full p-4 rounded-xl shadow-sm text-left transition-all hover:shadow-md"
                style={{ backgroundColor: colors.card }}
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: option.color, color: 'white' }}
                  >
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                      {option.title}
                    </h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {option.description}
                    </p>
                  </div>
                  <div className="text-2xl" style={{ color: colors.textMuted }}>
                    →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions fréquentes acheteurs */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            💡 Questions Fréquentes Acheteurs
          </h2>
          
          <div className="space-y-3">
            {buyerProblems.map(problem => (
              <div
                key={problem.id}
                className="p-4 rounded-xl shadow-sm"
                style={{ backgroundColor: colors.card }}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{problem.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-2" style={{ color: colors.text }}>
                      {problem.question}
                    </h4>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {problem.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services de support */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            🛠️ Nos Services pour Acheteurs
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {servicesSupport.map(service => (
              <div
                key={service.id}
                className="p-3 rounded-xl text-center"
                style={{ backgroundColor: colors.card }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl mx-auto mb-2"
                  style={{ backgroundColor: service.color, color: 'white' }}
                >
                  {service.icon}
                </div>
                <h4 className="font-bold text-sm mb-1" style={{ color: colors.text }}>
                  {service.titre}
                </h4>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Équipe dédiée */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div 
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <div className="text-4xl mb-3">👥</div>
            <h3 className="font-bold mb-2" style={{ color: colors.text }}>
              Équipe Spécialisée Acheteurs
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs mb-3">
              <div>
                <p className="font-bold" style={{ color: colors.primary }}>Aminata Sidibé</p>
                <p style={{ color: colors.textSecondary }}>Responsable Acheteurs</p>
              </div>
              <div>
                <p className="font-bold" style={{ color: colors.primary }}>Ousmane Koné</p>
                <p style={{ color: colors.textSecondary }}>Support Achats</p>
              </div>
              <div>
                <p className="font-bold" style={{ color: colors.primary }}>Kadiatou Barry</p>
                <p style={{ color: colors.textSecondary }}>Médiation Litiges</p>
              </div>
              <div>
                <p className="font-bold" style={{ color: colors.primary }}>Mamadou Fofana</p>
                <p style={{ color: colors.textSecondary }}>Conseils Qualité</p>
              </div>
            </div>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              Une équipe de 4 experts dédiés à la réussite de vos achats
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques support */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div 
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.card }}
          >
            <h3 className="font-bold mb-3" style={{ color: colors.text }}>
              📊 Notre Performance Support
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.success }}>
                  99%
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Satisfaction</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                  8min
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Réponse moy.</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.warning }}>
                  24h/7j
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Urgences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Garanties acheteurs */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div 
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e3f2fd' }}
          >
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-bold mb-2" style={{ color: colors.text }}>
              Garanties AviMarché Acheteurs
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span style={{ color: colors.text }}>Éleveurs vérifiés et notés</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span style={{ color: colors.text }}>Médiation gratuite en cas de litige</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span style={{ color: colors.text }}>Support 24h en cas d'urgence</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span style={{ color: colors.text }}>Conseils qualité avant achat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message d'encouragement */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e8f5e8' }}
          >
            <div className="text-4xl mb-2">🛒</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              Achetez en toute confiance !
            </p>
            <p className="text-xs text-green-700">
              Notre équipe de 4 experts veille à ce que vos achats se passent parfaitement. N'hésitez jamais à nous contacter !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerContactSupportPage;