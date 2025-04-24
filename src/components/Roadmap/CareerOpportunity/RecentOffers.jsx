import React from "react";
import { theme } from "@/constants/theme";
import JobOfferCard from "./JobOfferCard";
import { FaInfoCircle } from "react-icons/fa";

const RecentOffers = ({ 
  recentOffers, 
  isFavorite, 
  toggleFavorite, 
  handleOfferClick, 
  saving,
  userEligibility
}) => {
  const filteredOffers = recentOffers.filter(offer => {
    if (userEligibility.canSearchJobs) return true;
    
    if (userEligibility.canSearchInternships && !userEligibility.canSearchJobs) {
      return offer.jobType === "I" || !offer.jobType;
    }
    
    return false;
  });

  const hasFilteredOffers = filteredOffers.length < recentOffers.length;

  return (
    <div className="space-y-4">
      <h2
        className="font-semibold text-lg mb-2 flex items-center"
        style={{ color: theme.palette.text.hex }}
      >
      </h2>

      {hasFilteredOffers && userEligibility.canSearchInternships && !userEligibility.canSearchJobs && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 text-sm flex items-start">
          <FaInfoCircle className="mr-2 mt-0.5" />
          <p>Algunas ofertas no se muestran porque en tu año académico actual solo puedes acceder a prácticas.</p>
        </div>
      )}

      {filteredOffers.length === 0 ? (
        <div
          className="text-center py-8 rounded-lg"
          style={{ backgroundColor: theme.palette.neutral.hex }}
        >
          {!userEligibility.isEligible ? (
            <p style={{ color: theme.palette.darkGray.hex }} className="flex flex-col items-center justify-center">
              No puedes acceder a ofertas en este momento. 
              Se requiere completar al menos el segundo año académico.
            </p>
          ) : (
            <p style={{ color: theme.palette.darkGray.hex }} className="flex flex-col items-center justify-center">
              Aún no has visitado ninguna oferta. 
              Haz clic en "Ver ofertas en LinkedIn" para comenzar.
            </p>
          )}
        </div>
      ) : (
        filteredOffers.map((offer, index) => (
          <JobOfferCard
            key={index}
            offer={offer}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            handleOfferClick={handleOfferClick}
            saving={saving}
            userEligibility={userEligibility}
          />
        ))
      )}
    </div>
  );
};

export default RecentOffers;