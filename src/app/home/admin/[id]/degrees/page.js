"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import { FaUpload, FaTrash } from 'react-icons/fa';

const DegreeList = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [expandedDegree, setExpandedDegree] = useState(null);

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/degrees`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener la lista de titulaciones");
        }

        const data = await response.json();
        setDegrees(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDegrees();
  }, []);

  const handleDelete = async (degreeName) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la titulación "${degreeName}"?`)) {
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/degrees/${encodeURIComponent(degreeName)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la titulación");
      }
      setDegrees(degrees.filter(degree => degree.name !== degreeName && degree.id !== degreeName));
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor selecciona un archivo");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/degrees`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al subir la titulación");
      }

      const data = await response.json();
      
      setDegrees([...degrees, data]);
      setShowUploadModal(false);
      setFile(null);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const toggleDegreeDetails = (degreeName) => {
    if (expandedDegree === degreeName) {
      setExpandedDegree(null);
    } else {
      setExpandedDegree(degreeName);
    }
  };

  const filteredDegrees = degrees.filter(degree => 
    degree.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingModal message="Cargando titulaciones..." />;
  }

  return (
    <div 
      className="min-h-screen py-8"
      style={{ 
        backgroundImage: "url('/assets/fondo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white bg-opacity-95 rounded-lg shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">
            Gestión de Titulaciones
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <FaUpload className="text-lg" /> 
              Subir Titulación
            </button>
            <button
              onClick={() => router.push(`/home/admin/${id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white bg-opacity-95 rounded-lg shadow-md mb-8">
          <div className="p-4 border-b bg-blue-50 bg-opacity-90">
            <input
              type="text"
              placeholder="Buscar titulaciones..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderColor: theme.palette.light.hex }}
            />
          </div>

          <div className="overflow-hidden">
            {filteredDegrees.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredDegrees.map((degree) => (
                  <li key={degree.name} className="hover:bg-gray-50 transition-colors">
                    <div 
                      className="p-4 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleDegreeDetails(degree.name)}
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800">
                          {degree.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {degree.subjects ? `${degree.subjects.length} asignaturas` : 'No hay datos de asignaturas'}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {degree.subjects && 
                            [...new Set(degree.subjects.map(s => s.label))].slice(0, 5).map((label, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                              >
                                {label}
                              </span>
                            ))
                          }
                          {degree.subjects && 
                            [...new Set(degree.subjects.map(s => s.label))].length > 5 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                +{[...new Set(degree.subjects.map(s => s.label))].length - 5} más
                              </span>
                            )
                          }
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-sm">
                          {expandedDegree === degree.name ? 'Ocultar detalles' : 'Ver detalles'}
                        </span>
                        <i className={`bi ${expandedDegree === degree.name ? 'bi-chevron-up' : 'bi-chevron-down'} text-blue-500`}></i>
                      </div>
                    </div>

                    {expandedDegree === degree.name && degree.subjects && (
                      <div className="px-4 pb-4 bg-blue-50 bg-opacity-50 border-t border-blue-100">
                        <div className="overflow-x-auto mt-2">
                          <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden shadow-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Nombre
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Créditos
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Tipo
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Categoría
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Año
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Mención
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {degree.subjects.map((subject, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {subject.name}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                    {subject.credits}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      subject.type === "B" ? "bg-green-100 text-green-800" :
                                      subject.type === "OB" ? "bg-blue-100 text-blue-800" :
                                      subject.type === "OP" ? "bg-purple-100 text-purple-800" :
                                      "bg-yellow-100 text-yellow-800"
                                    }`}>
                                      {subject.type}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                    {subject.label}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                    {subject.year}º
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                    {subject.mention || "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="mt-4 flex justify-end gap-2">
                          <button
                            className="px-3 py-2 text-sm text-red-600 hover:text-red-900 border border-red-200 rounded-md hover:bg-red-50 transition-colors flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(degree.name);
                            }}
                          >
                            <FaTrash className="text-lg" /> Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500 bg-white bg-opacity-90 rounded-lg">
                No se encontraron titulaciones
              </div>
            )}
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h3 className="text-xl font-semibold text-blue-800">
                Subir Nueva Titulación
              </h3>
            </div>
            
            <form onSubmit={handleUpload} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivo JSON de la Titulación
                </label>
                <div className="relative border-2 border-dashed border-blue-200 rounded-lg py-4 px-4 text-center hover:border-blue-400 transition-colors group">
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-10 w-10 text-blue-400 group-hover:text-blue-600 transition-colors" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <p className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors">
                      Selecciona un archivo JSON
                    </p>
                    <p className="text-xs text-gray-500">
                      {file ? file.name : 'no file selected'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Solo se aceptan archivos JSON con el formato adecuado para titulaciones.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={uploading}
                >
                  {uploading ? "Subiendo..." : "Subir"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DegreeList;