"use client";

import React, { useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { theme } from "@/constants/theme";
import Task from "@/components/Roadmap/Task";

const SectionPopup = ({
  sectionName,
  sectionData,
  updateProgress,
  onClose,
}) => {
  const popupRef = useRef(null);

  const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{
        fontFamily: "Montserrat, sans-serif",
      }}
      onClick={handleClickOutside}
    >
      <div
        ref={popupRef}
        className="bg-white p-8 rounded-lg shadow-xl max-h-fit relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition duration-200"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: theme.palette.primary.hex,
          }}
        >
          <FaTimes />
        </button>

        <h2
          className="text-2xl font-semibold mb-8 mt-4 text-center"
          style={{ color: theme.palette.dark.hex }}
        >
          {sectionName}
        </h2>

        <div className="flex justify-center overflow-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch">
            {Object.entries(sectionData)
              .slice(1)
              .map(([taskName, taskData]) => (
                <div
                  key={taskName}
                  className="bg-white rounded-xl p-4 w-full max-w-xs"
                >
                  <Task
                    taskName={taskName}
                    taskData={taskData}
                    sectionName={sectionName}
                    updateProgress={updateProgress}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionPopup;
