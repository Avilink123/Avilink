import React, { useState, useEffect } from 'react';

const MyRatingsPage = ({ onBack, currentUser }) => {
  const [ratingsSummary, setRatingsSummary] = useState(null);
  const [userRatings, setUserRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatingsData();
  }, [currentUser]);

  const fetchRatingsData = async () => {
    try {
      setLoading(true);
      
      // Récupérer le résumé des évaluations
      const summaryResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/ratings/summary/${currentUser.id}`
      );
      if (summaryResponse.ok) {
        const summary = await summaryResponse.json();
        setRatingsSummary(summary);
      }

      // Récupérer les évaluations détaillées
      const ratingsResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/ratings/user/${currentUser.id}`
      );
      if (ratingsResponse.ok) {
        const ratings = await ratingsResponse.json();
        setUserRatings(ratings);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des évaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRoleColor = () => {
    switch (currentUser.role) {
      case 'aviculteur': return 'blue';
      case 'acheteur': return 'green';
      case 'fournisseur': return 'purple';
      default: return 'gray';
    }
  };

  const color = getRoleColor();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos évaluations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-${color}-600 text-white p-4`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className={`p-2 hover:bg-${color}-700 rounded-lg transition-colors text-2xl`}
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold">Mes Évaluations</h1>
            <p className={`text-${color}-100`}>Voir les avis sur mon service</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Résumé des évaluations */}
        {ratingsSummary && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className={`text-${color}-600`} size={24} />
              Résumé de votre Réputation
            </h2>

            {ratingsSummary.nombre_evaluations > 0 ? (
              <>
                {/* Note moyenne */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="text-yellow-400 fill-current" size={32} />
                    <span className="text-3xl font-bold text-gray-800">
                      {ratingsSummary.note_moyenne}
                    </span>
                    <span className="text-gray-500">/5</span>
                  </div>
                  <p className="text-gray-600">
                    Basé sur {ratingsSummary.nombre_evaluations} évaluation{ratingsSummary.nombre_evaluations > 1 ? 's' : ''}
                  </p>
                </div>

                {/* Répartition des étoiles */}
                <div className="space-y-2 mb-6">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm w-8">{stars}⭐</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-${color}-500 h-2 rounded-full`}
                          style={{ 
                            width: `${(ratingsSummary.repartition_notes[stars] / ratingsSummary.nombre_evaluations) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm w-8 text-gray-600">
                        {ratingsSummary.repartition_notes[stars]}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Star className="text-gray-300 mx-auto mb-4" size={48} />
                <p className="text-gray-600 text-lg">Aucune évaluation reçue pour le moment</p>
                <p className="text-gray-500 text-sm">
                  Les {currentUser.role === 'aviculteur' ? 'acheteurs' : 'éleveurs'} pourront vous noter après leurs achats
                </p>
              </div>
            )}
          </div>
        )}

        {/* Liste des évaluations détaillées */}
        {userRatings.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare className={`text-${color}-600`} size={24} />
              Dernières Évaluations
            </h2>

            <div className="space-y-4">
              {userRatings.map((rating) => (
                <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                  {/* En-tête de l'évaluation */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-lg">{rating.evaluateur_nom}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={star <= rating.note ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({rating.note}/5)</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(rating.date_evaluation)}
                      </div>
                    </div>
                  </div>

                  {/* Produit concerné */}
                  {rating.produit_concerne && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        <Package size={14} />
                        {rating.produit_concerne}
                      </span>
                    </div>
                  )}

                  {/* Commentaire */}
                  {rating.commentaire && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-700 italic">"{rating.commentaire}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conseils pour améliorer sa réputation */}
        <div className={`bg-${color}-50 rounded-xl p-6 shadow-lg`}>
          <h2 className={`text-xl font-bold text-${color}-800 mb-4`}>
            💡 Conseils pour Améliorer votre Réputation
          </h2>
          <div className="space-y-2 text-sm">
            {currentUser.role === 'aviculteur' && (
              <>
                <p>• Maintenez une bonne qualité de vos volailles et œufs</p>
                <p>• Respectez les délais convenus avec les acheteurs</p>
                <p>• Communiquez régulièrement sur la disponibilité de vos produits</p>
                <p>• Offrez un service client attentif et professionnel</p>
              </>
            )}
            {currentUser.role === 'fournisseur' && (
              <>
                <p>• Assurez-vous de la qualité et fraîcheur de vos aliments</p>
                <p>• Livrez dans les délais convenus</p>
                <p>• Proposez des prix compétitifs et transparents</p>
                <p>• Donnez des conseils techniques aux éleveurs</p>
                <p>• Maintenez un stock régulier de vos produits</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRatingsPage;