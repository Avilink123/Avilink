import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FinancialTools = ({ currentUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, transactions, add
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    type_transaction: 'revenu',
    montant: '',
    description: '',
    categorie: '',
    date_transaction: new Date().toISOString().split('T')[0],
    mode_paiement: 'especes'
  });

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const [transactionsRes, summaryRes] = await Promise.all([
        axios.get(`${API}/finances/transactions/user/${currentUser.id}`),
        axios.get(`${API}/finances/summary/user/${currentUser.id}?days=30`)
      ]);
      setTransactions(transactionsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données financières:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const transactionData = {
        ...formData,
        montant: parseFloat(formData.montant)
      };
      
      await axios.post(`${API}/finances/transaction?user_id=${currentUser.id}`, transactionData);
      alert('Transaction enregistrée avec succès !');
      setShowAddModal(false);
      setFormData({
        type_transaction: 'revenu',
        montant: '',
        description: '',
        categorie: '',
        date_transaction: new Date().toISOString().split('T')[0],
        mode_paiement: 'especes'
      });
      loadData();
    } catch (error) {
      alert(error.response?.data?.detail || 'Erreur lors de l\'enregistrement');
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'revenu' ? '💰' : '💸';
  };

  const getTransactionColor = (type) => {
    return type === 'revenu' ? 'text-green-600' : 'text-red-600';
  };

  const getCategoryName = (categorie) => {
    const categories = {
      'vente_oeufs': 'Vente d\'œufs',
      'vente_volaille': 'Vente de volaille',
      'vente_fumier': 'Vente de fumier',
      'achat_aliment': 'Achat d\'aliment',
      'achat_poussin': 'Achat de poussins',
      'frais_veterinaire': 'Frais vétérinaire',
      'frais_transport': 'Transport',
      'frais_energie': 'Électricité/Carburant',
      'autres_revenus': 'Autres revenus',
      'autres_depenses': 'Autres dépenses'
    };
    return categories[categorie] || categorie;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
          <p className="text-gray-600">Vous devez être connecté pour accéder aux outils financiers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📊 Outils Financiers</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            ➕ Nouvelle Transaction
          </button>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'dashboard' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              📈 Tableau de Bord
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'transactions' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              📋 Historique
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Chargement...</div>
          </div>
        ) : (
          <>
            {/* Dashboard */}
            {activeTab === 'dashboard' && summary && (
              <div>
                {/* Résumé financier */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Revenus</p>
                        <p className="text-2xl font-bold text-green-600">
                          {summary.total_revenus.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className="text-3xl">💰</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Dépenses</p>
                        <p className="text-2xl font-bold text-red-600">
                          {summary.total_depenses.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className="text-3xl">💸</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Bénéfice Net</p>
                        <p className={`text-2xl font-bold ${summary.benefice_net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {summary.benefice_net.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className="text-3xl">{summary.benefice_net >= 0 ? '📈' : '📉'}</div>
                    </div>
                  </div>
                </div>
                
                {/* Principales catégories */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4 text-green-700">💰 Principales Sources de Revenus</h3>
                    {summary.principales_revenus.length > 0 ? (
                      <div className="space-y-3">
                        {summary.principales_revenus.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-700">{getCategoryName(item.categorie)}</span>
                            <span className="font-semibold text-green-600">
                              {item.montant.toLocaleString()} FCFA
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Aucun revenu enregistré</p>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4 text-red-700">💸 Principales Dépenses</h3>
                    {summary.principales_depenses.length > 0 ? (
                      <div className="space-y-3">
                        {summary.principales_depenses.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-700">{getCategoryName(item.categorie)}</span>
                            <span className="font-semibold text-red-600">
                              {item.montant.toLocaleString()} FCFA
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Aucune dépense enregistrée</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    📅 Période: {new Date(summary.periode_debut).toLocaleDateString('fr-FR')} - {new Date(summary.periode_fin).toLocaleDateString('fr-FR')} (30 derniers jours)
                  </p>
                </div>
              </div>
            )}
            
            {/* Historique des transactions */}
            {activeTab === 'transactions' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Historique des transactions</h2>
                  <p className="text-gray-600">
                    Consultez toutes vos transactions financières récentes.
                  </p>
                </div>
                
                {transactions.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-lg shadow-md">
                    <div className="text-gray-500 mb-4">📊</div>
                    <p className="text-gray-600">
                      Aucune transaction enregistrée.
                      <br />
                      Commencez par ajouter vos revenus et dépenses.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Catégorie
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Montant
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(transaction.date_transaction).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`flex items-center text-sm ${getTransactionColor(transaction.type_transaction)}`}>
                                  {getTransactionIcon(transaction.type_transaction)}
                                  <span className="ml-1 capitalize">{transaction.type_transaction}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {transaction.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {getCategoryName(transaction.categorie)}
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getTransactionColor(transaction.type_transaction)}`}>
                                {transaction.type_transaction === 'revenu' ? '+' : '-'}{transaction.montant.toLocaleString()} FCFA
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {/* Modal d'ajout de transaction */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Nouvelle Transaction</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type*</label>
                  <select
                    value={formData.type_transaction}
                    onChange={(e) => setFormData({...formData, type_transaction: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="revenu">💰 Revenu</option>
                    <option value="depense">💸 Dépense</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Montant (FCFA)*</label>
                  <input
                    type="number"
                    required
                    value={formData.montant}
                    onChange={(e) => setFormData({...formData, montant: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Ex: 25000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description*</label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Ex: Vente de 30 poulets"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie*</label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Choisir une catégorie</option>
                    {formData.type_transaction === 'revenu' ? (
                      <>
                        <option value="vente_oeufs">Vente d'œufs</option>
                        <option value="vente_volaille">Vente de volaille</option>
                        <option value="vente_fumier">Vente de fumier</option>
                        <option value="autres_revenus">Autres revenus</option>
                      </>
                    ) : (
                      <>
                        <option value="achat_aliment">Achat d'aliment</option>
                        <option value="achat_poussin">Achat de poussins</option>
                        <option value="frais_veterinaire">Frais vétérinaire</option>
                        <option value="frais_transport">Transport</option>
                        <option value="frais_energie">Électricité/Carburant</option>
                        <option value="autres_depenses">Autres dépenses</option>
                      </>
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date*</label>
                  <input
                    type="date"
                    required
                    value={formData.date_transaction}
                    onChange={(e) => setFormData({...formData, date_transaction: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Mode de paiement</label>
                  <select
                    value={formData.mode_paiement}
                    onChange={(e) => setFormData({...formData, mode_paiement: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="especes">Espèces</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="cheque">Chèque</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">💡 Conseils de gestion</h3>
          <ul className="text-yellow-800 text-sm space-y-1">
            <li>• Enregistrez toutes vos transactions quotidiennement</li>
            <li>• Suivez vos coûts d'alimentation - ils représentent 60-70% des dépenses</li>
            <li>• Planifiez vos dépenses selon les cycles de production</li>
            <li>• Gardez une réserve d'urgence pour les frais vétérinaires</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinancialTools;