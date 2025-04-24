import React, { useState } from "react";
import { theme } from "@/constants/theme";
import JobOfferCard from "./JobOfferCard";

const FavoriteOffers = ({ 
  favorites, 
  toggleFavorite, 
  handleOfferClick, 
  saving,
  userEligibility,
  deleteJobOffer,
  clearAllOffers
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const filteredFavorites = favorites.filter(offer => {
    if (userEligibility.canSearchJobs) return true;
    if (userEligibility.canSearchInternships && !userEligibility.canSearchJobs) return offer.jobType === "I" || !offer.jobType;
    
    return false;
  });

  const hasFilteredOffers = filteredFavorites.length < favorites.length;

  const handleClearAll = async () => {
    if (isClearing) return;
    
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }
    
    setIsClearing(true);
    try {
      const success = await clearAllOffers();
      if (success) {
        setShowClearConfirm(false);
      } else {
        alert("No se pudieron eliminar todas las ofertas. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al limpiar ofertas:", error);
    } finally {
      setIsClearing(false);
    }
  };

  const cancelClearAll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2
          className="font-semibold text-lg mb-2 flex items-center"
          style={{ color: theme.palette.text.hex }}
        >
        </h2>
        
        {filteredFavorites.length > 0 && (
          <button
            onClick={handleClearAll}
            className={`text-sm px-3 py-1 rounded-md flex items-center ${showClearConfirm ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            disabled={isClearing}
          >
            {isClearing ? (
              <>
                <i className="bi bi-hourglass-split animate-spin mr-1"></i> Limpiando...
              </>
            ) : showClearConfirm ? (
              <>
                <i className="bi bi-exclamation-triangle-fill mr-1"></i> Confirmar
              </>
            ) : (
              <>
                <i className="bi bi-trash mr-1"></i> Limpiar todo
              </>
            )}
          </button>
        )}
      </div>

      {showClearConfirm && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-start">
          <i className="bi bi-exclamation-triangle-fill mr-2 mt-0.5"></i>
          <div className="flex-1">
            <p className="font-medium">¿Estás seguro de eliminar todas las ofertas guardadas?</p>
            <p className="text-sm mt-1">Esta acción no se puede deshacer. Se eliminarán las ofertas de tu cuenta y dispositivo.</p>
            <div className="flex mt-2 space-x-2">
              <button 
                onClick={handleClearAll}
                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                disabled={isClearing}
              >
                {isClearing ? "Eliminando..." : "Sí, eliminar todo"}
              </button>
              <button 
                onClick={cancelClearAll}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {hasFilteredOffers && userEligibility.canSearchInternships && !userEligibility.canSearchJobs && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 text-sm flex items-start">
          <i className="bi bi-info-circle-fill mr-2 mt-0.5"></i>
          <p>Algunas ofertas guardadas no se muestran porque en tu año académico actual solo puedes acceder a prácticas.</p>
        </div>
      )}

      {filteredFavorites.length === 0 ? (
        <div
          className="text-center py-8 rounded-lg"
          style={{ backgroundColor: theme.palette.neutral.hex }}
        >
          {!userEligibility.isEligible ? (
            <p style={{ color: theme.palette.darkGray.hex }} className="flex flex-col items-center justify-center">
              No puedes acceder a ofertas en este momento.
              Se requiere completar al menos el segundo año académico.
            </p>
          ) : hasFilteredOffers ? (
            <p style={{ color: theme.palette.darkGray.hex }} className="flex flex-col items-center justify-center">
              Tienes ofertas guardadas, pero no son visibles con tu nivel académico actual.
              Necesitas estar en 3° o 4° año para ver ofertas de empleo.
            </p>
          ) : showClearConfirm ? (
            <p style={{ color: theme.palette.darkGray.hex }} className="flex flex-col items-center justify-center">
              Eliminando todas las ofertas guardadas...
            </p>
          ) : (
            <p style={{ color: theme.palette.darkGray.hex }} className="flex flex-col items-center justify-center">
              No has guardado ninguna oferta todavía. 
            </p>
          )}
        </div>
      ) : (
        filteredFavorites.map((offer, index) => (
          <JobOfferCard
            key={index}
            offer={offer}
            isFavorite={() => true} 
            toggleFavorite={toggleFavorite}
            handleOfferClick={handleOfferClick}
            saving={saving}
            isFavoriteCard={true}
            userEligibility={userEligibility}
            deleteJobOffer={deleteJobOffer}
          />
        ))
      )}
    </div>
  );
};

export default FavoriteOffers;