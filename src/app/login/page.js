"use client";

import React, { useState, useEffect } from "react";
import { theme } from "@/constants/theme";
import { useRouter } from "next/navigation";
import "@fontsource/montserrat";
import ErrorPopUp from "@/components/ErrorPopUp";
import { emailRegex, passwordRegex } from "@/utils/ValidatorRegex";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tokenError, setTokenError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedToken = localStorage.getItem("token");
      if (storedToken) {
        setTokenError(true);
      }
    }
  }, []);

  if (tokenError) {
    return <ErrorPopUp message={"No tienes acceso a esta página"} />;
  }

  const validateForm = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    // Validar que todos los campos estén completados
    if (!email.trim() || !password.trim()) {
      setError("Todos los campos deben estar completados.");
      setIsLoading(false);
      return;
    }
  
    if (
      !emailRegex.test(email) ||
      (!email.endsWith("live.u-tad.com") && !email.endsWith("u-tad.com"))
    ) {
      setError("El correo debe terminar en live.u-tad.com o u-tad.com");
      setIsLoading(false);
      return;
    }
  
    if (!passwordRegex.test(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 carácter especial.");
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        const errorMessages = {
          INVALID_CREDENTIALS: "Usuario no encontrado",
          INTERNAL_SERVER_ERROR: "Servidor en mantenimiento",
        };
  
        setError(errorMessages[data?.error] || "Error al acceder");
        return;
      }
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      if (data.user.role === "STUDENT") {
        router.push(`/profile/student/${data.user.id}`);
      } else if (data.user.role === "TEACHER") {
        router.push(`/profile/teacher/${data.user.id}`);
      } else if (data.user.role === "ADMIN") {
        router.push(`/home/admin/${data.user.id}`);
      }
    } catch (error) {
      setError("Ha ocurrido un error inesperado");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-1 mt-20"
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
          className="text-2xl font-bold text-center pb-8"
          style={{
            color: theme.palette.primary.hex,
            fontFamily: "Montserrat",
          }}
        >
          Iniciar sesión
        </h2>

        <form className="space-y-6" onSubmit={validateForm}>
          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full mt-1 p-3 border"
              placeholder="tuemail@live.u-tad.com"
              style={{
                borderColor: theme.palette.light.hex,
                color: theme.palette.text.hex,
                borderRadius: theme.buttonRadios.m,
              }}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full mt-1 p-3 border pr-10"
              placeholder="Contraseña"
              style={{
                color: theme.palette.text.hex,
                borderColor: theme.palette.light.hex,
                borderRadius: theme.buttonRadios.m,
              }}
            />
            {password.trim() !== "" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white rounded-md transition duration-200"
            style={{
              backgroundColor: theme.palette.primary.hex,
              borderRadius: theme.buttonRadios.m,
              fontWeight: theme.fontWeight.bold,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = theme.palette.dark.hex)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = theme.palette.primary.hex)
            }
          >
            Iniciar sesión
          </button>
        </form>

        <p
          className="text-sm text-center mt-8"
          style={{ color: theme.palette.dark.hex }}
        >
          ¿Olvidaste tu contraseña?{" "}
          <a
            href="/reset-password"
            style={{ color: theme.palette.complementary.hex }}
            className="hover:underline"
          >
            Recupérala
          </a>
        </p>

        <p
          className="text-sm text-center mt-8"
          style={{ color: theme.palette.text.hex }}
        >
          ¿No tienes una cuenta?{" "}
          <a
            href="/register"
            style={{ color: theme.palette.dark.hex }}
            className="hover:underline"
          >
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );


};

export default LoginForm;
