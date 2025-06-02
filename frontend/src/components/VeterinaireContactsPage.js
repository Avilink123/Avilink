import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const VeterinaireContactsPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [veterinaires, setVeterinaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');

  useEffect(() => {
    // Simulation données vétérinaires spécialisés aviculture
    const mockVeterinaires = [
      {
        id: '1',
        nom: 'Dr. Amadou Traoré',
        specialite: 'Aviculture Moderne',
        telephone: '+223 76 12 34 56',
        localisation: 'Bamako',
        region: 'Bamako',
        experience: '8 ans',
        langues: ['Français', 'Bambara'],
        urgence24h: true,
        deplacement: true,
        tarifs: {
          consultation: 15000
        },
        services: [
          'Consultation générale',
          'Vaccination volailles',
          'Diagnostic maladies',
          'Soins intensifs',
          'Formation éleveurs'
        ],
        disponibilite: 'Lun-Sam 8h-18h, Urgences 24h',
        evaluation: 4.8,
        clients: 45,
        description: 'Vétérinaire spécialisé en aviculture avec 8 ans d\'expérience au Mali'
      },
      {
        id: '2',
        nom: 'Dr. Fatoumata Keita',
        specialite: 'Pathologie Aviaire',
        telephone: '+223 65 43 21 98',
        localisation: 'Sikasso',
        region: 'Sikasso',
        experience: '12 ans',
        langues: ['Français', 'Bambara', 'Peulh'],
        urgence24h: false,
        deplacement: true,
        tarifs: {
          consultation: 12000
        },
        services: [
          'Diagnostic avancé',
          'Laboratoire analyses',
          'Médecine préventive',
          'Nutrition volailles',
          'Gestion sanitaire'
        ],
        disponibilite: 'Lun-Ven 9h-17h',
        evaluation: 4.6,
        clients: 38,
        description: 'Experte en pathologie aviaire et nutrition, formation européenne'
      },
      {
        id: '3',
        nom: 'Dr. Ibrahim Coulibaly',
        specialite: 'Médecine Rurale',
        telephone: '+223 78 87 65 43',
        localisation: 'Ségou',
        region: 'Ségou',
        experience: '6 ans',
        langues: ['Français', 'Bambara'],
        urgence24h: true,
        deplacement: true,
        tarifs: {
          consultation: 10000
        },
        services: [
          'Soins de base',
          'Vaccination',
          'Première urgence',
          'Conseils élevage',
          'Suivi de ferme'
        ],
        disponibilite: 'Tous les jours 7h-19h',
        evaluation: 4.4,
        clients: 52,
        description: 'Vétérinaire rural, spécialiste des petits élevages familiaux'
      },
      {
        id: '4',
        nom: 'Dr. Mariam Sidibé',
        specialite: 'Reproduction Aviaire',
        telephone: '+223 69 78 45 12',
        localisation: 'Kayes',
        region: 'Kayes',
        experience: '10 ans',
        langues: ['Français', 'Soninké', 'Bambara'],
        urgence24h: false,
        deplacement: false,
        tarifs: {
          consultation: 18000
        },
        services: [
          'Reproduction assistée',
          'Incubation artificielle',
          'Sélection génétique',
          'Amélioration ponte',
          'Formation technique'
        ],
        disponibilite: 'Mar-Sam 10h-16h',
        evaluation: 4.9,
        clients: 28,
        description: 'Spécialiste reproduction et amélioration génétique des volailles'
      },
      {
        id: '5',
        nom: 'Dr. Moussa Diarra',
        specialite: 'Urgences Avicoles',
        telephone: '+223 77 99 88 77',
        localisation: 'Mopti',
        region: 'Mopti',
        experience: '5 ans',
        langues: ['Français', 'Peulh', 'Dogon'],
        urgence24h: true,
        deplacement: true,
        tarifs: {
          consultation: 13000
        },
        services: [
          'Urgences 24h',
          'Soins intensifs',
          'Chirurgie mineure',
          'Traitement infections',
          'Réanimation'
        ],
        disponibilite: '24h/24, 7j/7',
        evaluation: 4.7,
        clients: 41,
        description: 'Service d\'urgence vétérinaire, intervention rapide dans le Delta'
      }
    ];

    setTimeout(() => {
      setVeterinaires(mockVeterinaires);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredVeterinaires = veterinaires.filter(vet => {
    if (filter === 'tous') return true;
    if (filter === 'urgence') return vet.urgence24h;
    if (filter === 'deplacement') return vet.deplacement;
    return vet.region.toLowerCase() === filter.toLowerCase();
  });

  const handleContacter = (vet) => {
    alert(
      `📞 Contacter ${vet.nom}\n\n` +
      `🎓 Spécialité : ${vet.specialite}\n` +
      `📍 Localisation : ${vet.localisation}\n` +
      `⏰ Disponibilité : ${vet.disponibilite}\n` +
      `💰 Consultation : ${vet.tarifs.consultation.toLocaleString()} FCFA\n` +
      `${vet.deplacement ? `🚗 Déplacement : ${vet.tarifs.deplacement.toLocaleString()} FCFA\n` : ''}` +
      `${vet.urgence24h ? `🚨 Urgence : ${vet.tarifs.urgence.toLocaleString()} FCFA\n` : ''}\n` +
      `☎️ Téléphone : ${vet.telephone}\n\n` +
      `Services proposés :\n${vet.services.map(s => `• ${s}`).join('\n')}`
    );
  };

  const getSpecialiteIcon = (specialite) => {
    if (specialite.includes('Urgence')) return '🚨';
    if (specialite.includes('Pathologie')) return '🔬';
    if (specialite.includes('Reproduction')) return '🥚';
    if (specialite.includes('Rurale')) return '🏡';
    return '👨‍⚕️';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p style={{ color: colors.text }}>Chargement des vétérinaires...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: colors.surface }}>
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.card }}
            >
              <span className="text-xl">←</span>
            </button>
            <h1 className="text-lg font-bold" style={{ color: colors.text }}>
              👨‍⚕️ Vétérinaires Avicoles
            </h1>
            <div></div>
          </div>
        </div>

        {/* Filtres */}
        <div className="px-4 pb-4">
          <div className="max-w-md mx-auto">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'tous', label: 'Tous', icon: '👨‍⚕️' },
                { key: 'urgence', label: 'Urgence 24h', icon: '🚨' },
                { key: 'deplacement', label: 'Déplacement', icon: '🚗' },
                { key: 'bamako', label: 'Bamako', icon: '🏢' },
                { key: 'sikasso', label: 'Sikasso', icon: '🌾' },
                { key: 'ségou', label: 'Ségou', icon: '🏞️' }
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="px-3 py-2 rounded-full text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: filter === f.key ? colors.primary : colors.card,
                    color: filter === f.key ? 'white' : colors.text,
                    border: `1px solid ${filter === f.key ? colors.primary : colors.border}`
                  }}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Liste des vétérinaires */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-4">
          {filteredVeterinaires.map(vet => (
            <div
              key={vet.id}
              className="p-4 rounded-xl shadow-lg border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border
              }}
            >
              {/* En-tête */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{getSpecialiteIcon(vet.specialite)}</span>
                    <h3 className="font-bold text-base" style={{ color: colors.text }}>
                      {vet.nom}
                    </h3>
                  </div>
                  <p className="text-sm font-medium" style={{ color: colors.primary }}>
                    {vet.specialite}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    📍 {vet.localisation} • {vet.experience} d'expérience
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium" style={{ color: colors.text }}>
                      {vet.evaluation}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    {vet.clients} clients
                  </p>
                </div>
              </div>

              {/* Badges services */}
              <div className="flex flex-wrap gap-2 mb-3">
                {vet.urgence24h && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-red-500">
                    🚨 Urgence 24h
                  </span>
                )}
                {vet.deplacement && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: colors.info }}>
                    🚗 Déplacement
                  </span>
                )}
                <span className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: colors.success }}>
                  💬 {vet.langues[0]}
                </span>
              </div>

              {/* Disponibilité */}
              <div className="mb-3">
                <p className="text-sm" style={{ color: colors.text }}>
                  <span className="font-medium">Disponibilité :</span> {vet.disponibilite}
                </p>
                <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                  {vet.description}
                </p>
              </div>

              {/* Tarifs */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: colors.text }}>Consultation :</span>
                  <span className="font-medium" style={{ color: colors.primary }}>
                    {vet.tarifs.consultation.toLocaleString()} FCFA
                  </span>
                </div>
                {vet.deplacement && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: colors.text }}>Déplacement :</span>
                    <span className="font-medium" style={{ color: colors.warning }}>
                      {vet.tarifs.deplacement.toLocaleString()} FCFA
                    </span>
                  </div>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => handleContacter(vet)}
                className="w-full py-3 rounded-lg font-medium text-white transition-colors"
                style={{ backgroundColor: colors.primary }}
              >
                📞 Contacter {vet.nom.split(' ')[1]}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Message d'aide */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-lg text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <p className="text-sm font-medium" style={{ color: colors.text }}>
              🩺 Conseil Santé
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              En cas d'urgence, appelez directement. Pour la prévention, planifiez des visites régulières
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeterinaireContactsPage;