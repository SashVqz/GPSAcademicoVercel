import React, { useState } from "react";
import { theme } from "@/constants/theme";

const OfferTabs = ({ 
  activeTab, 
  setActiveTab, 
  favoritesCount, 
  recentCount,
  clearAllOffers,
  clearRecentOffers
}) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const handleClearRecent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm("¿Estás seguro de que quieres eliminar tu historial de ofertas recientes?")) {
      clearRecentOffers();
      setShowSettingsMenu(false);
    }
  };

  const handleClearAll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm("¿Estás seguro de que quieres eliminar TODAS las ofertas? Esta acción eliminará tanto las ofertas recientes como las guardadas.")) {
      clearAllOffers();
      setShowSettingsMenu(false);
    }
  };

  return (
    <div className="mb-4 border-b border-gray-200 relative">
      <div className="flex justify-between items-center">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("recent")}
              className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${
                activeTab === "recent"
                  ? "border-current text-current"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              style={{
                color: activeTab === "recent" ? theme.palette.primary.hex : theme.palette.text.hex,
                borderColor: activeTab === "recent" ? theme.palette.primary.hex : "transparent"
              }}
            >
              <i className={`bi bi-clock-history mr-2 ${activeTab === "recent" ? "text-current" : "text-gray-400"}`}></i>
              Ofertas recientes
              {recentCount > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {recentCount}
                </span>
              )}
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("favorites")}
              className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${
                activeTab === "favorites"
                  ? "border-current text-current"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              style={{
                color: activeTab === "favorites" ? theme.palette.primary.hex : theme.palette.text.hex,
                borderColor: activeTab === "favorites" ? theme.palette.primary.hex : "transparent"
              }}
            >
              <i className={`bi bi-bookmark-star mr-2 ${activeTab === "favorites" ? "text-current" : "text-gray-400"}`}></i>
              Ofertas guardadas
              {favoritesCount > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>
          </li>
        </ul>

        <div className="relative">
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            aria-label="Opciones"
          >
            <i className="bi bi-three-dots-vertical"></i>
          </button>
          
          {showSettingsMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1 text-sm text-gray-700">
                <button
                  onClick={handleClearRecent}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                >
                  <i className="bi bi-eraser mr-2 text-gray-500"></i>
                  Limpiar historial de ofertas
                </button>
                <button
                  onClick={handleClearAll}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center text-red-600"
                >
                  <i className="bi bi-trash mr-2"></i>
                  Eliminar todas las ofertas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {showSettingsMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowSettingsMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default OfferTabs;