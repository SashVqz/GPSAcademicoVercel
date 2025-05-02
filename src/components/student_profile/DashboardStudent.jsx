"use client";

import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
    LabelList,
} from "recharts";
import { theme } from "@/constants/theme";
import { getRoadmapByName } from "../exploreRoadmaps/roadmapsData";

const DashboardStudent = ({
    firstName,
    lastName,
    degree,
    yearsCompleted,
    endDate,
    roadmap,
    academicRecord = [],
    skills = [],
    onGoToRoadmap,
}) => {
    const topSubjects = academicRecord
        .filter((subj) => subj.grade && !isNaN(subj.grade))
        .sort((a, b) => b.grade - a.grade)
        .slice(0, 5);

    const highLevelSkills = skills.filter((s) => s.level === "high");
    const midLevelSkills = skills.filter((s) => s.level === "medium");
    const combinedSkills = [...highLevelSkills, ...midLevelSkills].slice(0, 5);

    const latestYear =
        Array.isArray(yearsCompleted) && yearsCompleted.length > 0
            ? parseInt(yearsCompleted[yearsCompleted.length - 1], 10)
            : 0;
    const courseProgress = (latestYear / 4) * 100;

    const roadmapData = getRoadmapByName(roadmap?.name);
    const recommendedLanguages = roadmapData?.languages || [];
    console.log(recommendedLanguages);
    const keySubjects = roadmapData?.keySubjects?.map((s) => s.name) || [];
    console.log(keySubjects);
    const completedKeySubjectsCount = 2;

    const skillMap = skills.reduce((map, skill) => {
        map[skill.name.toLowerCase()] = skill.level;
        return map;
    }, {});

    const levelMap = {
        high: { value: 100, label: "Alto", color: theme.palette.success.hex },
        medium: { value: 60, label: "Medio", color: theme.palette.warning.hex },
        none: { value: 0, label: "Sin iniciar", color: theme.palette.lightGray.hex },
    };

    const languageComparisonData = recommendedLanguages.map((lang) => {
        const normalized = lang.toLowerCase();
        const level = skillMap[normalized] || "none";
        const { value, label, color } = levelMap[level] || levelMap.none;

        return {
            name: lang,
            nivel: value,
            label,
            fill: color,
        };
    });

    return (
        <div className="space-y-4 p-4 bg-white rounded-lg">
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

                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", fontSize: theme.fontSizes.m, color: theme.palette.text.hex }}>
                    <span>
                        {latestYear > 0 ? `${latestYear}º` : "SIN CALCULAR"} {degree}
                    </span>
                    <div style={{ width: "112px", height: "8px", backgroundColor: theme.palette.lightGray.hex, borderRadius: "9999px" }}>
                        <div
                            style={{
                                height: "8px",
                                width: `${courseProgress}%`,
                                backgroundColor: theme.palette.primary.hex,
                                borderRadius: "9999px",
                            }}
                        />
                    </div>
                    <span style={{ color: theme.palette.gray.hex }}>
                        Graduación prevista: {endDate}
                    </span>
                </div>
            </div>

            {/* Fortalezas */}
            <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr 1fr", marginTop: "2rem" }}>
                {/* Fortalezas en programación */}
                <div>
                    <h2
                        style={{
                            fontSize: theme.fontSizes.xl,
                            fontWeight: theme.fontWeight.semibold,
                            marginBottom: "0.75rem",
                            color: theme.palette.text.hex,
                        }}
                    >
                        Fortalezas en programación
                    </h2>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {combinedSkills.map((skill, idx) => (
                            <li
                                key={idx}
                                style={{
                                    backgroundColor: theme.palette.success.hex + "20",
                                    color: theme.palette.success.hex,
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.5rem",
                                    fontWeight: theme.fontWeight.regular,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span>{skill.name}</span>
                                <span style={{ fontWeight: theme.fontWeight.semibold, textTransform: "capitalize" }}>{skill.level}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Mejores asignaturas */}
                <div>
                    <h2
                        style={{
                            fontSize: theme.fontSizes.xl,
                            fontWeight: theme.fontWeight.semibold,
                            marginBottom: "0.75rem",
                            color: theme.palette.text.hex,
                        }}
                    >
                        Mejores asignaturas
                    </h2>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {topSubjects.map((subject, idx) => (
                            <li
                                key={idx}
                                style={{
                                    backgroundColor: theme.palette.primary.hex + "20",
                                    color: theme.palette.primary.hex,
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.5rem",
                                    fontWeight: theme.fontWeight.regular,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span>{subject.name}</span>
                                <span style={{ fontWeight: theme.fontWeight.semibold }}>{subject.grade}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* CTA */}
            <div
                style={{
                    marginTop: "2rem",
                    backgroundColor: theme.palette.background.hex,
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                    padding: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                    alignItems: "center",
                }}
            >
                <p style={{ color: theme.palette.text.hex, fontSize: theme.fontSizes.l }}>
                    Roadmap elegido:{" "}
                    <strong style={{ color: theme.palette.primary.hex }}>{roadmap?.name}</strong>
                </p>
                <button
                    onClick={() => {
                        const user = JSON.parse(localStorage.getItem("user"));
                        if (user?.id) {
                            window.location.href = `http://localhost:3001/home/student/${user.id}`;
                        } else {
                            console.error("ID de usuario no encontrado en localStorage.");
                        }
                    }}
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
            </div>
        </div>
    );
};

export default DashboardStudent;
