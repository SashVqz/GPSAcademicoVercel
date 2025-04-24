"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import { FiChevronDown, FiChevronUp, FiBookOpen, FiCheck, FiClock, FiLink } from "react-icons/fi";

const RoadmapViewer = () => {
  const router = useRouter();
  const params = useParams();
  const { id, roadmapId } = params;

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmaps/${roadmapId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener el roadmap");
        }

        const data = await response.json();
        setRoadmap(data);
        
        const initialExpandedState = {};
        Object.keys(data.body || {}).forEach(section => {
          initialExpandedState[section] = false;
        });
        setExpandedSections(initialExpandedState);
        
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (roadmapId) {
      fetchRoadmap();
    }
  }, [roadmapId]);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const getStatusIcon = (status) => {
    if (status === "done") {
      return <FiCheck className="text-green-500" size={18} />;
    } else {
      return <FiClock className="text-blue-500" size={18} />;
    }
  };

  if (loading) {
    return <LoadingModal message="Cargando roadmap..." />;
  }

  const filterOutOrderKey = (section) => {
    const result = {};
    Object.keys(section).forEach(key => {
      if (key !== "order") {
        result[key] = section[key];
      }
    });
    return result;
  };

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
            {roadmap?.name || "Detalle de Roadmap"}
          </h1>
          <button
            onClick={() => router.push(`/home/admin/${id}/roadmaps`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!roadmap ? (
          <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-8 text-center text-gray-500">
            No se pudo cargar el roadmap
          </div>
        ) : (
          <div className="grid gap-6">
            {roadmap.body && Object.keys(roadmap.body).length > 0 ? (
              Object.keys(roadmap.body)
                .sort((a, b) => {
                  const orderA = roadmap.body[a].order !== undefined ? roadmap.body[a].order : 999;
                  const orderB = roadmap.body[b].order !== undefined ? roadmap.body[b].order : 999;
                  if (orderA !== orderB) return orderA - orderB;
                  return a.localeCompare(b);
                })
                .map((section) => (
                  <div key={section} className="bg-white bg-opacity-95 rounded-lg shadow-md overflow-hidden">
                    <div 
                      className="px-6 py-4 flex justify-between items-center cursor-pointer transition-colors hover:bg-gray-50 border-b bg-blue-50 bg-opacity-90"
                      onClick={() => toggleSection(section)}
                    >
                      <h3 className="text-lg font-semibold text-blue-800">
                        {section}
                      </h3>
                      <div>
                        {expandedSections[section] ? 
                          <FiChevronUp className="text-gray-600" size={24} /> : 
                          <FiChevronDown className="text-gray-600" size={24} />
                        }
                      </div>
                    </div>

                    {expandedSections[section] && (
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.keys(filterOutOrderKey(roadmap.body[section])).length > 0 ? (
                            Object.keys(filterOutOrderKey(roadmap.body[section])).map((topic) => {
                              const topicData = roadmap.body[section][topic];
                              return (
                                <div 
                                  key={topic} 
                                  className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 bg-white"
                                  style={{ borderColor: theme.palette.light.hex }}
                                >
                                  <div className="border-b bg-blue-50 px-4 py-3 flex justify-between items-center">
                                    <h4 className="font-medium text-blue-800">
                                      {topic}
                                    </h4>
                                    {getStatusIcon(topicData.status)}
                                  </div>
                                  
                                  <div className="p-4">
                                    <p className="mb-3 text-gray-700 text-sm">
                                      {topicData.description || "Sin descripción"}
                                    </p>
                                    
                                    {(topicData.skill || topicData.subject) && (
                                      <div className="flex flex-wrap gap-2 mb-3">
                                        {topicData.skill && (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {topicData.skill}
                                          </span>
                                        )}
                                        {topicData.subject && (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {topicData.subject}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                    
                                    {topicData.resources && topicData.resources.length > 0 && (
                                      <div className="mt-4">
                                        <h5 className="text-sm font-medium mb-2 flex items-center">
                                          <FiBookOpen className="mr-1" size={14} /> Recursos
                                        </h5>
                                        <ul className="space-y-1">
                                          {topicData.resources.map((resource, idx) => (
                                            <li key={idx} className="text-sm">
                                              <a 
                                                href={resource.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                                              >
                                                <FiLink className="mr-1" size={12} />
                                                {resource.description || "Recurso sin descripción"}
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="col-span-full text-gray-500 text-center py-8">
                              No hay temas en esta sección.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-8 text-center text-gray-500">
                Este roadmap no tiene contenido.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapViewer;