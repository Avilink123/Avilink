import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import OrderModal from './OrderModal';

const BuyFeedPage = ({ currentUser, onNavigate }) => {
  const { colors } = useTheme();
  const [aliments, setAliments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    // Simulation données aliments pour volailles (protégées)
    const mockAliments = [
      {
        id: 'feed_1',
        titre: 'Maïs pour volailles',
        vendeur_nom: 'Mamadou Keita',
        vendeur_id: 'vendor_1',
        prix: 300,
        unite: 'kg',
        quantite_disponible: 100,
        localisation: 'Sikasso',
        type_produit: 'aliment',
        sous_type: 'cereales',
        description: 'Maïs de qualité pour vos volailles',
        created_at: new Date().toISOString()
      },
      {
        id: 'feed_2',
        titre: 'Nourriture complète',
        vendeur_nom: 'Fatoumata Diarra',
        vendeur_id: 'vendor_2',
        prix: 450,
        unite: 'kg',
        quantite_disponible: 50,
        localisation: 'Bamako',
        type_produit: 'aliment',
        sous_type: 'complet',
        description: 'Nourriture complète riche en vitamines',
        created_at: new Date().toISOString()
      },
      {
        id: 'feed_3',
        titre: 'Son de blé',
        vendeur_nom: 'Ibrahim Coulibaly',
        vendeur_id: 'vendor_3',
        prix: 250,
        unite: 'kg',
        quantite_disponible: 200,
        localisation: 'Ségou',
        type_produit: 'aliment',
        sous_type: 'cereales',
        description: 'Son de blé pour bien nourrir vos poules',
        created_at: new Date().toISOString()
      },
      {
        id: 'feed_4',
        titre: 'Vitamines pour ponte',
        vendeur_nom: 'Aminata Touré',
        vendeur_id: 'vendor_4',
        prix: 800,
        unite: 'kg',
        quantite_disponible: 30,
        localisation: 'Mopti',
        type_produit: 'aliment',
        sous_type: 'vitamines',
        description: 'Aide vos poules à pondre plus d\'œufs',
        created_at: new Date().toISOString()
      },
      {
        id: 'feed_5',
        titre: 'Protéines poisson',
        vendeur_nom: 'Sekou Traoré',
        vendeur_id: 'vendor_5',
        prix: 600,
        unite: 'kg',
        quantite_disponible: 80,
        localisation: 'Kayes',
        type_produit: 'aliment',
        sous_type: 'proteines',
        description: 'Protéines de poisson pour volailles fortes',
        created_at: new Date().toISOString()
      },
      {
        id: 'feed_6',
        titre: 'Mélange complet poulets',
        vendeur_nom: 'Mariam Sidibé',
        vendeur_id: 'vendor_6',
        prix: 400,
        unite: 'kg',
        quantite_disponible: 120,
        localisation: 'Bamako',
        type_produit: 'aliment',
        sous_type: 'complet',
        description: 'Tout ce qu\'il faut pour vos poulets',
        created_at: new Date().toISOString()
      }
    ];

    setTimeout(() => {
      setAliments(mockAliments);
      setLoading(false);
    }, 800);
  }, []);

  const filteredAliments = aliments.filter(aliment => {
    if (filter === 'tous') return true;
    return aliment.sous_type === filter;
  });

  const handleCommander = (aliment) => {
    setSelectedProduct(aliment);
    setShowOrderModal(true);
  };

  const handleOrderSuccess = (order) => {
    setShowOrderModal(false);
    alert(`✅ Commande envoyée avec succès !\n\nVotre commande de ${order.quantity_requested} kg de ${order.product_title} a été envoyée au fournisseur.\n\nVous recevrez une notification quand le fournisseur aura répondu.`);
  };

  const isOwner = (aliment) => {
    return currentUser && currentUser.id === aliment.vendeur_id;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🌾</div>
          <p className="text-xl" style={{ color: colors.text }}>Chargement des aliments...</p>
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
            🌾 Acheter Aliments Volailles
          </h1>
          <p className="text-center mt-2" style={{ color: colors.textSecondary }}>
            Trouvez de la bonne nourriture pour vos volailles
          </p>
        </div>
      </div>

      {/* Filtres simples */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { key: 'tous', label: 'Tout', icon: '🌾' },
              { key: 'cereales', label: 'Grains', icon: '🌾' },
              { key: 'complet', label: 'Complet', icon: '🍽️' },
              { key: 'vitamines', label: 'Vitamines', icon: '💊' }
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

      {/* Liste des aliments */}
      <div className="px-4">
        <div className="max-w-md mx-auto space-y-4">
          {filteredAliments.map(aliment => (
            <div
              key={aliment.id}
              className="p-4 rounded-xl shadow-lg"
              style={{ backgroundColor: colors.card }}
            >
              {/* En-tête produit */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                    🌾 {aliment.titre}
                  </h3>
                  <p className="text-sm" style={{ color: colors.primary }}>
                    👨‍🌾 {aliment.vendeur_nom}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    📍 {aliment.localisation}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: colors.success }}>
                    {aliment.prix}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    FCFA/{aliment.unite}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <p className="text-sm" style={{ color: colors.text }}>
                  {aliment.description}
                </p>
              </div>

              {/* Stock */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    📦 Stock disponible :
                  </span>
                  <span className="font-bold text-sm" style={{ color: colors.success }}>
                    {aliment.quantite_disponible} {aliment.unite}
                  </span>
                </div>
              </div>

              {/* Boutons d'action */}
              {!isOwner(aliment) ? (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleCommander(aliment)}
                    className="flex-1 py-3 rounded-xl font-bold text-lg text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    🛒 Commander
                  </button>
                  <button
                    onClick={() => alert('Pour plus d\'informations, veuillez d\'abord passer commande. Le fournisseur pourra alors vous contacter directement.')}
                    className="px-4 py-3 rounded-xl font-bold text-lg text-white"
                    style={{ backgroundColor: colors.textSecondary }}
                  >
                    💬 Info
                  </button>
                </div>
              ) : (
                <div className="text-center py-3 px-4 rounded-xl" style={{ backgroundColor: colors.background }}>
                  <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                    📝 Votre produit
                  </p>
                </div>
              )}
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
              🔒 Achat Sécurisé
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              Commandez en toute sécurité ! Le fournisseur recevra votre demande et pourra vous contacter seulement après avoir accepté votre commande.
            </p>
          </div>
        </div>
      </div>
      
      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        product={selectedProduct}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default BuyFeedPage;