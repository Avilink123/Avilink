import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ContactSupportPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [selectedOption, setSelectedOption] = useState(null);

  const supportOptions = [
    {
      id: 'message',
      title: 'Envoyer un message',
      icon: '💬',
      description: 'Écrivez votre problème',
      color: colors.primary,
      action: () => {
        alert(
          `💬 Message à l'équipe AviMarché\n\n` +
          `Vous allez être dirigé vers la messagerie pour contacter notre équipe.\n\n` +
          `Notre équipe vous répondra rapidement pour vous aider !`
        );
        onNavigate('messages');
      }
    },
    {
      id: 'call',
      title: 'Appeler directement',
      icon: '📞',
      description: 'Parlez directement à notre équipe',
      color: colors.success,
      action: () => {
        alert(
          `📞 Appeler AviMarché Support\n\n` +
          `📱 Numéro direct : +223 20 XX XX XX\n\n` +
          `⏰ Horaires :\n` +
          `Lundi - Vendredi : 8h - 18h\n` +
          `Samedi : 8h - 12h\n` +
          `Dimanche : Fermé\n\n` +
          `🗣️ Langues : Français, Bambara`
        );
      }
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Support',
      icon: '💚',
      description: 'Message WhatsApp rapide',
      color: '#25D366',
      action: () => {
        alert(
          `💚 WhatsApp AviMarché\n\n` +
          `📱 Numéro WhatsApp : +223 70 XX XX XX\n\n` +
          `💬 Message suggéré :\n` +
          `"Bonjour, j'ai besoin d'aide avec AviMarché. Mon nom est ${currentUser?.nom || '[Votre nom]'}"\n\n` +
          `⚡ Réponse rapide garantie !`
        );
      }
    },
    {
      id: 'urgent',
      title: 'Problème urgent',
      icon: '🚨',
      description: 'Problème très important',
      color: colors.error,
      action: () => {
        alert(
          `🚨 URGENCE - Support AviMarché\n\n` +
          `Pour les problèmes urgents :\n\n` +
          `📞 Ligne urgence : +223 90 XX XX XX\n` +
          `💬 WhatsApp urgence : +223 91 XX XX XX\n\n` +
          `⏰ Disponible 24h/24\n\n` +
          `Exemples d'urgence :\n` +
          `• Impossible de vendre mes volailles\n` +
          `• Problème avec paiement client\n` +
          `• Bug qui bloque mon travail`
        );
      }
    }
  ];

  const commonProblems = [
    {
      id: '1',
      question: 'Comment vendre mes volailles ?',
      icon: '🐔',
      answer: 'Allez dans "Vendre volailles/œufs" depuis la page d\'accueil. Remplissez les informations et votre annonce sera visible par tous les acheteurs.'
    },
    {
      id: '2',
      question: 'Comment acheter des aliments ?',
      icon: '🌾',
      answer: 'Cliquez sur "Acheter aliments volailles" depuis la page d\'accueil. Vous verrez tous les fournisseurs et leurs prix.'
    },
    {
      id: '3',
      question: 'Comment envoyer un message ?',
      icon: '💬',
      answer: 'Sous chaque annonce, cliquez sur "Message" pour parler directement avec le vendeur ou acheteur.'
    },
    {
      id: '4',
      question: 'Comment voir mes volailles ?',
      icon: '📦',
      answer: 'Cliquez sur "Mon stock de volailles" pour voir toutes vos volailles, leur valeur et leur santé.'
    },
    {
      id: '5',
      question: 'Comment trouver un vétérinaire ?',
      icon: '👨‍⚕️',
      answer: 'Allez dans "Contacts vétérinaires" pour voir tous les vétérinaires près de chez vous avec leurs numéros.'
    }
  ];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header simple */}
      <div className="px-4 py-6" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-md mx-auto text-center">
          <button 
            onClick={() => onNavigate('home')}
            className="text-2xl mb-4"
          >
            ← 
          </button>
          <div className="text-6xl mb-4">🤝</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Contact Support
          </h1>
          <p className="mt-2" style={{ color: colors.textSecondary }}>
            Nous sommes là pour vous aider !
          </p>
        </div>
      </div>

      {/* Options de contact */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            Comment voulez-vous nous contacter ?
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

      {/* Questions fréquentes */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
            💡 Questions Fréquentes
          </h2>
          
          <div className="space-y-3">
            {commonProblems.map(problem => (
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

      {/* Informations supplémentaires */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div 
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <div className="text-4xl mb-3">📱</div>
            <h3 className="font-bold mb-2" style={{ color: colors.text }}>
              Support Rapide
            </h3>
            <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
              Notre équipe répond en moins de 2 heures pendant les heures de bureau
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold" style={{ color: colors.primary }}>Réponse moyenne</p>
                <p style={{ color: colors.text }}>1 heure</p>
              </div>
              <div>
                <p className="font-bold" style={{ color: colors.primary }}>Satisfaction</p>
                <p style={{ color: colors.text }}>98%</p>
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
            <div className="text-4xl mb-2">🤗</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              N'hésitez pas à nous contacter !
            </p>
            <p className="text-xs text-green-700">
              Aucune question n'est trop petite. Nous sommes là pour vous accompagner dans votre réussite !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupportPage;