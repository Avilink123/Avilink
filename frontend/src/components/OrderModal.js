import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrderModal = ({ isOpen, onClose, product, currentUser, onOrderSuccess }) => {
  const { colors } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitOrder = async () => {
    if (!currentUser || !product) return;

    setLoading(true);
    setError('');

    try {
      const orderData = {
        product_id: product.id,
        quantity_requested: quantity,
        message_from_buyer: message.trim() || null
      };

      const response = await axios.post(`${API}/orders?buyer_id=${currentUser.id}`, orderData);
      
      if (response.data) {
        onOrderSuccess && onOrderSuccess(response.data);
        onClose();
        // Reset form
        setQuantity(1);
        setMessage('');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.response?.data?.detail || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = product ? product.prix * quantity : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full max-h-90vh overflow-y-auto shadow-2xl"
        style={{ backgroundColor: colors.surface }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: colors.text }}>
              🛒 Commander ce produit
            </h2>
            <button
              onClick={onClose}
              className="text-2xl hover:opacity-60 transition-opacity"
              style={{ color: colors.textSecondary }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product info */}
          {product && (
            <div className="mb-6 p-4 rounded-xl border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: colors.text }}>
                {product.titre}
              </h3>
              <div className="space-y-1 text-sm" style={{ color: colors.textSecondary }}>
                <p>💰 Prix unitaire: {product.prix.toLocaleString()} FCFA</p>
                <p>📦 Stock disponible: {product.quantite_disponible} {product.unite}</p>
                <p>📍 Localisation: {product.localisation}</p>
                <p>👤 Vendeur: {product.vendeur_nom}</p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Quantity selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              📦 Quantité souhaitée
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <div className="flex-1 text-center">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product?.quantite_disponible || 1, parseInt(e.target.value) || 1)))}
                  min="1"
                  max={product?.quantite_disponible || 1}
                  className="w-20 text-center p-2 rounded-lg border"
                  style={{ backgroundColor: colors.card, borderColor: colors.border }}
                />
              </div>
              <button
                onClick={() => setQuantity(Math.min(product?.quantite_disponible || 1, quantity + 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold transition-colors"
                disabled={quantity >= (product?.quantite_disponible || 1)}
              >
                +
              </button>
            </div>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Maximum disponible: {product?.quantite_disponible || 0} {product?.unite}
            </p>
          </div>

          {/* Message to seller */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              💬 Message au vendeur (optionnel)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ajoutez des détails sur votre commande, vos préférences, ou questions..."
              className="w-full p-3 rounded-lg border resize-none"
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
              rows="3"
              maxLength="500"
            />
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              {message.length}/500 caractères
            </p>
          </div>

          {/* Order summary */}
          <div className="mb-6 p-4 rounded-xl border" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
            <h4 className="font-bold mb-3" style={{ color: colors.text }}>
              📋 Résumé de la commande
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>Quantité:</span>
                <span style={{ color: colors.text }}>{quantity} {product?.unite}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>Prix unitaire:</span>
                <span style={{ color: colors.text }}>{product?.prix.toLocaleString()} FCFA</span>
              </div>
              <div className="border-t pt-2" style={{ borderColor: colors.border }}>
                <div className="flex justify-between font-bold text-lg">
                  <span style={{ color: colors.text }}>Total:</span>
                  <span style={{ color: colors.primary }}>{totalAmount.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border font-semibold transition-colors"
              style={{ 
                borderColor: colors.border, 
                color: colors.textSecondary,
                backgroundColor: colors.card 
              }}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmitOrder}
              disabled={loading || !product}
              className="flex-1 py-3 px-4 rounded-xl text-white font-semibold transition-colors disabled:opacity-50"
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Envoi...</span>
                </div>
              ) : (
                '🛒 Envoyer la commande'
              )}
            </button>
          </div>

          {/* Info message */}
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: colors.background }}>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              ℹ️ Après envoi, le vendeur recevra une notification et pourra accepter ou refuser votre commande. 
              Si acceptée, vous pourrez discuter directement avec lui.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;