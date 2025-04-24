"use client";

import { theme } from "@/constants/theme";
import "@fontsource/montserrat";

export default function Home() {
  return (
    <>
      <div
        style={{
          fontFamily: "Montserrat",
          color: theme.palette.text.hex,
        }}
        className="flex flex-col items-center justify-center min-h-screen text-center px-6"
      >
        <h1
          className="text-4xl font-bold animate-fadeIn"
          style={{ color: theme.palette.primary.hex }}
        >
          Bienvenido al Asistente de Carrera Profesional de U-tad
        </h1>

        <p
          className="text-lg mt-10 animate-fadeIn"
          style={{ maxWidth: "600px", color: theme.palette.darkGray.hex }}
        >
          Explora diferentes especializaciones en Ingeniería de Datos, Ciencia
          de Datos y más. Descubre cuál es el camino profesional adecuado para
          ti con nuestras guías personalizadas.
        </p>

        <button
          style={{
            backgroundColor: theme.palette.primary.hex,
            color: theme.palette.background.hex,
            borderRadius: theme.buttonRadios.m,
          }}
          className="mt-8 px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-300"
          onClick={() => (window.location.href = "/exploreRoadmaps")}
        >
          Explorar carreras
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </>
  );
}
