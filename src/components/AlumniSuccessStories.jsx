"use client";

import React from "react";
import { theme } from "@/constants/theme";

const alumniStories = [
  {
    name: "Laura González",
    title: "Ingeniera de Software en Google",
    description:
      "Gracias a la plataforma, pude identificar mi pasión por la inteligencia artificial y prepararme para un puesto en una gran empresa.",
  },
  {
    name: "Carlos Ramírez",
    title: "Especialista en Ciberseguridad en Telefónica",
    description:
      "La guía personalizada me ayudó a enfocar mis estudios en lo que realmente me motivaba. Ahora trabajo en un sector que me encanta.",
  },
  {
    name: "María Fernández",
    title: "Desarrolladora Full Stack en una startup",
    description:
      "El roadmap fue clave para dar mis primeros pasos. Hoy trabajo en una empresa innovadora donde aplico lo aprendido cada día.",
  },
];

const AlumniSuccessStories = () => {
  return (
    <section className="py-16 px-4 mb-20">
      <h2
        className="text-3xl font-bold text-center mb-12"
        style={{ color: theme.palette.primary.hex }}
      >
        Historias de Éxito
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {alumniStories.map((alumni, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-1" style={{ color: theme.palette.text.hex }}>
              {alumni.name}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{alumni.title}</p>
            <p className="text-base leading-relaxed" style={{ color: theme.palette.gray.hex }}>
              {alumni.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AlumniSuccessStories;
