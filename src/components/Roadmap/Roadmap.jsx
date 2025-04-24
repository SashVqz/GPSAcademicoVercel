"use client";

import React, { useEffect, useState } from "react";
import { theme } from "@/constants/theme";
import ProgressBar from "@/components/student_profile/ProgressBar";
import Section from "@/components/Roadmap/Section";
import SectionPopup from "@/components/Roadmap/SectionPopUp";
import { FaInfoCircle, FaTrophy } from "react-icons/fa";
import MotivationalMessage from "@/components/Roadmap/MotivationalMessage";

const Roadmap = ({ roadmap, metadata, progress, setProgress }) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (selectedSection) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedSection]);

  const openSectionPopup = (sectionName, sectionData) => {
    setSelectedSection({ sectionName, sectionData });
  };

  const closeSectionPopup = () => {
    setSelectedSection(null);
  };

  return (
    <div className="flex items-center justify-center p-8 fade pb-20">
      <div className="w-full" style={{ borderRadius: theme.buttonRadios.xxl }}>
        {/* Título con icono de información */}
        <div className="relative mb-6 text-center flex items-center justify-center gap-2">
          <h1
            className="text-3xl font-bold"
            style={{
              color: theme.palette.primary.hex,
              fontFamily: "Montserrat",
            }}
          >
            {roadmap.name}
          </h1>

          <button
            onClick={() => setShowInfo(!showInfo)}
            title="Información sobre el progreso"
            className="text-blue-600 hover:text-blue-800 transition"
          >
            <FaInfoCircle size={18} />
          </button>

          {showInfo && (
            <div
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 shadow-md rounded-md px-4 py-3 text-sm text-gray-800 z-50 w-full max-w-md"
              style={{ fontFamily: "Montserrat" }}
            >
              <p>
                El progreso mostrado también se actualiza automáticamente en
                función de las asignaturas que hayas superado.
              </p>
              <p>
                Si ya has aprobado contenidos relacionados, se convalidarán
                checkpoints del roadmap correspondientes.
              </p>
            </div>
          )}
        </div>

        {/* Bubble con progreso */}
        <div className="flex justify-center mb-2">
          <div
            className="flex items-center gap-3 px-6 py-2 rounded-full shadow-md text-white font-semibold"
            style={{ backgroundColor: theme.palette.primary.hex }}
          >
            <FaTrophy size={18} />
            Progreso: {Math.round(progress)}%
          </div>
        </div>

        {/* Mensaje motivacional */}
        <MotivationalMessage progress={progress} />

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-10">
          <ProgressBar progress={progress} />
        </div>

        {/* Camino visual de secciones con conectores simplificados */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 px-6">
          {roadmap.body &&
            Object.entries(roadmap.body).map(([sectionName, sectionData]) => {
              const isDone = Object.values(sectionData)
                .slice(1)
                .every((task) => task?.status === "done");

              return (
                <div
                  key={sectionName}
                  className={`relative flex flex-col items-center p-4 rounded-xl border shadow-sm transition duration-300 ease-in-out ${
                    isDone ? "bg-green-50 border-green-400" : "bg-white border-gray-200"
                  }`}
                >
                  {isDone && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                      Completado
                    </span>
                  )}

                  <Section
                    sectionName={sectionName}
                    sectionData={sectionData}
                    onClick={() => openSectionPopup(sectionName, sectionData)}
                  />

                  <p className="mt-3 text-center text-sm font-medium text-gray-700 leading-snug">
                    {sectionName}
                  </p>
                </div>
              );
            })}
        </div>
      </div>

      {selectedSection && (
        <SectionPopup
          sectionName={selectedSection.sectionName}
          sectionData={selectedSection.sectionData}
          onClose={closeSectionPopup}
          updateProgress={() => {
            const newProgress = calculateProgress(roadmap);
            setProgress(newProgress);
          }}
        />
      )}
    </div>
  );
};

function calculateProgress(_roadmap) {
  if (!_roadmap || !_roadmap.body) return 0;

  let totalTasks = 0;
  let completedTasks = 0;

  Object.entries(_roadmap.body).forEach(([_, sectionData]) => {
    const tasks = Object.entries(sectionData).slice(1);
    tasks.forEach(([_, taskData]) => {
      if (taskData?.status) {
        totalTasks++;
        if (taskData.status === "done") completedTasks++;
      }
    });
  });

  return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
}

export default Roadmap;