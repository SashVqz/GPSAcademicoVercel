"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@constants/theme";
import "@fontsource/montserrat";
import ErrorPopUp from "@components/ErrorPopUp";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import RoadmapTest from "@/components/Roadmap/RoadmapGuide/RoadmapTest";

const RoadmapGuide = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasAcademicRecord, setHasAcademicRecord] = useState(false);

  useEffect(() => {
    const checkUserAndAcademicRecord = async () => {
      if (localStorage.getItem("user") && localStorage.getItem("token")) {
        if (JSON.parse(localStorage.getItem("user")).role === "TEACHER") {
          return; 
        } else {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/AH`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.subjects && Array.isArray(data.subjects) && data.subjects.length > 0) {
                setHasAcademicRecord(true);
              } else {
                setError("Necesitas completar tu expediente académico antes de generar un roadmap.");
              }
            } else {
              setError("No se pudo verificar el expediente académico. Por favor, completa tu expediente académico primero.");
            }
          } catch (error) {
            console.error("Error checking academic record:", error);
            setError("Ocurrió un error al verificar tu expediente académico.");
          }
          
          setLoading(false);
        }
      }
    };
    
    checkUserAndAcademicRecord();
  }, []);

  const handleSubmit = async (specialization) => {
    if (!hasAcademicRecord) {
      setError("Necesitas completar tu expediente académico antes de generar un roadmap.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ specialization }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        const errorMessages = {
          NO_VALID_FIELDS_TO_UPDATE: "Algún dato introducido no es válido",
          INVALID_USER_ID: "El usuario no existe",
          INTERNAL_SERVER_ERROR: "Servidor en mantenimiento",
        };
        setError(errorMessages[data?.error] || "Error al actualizar los metadatos");
        setLoading(false);
        return;
      }

      router.push(`/home/student/${params.id}`);
    } catch (err) {
      console.error(err);
      setError("Ha ocurrido un error inesperado");
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingModal message="Cargando..." />;
  }

  if (JSON.parse(localStorage.getItem("user"))?.role === "TEACHER") {
    return (
      <ErrorPopUp
        message={"No tienes acceso a esta página."}
        path={`/home/student/${params.id}`}
      />
    );
  }

  if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
    return (
      <ErrorPopUp
        message={"Debes iniciar sesión para ver esta página."}
        path={`/login`}
      />
    );
  }

  return (
    <div>
      {!hasAcademicRecord ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.palette.primary.hex }}>
              Expediente académico requerido
            </h2>
            <p className="mb-6 text-gray-700">
              Para generar un roadmap personalizado, primero debes completar tu expediente académico.
            </p>
            <button
              onClick={() => router.push(`/profile/student/${params.id}`)}
              className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
            >
              Ir a mi perfil
            </button>
          </div>
        </div>
      ) : (
        <RoadmapTest onSubmit={handleSubmit} />
      )}
      
      {error && (
        <p
          style={{
            color: theme.palette.error.hex,
            fontFamily: "Montserrat, sans-serif",
          }}
          className="text-sm text-center mt-4"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default RoadmapGuide;