"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { theme } from "@/constants/theme";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import { FaUpload, FaEye, FaTrash } from 'react-icons/fa';

const RoadmapList = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener la lista de roadmaps");
        }

        const data = await response.json();
        setRoadmaps(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const handleDelete = async (roadmapName) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el roadmap "${roadmapName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps/${encodeURIComponent(roadmapName)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el roadmap");
      }

      setRoadmaps(roadmaps.filter(roadmap => roadmap.name !== roadmapName));
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al subir el roadmap");
      }

      const data = await response.json();
      
      setRoadmaps([...roadmaps, data]);
      setShowUploadModal(false);
      setFile(null);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const filteredRoadmaps = roadmaps.filter(roadmap => 
    roadmap.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingModal message="Cargando roadmaps..." />;
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
            Gestión de Roadmaps
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <FaUpload className="text-lg" />
              Subir Roadmap
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
              placeholder="Buscar roadmaps..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderColor: theme.palette.light.hex }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredRoadmaps.length > 0 ? (
              filteredRoadmaps.map((roadmap) => (
                <div 
                  key={roadmap.name} 
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col bg-white"
                  style={{ borderColor: theme.palette.light.hex }}
                >
                  <div className="px-6 py-4 border-b bg-blue-50 flex-shrink-0">
                    <h3 className="text-lg font-semibold truncate text-blue-800">
                      {roadmap.name}
                    </h3>
                  </div>
                  <div className="px-6 py-4 flex-grow">
                    {roadmap.body && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {Object.keys(roadmap.body).map((section, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                            >
                              {section}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          {countTopics(roadmap.body)} temas
                        </p>
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      Actualizado: {formatDate(roadmap.updatedAt)}
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-gray-50 border-t flex justify-end gap-2 flex-shrink-0">
                    <button
                      className="text-blue-600 hover:text-blue-900 px-2 py-1 flex items-center gap-1 hover:bg-blue-50 rounded transition-colors"
                      onClick={() => {
                        const url = `/home/admin/${id}/roadmaps/edit/${roadmap.name}`;
                        router.push(url);
                      }}
                    >
                      <FaEye className="text-lg" /> Ver Detalles
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 px-2 py-1 flex items-center gap-1 hover:bg-red-50 rounded transition-colors"
                      onClick={() => handleDelete(roadmap.name)}
                    >
                      <FaTrash className="text-lg" /> Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-gray-500 bg-white bg-opacity-90 rounded-lg">
                No se encontraron roadmaps
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
                Subir Nuevo Roadmap
              </h3>
            </div>
            
            <form onSubmit={handleUpload} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivo JSON del Roadmap
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
                  Solo se aceptan archivos JSON con el formato adecuado para roadmaps.
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

function countTopics(body) {
  let count = 0;
  Object.values(body).forEach(section => {
    const topics = Object.keys(section).filter(key => key !== "order");
    count += topics.length;
  });
  return count;
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default RoadmapList;