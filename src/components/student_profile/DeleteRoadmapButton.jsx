"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";

const DeleteRoadmapButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangingSpecialization, setIsChangingSpecialization] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const specializations = [
    "Frontend Developer",
    "Backend Development",
    "Artificial Intelligence",
    "Data Analyst"
  ];

  const openModal = () => {
    setIsModalOpen(true);
    setErrorMsg(null);
    setIsChangingSpecialization(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMsg(null);
    setIsChangingSpecialization(false);
  };

  const handleChangeSpecializationAndDelete = async () => {
    if (!selectedSpecialization) {
      setErrorMsg("Debes seleccionar una especialización");
      return;
    }

    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const updateResponse = await fetch("http://localhost:3000/metadata", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          specialization: selectedSpecialization
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.text();
        let errorMessage;
        try {
          const parsed = JSON.parse(errorData);
          errorMessage = parsed.error || parsed.message || "Error al actualizar la especialización";
        } catch (e) {
          errorMessage = errorData || "Error al actualizar la especialización";
        }
        throw new Error(errorMessage);
      }

      const response = await fetch("http://localhost:3000/userRoadmap", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage;
        try {
          const parsed = JSON.parse(errorData);
          errorMessage = parsed.error || parsed.message || "Error al eliminar el roadmap";
        } catch (e) {
          errorMessage = errorData || "Error al eliminar el roadmap";
        }
        throw new Error(errorMessage);
      }

      try {
        const storedMetadata = JSON.parse(localStorage.getItem("metadata") || "{}");
        if (storedMetadata) {
          storedMetadata.specialization = selectedSpecialization;
          if (storedMetadata.roadmap) {
            delete storedMetadata.roadmap;
          }
          localStorage.setItem("metadata", JSON.stringify(storedMetadata));
        }
      } catch (e) {
        console.error("Error al actualizar localStorage:", e);
      }

      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Error en el proceso:", err);
      setErrorMsg(err.message || "Error al procesar la solicitud");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center justify-center gap-2 px-5 py-2 transition-all hover:opacity-90"
        style={{
          backgroundColor: theme.palette.error.hex,
          color: theme.palette.background.hex,
          padding: "0.5rem 1.25rem",
          borderRadius: theme.buttonRadios.m,
          fontSize: theme.fontSizes.m,
          border: "none",
          cursor: "pointer",
        }}
      >
        <span>Cambiar Roadmap</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 border"
            style={{
              borderColor: theme.palette.lightGray.hex,
              fontFamily: "Montserrat, sans-serif"
            }}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b" style={{ borderColor: theme.palette.lightGray.hex }}>
              <h2
                className="text-xl font-semibold"
                style={{ color: theme.palette.dark.hex }}
              >
                Cambiar Roadmap
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div
              className="flex items-start gap-4 p-4 rounded-md mb-6"
              style={{ backgroundColor: `${theme.palette.warning.hex}20`, borderLeft: `4px solid ${theme.palette.warning.hex}` }}
            >
              <div className="text-amber-600 pt-0.5">
                <i className="bi bi-exclamation-triangle-fill"></i>
              </div>
              <p className="text-gray-700 text-sm">
                Selecciona una nueva especialización y se eliminará el roadmap actual. Asegúrate de que deseas continuar con esta acción.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-md mb-4" style={{ backgroundColor: `${theme.palette.error.hex}20`, borderLeft: `4px solid ${theme.palette.error.hex}` }}>
                <p className="text-sm" style={{ color: theme.palette.error.hex }}>{errorMsg}</p>
              </div>
            )}

            <div className="mt-4 p-4 rounded-md" style={{ backgroundColor: theme.palette.neutral.hex }}>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.palette.text.hex }}>
                Selecciona tu nueva especialización:
              </label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex
                }}
              >
                <option value="">Selecciona una especialización</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 border transition-colors hover:bg-gray-50"
                style={{
                  borderColor: theme.palette.lightGray.hex,
                  color: theme.palette.darkGray.hex,
                  fontWeight: theme.fontWeight.regular,
                  borderRadius: "4px"
                }}
              >
                Cancelar
              </button>

              <button
                onClick={handleChangeSpecializationAndDelete}
                className="px-6 py-2 text-white transition-colors hover:opacity-90 flex items-center gap-2"
                disabled={isDeleting || !selectedSpecialization}
                style={{
                  backgroundColor: theme.palette.primary.hex,
                  opacity: (isDeleting || !selectedSpecialization) ? 0.5 : 1,
                  fontWeight: theme.fontWeight.semibold,
                  borderRadius: "4px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
              >
                {isDeleting ? (
                  <span className="flex items-center gap-2">
                    <i className="bi bi-hourglass-split animate-spin"></i>
                    Procesando...
                  </span>
                ) : (
                  <span>Confirmar cambios</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteRoadmapButton;