import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MyFeedProductsPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('stock');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    type: 'aliment',
    category: 'maïs',
    quantity: '',
    price: '',
    description: ''
  });

  // Stock simulation fournisseur
  const [inventory, setInventory] = useState([
    {
      id: '1',
      type: 'aliment',
      category: 'maïs',
      name: 'Maïs Concassé',
      quantity: 450,
      unit: 'kg',
      price: 280,
      status: 'disponible',
      icon: '🌽',
      color: '#FFB74D'
    },
    {
      id: '2',
      type: 'aliment',
      category: 'soja',
      name: 'Tourteau de Soja',
      quantity: 120,
      unit: 'kg',
      price: 420,
      status: 'stock_bas',
      icon: '🫘',
      color: '#8BC34A'
    },
    {
      id: '3',
      type: 'aliment',
      category: 'concentré',
      name: 'Concentré Ponte',
      quantity: 80,
      unit: 'kg',
      price: 380,
      status: 'disponible',
      icon: '🥣',
      color: '#AB47BC'
    },
    {
      id: '4',
      type: 'poussin',
      category: 'poussins',
      name: 'Poussins 1 jour',
      quantity: 150,
      unit: 'unités',
      price: 650,
      status: 'disponible',
      icon: '🐤',
      color: '#FFC107'
    },
    {
      id: '5',
      type: 'oeuf',
      category: 'œufs_fécondés',
      name: 'Œufs Fécondés',
      quantity: 45,
      unit: 'unités',
      price: 350,
      status: 'rupture',
      icon: '🥚',
      color: '#FF7043'
    }
  ]);

  const categories = {
    aliment: [
      { value: 'maïs', label: 'Maïs', icon: '🌽' },
      { value: 'soja', label: 'Tourteau Soja', icon: '🫘' },
      { value: 'son', label: 'Son de Blé', icon: '🌾' },
      { value: 'concentré', label: 'Concentré', icon: '🥣' },
      { value: 'vitamines', label: 'Vitamines', icon: '💊' },
      { value: 'farine_poisson', label: 'Farine Poisson', icon: '🐟' }
    ],
    poussin: [
      { value: 'poussins', label: 'Poussins 1 jour', icon: '🐤' }
    ],
    oeuf: [
      { value: 'œufs_fécondés', label: 'Œufs Fécondés', icon: '🥚' }
    ]
  };

  const handleAddProduct = () => {
    if (!newProduct.quantity || !newProduct.price) {
      alert('Veuillez remplir la quantité et le prix');
      return;
    }

    const category = categories[newProduct.type].find(c => c.value === newProduct.category);
    const product = {
      id: Date.now().toString(),
      type: newProduct.type,
      category: newProduct.category,
      name: category.label,
      quantity: parseInt(newProduct.quantity),
      unit: newProduct.type === 'aliment' ? 'kg' : 'unités',
      price: parseInt(newProduct.price),
      status: 'disponible',
      icon: category.icon,
      color: '#4CAF50'
    };

    setInventory([...inventory, product]);
    setNewProduct({ type: 'aliment', category: 'maïs', quantity: '', price: '', description: '' });
    setShowAddProduct(false);
    alert('✅ Produit ajouté avec succès !');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponible': return '#4CAF50';
      case 'stock_bas': return '#FF9800';
      case 'rupture': return '#F44336';
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'disponible': return '✅ Disponible';
      case 'stock_bas': return '⚠️ Stock bas';
      case 'rupture': return '❌ Rupture';
      default: return status;
    }
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);

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
          <div className="text-6xl mb-4">🌾</div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Mon Stock
          </h1>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Gérez vos produits facilement
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveTab('stock')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeTab === 'stock' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeTab === 'stock' ? colors.primary : colors.card,
                color: activeTab === 'stock' ? 'white' : colors.text
              }}
            >
              <div className="text-2xl mb-1">📦</div>
              <p>Mon Stock</p>
            </button>
            
            <button
              onClick={() => setActiveTab('publier')}
              className={`flex-1 p-3 rounded-xl font-bold text-center transition-all ${
                activeTab === 'publier' ? 'scale-105 shadow-lg' : ''
              }`}
              style={{ 
                backgroundColor: activeTab === 'publier' ? colors.success : colors.card,
                color: activeTab === 'publier' ? 'white' : colors.text
              }}
            >
              <div className="text-2xl mb-1">📢</div>
              <p>Publier</p>
            </button>
          </div>
        </div>
      </div>

      {/* Résumé stock */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div 
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.card }}
          >
            <h3 className="font-bold mb-3" style={{ color: colors.text }}>
              📊 Résumé de mon stock
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                  {inventory.length}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Produits</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.success }}>
                  {Math.round(totalValue / 1000)}K
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Valeur (CFA)</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: colors.warning }}>
                  {inventory.filter(i => i.status === 'stock_bas' || i.status === 'rupture').length}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Alertes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu selon onglet */}
      {activeTab === 'stock' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              📦 Mon Inventaire
            </h2>
            
            <div className="space-y-3">
              {inventory.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl shadow-sm border-l-4"
                  style={{ 
                    backgroundColor: colors.card,
                    borderLeftColor: getStatusColor(item.status)
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: item.color, color: 'white' }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1" style={{ color: colors.text }}>
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {item.quantity} {item.unit}
                        </p>
                        <p className="font-bold text-lg" style={{ color: colors.primary }}>
                          {item.price} F/{item.unit === 'kg' ? 'kg' : 'pièce'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span 
                          className="text-xs font-bold px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: getStatusColor(item.status),
                            color: 'white'
                          }}
                        >
                          {getStatusText(item.status)}
                        </span>
                        <p className="text-xs font-bold" style={{ color: colors.textSecondary }}>
                          Valeur: {(item.quantity * item.price).toLocaleString()} F
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

      {/* Section Publier */}
      {activeTab === 'publier' && (
        <div className="px-4 py-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
              📢 Publier un Produit
            </h2>

            {!showAddProduct ? (
              <div className="space-y-4">
                <div 
                  className="p-6 rounded-xl text-center"
                  style={{ backgroundColor: colors.card }}
                >
                  <div className="text-5xl mb-4">📦</div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: colors.text }}>
                    Ajouter un nouveau produit
                  </h3>
                  <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                    Publiez vos aliments, poussins ou œufs fécondés
                  </p>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="w-full p-4 rounded-xl font-bold text-white"
                    style={{ backgroundColor: colors.success }}
                  >
                    ➕ Ajouter un produit
                  </button>
                </div>

                {/* Produits récents */}
                <div 
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: colors.surface }}
                >
                  <h4 className="font-bold mb-3" style={{ color: colors.text }}>
                    📋 Mes derniers produits publiés
                  </h4>
                  <div className="space-y-2">
                    {inventory.slice(0, 3).map(item => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-sm" style={{ color: colors.text }}>
                            {item.name}
                          </p>
                          <p className="text-xs" style={{ color: colors.textSecondary }}>
                            {item.quantity} {item.unit} - {item.price}F
                          </p>
                        </div>
                        <span style={{ color: getStatusColor(item.status) }}>
                          {item.status === 'disponible' ? '✅' : item.status === 'stock_bas' ? '⚠️' : '❌'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Formulaire ajout produit */
              <div className="space-y-4">
                <div 
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: colors.card }}
                >
                  <h3 className="font-bold mb-4 text-center" style={{ color: colors.text }}>
                    ➕ Nouveau Produit
                  </h3>

                  {/* Type de produit */}
                  <div className="mb-4">
                    <label className="font-bold text-sm mb-2 block" style={{ color: colors.text }}>
                      🏷️ Type de produit :
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['aliment', 'poussin', 'oeuf'].map(type => (
                        <button
                          key={type}
                          onClick={() => setNewProduct({...newProduct, type, category: categories[type][0].value})}
                          className={`p-3 rounded-xl text-sm font-bold ${
                            newProduct.type === type ? 'scale-105' : ''
                          }`}
                          style={{ 
                            backgroundColor: newProduct.type === type ? colors.primary : colors.surface,
                            color: newProduct.type === type ? 'white' : colors.text
                          }}
                        >
                          {type === 'aliment' && '🌾 Aliment'}
                          {type === 'poussin' && '🐤 Poussin'}
                          {type === 'oeuf' && '🥚 Œuf'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Catégorie */}
                  <div className="mb-4">
                    <label className="font-bold text-sm mb-2 block" style={{ color: colors.text }}>
                      📂 Catégorie :
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full p-3 rounded-xl border"
                      style={{ backgroundColor: colors.surface }}
                    >
                      {categories[newProduct.type].map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantité */}
                  <div className="mb-4">
                    <label className="font-bold text-sm mb-2 block" style={{ color: colors.text }}>
                      📦 Quantité :
                    </label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                      placeholder={newProduct.type === 'aliment' ? "Ex: 100 kg" : "Ex: 50 unités"}
                      className="w-full p-3 rounded-xl border"
                      style={{ backgroundColor: colors.surface }}
                    />
                  </div>

                  {/* Prix */}
                  <div className="mb-6">
                    <label className="font-bold text-sm mb-2 block" style={{ color: colors.text }}>
                      💰 Prix par {newProduct.type === 'aliment' ? 'kg' : 'unité'} :
                    </label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="Ex: 280 CFA"
                      className="w-full p-3 rounded-xl border"
                      style={{ backgroundColor: colors.surface }}
                    />
                  </div>

                  {/* Boutons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowAddProduct(false)}
                      className="flex-1 p-3 rounded-xl font-bold"
                      style={{ backgroundColor: colors.surface, color: colors.text }}
                    >
                      ❌ Annuler
                    </button>
                    <button
                      onClick={handleAddProduct}
                      className="flex-1 p-3 rounded-xl font-bold text-white"
                      style={{ backgroundColor: colors.success }}
                    >
                      ✅ Publier
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conseil du jour */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: '#e8f5e8' }}
          >
            <div className="text-4xl mb-2">💡</div>
            <p className="text-sm font-bold text-green-800 mb-1">
              Conseil du jour
            </p>
            <p className="text-xs text-green-700">
              Mettez à jour vos stocks régulièrement pour attirer plus de clients !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFeedProductsPage;