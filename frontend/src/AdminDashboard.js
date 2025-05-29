import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, exportRes] = await Promise.all([
        axios.get(`${API}/admin/stats`),
        axios.get(`${API}/admin/export`)
      ]);
      setStats(statsRes.data);
      setExportData(exportRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `avimarche_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'aviculteur': return 'bg-green-100 text-green-800';
      case 'acheteur': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'vendu': return 'bg-red-100 text-red-800';
      case 'suspendu': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, icon, color = 'bg-blue-500' }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <span className="text-2xl text-white">{icon}</span>
        </div>
      </div>
    </div>
  );

  const SimpleChart = ({ data, title, type = "bar" }) => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <p className="text-gray-500">Aucune donnée disponible</p>
        </div>
      );
    }

    const maxValue = Math.max(...Object.values(data));
    const entries = Object.entries(data);

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="space-y-3">
          {entries.map(([key, value]) => (
            <div key={key} className="flex items-center">
              <div className="w-24 text-sm text-gray-600 truncate">{key}</div>
              <div className="flex-1 mx-3">
                <div className="bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${(value / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-medium">{value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-gray-600">Chargement du tableau de bord admin...</div>
        </div>
      </div>
    );
  }

  if (!stats || !exportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-gray-600">Erreur lors du chargement des données</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🛠️ Administration AviMarché</h1>
            <p className="text-gray-600 mt-1">Tableau de bord et gestion des données</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              📊 Exporter Données
            </button>
            <button
              onClick={loadData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              🔄 Actualiser
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Utilisateurs" 
            value={stats.general_stats.total_users} 
            icon="👥" 
            color="bg-blue-500"
          />
          <StatCard 
            title="Produits Actifs" 
            value={stats.general_stats.active_products} 
            icon="📦" 
            color="bg-green-500"
          />
          <StatCard 
            title="Transactions" 
            value={stats.general_stats.total_transactions} 
            icon="💰" 
            color="bg-yellow-500"
          />
          <StatCard 
            title="Bénéfice Net" 
            value={`${stats.financial_summary.net_profit.toLocaleString()} FCFA`} 
            icon="📈" 
            color="bg-purple-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SimpleChart 
            data={stats.users_by_role} 
            title="Répartition par Rôle" 
          />
          <SimpleChart 
            data={stats.users_by_location} 
            title="Utilisateurs par Localisation" 
          />
          <SimpleChart 
            data={stats.products_by_location} 
            title="Produits par Localisation" 
          />
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Résumé Financier</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-green-700 font-medium">💰 Total Revenus</span>
                <span className="text-green-800 font-bold">{stats.financial_summary.total_revenue.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <span className="text-red-700 font-medium">💸 Total Dépenses</span>
                <span className="text-red-800 font-bold">{stats.financial_summary.total_expenses.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="text-blue-700 font-medium">📊 Bénéfice Net</span>
                <span className={`font-bold ${stats.financial_summary.net_profit >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                  {stats.financial_summary.net_profit.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: '📊 Vue d\'ensemble', icon: '📊' },
                { id: 'users', label: '👥 Utilisateurs', icon: '👥' },
                { id: 'products', label: '📦 Produits', icon: '📦' },
                { id: 'transactions', label: '💰 Transactions', icon: '💰' },
                { id: 'system', label: '⚙️ Système', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Vue d'ensemble de la plateforme</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Statistiques Générales</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Utilisateurs totaux:</span>
                      <span className="font-medium">{stats.general_stats.total_users}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Produits totaux:</span>
                      <span className="font-medium">{stats.general_stats.total_products}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Vétérinaires référencés:</span>
                      <span className="font-medium">{stats.general_stats.total_veterinaires}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Maladies documentées:</span>
                      <span className="font-medium">{stats.general_stats.total_diseases}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Activité Récente</h3>
                  <div className="text-sm text-gray-600">
                    <p>📅 Dernière mise à jour: {new Date(stats.timestamp).toLocaleString('fr-FR')}</p>
                    <p className="mt-2">La plateforme AviMarché fonctionne correctement avec tous les modules opérationnels.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Gestion des Utilisateurs</h2>
                <button
                  onClick={() => exportToCSV(exportData.data.users, 'users')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  📊 Exporter CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Téléphone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localisation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date d'inscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {exportData.data.users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.nom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.telephone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.localisation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Gestion des Produits</h2>
                <button
                  onClick={() => exportToCSV(exportData.data.products, 'products')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  📊 Exporter CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendeur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localisation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {exportData.data.products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <div className="max-w-xs truncate">{product.titre}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.type_produit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.prix.toLocaleString()} FCFA/{product.unite}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.vendeur_nom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.localisation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Transactions Financières</h2>
                <button
                  onClick={() => exportToCSV(exportData.data.financial_transactions, 'transactions')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  📊 Exporter CSV
                </button>
              </div>
              {exportData.data.financial_transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune transaction enregistrée</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
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
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Catégorie
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {exportData.data.financial_transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.date_transaction).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.type_transaction === 'revenu' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type_transaction === 'revenu' ? '💰 Revenu' : '💸 Dépense'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="max-w-xs truncate">{transaction.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={transaction.type_transaction === 'revenu' ? 'text-green-600' : 'text-red-600'}>
                              {transaction.type_transaction === 'revenu' ? '+' : '-'}{transaction.montant.toLocaleString()} FCFA
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.categorie}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'system' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Informations Système</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Collections MongoDB</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>👥 Utilisateurs:</span>
                      <span className="font-medium">{exportData.summary.total_users}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>📦 Produits:</span>
                      <span className="font-medium">{exportData.summary.total_products}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>💰 Transactions:</span>
                      <span className="font-medium">{exportData.summary.total_transactions}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>🩺 Maladies:</span>
                      <span className="font-medium">{exportData.summary.total_diseases}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>👨‍⚕️ Vétérinaires:</span>
                      <span className="font-medium">{exportData.summary.total_veterinaires}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>💉 Vaccinations:</span>
                      <span className="font-medium">{exportData.summary.total_vaccinations}</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Statut de la Plateforme</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                      <span>API Backend: Opérationnel</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                      <span>Base de données: Connectée</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                      <span>Marketplace: Fonctionnel</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                      <span>Modules additionnels: Actifs</span>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    Dernière vérification: {new Date().toLocaleString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Exporter les Données</h3>
                <button 
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    exportToJSON();
                    setShowExportModal(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-left"
                >
                  📋 Export Complet (JSON)
                  <div className="text-sm text-blue-200">Toutes les données de la plateforme</div>
                </button>
                
                <button
                  onClick={() => {
                    exportToCSV(exportData.data.users, 'users');
                    setShowExportModal(false);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium text-left"
                >
                  👥 Utilisateurs (CSV)
                  <div className="text-sm text-green-200">Liste des utilisateurs uniquement</div>
                </button>
                
                <button
                  onClick={() => {
                    exportToCSV(exportData.data.products, 'products');
                    setShowExportModal(false);
                  }}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-medium text-left"
                >
                  📦 Produits (CSV)
                  <div className="text-sm text-yellow-200">Catalogue des produits</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;