import React, { useState } from "react";
import { theme } from "@/constants/theme";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaTrash,
  FaTrashAlt,
  FaCheck,
  FaHourglassHalf,
  FaStar,
  FaStar as FaStarSolid,
  FaTimes,
  FaBriefcase,
  FaGraduationCap,
  FaTag,
  FaCalendarAlt,
  FaEye,
  FaClock
} from "react-icons/fa";

const JobOfferCard = ({ 
  offer, 
  isFavorite, 
  toggleFavorite,
  handleOfferClick,
  deleteJobOffer,
  saving,
  isFavoriteCard = false,
  userEligibility 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return 'Fecha desconocida';
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting) return;

    if (typeof deleteJobOffer !== 'function') {
      console.error("deleteJobOffer function is not defined or not a function");
      return;
    }

    if (!offer || !offer.url) {
      console.error("Cannot delete: offer or offer.url is missing");
      return;
    }

    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteJobOffer(offer.url);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting job offer:", error);
      alert("No se pudo eliminar la oferta. Por favor, inténtalo de nuevo.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const isRecent = () => {
    if (!offer.date) return false;
    const offerDate = new Date(offer.date);
    const now = new Date();
    const diffTime = Math.abs(now - offerDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const getJobTypeInfo = () => {
    switch (offer.jobType) {
      case "I":
        return { icon: <FaGraduationCap size={14} />, text: "Prácticas", color: theme.palette.accent.hex };
      case "F":
        return { icon: <FaBriefcase size={14} />, text: "Tiempo completo", color: theme.palette.primary.hex };
      case "P":
        return { icon: <FaClock size={14} />, text: "Tiempo parcial", color: theme.palette.complementary.hex };
      default:
        return { icon: <FaBriefcase size={14} />, text: "Empleo", color: theme.palette.dark.hex };
    }
  };

  const jobTypeInfo = getJobTypeInfo();

  return (
    <a
      href={offer.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => handleOfferClick(e, offer.title, offer.source)}
      className="block transition-all duration-200 bg-white border rounded-lg overflow-hidden hover:shadow-lg transform hover:-translate-y-1"
      style={{ borderColor: theme.palette.lightGray.hex, borderLeft: `4px solid ${jobTypeInfo.color}` }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2" style={{ color: theme.palette.text.hex }}>{offer.title}</h3>
            <div className="flex flex-wrap gap-3 items-center text-sm" style={{ color: theme.palette.gray.hex }}>
              {offer.company && (
                <span className="inline-flex items-center gap-1.5">
                  <FaBuilding size={14} /> 
                  <span>{offer.company}</span>
                </span>
              )}
              {offer.location && (
                <span className="inline-flex items-center gap-1.5">
                  <FaMapMarkerAlt size={14} /> 
                  <span>{offer.location}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex ml-2">
            {isFavoriteCard && deleteJobOffer && (
              <button
                onClick={handleDelete}
                className={`p-2 text-lg ml-1 rounded-full transition-colors ${showDeleteConfirm ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}`}
                disabled={isDeleting}
                aria-label="Eliminar oferta"
              >
                {isDeleting ? (
                  <FaHourglassHalf className="animate-pulse" size={16} />
                ) : showDeleteConfirm ? (
                  <FaTrash size={16} />
                ) : (
                  <FaTrashAlt size={16} />
                )}
              </button>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(offer);
              }}
              disabled={saving}
              className="p-2 text-xl rounded-full transition-colors hover:bg-yellow-50"
              aria-label={isFavorite && typeof isFavorite === 'function' && isFavorite(offer.url) ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              {saving ? (
                <FaHourglassHalf className="animate-pulse" size={18} />
              ) : (isFavorite && typeof isFavorite === 'function' && isFavorite(offer.url)) || isFavoriteCard ? (
                <FaStarSolid style={{ color: theme.palette.warning.hex }} size={18} />
              ) : (
                <FaStar style={{ color: theme.palette.gray.hex }} size={18} />
              )}
            </button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="mt-2 mb-4 p-3 rounded bg-red-50 text-sm border border-red-200">
            <p className="text-red-700 mb-2 font-medium">¿Eliminar esta oferta?</p>
            <div className="flex gap-2">
              <button 
                onClick={handleDelete} 
                className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium flex items-center justify-center"
              >
                {isDeleting ? (
                  <><FaHourglassHalf size={12} className="mr-1.5" /> <span>Eliminando...</span></>
                ) : (
                  <><FaCheck size={12} className="mr-1.5" /> <span>Sí, eliminar</span></>
                )}
              </button>
              <button 
                onClick={cancelDelete} 
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium flex items-center justify-center"
              >
                <FaTimes size={12} className="mr-1.5" /> <span>Cancelar</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span 
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium text-xs"
            style={{ backgroundColor: jobTypeInfo.color + '20', color: jobTypeInfo.color }}
          >
            {jobTypeInfo.icon}
            <span>{jobTypeInfo.text}</span>
          </span>

          {isRecent() && (
            <span 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium text-xs"
              style={{ backgroundColor: theme.palette.success.hex + '20', color: theme.palette.success.hex }}
            >
              <FaTag size={12} />
              <span>Reciente</span>
            </span>
          )}

          <span 
            className="inline-flex items-center gap-1.5 text-xs"
            style={{ color: theme.palette.gray.hex }}
          >
            <FaCalendarAlt size={12} />
            <span>{formatDate(offer.date)}</span>
          </span>
          
          {offer.visitCount > 1 && (
            <span 
              className="inline-flex items-center gap-1.5 text-xs"
              style={{ color: theme.palette.gray.hex }}
            >
              <FaEye size={12} />
              <span>{offer.visitCount} veces</span>
            </span>
          )}
        </div>
      </div>
    </a>
  );
};

export default JobOfferCard;