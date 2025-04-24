"use client";
import React, { useState, useEffect } from "react";
import "@fontsource/montserrat";
import { theme } from "@/constants/theme";
import SearchForm from "./CareerOpportunity/SearchForm";
import OfferTabs from "./CareerOpportunity/OfferTabs";
import RecentOffers from "./CareerOpportunity/RecentOffers";
import FavoriteOffers from "./CareerOpportunity/FavoriteOffers";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import { useJobOffers } from "./CareerOpportunity/useJobOffers";

const CareerOpportunityComponent = () => {
  const [activeTab, setActiveTab] = useState("recent");

  const {
    loading,
    saving,
    recentOffers,
    favorites,
    searchParams,
    userEligibility,
    handleInputChange,
    generateLinkedInUrl,
    isFavorite,
    toggleFavorite,
    handleOfferClick,
    deleteJobOffer,
    clearAllOffers,
    clearRecentOffers
  } = useJobOffers();

  // useEffect(() => {
  //   document.title = activeTab === "recent" 
  //     ? "Ofertas Recientes | Portal de Empleo" 
  //     : "Ofertas Guardadas | Portal de Empleo";
  // }, [activeTab]);

  if (loading) {
    return <LoadingModal />;
  }

  return (
    <div className="container mx-auto p-2 max-w-8xl">
      <div className="flex items-baseline justify-between mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: theme.palette.primary.hex, fontFamily: "Montserrat" }}
        >
          Portal de ofertas de {userEligibility.canSearchJobs ? "empleo y prácticas" : "prácticas"}
        </h1>
        <span className="italic text-sm text-gray-500" style={{ fontFamily: "Montserrat" }}>
          Diseñado especialmente para ti
        </span>
      </div>

      <SearchForm
        searchParams={searchParams}
        handleInputChange={handleInputChange}
        generateLinkedInUrl={generateLinkedInUrl}
        handleOfferClick={handleOfferClick}
        userEligibility={userEligibility}
      />

      <OfferTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
        recentCount={recentOffers.length}
        clearAllOffers={clearAllOffers}
        clearRecentOffers={clearRecentOffers}
      />

      {activeTab === "recent" ? (
        <RecentOffers
          recentOffers={recentOffers}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          handleOfferClick={handleOfferClick}
          saving={saving}
          userEligibility={userEligibility}
          clearRecentOffers={clearRecentOffers}
        />
      ) : (
        <FavoriteOffers
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          handleOfferClick={handleOfferClick}
          saving={saving}
          userEligibility={userEligibility}
          deleteJobOffer={deleteJobOffer}
          clearAllOffers={clearAllOffers}
        />
      )}
    </div>
  );
};

export default CareerOpportunityComponent;