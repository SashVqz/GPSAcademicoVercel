"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import ErrorPopUp from "@/components/ErrorPopUp";
import { useEffect } from "react";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [seedWord, setSeedWord] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedToken = localStorage.getItem("token");
      if (storedToken) {
        setTokenError(true);
      }
    }
  }, []);

  if (tokenError) {
    return <ErrorPopUp message={"No tienes acceso a esta página"} path="" />;
  }

  const validateForm = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !emailRegex.test(email) ||
      (!email.endsWith("live.u-tad.com") && !email.endsWith("u-tad.com"))
    ) {
      setError("El correo debe terminar en live.u-tad.com o u-tad.com");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 carácter especial."
      );
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/updatePassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email, newPassword, seedWord }),
      });

      if (!response.ok) {
        const errorMessages = {
          USER_NOT_FOUND: "Usuario no encontrado",
          INVALID_SEED_WORD: "La palabra clave introducida no es la correcta",
          INTERNAL_SERVER_ERROR: "Servidor en mantenimiento",
        };

        setError(errorMessages[data?.error] || "Error en el registro");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess(true);
      console.log(data);
      router.push("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          fontFamily: "Montserrat",
        }}
      >
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
            Restablecer contraseña
          </h2>
          <form className="space-y-6" onSubmit={validateForm}>
            <div>
              <input
                type="text"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full mt-1 p-3 border border-gray-300"
                placeholder="tuemail@live.u-tad.com"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  fontFamily: "Montserrat, sans-serif",
                  borderRadius: theme.buttonRadios.m,
                }}
              />
            </div>
            <div>
              <input
                type="password"
                id="newPassword"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full mt-1 p-3 border border-gray-300"
                placeholder="Nueva contraseña"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  fontFamily: "Montserrat, sans-serif",
                  borderRadius: theme.buttonRadios.m,
                }}
              />
            </div>
            <div>
              <input
                type="text"
                id="seed"
                required
                value={seedWord}
                onChange={(e) => setSeedWord(e.target.value)}
                className="block w-full mt-1 p-3 border border-gray-300 rounded-md"
                placeholder="Palabra clave"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                  fontFamily: "Montserrat, sans-serif",
                  borderRadius: theme.buttonRadios.m,
                }}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-500 text-sm text-center">
                La contraseña ha sido restablecida
              </p>
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
                (e.currentTarget.style.backgroundColor =
                  theme.palette.primary.hex)
              }
            >
              Restablecer
            </button>
          </form>
          <p
            className="text-sm text-center mt-8"
            style={{ color: theme.palette.text.hex }}
          >
            ¿No tienes una cuenta?{" "}
            <a
              href="/register"
              style={{
                color: theme.palette.dark.hex,
              }}
              className="hover:underline"
            >
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Reset;
