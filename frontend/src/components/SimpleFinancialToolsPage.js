import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SimpleFinancialToolsPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [calculateur, setCalculateur] = useState('profit');
  const [inputs, setInputs] = useState({
    // Calculateur profit
    ventePrix: '',
    venteQuantite: '',
    achatPrix: '',
    achatQuantite: '',
    fraisTransport: '',
    fraisAutres: '',
    
    // Calculateur élevage
    nombreVolailles: '',
    prixAliment: '',
    quantiteAliment: '',
    prixPoussins: '',
    fraisVeto: '',
    dureeElevage: '',
    
    // Calculateur prix vente
    coutTotal: '',
    margeVoulue: ''
  });

  const calculerProfit = () => {
    const vente = parseFloat(inputs.ventePrix) * parseFloat(inputs.venteQuantite) || 0;
    const achat = parseFloat(inputs.achatPrix) * parseFloat(inputs.achatQuantite) || 0;
    const transport = parseFloat(inputs.fraisTransport) || 0;
    const autres = parseFloat(inputs.fraisAutres) || 0;
    
    const profit = vente - achat - transport - autres;
    const pourcentage = vente > 0 ? ((profit / vente) * 100).toFixed(1) : 0;
    
    return { profit, pourcentage, vente, coutTotal: achat + transport + autres };
  };

  const calculerCoutElevage = () => {
    const volailles = parseFloat(inputs.nombreVolailles) || 0;
    const aliment = parseFloat(inputs.prixAliment) * parseFloat(inputs.quantiteAliment) || 0;
    const poussins = parseFloat(inputs.prixPoussins) * volailles || 0;
    const veto = parseFloat(inputs.fraisVeto) || 0;
    const duree = parseFloat(inputs.dureeElevage) || 1;
    
    const coutTotal = poussins + aliment + veto;
    const coutParVolaille = volailles > 0 ? coutTotal / volailles : 0;
    const coutParMois = coutTotal / duree;
    
    return { coutTotal, coutParVolaille, coutParMois };
  };

  const calculerPrixVente = () => {
    const cout = parseFloat(inputs.coutTotal) || 0;
    const marge = parseFloat(inputs.margeVoulue) || 0;
    
    const prixVente = cout + (cout * marge / 100);
    const profitAttendu = prixVente - cout;
    
    return { prixVente, profitAttendu };
  };

  const handleCalculate = () => {
    let resultat = '';
    
    if (calculateur === 'profit') {
      const { profit, pourcentage, vente, coutTotal } = calculerProfit();
      resultat = 
        `📊 RÉSULTAT PROFIT\n\n` +
        `💰 Argent gagné : ${vente.toLocaleString()} FCFA\n` +
        `💸 Argent dépensé : ${coutTotal.toLocaleString()} FCFA\n` +
        `${profit >= 0 ? '✅' : '❌'} Profit : ${profit.toLocaleString()} FCFA\n` +
        `📈 Pourcentage : ${pourcentage}%\n\n` +
        `${profit >= 0 ? 'Bon travail ! Vous gagnez de l\'argent' : 'Attention ! Vous perdez de l\'argent'}`;
    } 
    else if (calculateur === 'elevage') {
      const { coutTotal, coutParVolaille, coutParMois } = calculerCoutElevage();
      resultat = 
        `🐔 COÛT D'ÉLEVAGE\n\n` +
        `💰 Coût total : ${coutTotal.toLocaleString()} FCFA\n` +
        `🐓 Par volaille : ${coutParVolaille.toLocaleString()} FCFA\n` +
        `📅 Par mois : ${coutParMois.toLocaleString()} FCFA\n\n` +
        `💡 Vous devez vendre chaque volaille à plus de ${coutParVolaille.toLocaleString()} FCFA pour gagner`;
    }
    else if (calculateur === 'prix') {
      const { prixVente, profitAttendu } = calculerPrixVente();
      resultat = 
        `💰 PRIX DE VENTE\n\n` +
        `🏷️ Prix recommandé : ${prixVente.toLocaleString()} FCFA\n` +
        `✅ Profit attendu : ${profitAttendu.toLocaleString()} FCFA\n\n` +
        `💡 Vendez à ce prix pour avoir la marge voulue`;
    }
    
    alert(resultat);
  };

  const resetInputs = () => {
    setInputs({
      ventePrix: '', venteQuantite: '', achatPrix: '', achatQuantite: '',
      fraisTransport: '', fraisAutres: '', nombreVolailles: '', prixAliment: '',
      quantiteAliment: '', prixPoussins: '', fraisVeto: '', dureeElevage: '',
      coutTotal: '', margeVoulue: ''
    });
  };

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
            💰 Outils Financiers
          </h1>
          <p className="text-center mt-2" style={{ color: colors.textSecondary }}>
            Calculez vos profits facilement
          </p>
        </div>
      </div>

      {/* Sélecteur de calculateur */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { key: 'profit', label: 'Mon Profit', icon: '💰' },
              { key: 'elevage', label: 'Coût Élevage', icon: '🐔' },
              { key: 'prix', label: 'Prix Vente', icon: '🏷️' }
            ].map(calc => (
              <button
                key={calc.key}
                onClick={() => { setCalculateur(calc.key); resetInputs(); }}
                className="p-3 rounded-xl font-bold text-sm"
                style={{
                  backgroundColor: calculateur === calc.key ? colors.primary : colors.card,
                  color: calculateur === calc.key ? 'white' : colors.text
                }}
              >
                <div className="text-lg mb-1">{calc.icon}</div>
                {calc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Formulaires de calcul */}
      <div className="px-4">
        <div className="max-w-md mx-auto">
          <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: colors.card }}>

            {/* Calculateur de profit */}
            {calculateur === 'profit' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-center" style={{ color: colors.text }}>
                  💰 Calculer Mon Profit
                </h3>
                
                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    💵 Prix de vente (FCFA)
                  </label>
                  <input
                    type="number"
                    value={inputs.ventePrix}
                    onChange={(e) => setInputs({...inputs, ventePrix: e.target.value})}
                    placeholder="Ex: 3000"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    📦 Quantité vendue
                  </label>
                  <input
                    type="number"
                    value={inputs.venteQuantite}
                    onChange={(e) => setInputs({...inputs, venteQuantite: e.target.value})}
                    placeholder="Ex: 10"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    💸 Prix d'achat (FCFA)
                  </label>
                  <input
                    type="number"
                    value={inputs.achatPrix}
                    onChange={(e) => setInputs({...inputs, achatPrix: e.target.value})}
                    placeholder="Ex: 2000"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    📦 Quantité achetée
                  </label>
                  <input
                    type="number"
                    value={inputs.achatQuantite}
                    onChange={(e) => setInputs({...inputs, achatQuantite: e.target.value})}
                    placeholder="Ex: 10"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    🚛 Frais de transport (FCFA)
                  </label>
                  <input
                    type="number"
                    value={inputs.fraisTransport}
                    onChange={(e) => setInputs({...inputs, fraisTransport: e.target.value})}
                    placeholder="Ex: 1000"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    💼 Autres frais (FCFA)
                  </label>
                  <input
                    type="number"
                    value={inputs.fraisAutres}
                    onChange={(e) => setInputs({...inputs, fraisAutres: e.target.value})}
                    placeholder="Ex: 500"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                </div>
              </div>
            )}

            {/* Calculateur coût élevage */}
            {calculateur === 'elevage' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-center" style={{ color: colors.text }}>
                  🐔 Calculer Coût d'Élevage
                </h3>

                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    🐓 Nombre de volailles
                  </label>
                  <input
                    type="number"
                    value={inputs.nombreVolailles}
                    onChange={(e) => setInputs({...inputs, nombreVolailles: e.target.value})}
                    placeholder="Ex: 20"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    🌾 Prix aliment par kg (FCFA)
                  </label>
                  <input
                    type="number"
                    value={inputs.prixAliment}
                    onChange={(e) => setInputs({...inputs, prixAliment: e.target.value})}
                    placeholder="Ex: 350"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    📦 Quantité aliment (kg)
                  </label>
                  <input
                    type="number"
                    value={inputs.quantiteAliment}
                    onChange={(e) => setInputs({...inputs, quantiteAliment: e.target.value})}
                    placeholder="Ex: 100"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    🐣 Prix poussin (FCFA)
                  </label>
                  <input
                    type="number"
                    value={inputs.prixPoussins}
                    onChange={(e) => setInputs({...inputs, prixPoussins: e.target.value})}
                    placeholder="Ex: 500"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    💊 Frais vétérinaire (FCFA)
                  </label>
                  <input
                    type="number"
                    value={inputs.fraisVeto}
                    onChange={(e) => setInputs({...inputs, fraisVeto: e.target.value})}
                    placeholder="Ex: 5000"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    📅 Durée élevage (mois)
                  </label>
                  <input
                    type="number"
                    value={inputs.dureeElevage}
                    onChange={(e) => setInputs({...inputs, dureeElevage: e.target.value})}
                    placeholder="Ex: 3"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                </div>
              </div>
            )}

            {/* Calculateur prix de vente */}
            {calculateur === 'prix' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-center" style={{ color: colors.text }}>
                  🏷️ Calculer Prix de Vente
                </h3>

                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    💸 Coût total (FCFA)
                  </label>
                  <input
                    type="number"
                    value={inputs.coutTotal}
                    onChange={(e) => setInputs({...inputs, coutTotal: e.target.value})}
                    placeholder="Ex: 2000"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    Tout ce que vous avez dépensé
                  </p>
                </div>

                <div>
                  <label className="block font-bold mb-2" style={{ color: colors.text }}>
                    📈 Marge voulue (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.margeVoulue}
                    onChange={(e) => setInputs({...inputs, margeVoulue: e.target.value})}
                    placeholder="Ex: 20"
                    className="w-full p-3 text-lg rounded-lg border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  />
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    Combien vous voulez gagner en plus (%)
                  </p>
                </div>
              </div>
            )}

            {/* Bouton calculer */}
            <button
              onClick={handleCalculate}
              className="w-full py-4 mt-6 rounded-xl font-bold text-lg text-white"
              style={{ backgroundColor: colors.primary }}
            >
              🧮 Calculer
            </button>
          </div>

          {/* Conseils */}
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: colors.surface }}>
            <p className="text-lg font-bold mb-2" style={{ color: colors.text }}>
              💡 Conseil
            </p>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {calculateur === 'profit' && 'Calculez régulièrement vos profits pour voir si votre business marche bien'}
              {calculateur === 'elevage' && 'Connaître vos coûts vous aide à fixer le bon prix de vente'}
              {calculateur === 'prix' && 'Ajoutez toujours une marge pour couvrir les imprévus'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleFinancialToolsPage;