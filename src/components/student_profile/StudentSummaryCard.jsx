"use client";

import React from "react";
import { theme } from "@/constants/theme";
import DeleteRoadmapButton from "./DeleteRoadmapButton";

const StudentSummaryCard = ({
  firstName,
  lastName,
  degree,
  yearsCompleted = [],
  endDate,
  roadmap,
  academicRecord = [],
  skills = [],
}) => {
  const latestYear =
    Array.isArray(yearsCompleted) && yearsCompleted.length > 0
      ? parseInt(yearsCompleted[yearsCompleted.length - 1], 10)
      : 0;

  const courseProgress = (latestYear / 4) * 100;

  const topSubjects = academicRecord
    .filter((s) => s.grade && !isNaN(s.grade))
    .sort((a, b) => b.grade - a.grade)
    .slice(0, 3);

  const combinedSkills = skills
    .filter((s) => s.level === "high" || s.level === "medium")
    .slice(0, 3);

  const goToRoadmap = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      window.location.href = `/home/student/${user.id}`;
    } else {
      console.error("ID de usuario no encontrado en localStorage.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.hex,
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1
          style={{
            fontSize: theme.fontSizes.xxxl,
            fontWeight: theme.fontWeight.bold,
            color: theme.palette.text.hex,
          }}
        >
          {firstName} {lastName}
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: theme.fontSizes.m,
            color: theme.palette.text.hex,
          }}
        >
          <span>
            {latestYear > 0 ? `${latestYear}º` : "SIN CALCULAR"} {degree}
          </span>
          <div
            style={{
              width: "112px",
              height: "8px",
              backgroundColor: theme.palette.lightGray.hex,
              borderRadius: "9999px",
            }}
          >
            <div
              style={{
                width: `${courseProgress}%`,
                height: "8px",
                backgroundColor: theme.palette.primary.hex,
                borderRadius: "9999px",
              }}
            />
          </div>
          <span style={{ color: theme.palette.gray.hex }}>
            Graduación prevista: {new Date(endDate).toLocaleDateString("es-ES")}
          </span>
        </div>
      </div>

      {/* Fortalezas */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {/* Lenguajes */}
        <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
          <h3
            style={{
              fontSize: theme.fontSizes.l,
              fontWeight: theme.fontWeight.semibold,
              marginBottom: "0.75rem",
              color: theme.palette.text.hex,
            }}
          >
            Fortalezas en programación
          </h3>
          {combinedSkills.length > 0 ? (
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {combinedSkills.map((skill, idx) => {
                const isHigh = skill.level === "high";
                const translatedLevel = isHigh
                  ? "Alto"
                  : skill.level === "medium"
                    ? "Medio"
                    : skill.level;

                return (
                  <li
                    key={idx}
                    style={{
                      backgroundColor: isHigh
                        ? theme.palette.success.hex + "20"
                        : theme.palette.warning.hex + "20",
                      color: isHigh
                        ? theme.palette.success.hex
                        : theme.palette.warning.hex,
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{skill.name}</span>
                    <span style={{ fontWeight: theme.fontWeight.semibold }}>
                      {translatedLevel}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p style={{ color: theme.palette.gray.hex }}>No disponible</p>
          )}
        </div>

        {/* Asignaturas */}
        <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
          <h3
            style={{
              fontSize: theme.fontSizes.l,
              fontWeight: theme.fontWeight.semibold,
              marginBottom: "0.75rem",
              color: theme.palette.text.hex,
            }}
          >
            Mejores asignaturas
          </h3>
          {topSubjects.length > 0 ? (
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {topSubjects.map((subject, idx) => (
                <li
                  key={idx}
                  style={{
                    backgroundColor: theme.palette.primary.hex + "20",
                    color: theme.palette.primary.hex,
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{subject.name}</span>
                  <span style={{ fontWeight: theme.fontWeight.semibold }}>
                    {subject.grade}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: theme.palette.gray.hex }}>No disponible</p>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: "1rem",
          backgroundColor: theme.palette.neutral.hex,
          borderRadius: "0.5rem",
          padding: "1.25rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <p style={{ color: theme.palette.text.hex, fontSize: theme.fontSizes.l, margin: 0 }}>
          Roadmap elegido:{" "}
          <strong style={{ color: theme.palette.primary.hex }}>
            {roadmap?.name || "No disponible"}
          </strong>
        </p>

        <div style={{ display: "flex", gap: "0.75rem" }}>

          <button
            onClick={goToRoadmap}
            className="transition-all hover:opacity-90"
            style={{
              backgroundColor: theme.palette.primary.hex,
              color: theme.palette.background.hex,
              padding: "0.5rem 1.25rem",
              borderRadius: theme.buttonRadios.m,
              fontSize: theme.fontSizes.m,
              border: "none",
              cursor: "pointer",
            }}
          >
            Ver el Roadmap
          </button>

          <DeleteRoadmapButton />
          
        </div>
      </div>
    </div>
  );
};

export default StudentSummaryCard;
