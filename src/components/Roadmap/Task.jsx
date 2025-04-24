"use client";

import React from "react";
import Image from "next/image";
import { theme } from "@/constants/theme";
import Resource from "@/components/Roadmap/Resource";

const Task = ({ taskName, taskData, sectionName, updateProgress }) => {
  const handleMarkAsDone = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/userRoadmap`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        sectionName,
        topicName: taskName,
        newStatus: "done",
      }),
    });
    if (updateProgress) updateProgress();
    window.location.reload();
  };

  return (
    <div className="flex h-80 flex-col items-center">
      {/* Icon card */}
      <div className="w-24 h-24 bg-white mt-4 rounded-2xl flex items-center justify-center">
        <Image
          src={
            taskData.status === "doing"
              ? `/icons/${taskData.skill}.png`
              : `/si.png`
          }
          alt={taskName}
          width={50}
          height={50}
        />
      </div>

      {/* Always visible content */}
      <div className="w-full mt-4">
        <div className="relative bg-white p-6 mt-4 rounded-xl ">
          <h3
            className="text-lg font-semibold text-center mb-2"
            style={{ color: theme.palette.dark.hex }}
          >
            {taskName}
          </h3>

          <p
            className="text-center text-sm mb-4"
            style={{ color: theme.palette.text.hex }}
          >
            {taskData.description}
          </p>

          {/* Recursos */}
          <div className="mt-6 text-center">
            <h4
              className="text-md font-semibold mb-1"
              style={{ color: theme.palette.primary.hex }}
            >
              Cursos recomendados
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              Las asignaturas que cubren estos conocimientos autocompletarán
              esta sección automáticamente.
            </p>
            <div className="space-y-2">
              {taskData.resources?.map((resource, i) => (
                <Resource key={i} resource={resource} />
              ))}
            </div>
          </div>

          {/* Acción */}
          <div className="flex justify-center mt-6">
            {taskData.status === "doing" ? (
              <button
                onClick={handleMarkAsDone}
                className="px-6 py-2 text-white text-center font-bold rounded-full shadow-md transition-colors duration-300"
                style={{
                  backgroundColor: theme.palette.primary.hex,
                  fontFamily: "Montserrat",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = theme.palette.secondary.hex)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = theme.palette.primary.hex)
                }
              >
                Completar sección
              </button>
            ) : (
              <div
                className="px-6 py-2 text-white text-center font-bold rounded-full shadow-md"
                style={{
                  backgroundColor: "#26a269",
                  fontFamily: "Montserrat",
                }}
              >
                Sección completada
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
