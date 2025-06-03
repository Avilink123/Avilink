import React, { useState, useEffect } from 'react';

const RateSupplierPage = ({ onBack, currentUser }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [product, setProduct] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/by-role/fournisseur`);
      if (response.ok) {
        const suppliersData = await response.json();
        // Filtrer pour ne garder que les fournisseurs de la même région
        const localSuppliers = suppliersData.filter(supplier => 
          supplier.localisation === currentUser.localisation
        );
        setSuppliers(localSuppliers);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des fournisseurs:', error);
    }
  };

  const submitRating = async () => {
    if (!selectedSupplier || rating === 0) return;
    
    setSubmitting(true);
    try {
      const ratingData = {
        type_rating: "farmer_to_supplier",
        evaluateur_id: currentUser.id,
        evalué_id: selectedSupplier.id,
        note: rating,
        commentaire: comment.trim() || null,
        produit_concerne: product.trim() || null,
        localisation: currentUser.localisation
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData)
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setSelectedSupplier(null);
        setRating(0);
        setComment('');
        setProduct('');
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'évaluation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors text-2xl"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold">Noter un Fournisseur</h1>
            <p className="text-blue-100">Évaluez la qualité des aliments</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Message de succès */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <p className="text-lg font-semibold">✅ Évaluation envoyée avec succès !</p>
            <p>Merci pour votre retour.</p>
          </div>
        )}

        {/* Sélection du fournisseur */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-blue-600" size={24} />
            Choisir le Fournisseur
          </h2>
          
          <div className="grid gap-3">
            {suppliers.map((supplier) => (
              <button
                key={supplier.id}
                onClick={() => setSelectedSupplier(supplier)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedSupplier?.id === supplier.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{supplier.nom}</p>
                    <p className="text-gray-600">{supplier.telephone}</p>
                    <p className="text-sm text-gray-500">{supplier.localisation}</p>
                    {supplier.rating_average > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="text-yellow-400 fill-current" size={16} />
                        <span className="text-sm">{supplier.rating_average}/5 ({supplier.rating_count} avis)</span>
                      </div>
                    )}
                  </div>
                  {selectedSupplier?.id === supplier.id && (
                    <div className="text-blue-600">✓</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire d'évaluation */}
        {selectedSupplier && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Évaluer {selectedSupplier.nom}
            </h2>

            {/* Produit concerné */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                <Package className="inline mr-2" size={20} />
                Aliment acheté (optionnel)
              </label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Ex: Aliment poussin, Provende croissance, Maïs..."
                className="w-full p-3 border border-gray-300 rounded-lg text-lg"
              />
            </div>

            {/* Système d'étoiles */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Note (obligatoire)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-2 text-gray-600">
                {rating === 0 && "Cliquez sur les étoiles pour noter"}
                {rating === 1 && "⭐ Très décevant"}
                {rating === 2 && "⭐⭐ Décevant"}
                {rating === 3 && "⭐⭐⭐ Correct"}
                {rating === 4 && "⭐⭐⭐⭐ Bien"}
                {rating === 5 && "⭐⭐⭐⭐⭐ Excellent"}
              </div>
            </div>

            {/* Commentaire */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Votre commentaire (optionnel)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience : qualité des aliments, prix, service, livraison..."
                className="w-full p-3 border border-gray-300 rounded-lg text-lg h-32 resize-none"
              />
            </div>

            {/* Critères d'évaluation */}
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Critères à considérer :</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Qualité des aliments (fraîcheur, composition)</li>
                <li>• Rapport qualité-prix</li>
                <li>• Ponctualité des livraisons</li>
                <li>• Service client et conseils</li>
                <li>• Régularité des approvisionnements</li>
              </ul>
            </div>

            {/* Bouton d'envoi */}
            <button
              onClick={submitRating}
              disabled={rating === 0 || submitting}
              className={`w-full py-4 rounded-lg text-white font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                rating === 0 || submitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Envoyer l'Évaluation
                </>
              )}
            </button>
          </div>
        )}

        {/* Message si aucun fournisseur */}
        {suppliers.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            <p className="text-lg font-semibold">Aucun fournisseur trouvé</p>
            <p>Il n'y a pas encore de fournisseurs dans votre région ({currentUser.localisation}).</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RateSupplierPage;