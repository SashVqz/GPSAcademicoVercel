import React, { useState } from "react";

const ActivityLog = ({ updateHistory }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 

  if (!updateHistory || updateHistory.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
        <p className="text-yellow-700">No hay historial de actividad disponible para este usuario.</p>
        <p className="text-sm text-yellow-600 mt-2">
          El historial de actividad se registra cuando se realizan cambios en el perfil del usuario.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(updateHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = updateHistory.slice(startIndex, startIndex + itemsPerPage);

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
    <div className="space-y-4">
      {currentItems.map((entry, index) => {
        if (!entry || !entry.timestamp || !Array.isArray(entry.changes)) {
          return (
            <div key={index} className="bg-red-50 border border-red-200 p-4 rounded">
              <p className="text-red-600">Entrada de registro inválida</p>
            </div>
          );
        }

        return (
          <div
            key={index}
            className="bg-white border rounded-lg shadow-sm overflow-hidden"
          >
            <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">
                {new Date(entry.timestamp).toLocaleString()}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {`#${updateHistory.length - (startIndex + index)}`}
              </span>
            </div>
            <div className="p-4">
              {entry.changes.map((change, changeIndex) => {
                if (!change || !change.field) {
                  return (
                    <div key={changeIndex} className="mb-4 pb-4 border-b last:border-b-0">
                      <p className="text-red-600">Cambio inválido</p>
                    </div>
                  );
                }

                return (
                  <div
                    key={changeIndex}
                    className="mb-4 pb-4 border-b last:border-b-0"
                  >
                    <div className="font-semibold text-blue-600 mb-2 capitalize">
                      {change.field}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-red-600 mb-1">Valor anterior:</div>
                        <pre className="bg-red-50 p-2 rounded text-xs overflow-auto max-h-40">
                          {change.oldValue !== undefined && change.oldValue !== null
                            ? typeof change.oldValue === "object"
                              ? JSON.stringify(change.oldValue, null, 2)
                              : change.oldValue.toString()
                            : "No disponible"}
                        </pre>
                      </div>
                      <div>
                        <div className="text-xs text-green-600 mb-1">Nuevo valor:</div>
                        <pre className="bg-green-50 p-2 rounded text-xs overflow-auto max-h-40">
                          {change.newValue !== undefined && change.newValue !== null
                            ? typeof change.newValue === "object"
                              ? JSON.stringify(change.newValue, null, 2)
                              : change.newValue.toString()
                            : "No disponible"}
                        </pre>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Páginas */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
        >
          Anterior
        </button>
        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ActivityLog;
