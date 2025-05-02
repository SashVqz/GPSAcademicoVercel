import React, { useState } from "react";
import { theme } from "@/constants/theme";
import { certificationRegex, nameRegex } from "@/utils/ValidatorRegex";
import { FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

const Certifications = ({ certifications, setCertifications, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [tempCertifications, setTempCertifications] = useState([...certifications]);
  const [deletedCertifications, setDeletedCertifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleNameChange = (index, event) => {
    const updatedCertifications = [...tempCertifications];
    updatedCertifications[index].name = event.target.value;
    setTempCertifications(updatedCertifications);
  };

  const handleDateChange = (index, event) => {
    const updatedCertifications = [...tempCertifications];
    updatedCertifications[index].date = event.target.value.trim();
    setTempCertifications(updatedCertifications);
  };

  const handleInstitutionChange = (index, event) => {
    const updatedCertifications = [...tempCertifications];
    updatedCertifications[index].institution = event.target.value;
    setTempCertifications(updatedCertifications);
  };

  const addCertification = () => {
    setTempCertifications([
      ...tempCertifications,
      { _id: uuidv4(), name: "", date: "", institution: "" },
    ]);
  };

  const validateForm = () => {
    let newErrors = {};

    tempCertifications.forEach((cert, index) => {
      if (!cert.name || !cert.name.trim()) {
        newErrors[`certification-${index}`] = "El nombre no puede estar vacío.";
      } else if (!certificationRegex(cert.name.trim())) {
        newErrors[`certification-${index}`] = "El nombre solo puede contener caracteres latinos.";
      }
      if (!cert.institution || !cert.institution.trim()) {
        newErrors[`certification-institution-${index}`] = "La institución no puede estar vacía.";
      }
      const currentDate = new Date();
      const certDate = new Date(cert.date);
      if (!cert.date || isNaN(certDate.getTime())) {
        newErrors[`certification-date-${index}`] = "La fecha es obligatoria y debe ser válida.";
      } else if (certDate > currentDate) {
        newErrors[`certification-date-${index}`] = "La fecha no puede ser posterior a la fecha actual.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = (index) => {
    const certificationToDelete = tempCertifications[index];

    if (certificationToDelete._id && certifications.some(cert => cert._id === certificationToDelete._id)) {
      setDeletedCertifications(prev => [...prev, certificationToDelete]);
    }

    setTempCertifications(tempCertifications.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (deletedCertifications.length > 0) {
        await onDelete({ certifications: deletedCertifications });
        setDeletedCertifications([]);
      }

      if (tempCertifications.length > 0) {
        await onSave({
          certifications: tempCertifications
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar las certificaciones", error);
    }
  };

  const handleCancel = () => {
    setTempCertifications([...certifications]);
    setDeletedCertifications([]);
    setErrors({});
    setIsEditing(false);
  };

  const paginatedCertifications = tempCertifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(tempCertifications.length / itemsPerPage);

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg">
      {/* Header con botón de edición */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-lg font-semibold" style={{ color: theme.palette.text.hex }}>
          Certificaciones
        </h2>

        <div className="flex gap-2">
          {isEditing && (
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-white rounded-md transition duration-200"
              style={{ backgroundColor: theme.palette.primary.hex, fontWeight: "bold" }}
            >
              Guardar cambios
            </button>
          )}
          <button
            type="button"
            onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
            className="px-4 py-2 text-white rounded-md transition duration-200"
            style={{ backgroundColor: isEditing ? theme.palette.error.hex : theme.palette.primary.hex, fontWeight: "bold" }}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>
      </div>

      {/* Mensaje cuando no hay certificaciones */}
      {tempCertifications.length === 0 && (
        <p className="text-gray-500 text-sm text-center">No hay certificaciones guardadas.</p>
      )}

      {/* Lista de certificaciones */}
      {paginatedCertifications.map((certification, index) => {
        const actualIndex = (currentPage - 1) * itemsPerPage + index;

        return (
          <div
            key={certification._id || `temp-${actualIndex}`}
            className="rounded-md p-4 border space-y-3"
            style={{ borderColor: theme.palette.lightGray.hex }}
          >
            <div className="flex items-start gap-3">

              {/* Campo Nombre */}
              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Nombre
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="Nombre de la certificación"
                    value={certification.name || ""}
                    onChange={(e) => handleNameChange(actualIndex, e)}
                    className="block w-full p-2 border rounded-md"
                    style={{
                      borderColor: errors[`certification-${actualIndex}`]
                        ? theme.palette.error.hex
                        : theme.palette.primary.hex,
                      color: theme.palette.text.hex,
                    }}
                  />
                ) : (
                  <p
                    className="w-full p-2 bg-transparent border border-transparent"
                    style={{ color: theme.palette.text.hex }}
                  >
                    {certification.name || "—"}
                  </p>
                )}
                {errors[`certification-${actualIndex}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`certification-${actualIndex}`]}
                  </p>
                )}
              </div>

              {/* Campo Institución */}
              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Institución
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="Nombre de la institución"
                    value={certification.institution || ""}
                    onChange={(e) => handleInstitutionChange(actualIndex, e)}
                    className="block w-full p-2 border rounded-md"
                    style={{
                      borderColor: errors[`certification-institution-${actualIndex}`]
                        ? theme.palette.error.hex
                        : theme.palette.primary.hex,
                      color: theme.palette.text.hex,
                    }}
                  />
                ) : (
                  <p
                    className="w-full p-2 bg-transparent border border-transparent"
                    style={{ color: theme.palette.text.hex }}
                  >
                    {certification.institution || "—"}
                  </p>
                )}
                {errors[`certification-institution-${actualIndex}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`certification-institution-${actualIndex}`]}
                  </p>
                )}
              </div>

              {/* Campo Fecha de obtención */}
              <div className="w-1/3 space-y-1">
                <label className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                  Fecha de obtención
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={certification.date || ""}
                    onChange={(e) => handleDateChange(actualIndex, e)}
                    className="block w-full p-2 border rounded-md"
                    style={{
                      borderColor: errors[`certification-date-${actualIndex}`]
                        ? theme.palette.error.hex
                        : theme.palette.primary.hex,
                      color: theme.palette.text.hex,
                    }}
                  />
                ) : (
                  <p
                    className="w-full p-2 bg-transparent border border-transparent"
                    style={{ color: theme.palette.text.hex }}
                  >
                    {certification.date
                      ? new Date(certification.date).toLocaleDateString("es-ES")
                      : "—"}
                  </p>
                )}
                {errors[`certification-date-${actualIndex}`] && (
                  <p className="text-xs" style={{ color: theme.palette.error.hex }}>
                    {errors[`certification-date-${actualIndex}`]}
                  </p>
                )}
              </div>

              {/* Botón borrar */}
              {isEditing && (
                <div className="pt-6 mt-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(actualIndex)}
                    className="text-white p-2 rounded-md transition duration-200"
                    style={{ backgroundColor: theme.palette.error.hex }}
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              )}

            </div>
          </div>
        );
      })}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-white rounded-md transition duration-200"
            style={{
              backgroundColor: currentPage === 1 ? theme.palette.lightGray.hex : theme.palette.primary.hex,
            }}
          >
            Anterior
          </button>
          <span className="text-sm" style={{ color: theme.palette.text.hex }}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-white rounded-md transition duration-200"
            style={{
              backgroundColor: currentPage === totalPages ? theme.palette.lightGray.hex : theme.palette.primary.hex,
            }}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Botón para añadir nuevas certificaciones */}
      {isEditing && (
        <button
          type="button"
          onClick={addCertification}
          className="w-full px-4 py-2 text-white rounded-md transition duration-200"
          style={{ backgroundColor: theme.palette.primary.hex, fontWeight: "bold" }}
        >
          Añadir Certificación
        </button>
      )}
    </div>
  );
};

export default Certifications;