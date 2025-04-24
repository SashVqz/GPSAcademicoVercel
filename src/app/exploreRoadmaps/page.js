"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAllRoadmaps } from '@/components/exploreRoadmaps/roadmapsData.js';
import { theme } from '@/constants/theme';
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), { ssr: false });
import { FaSearch, FaTimes } from 'react-icons/fa';

export default function ExploreRoadmaps() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = () => {
      try {
        const data = getAllRoadmaps();
        setRoadmaps(data);
      } catch (error) {
        console.error("Error al cargar las especialidades:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const filteredRoadmaps = useCallback(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    if (normalizedSearchTerm === '') return roadmaps;
    return roadmaps.filter(roadmap => roadmap.name ? roadmap.name.toLowerCase().includes(normalizedSearchTerm) : false);
  }, [roadmaps, searchTerm]);

  const handleRoadmapClick = useCallback((roadmapId) => {
    router.push(`/exploreRoadmaps/${roadmapId}`);
  }, [router]);

  const filteredResults = filteredRoadmaps();

  if (loading) return <LoadingModal />;

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: "url('/assets/fondo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="container mt-5 mb-10 mx-auto px-4 py-8">
        <h1 style={{ color: theme.palette.primary.hex, fontFamily: 'Montserrat', fontWeight: theme.fontWeight.bold }} className="text-3xl text-center mb-10">
          Conoce nuestras Especializaciones
        </h1>

        <div className="mb-8 max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Buscar especialidad por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%',
              padding: '12px 12px 12px 40px',
              borderRadius: theme.buttonRadios.xl,
              border: `1px solid ${theme.palette.light.hex}`,
              color: theme.palette.text.hex,
              fontFamily: 'Montserrat',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          />
          <FaSearch 
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: theme.palette.gray.hex }}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none' }}
            >
              <FaTimes style={{ color: theme.palette.gray.hex }} />
            </button>
          )}
        </div>

        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredResults.map((roadmap) => (
              <div
                key={roadmap.id}
                onClick={() => handleRoadmapClick(roadmap.id)}
                style={{
                  backgroundColor: theme.palette.background.hex,
                  borderRadius: theme.buttonRadios.l,
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  fontFamily: 'Montserrat',
                }}
                className="hover:shadow-lg"
              >
                <div className="p-4">
                  <div className="mb-3 flex items-center">
                    <h2 style={{ color: theme.palette.dark.hex, fontWeight: theme.fontWeight.semibold }} className="text-lg line-clamp-1">
                      {roadmap.name}
                    </h2>
                  </div>

                  <p style={{ color: theme.palette.text.hex }} className="text-sm line-clamp-2 mb-3">
                    {roadmap.shortDescription || "Explora esta especialidad tecnológica"}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {roadmap.languages && roadmap.languages.slice(0, 3).map((lang, idx) => (
                      <span
                        key={idx}
                        style={{ backgroundColor: `${theme.palette.primary.hex}15`, color: theme.palette.primary.hex, padding: '4px 8px', borderRadius: theme.buttonRadios.m, fontSize: theme.fontSizes.s }}
                      >
                        {lang}
                      </span>
                    ))}
                    {roadmap.languages && roadmap.languages.length > 3 && (
                      <span
                        style={{ backgroundColor: `${theme.palette.gray.hex}15`, color: theme.palette.gray.hex, padding: '4px 8px', borderRadius: theme.buttonRadios.m, fontSize: theme.fontSizes.s }}
                      >
                        +{roadmap.languages.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: theme.buttonRadios.l, boxShadow: '0 4px 8px rgba(0,0,0,0.2)', padding: '32px' }} className="text-center">
            <p style={{ color: theme.palette.gray.hex, fontFamily: 'Montserrat', fontSize: theme.fontSizes.l }}>
              No se encontraron especialidades que coincidan con "{searchTerm}".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}