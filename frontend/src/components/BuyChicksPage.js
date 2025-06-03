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
    // Simulation données poussins et œufs fécondés (protégées)
    const mockProduits = [
      {
        id: 'chick_1',
        titre: 'Poussins 1 jour',
        vendeur_nom: 'Mamadou Keita',
        vendeur_id: 'vendor_1',
        prix: 500,
        unite: 'pièce',
        quantite_disponible: 50,
        localisation: 'Sikasso',
        type_produit: 'volaille_vivante',
        sous_type: 'poussins',
        description: 'Poussins en bonne santé, vaccinés',
        created_at: new Date().toISOString()
      },
      {
        id: 'egg_1',
        titre: 'Œufs fécondés de poules',
        vendeur_nom: 'Fatoumata Diarra',
        vendeur_id: 'vendor_2',
        prix: 200,
        unite: 'pièce',
        quantite_disponible: 100,
        localisation: 'Bamako',
        type_produit: 'oeufs',
        sous_type: 'fecondes',
        description: 'Œufs fécondés de poules locales',
        created_at: new Date().toISOString()
      },
      {
        id: 'chick_2',
        titre: 'Poussins pintades',
        vendeur_nom: 'Ibrahim Coulibaly',
        vendeur_id: 'vendor_3',
        prix: 800,
        unite: 'pièce',
        quantite_disponible: 30,
        localisation: 'Ségou',
        type_produit: 'volaille_vivante',
        sous_type: 'poussins',
        description: 'Jeunes pintades résistantes',
        created_at: new Date().toISOString()
      },
      {
        id: 'egg_2',
        titre: 'Œufs de pintades fécondés',
        vendeur_nom: 'Aminata Touré',
        vendeur_id: 'vendor_4',
        prix: 300,
        unite: 'pièce',
        quantite_disponible: 60,
        localisation: 'Mopti',
        type_produit: 'oeufs',
        sous_type: 'fecondes',
        description: 'Œufs de pintades pour élevage',
        created_at: new Date().toISOString()
      },
      {
        id: 'chick_3',
        titre: 'Poussins coqs locaux',
        vendeur_nom: 'Sekou Traoré',
        vendeur_id: 'vendor_5',
        prix: 600,
        unite: 'pièce',
        quantite_disponible: 40,
        localisation: 'Kayes',
        type_produit: 'volaille_vivante',
        sous_type: 'poussins',
        description: 'Poussins de race locale robuste',
        created_at: new Date().toISOString()
      },
      {
        id: 'chick_4',
        titre: 'Poussins poulets chair',
        vendeur_nom: 'Mariam Sidibé',
        vendeur_id: 'vendor_6',
        prix: 450,
        unite: 'pièce',
        quantite_disponible: 80,
        localisation: 'Bamako',
        type_produit: 'volaille_vivante',
        sous_type: 'poussins',
        description: 'Poussins spécialisés pour la viande',
        created_at: new Date().toISOString()
      }
    ];

    setTimeout(() => {
      setProduits(mockProduits);
      setLoading(false);
    }, 800);
  }, []);

  const filteredProduits = produits.filter(produit => {
    if (filter === 'tous') return true;
    return produit.sous_type === filter;
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
              { key: 'fecondes', label: 'Œufs fécondés', icon: '🥚' }
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