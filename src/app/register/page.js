"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import ErrorPopUp from "@/components/ErrorPopUp";
import { emailRegex, passwordRegex } from "@/utils/ValidatorRegex";
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seedWord, setSeedWord] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [tokenError, setTokenError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedToken = localStorage.getItem("token");
      if (storedToken) {
        setTokenError(true);
      }
    }
  }, []);

  const validateForm = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!email.trim() || !password.trim() || !seedWord.trim()) {
      setError("Todos los campos deben estar completados.");
      return;
    }
  
    if (
      !emailRegex.test(email) ||
      (!email.endsWith("live.u-tad.com") && !email.endsWith("u-tad.com"))
    ) {
      setError("El correo debe terminar en live.u-tad.com o u-tad.com");
      return;
    }
  
    if (!passwordRegex.test(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 carácter especial.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, seedWord }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        const errorMessages = {
          USER_ALREADY_EXISTS: "Ya existe un usuario registrado con ese correo",
          INVALID_EMAIL: "El correo debe terminar en live.u-tad.com o u-tad.com",
          INTERNAL_SERVER_ERROR: "Servidor en mantenimiento",
        };
  
        setSuccess(false);
        setError(errorMessages[data?.error] || "Error en el registro");
        setIsLoading(false);
        return;
      }
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setSuccess(true);
      
      const userRole =
        data.user.role || JSON.parse(localStorage.getItem("user"))?.role;
  
      if (userRole === "STUDENT") {
        router.push(`/data_complete/student/${data.user.id}`);
      } else if (userRole === "TEACHER") {
        router.push(`/data_complete/teacher/${data.user.id}`);
      }
    } catch (error) {
      console.error("Error en la conexión con el backend:", error);
      setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
      setIsLoading(false);
    }
  };
  

  if (tokenError) {
    return <ErrorPopUp message={"No tienes acceso a esta página"} path="" />;
  }


  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-1 md:mt-20"
      style={{ overflow: "hidden" }}
    >
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <LoadingModal />
        </div>
      )}

      <div
        className="w-full max-w-md p-8 bg-white shadow-lg"
        style={{ borderRadius: theme.buttonRadios.l }}
      >
        <h2
          className="text-2xl font-bold text-center pb-6"
          style={{
            color: theme.palette.primary.hex,
            fontFamily: "Montserrat",
          }}
        >
          Regístrate
        </h2>

        <form className="space-y-5" onSubmit={validateForm}>
          {/* Email */}
          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full p-3 border"
              placeholder="tuemail@live.u-tad.com"
              style={{
                borderColor: theme.palette.light.hex,
                color: theme.palette.text.hex,
                fontFamily: "Montserrat, sans-serif",
                borderRadius: theme.buttonRadios.m,
              }}
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-3">
            {/* Input + botón en un contenedor relativo */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full p-3 border pr-10"
                placeholder="Contraseña"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  fontFamily: "Montserrat, sans-serif",
                  borderRadius: theme.buttonRadios.m,
                }}
              />
              {password.trim() !== "" && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: theme.palette.gray.hex }}
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              )}
            </div>

            {/* Validaciones dinámicas */}
            <ul
              className="space-y-1 text-xs font-medium"
              style={{ color: theme.palette.darkGray.hex }}
            >
              <li className="flex items-center gap-2">
                {hasMinLength ? (
                  <FaCheckCircle style={{ color: theme.palette.success.hex }} />
                ) : (
                  <FaTimesCircle style={{ color: theme.palette.error.hex }} />
                )}
                Al menos 8 caracteres
              </li>
              <li className="flex items-center gap-2">
                {hasUppercase ? (
                  <FaCheckCircle style={{ color: theme.palette.success.hex }} />
                ) : (
                  <FaTimesCircle style={{ color: theme.palette.error.hex }} />
                )}
                Al menos 1 mayúscula
              </li>
              <li className="flex items-center gap-2">
                {hasSpecialChar ? (
                  <FaCheckCircle style={{ color: theme.palette.success.hex }} />
                ) : (
                  <FaTimesCircle style={{ color: theme.palette.error.hex }} />
                )}
                Al menos 1 carácter especial (!@#$%^&*)
              </li>
            </ul>
          </div>


          {/* Palabra clave */}
          <div>
            <input
              type="text"
              id="seed"
              value={seedWord}
              onChange={(e) => setSeedWord(e.target.value)}
              className="block w-full p-3 border "
              placeholder="Palabra clave"
              style={{
                borderColor: theme.palette.light.hex,
                color: theme.palette.text.hex,
                fontFamily: "Montserrat, sans-serif",
                borderRadius: theme.buttonRadios.m,
              }}
            />
            <p
              className="text-xs mt-2"
              style={{ color: theme.palette.darkGray.hex }}
            >
              Una palabra personal que se usará para verificar tu identidad en caso de recuperación de cuenta.
            </p>
          </div>

          {/* Errores / éxito */}
          {error && (
            <p
              className="text-sm text-center"
              style={{ color: theme.palette.error.hex }}
            >
              {error}
            </p>
          )}

          {success && (
            <p
              className="text-sm text-center"
              style={{ color: theme.palette.success.hex }}
            >
              Registro exitoso.
            </p>
          )}


          <button
            type="submit"
            className="w-full px-4 py-2 text-white rounded-md transition duration-200"
            disabled={isLoading}
            style={{
              backgroundColor: theme.palette.primary.hex,
              borderRadius: theme.buttonRadios.m,
              fontWeight: theme.fontWeight.bold,
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? "Procesando..." : "Regístrate"}
          </button>
        </form>

        <p
          className="text-sm text-center mt-6"
          style={{ color: theme.palette.text.hex }}
        >
          ¿Ya tienes una cuenta?{" "}
          <a
            href="/login"
            style={{ color: theme.palette.dark.hex }}
            className="hover:underline"
          >
            Acceder
          </a>
        </p>
      </div>
    </div>

  );
};

export default RegisterForm;