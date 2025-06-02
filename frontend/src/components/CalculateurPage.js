import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const CalculateurPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [calcul, setCalcul] = React.useState({
    typeVolaille: 'poules',
    quantite: '',
    prixUnitaire: '',
    transport: '',
    autresCoûts: '',
    prixRevente: ''
  });

  const [resultat, setResultat] = React.useState(null);

  const typesVolailles = {
    'poules': { nom: 'Poules pondeuses', icon: '🐔', prixMoyen: 2500 },
    'pintades': { nom: 'Pintades', icon: '🦃', prixMoyen: 4200 },
    'poussins': { nom: 'Poussins', icon: '🐣', prixMoyen: 500 },
    'oeufs': { nom: 'Œufs (par 30)', icon: '🥚', prixMoyen: 4500 }
  };

  const calculerBenefice = () => {
    const quantite = parseFloat(calcul.quantite) || 0;
    const prixUnitaire = parseFloat(calcul.prixUnitaire) || 0;
    const transport = parseFloat(calcul.transport) || 0;
    const autresCoûts = parseFloat(calcul.autresCoûts) || 0;
    const prixRevente = parseFloat(calcul.prixRevente) || 0;

    const coûtAchat = quantite * prixUnitaire;
    const coûtTotal = coûtAchat + transport + autresCoûts;
    const revenus = quantite * prixRevente;
    const benefice = revenus - coûtTotal;
    const margePercent = coûtTotal > 0 ? ((benefice / coûtTotal) * 100).toFixed(1) : 0;

    setResultat({
      coûtAchat,
      coûtTotal,
      revenus,
      benefice,
      margePercent
    });
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <button onClick={() => onNavigate('home')} className="mb-4 text-blue-600 font-medium">
            ← Retour à l'accueil
          </button>
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
            🧮 Calculateur d'Achat
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Calculez vos coûts d'achat et estimez vos bénéfices
          </p>
        </div>
      </div>

      <div className="px-4">
        <div className="max-w-md mx-auto space-y-4">
          
          {/* Type de volaille */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: colors.card }}>
            <h3 className="font-bold mb-3" style={{ color: colors.text }}>
              Que voulez-vous acheter ?
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(typesVolailles).map(([key, type]) => (
                <button
                  key={key}
                  onClick={() => setCalcul({...calcul, typeVolaille: key, prixUnitaire: type.prixMoyen.toString()})}
                  className={`p-3 rounded-lg border-2 ${calcul.typeVolaille === key ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                >
                  <div className="text-center">
                    <div className="text-xl mb-1">{type.icon}</div>
                    <div className="text-xs font-medium">{type.nom}</div>
                    <div className="text-xs text-gray-500">{type.prixMoyen} F</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantité */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: colors.card }}>
            <label className="block font-bold mb-2" style={{ color: colors.text }}>
              📊 Quantité à acheter
            </label>
            <input
              type="number"
              value={calcul.quantite}
              onChange={(e) => setCalcul({...calcul, quantite: e.target.value})}
              className="w-full p-3 text-lg border rounded-lg"
              placeholder="Ex: 10"
            />
          </div>

          {/* Prix unitaire */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: colors.card }}>
            <label className="block font-bold mb-2" style={{ color: colors.text }}>
              💰 Prix unitaire (FCFA)
            </label>
            <input
              type="number"
              value={calcul.prixUnitaire}
              onChange={(e) => setCalcul({...calcul, prixUnitaire: e.target.value})}
              className="w-full p-3 text-lg border rounded-lg"
              placeholder="Ex: 2500"
            />
          </div>

          {/* Transport */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: colors.card }}>
            <label className="block font-bold mb-2" style={{ color: colors.text }}>
              🚛 Frais de transport (FCFA)
            </label>
            <input
              type="number"
              value={calcul.transport}
              onChange={(e) => setCalcul({...calcul, transport: e.target.value})}
              className="w-full p-3 text-lg border rounded-lg"
              placeholder="Ex: 2000"
            />
          </div>

          {/* Autres coûts */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: colors.card }}>
            <label className="block font-bold mb-2" style={{ color: colors.text }}>
              💸 Autres coûts (FCFA)
            </label>
            <input
              type="number"
              value={calcul.autresCoûts}
              onChange={(e) => setCalcul({...calcul, autresCoûts: e.target.value})}
              className="w-full p-3 text-lg border rounded-lg"
              placeholder="Ex: 1000"
            />
          </div>

          {/* Prix de revente */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: colors.card }}>
            <label className="block font-bold mb-2" style={{ color: colors.text }}>
              💵 Prix de revente unitaire (optionnel)
            </label>
            <input
              type="number"
              value={calcul.prixRevente}
              onChange={(e) => setCalcul({...calcul, prixRevente: e.target.value})}
              className="w-full p-3 text-lg border rounded-lg"
              placeholder="Ex: 3000"
            />
          </div>

          {/* Bouton calculer */}
          <button
            onClick={calculerBenefice}
            className="w-full py-4 rounded-xl text-white font-bold text-lg"
            style={{ backgroundColor: colors.primary }}
          >
            🧮 Calculer
          </button>

          {/* Résultats */}
          {resultat && (
            <div className="p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
              <h3 className="font-bold mb-3 text-center" style={{ color: colors.text }}>
                📊 Résultats du calcul
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: colors.textSecondary }}>Coût d'achat :</span>
                  <span className="font-bold" style={{ color: colors.text }}>
                    {resultat.coûtAchat.toLocaleString()} FCFA
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span style={{ color: colors.textSecondary }}>Coût total :</span>
                  <span className="font-bold" style={{ color: colors.text }}>
                    {resultat.coûtTotal.toLocaleString()} FCFA
                  </span>
                </div>

                {calcul.prixRevente && (
                  <>
                    <div className="flex justify-between">
                      <span style={{ color: colors.textSecondary }}>Revenus estimés :</span>
                      <span className="font-bold" style={{ color: colors.success }}>
                        {resultat.revenus.toLocaleString()} FCFA
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-lg">
                      <span style={{ color: colors.textSecondary }}>Bénéfice :</span>
                      <span className={`font-bold ${resultat.benefice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {resultat.benefice >= 0 ? '+' : ''}{resultat.benefice.toLocaleString()} FCFA
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span style={{ color: colors.textSecondary }}>Marge :</span>
                      <span className={`font-bold ${resultat.benefice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {resultat.margePercent}%
                      </span>
                    </div>
                  </>
                )}
              </div>

              {calcul.prixRevente && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50">
                  <p className="text-sm text-blue-800 text-center">
                    {resultat.benefice >= 0 
                      ? `💚 Bonne affaire ! Vous gagnez ${resultat.benefice.toLocaleString()} FCFA`
                      : `⚠️ Attention ! Vous perdez ${Math.abs(resultat.benefice).toLocaleString()} FCFA`
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculateurPage;