import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SupplierContactSupportPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();

  const supportOptions = [
    {
      id: 'message',
      title: 'Envoyer un message',
      icon: '💬',
      description: 'Contactez notre équipe fournisseurs',
      color: colors.primary,
      action: () => {
        // Rediriger vers messagerie avec conversation support
        onNavigate('messages', { openSupport: true });
      }
    },
    {
      id: 'call',
      title: 'Appeler directement',
      icon: '📞',
      description: 'Support fournisseurs prioritaire',
      color: colors.success,
      action: () => {
        alert(
          `📞 Support AviMarché - Fournisseurs\n\n` +
          `📱 Ligne directe : +223 70 11 22 33\n\n` +
          `⏰ Horaires spécialisés :\n` +
          `Lundi - Vendredi : 7h - 19h\n` +
          `Samedi : 8h - 16h\n` +
          `Dimanche : 10h - 14h (urgences)\n\n` +
          `🗣️ Langues : Français, Bambara\n` +
          `🎯 Équipe dédiée aux fournisseurs`
        );
      }
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Business',
      icon: '💚',
      description: 'Chat rapide avec l\'équipe',
      color: '#25D366',
      action: () => {
        alert(
          `💚 WhatsApp Business AviMarché\n\n` +
          `📱 Numéro WhatsApp : +223 91 22 33 44\n\n` +
          `💬 Message suggéré :\n` +
          `"Bonjour équipe AviMarché,\n` +
          `Je suis ${currentUser?.nom || '[Votre nom]'}, fournisseur d'aliments volailles.\n` +
          `J'ai besoin d'aide avec : [décrivez votre problème]"\n\n` +
          `⚡ Réponse sous 30 minutes en heures de bureau !`
        );
      }
    },
    {
      id: 'urgent',
      title: 'Urgence Fournisseur',
      icon: '🚨',
      description: 'Problème bloquant votre activité',
      color: colors.error,
      action: () => {
        alert(
          `🚨 URGENCE FOURNISSEURS\n\n` +
          `Pour les problèmes urgents qui bloquent votre activité :\n\n` +
          `📞 Ligne urgence : +223 66 77 88 99\n` +
          `💬 WhatsApp urgence : +223 66 77 88 00\n\n` +
          `⏰ Disponible 24h/24 - 7j/7\n\n` +
          `🚨 Exemples d'urgences :\n` +
          `• Impossible de recevoir des commandes\n` +
          `• Problème système de paiement\n` +
          `• Bug bloquant votre business\n` +
          `• Litige urgent avec client`
        );
      }
    }
  ];

  const fournisseurProblems = [
    {
      id: '1',
      question: 'Comment publier mes produits ?',
      icon: '📦',
      answer: 'Allez dans "Publier stock disponible" depuis votre page d\'accueil. Ajoutez vos aliments, poussins ou œufs fécondés avec prix et quantités.'
    },
    {
      id: '2',
      question: 'Comment gérer mes commandes ?',
      icon: '📋',
      answer: 'Cliquez sur "Voir commandes reçues". Vous pouvez accepter, refuser ou contacter directement les éleveurs clients.'
    },
    {
      id: '3',
      question: 'Comment fixer mes prix ?',
      icon: '💰',
      answer: 'Utilisez "Prix du marché" pour voir les prix concurrents, puis ajustez vos tarifs pour rester compétitif tout en préservant vos marges.'
    },
    {
      id: '4',
      question: 'Comment contacter mes clients ?',
      icon: '👨‍🌾',
      answer: 'Allez dans "Mes clients" ou "Messages" pour voir tous vos éleveurs. Vous pouvez les appeler ou leur envoyer des messages.'
    },
    {
      id: '5',
      question: 'Comment améliorer mes ventes ?',
      icon: '📈',
      answer: 'Consultez "Produits les plus demandés" et "Ma performance" pour adapter votre offre aux besoins du marché.'
    },
    {
      id: '6',
      question: 'Comment être payé ?',
      icon: '💳',
      answer: 'AviMarché facilite le contact. Le paiement se fait directement entre vous et l\'éleveur (cash, Orange Money, mobile banking).'
    }
  ];

  const servicesSupport = [
    {
      id: '1',
      titre: 'Conseils Business',
      description: 'Stratégie commerciale, gestion stock, pricing',
      icon: '💼',
      color: colors.primary
    },
    {
      id: '2',
      titre: 'Support Technique',
      description: 'Aide utilisation app, bug, fonctionnalités',
      icon: '🔧',
      color: colors.warning
    },
    {
      id: '3',
      titre: 'Formation Gratuite',
      description: 'Sessions groupe fournisseurs chaque jeudi',
      icon: '🎓',
      color: colors.info
    },
    {
      id: '4',
      titre: 'Résolution Litiges',
      description: 'Médiation conflits avec éleveurs clients',
      icon: '⚖️',
      color: colors.success
    },
    {
      id: '5',
      titre: 'Veille Marché',
      description: 'Tendances, opportunités, alertes prix',
      icon: '📊',
      color: colors.primary
    },
    {
      id: '6',
      titre: 'Networking',
      description: 'Mise en relation, partenariats fournisseurs',
      icon: '🤝',
      color: colors.success
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
          <div className="text-6xl mb-4">🤝</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Support Fournisseurs
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Équipe dédiée à votre succès !
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

      {/* Questions fréquentes fournisseurs */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            💡 Questions Fréquentes Fournisseurs
          </h2>
          
          <div className="space-y-3">
            {fournisseurProblems.map(problem => (
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
            🛠️ Nos Services pour Fournisseurs
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
              Équipe Spécialisée Fournisseurs
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs mb-3">
              <div>
                <p className="font-bold" style={{ color: colors.primary }}>Fatou Keita</p>
                <p style={{ color: colors.textSecondary }}>Responsable Fournisseurs</p>
              </div>
              <div>
                <p className="font-bold" style={{ color: colors.primary }}>Amadou Sanogo</p>
                <p style={{ color: colors.textSecondary }}>Support Technique</p>
              </div>
              <div>
                <p className="font-bold" style={{ color: colors.primary }}>Mariam Traoré</p>
                <p style={{ color: colors.textSecondary }}>Conseils Business</p>
              </div>
              <div>
                <p className="font-bold" style={{ color: colors.primary }}>Ibrahim Diallo</p>
                <p style={{ color: colors.textSecondary }}>Formation & Litiges</p>
              </div>
            </div>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              Une équipe de 4 experts dédiés au succès des fournisseurs maliens
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
                  98%
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Satisfaction</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                  15min
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

      {/* Message d'encouragement */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e8f5e8' }}
          >
            <div className="text-4xl mb-2">🚀</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              Votre succès est notre priorité !
            </p>
            <p className="text-xs text-green-700">
              Notre équipe de 4 experts est dédiée à votre réussite sur AviMarché. N'hésitez jamais à nous contacter !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierContactSupportPage;