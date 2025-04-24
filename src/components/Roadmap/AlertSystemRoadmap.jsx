"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/constants/theme";
import { MdUpdate } from "react-icons/md";

export const AlertSystemRoadmap = ({ alerts }) => {
    const router = useRouter();
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;

    if (!alerts || alerts.length === 0) return null;

    const alert = alerts[0];

    const alertConfig = {
        empty: {
            title: "Expediente vacío",
            message: "Aún no has cargado tu expediente académico. Para comenzar, debes completarlo.",
            icon: <MdUpdate size={36} color="#fff" />,
            iconBg: theme.palette.primary.hex,
            typeColor: theme.palette.text.hex,
            action: {
                label: "Ir al perfil",
                path: `/profile/student/${user?.id}?section=AH`,
            },
        },
        incomplete: {
            title: "Expediente incompleto",
            message: "Debes aprobar al menos el 80% de asignaturas de 1º y 2º curso (máximo 2 suspensas por año).",
            icon: <MdUpdate size={36} color="#fff" />,
            iconBg: theme.palette.warning.hex,
            typeColor: theme.palette.text.hex,
            action: {
                label: "Ir al perfil",
                path: `/profile/student/${user?.id}?section=AH`,
            },
        },
    };

    const current = alertConfig[alert.keyword];
    if (!current) return null;

    return (
        <div className="flex flex-col justify-center items-center p-6 bg-transparent">
            <h1
                className="text-3xl font-bold text-center pt-10 pb-10"
                style={{ color: theme.palette.primary.hex, fontFamily: "Montserrat" }}
            >
                Antes de continuar
            </h1>

            <div
                className="w-full max-w-3xl rounded-xl py-10 px-8 shadow-md"
                style={{
                    backgroundColor: `${current.iconBg}20`,
                    borderLeft: `6px solid ${current.iconBg}`,
                }}
            >
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="flex items-center gap-4">
                        <div
                            className="rounded-full w-14 h-14 flex items-center justify-center"
                            style={{ backgroundColor: current.iconBg }}
                        >
                            {current.icon}
                        </div>
                        <h2
                            className="text-2xl font-semibold"
                            style={{ color: current.typeColor, fontFamily: "Montserrat" }}
                        >
                            {current.title}
                        </h2>
                    </div>

                    <p
                        className="text-lg leading-relaxed"
                        style={{ color: current.typeColor, fontFamily: "Montserrat" }}
                    >
                        {current.message}
                    </p>

                    {current.action && (
                        <button
                            onClick={() => router.push(current.action.path)}
                            className="px-6 py-2 text-white font-semibold rounded-full transition text-base"
                            style={{ backgroundColor: theme.palette.primary.hex }}
                        >
                            {current.action.label}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
