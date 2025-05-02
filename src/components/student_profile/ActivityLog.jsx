import React, { useState } from "react";
import { theme } from "@/constants/theme";

const ActivityLog = ({ updateHistory }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const renderValue = (value) => {
    if (value === null || value === undefined) return "No disponible";

    if (Array.isArray(value) && value.every(v => typeof v === "object" && v !== null)) {
      const keys = Object.keys(value[0]).filter(k => k !== "_id");

      return (
        <table className="text-xs w-full border-collapse">
          <thead>
            <tr>
              {keys.map((key) => (
                <th key={key} className="text-left px-2 py-1 font-semibold border-b" style={{ color: theme.palette.text.hex }}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {value.map((item, i) => (
              <tr key={i} className="border-b last:border-0">
                {keys.map((key) => (
                  <td key={key} className="px-2 py-1">{item[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (typeof value === "object") {
      const { _id, ...rest } = value;
      return Object.entries(rest)
        .map(([key, val]) => `${key}: ${val}`)
        .join(" | ");
    }

    return value.toString();
  };

  if (!updateHistory || updateHistory.length === 0) {
    return (
      <div className="space-y-4 p-4 bg-white rounded-lg">
        <h2
          className="text-lg font-semibold"
          style={{ color: theme.palette.text.hex }}>
          Registro de actividad
        </h2>

        <div
          className="p-4 rounded"
          style={{ backgroundColor: `${theme.palette.warning.hex}20`, border: `1px solid ${theme.palette.warning.hex}` }}
        >
          <p style={{ color: theme.palette.deepOrange.hex }}>No hay historial de actividad disponible para este usuario.</p>
          <p className="text-sm mt-2" style={{ color: `${theme.palette.complementary.hex}CC` }}>
            El historial de actividad se registra cuando se realizan cambios en el perfil del usuario.
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(updateHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = updateHistory.slice().reverse().slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg">
      <h2
        className="text-lg font-semibold"
        style={{ color: theme.palette.text.hex }}>
        Registro de actividad
      </h2>

      {currentItems.map((entry, index) => {
        if (!entry || !entry.timestamp || !Array.isArray(entry.changes)) {
          return (
            <div
              key={index}
              className="p-4 rounded"
              style={{ backgroundColor: `${theme.palette.error.hex}20`, border: `1px solid ${theme.palette.error.hex}` }}
            >
              <p style={{ color: theme.palette.error.hex }}>Entrada de registro inválida</p>
            </div>
          );
        }

        return (
          <div
            key={index}
            className="border rounded-lg shadow-sm overflow-hidden"
            style={{
              backgroundColor: theme.palette.background.hex,
              borderColor: theme.palette.lightGray.hex
            }}
          >
            <div
              className="px-4 py-2 flex justify-between items-center"
              style={{ backgroundColor: theme.palette.neutral.hex }}
            >
              <span className="text-sm font-medium" style={{ color: theme.palette.text.hex }}>
                {new Date(entry.timestamp).toLocaleString()}
              </span>
              <span
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: `${theme.palette.secondary.hex}30`, color: theme.palette.primary.hex }}
              >
                {`#${updateHistory.length - (startIndex + index)}`}
              </span>
            </div>
            <div className="p-4">
              {entry.changes.map((change, changeIndex) => {
                if (!change || !change.field) {
                  return (
                    <div key={changeIndex} className="mb-4 pb-4 border-b last:border-b-0">
                      <p style={{ color: theme.palette.error.hex }}>Cambio inválido</p>
                    </div>
                  );
                }

                return (
                  <div
                    key={changeIndex}
                    className="mb-4 pb-4 border-b last:border-b-0"
                    style={{ borderColor: theme.palette.lightGray.hex }}
                  >
                    <div className="font-semibold mb-2 capitalize" style={{ color: theme.palette.primary.hex }}>
                      {change.field.replace(/_/g, " ")}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs mb-1" style={{ color: theme.palette.error.hex }}>Valor anterior:</div>
                        <div className="p-2 rounded text-xs overflow-auto max-h-40" style={{ backgroundColor: `${theme.palette.error.hex}10` }}>
                          {renderValue(change.oldValue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs mb-1" style={{ color: theme.palette.success.hex }}>Nuevo valor:</div>
                        <div className="p-2 rounded text-xs overflow-auto max-h-40" style={{ backgroundColor: `${theme.palette.success.hex}10` }}>
                          {renderValue(change.newValue)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded"
          style={{
            backgroundColor: currentPage === 1 ? theme.palette.lightGray.hex : theme.palette.primary.hex,
            color: currentPage === 1 ? theme.palette.text.hex : theme.palette.background.hex,
          }}
        >
          Anterior
        </button>
        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded"
          style={{
            backgroundColor: currentPage === totalPages ? theme.palette.lightGray.hex : theme.palette.primary.hex,
            color: currentPage === totalPages ? theme.palette.text.hex : theme.palette.background.hex,
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ActivityLog;
