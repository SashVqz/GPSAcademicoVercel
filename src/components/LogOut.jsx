"use client";

import { useState } from "react";
import { theme } from "@/constants/theme";
import { BiLogOut } from "react-icons/bi";
import { MdCancel } from "react-icons/md";

const LogOut = ({ onClose }) => {
  const [error, setError] = useState("");

  const handleLogOut = async () => {
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        setError("Error al cerrar sesión");
        return;
      }

      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      setError("Error inesperado");
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };


  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <div
        style={{
          padding: "24px",
          backgroundColor: theme.palette.background.hex,
          borderRadius: "12px",
          borderLeft: `4px solid ${theme.palette.primary.hex}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <p
          className="text-center"
          style={{ fontSize: theme.fontSizes.s, color: theme.palette.text.hex, textTransform: "uppercase", fontWeight: theme.fontWeight.semibold }}>
          Confirmar acción
        </p>

        {error && (
          <p style={{ color: theme.palette.error.hex, marginTop: "8px", fontSize: theme.fontSizes.m }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={handleLogOut}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: theme.palette.error.hex,
              color: theme.palette.background.hex,
              fontWeight: theme.fontWeight.bold,
              borderRadius: theme.buttonRadios.m,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              border: "none",
              fontSize: theme.fontSizes.m,
              cursor: "pointer",
            }}
          >
            <BiLogOut /> Cerrar sesión
          </button>

          <button
            onClick={handleCancel}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: theme.palette.lightGray.hex,
              color: theme.palette.text.hex,
              fontWeight: theme.fontWeight.bold,
              borderRadius: theme.buttonRadios.m,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              border: "none",
              fontSize: theme.fontSizes.m,
              cursor: "pointer",
            }}
          >
            <MdCancel /> Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogOut;
