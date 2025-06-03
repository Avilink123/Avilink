import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import OrderModal from './OrderModal';

const BuyChicksPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    // Simulation données poussins et œufs fécondés (simple pour illettrés)
    const mockProduits = [
      {
        id: '1',
        nom: 'Poussins 1 jour',
        vendeur: 'Mamadou Keita',
        prix: 500,
        stock: 50,
        localisation: 'Sikasso',
        telephone: '+223 76 12 34 56',
        type: 'poussins',
        description: 'Poussins en bonne santé, vaccinés'
      },
      {
        id: '2',
        nom: 'Œufs fécondés de poules',
        vendeur: 'Fatoumata Diarra',
        prix: 200,
        stock: 100,
        localisation: 'Bamako',
        telephone: '+223 65 43 21 98',
        type: 'oeufs',
        description: 'Œufs fécondés de poules locales'
      },
      {
        id: '3',
        nom: 'Poussins pintades',
        vendeur: 'Ibrahim Coulibaly',
        prix: 800,
        stock: 30,
        localisation: 'Ségou',
        telephone: '+223 78 87 65 43',
        type: 'poussins',
        description: 'Poussins de pintades résistantes'
      },
      {
        id: '4',
        nom: 'Œufs fécondés pintades',
        vendeur: 'Aminata Touré',
        prix: 300,
        stock: 60,
        localisation: 'Mopti',
        telephone: '+223 69 78 45 12',
        type: 'oeufs',
        description: 'Œufs fécondés de pintades'
      },
      {
        id: '5',
        nom: 'Poussins canards',
        vendeur: 'Sekou Traoré',
        prix: 600,
        stock: 25,
        localisation: 'Kayes',
        telephone: '+223 72 85 96 30',
        type: 'poussins',
        description: 'Poussins de canards du fleuve'
      },
      {
        id: '6',
        nom: 'Œufs fécondés race améliorée',
        vendeur: 'Mariam Sidibé',
        prix: 250,
        stock: 80,
        localisation: 'Bamako',
        telephone: '+223 77 99 88 77',
        type: 'oeufs',
        description: 'Œufs de race améliorée très productive'
      }
    ];

    setTimeout(() => {
      setProduits(mockProduits);
      setLoading(false);
    }, 800);
  }, []);

  const filteredProduits = produits.filter(produit => {
    if (filter === 'tous') return true;
    return produit.type === filter;
  });

  const handleCommander = (produit) => {
    setSelectedProduct(produit);
    setShowOrderModal(true);
  };

  const handleOrderSuccess = (order) => {
    setShowOrderModal(false);
    alert(`✅ Commande envoyée avec succès !\n\nVotre commande de ${order.quantity_requested} x ${order.product_title} a été envoyée au vendeur.\n\nVous recevrez une notification quand le vendeur aura répondu.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🐣</div>
          <p className="text-xl" style={{ color: colors.text }}>Chargement des poussins...</p>
        </div>
      </div>
    );
  }

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
            🐣 Acheter Poussins/Œufs fécondés
          </h1>
          <p className="text-center mt-2" style={{ color: colors.textSecondary }}>
            Démarrez ou agrandissez votre élevage
          </p>
        </div>
      </div>

      {/* Filtres simples */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { key: 'tous', label: 'Tout', icon: '🐣' },
              { key: 'poussins', label: 'Poussins', icon: '🐣' },
              { key: 'oeufs', label: 'Œufs fécondés', icon: '🥚' }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="p-3 rounded-xl font-bold text-lg"
                style={{
                  backgroundColor: filter === f.key ? colors.primary : colors.card,
                  color: filter === f.key ? 'white' : colors.text
                }}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-4">
          {filteredProduits.map(produit => (
            <div
              key={produit.id}
              className="p-4 rounded-xl shadow-lg"
              style={{ backgroundColor: colors.card }}
            >
              {/* En-tête produit */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                    🐣 {produit.nom}
                  </h3>
                  <p className="text-sm" style={{ color: colors.primary }}>
                    👨‍🌾 {produit.vendeur}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    📍 {produit.localisation}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: colors.success }}>
                    {produit.prix}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    FCFA/pièce
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <p className="text-sm" style={{ color: colors.text }}>
                  {produit.description}
                </p>
              </div>

              {/* Stock */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    📦 Stock disponible :
                  </span>
                  <span className="font-bold text-sm" style={{ color: colors.success }}>
                    {produit.stock} pièces
                  </span>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleCommander(produit)}
                  className="flex-1 py-3 rounded-xl font-bold text-lg text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  🛒 Commander
                </button>
                <button
                  onClick={() => alert('Pour plus d\'informations, veuillez d\'abord passer commande. Le vendeur pourra alors vous contacter directement.')}
                  className="px-4 py-3 rounded-xl font-bold text-lg text-white"
                  style={{ backgroundColor: colors.textSecondary }}
                >
                  💬 Info
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message d'aide */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <p className="text-lg font-bold" style={{ color: colors.text }}>
              💡 Conseil
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              Achetez des poussins vaccinés et des œufs fécondés de qualité pour bien commencer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyChicksPage;