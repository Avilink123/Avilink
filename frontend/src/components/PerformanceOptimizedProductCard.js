import React, { memo, useMemo, useCallback } from 'react';
import { optimizeImage } from '../utils/performance';

const PerformanceOptimizedProductCard = memo(({ 
  product, 
  currentUser, 
  onContact, 
  onEdit, 
  onDelete,
  lazy = true 
}) => {
  // Memoize expensive calculations
  const productIcon = useMemo(() => {
    const icons = {
      'volaille_vivante': '🐔',
      'oeufs': '🥚',
      'volaille_transformee': '🍗',
      'amendements': '🌱',
      'fientes': '🌱'
    };
    return icons[product.type_produit] || '📦';
  }, [product.type_produit]);

  const productTypeName = useMemo(() => {
    const types = {
      'volaille_vivante': 'Volaille Vivante',
      'oeufs': 'Œufs',
      'volaille_transformee': 'Volaille Transformée',
      'amendements': 'Amendements',
      'fientes': 'Fientes'
    };
    return types[product.type_produit] || 'Produit';
  }, [product.type_produit]);

  const isOwner = useMemo(() => {
    return currentUser && currentUser.id === product.vendeur_id;
  }, [currentUser, product.vendeur_id]);

  const formattedPrice = useMemo(() => {
    return product.prix.toLocaleString();
  }, [product.prix]);

  const formattedDate = useMemo(() => {
    return new Date(product.created_at).toLocaleDateString('fr-FR');
  }, [product.created_at]);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleContact = useCallback(() => {
    onContact?.(product);
  }, [onContact, product]);

  const handleEdit = useCallback(() => {
    onEdit?.(product);
  }, [onEdit, product]);

  const handleDelete = useCallback(() => {
    onDelete?.(product.id);
  }, [onDelete, product.id]);

  const handleCall = useCallback(() => {
    window.open(`tel:${product.vendeur_telephone}`, '_self');
  }, [product.vendeur_telephone]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1">
            <span className="text-3xl" role="img" aria-label={productTypeName}>
              {productIcon}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg md:text-xl truncate" title={product.titre}>
                {product.titre}
              </h3>
              <span className="text-sm text-gray-500">{productTypeName}</span>
            </div>
          </div>
          {isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="text-blue-600 hover:text-blue-800 text-lg p-1 transition-colors"
                aria-label="Modifier"
                title="Modifier le produit"
              >
                ✏️
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 text-lg p-1 transition-colors"
                aria-label="Supprimer"
                title="Supprimer le produit"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2" title={product.description}>
          {product.description}
        </p>
        
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="col-span-2 md:col-span-1">
            <span className="font-bold text-lg text-green-700">{formattedPrice} FCFA</span>
            <span className="text-gray-500">/{product.unite}</span>
          </div>
          <div className="text-gray-600">
            Stock: {product.quantite_disponible} {product.unite}
          </div>
          <div className="text-gray-600 truncate" title={product.localisation}>
            📍 {product.localisation}
          </div>
          <div className="text-gray-600 truncate" title={product.vendeur_nom}>
            👤 {product.vendeur_nom}
          </div>
        </div>
        
        {/* Product-specific details */}
        {product.race_volaille && (
          <div className="text-xs md:text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded">
            Race: {product.race_volaille} • {product.age_semaines} sem • {product.poids_moyen}kg
          </div>
        )}
        {product.type_oeuf && (
          <div className="text-xs md:text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded">
            Type: {product.type_oeuf} • Fraîcheur: {product.fraicheur_jours} jour(s)
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-3 border-t space-y-2 md:space-y-0">
          <span className="text-xs text-gray-500">
            {formattedDate}
          </span>
          {!isOwner && (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
              <button
                onClick={handleCall}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold text-center flex items-center justify-center space-x-1 transition-colors"
                title={`Appeler ${product.vendeur_nom}`}
              >
                <span>📞</span>
                <span className="hidden md:inline">{product.vendeur_telephone}</span>
                <span className="md:hidden">Appeler</span>
              </button>
              <button
                onClick={handleContact}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                title="Plus d'informations"
              >
                💬 Info
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PerformanceOptimizedProductCard.displayName = 'PerformanceOptimizedProductCard';

export default PerformanceOptimizedProductCard;