"use client";

import React, { useState, useEffect } from "react";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import { nameRegex, dateRegex } from "@/utils/ValidatorRegex";
import { FaLongArrowAltRight } from "react-icons/fa";

const StudentInitForm = () => {
  const [errors, setErrors] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [degree, setDegree] = useState("INSO_DATA");
  const [gender, setGender] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [submitting, setSubmitting] = useState(false);
  // const [metadataError, setMetadataError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          setError("Error en obteniendo los metadatos");
        }
        const data = await response.json();

        // Comprobar si la metadata está completa
        if (data.metadata && Object.keys(data.metadata).length > 0) {

          // setMetadataError(true);

          router.push(`/profile/${JSON.parse(localStorage.getItem("user")).role == "STUDENT"
            ? "student"
            : "teacher"
            }/${id}`);
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false)
      }
    };

    if (JSON.parse(localStorage.getItem("user")).role == "TEACHER") {
      router.push(`/data_complete/teacher/${id}`);
    } else {
      fetchData();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const today = new Date().toISOString().split("T")[0];

    const newErrors = {
      firstName: !firstName?.trim()
        ? "El nombre es obligatorio."
        : !nameRegex(firstName)
          ? "Solo se permiten caracteres latinos en el nombre."
          : undefined,

      lastName: !lastName.trim()
        ? "El apellido es obligatorio."
        : !nameRegex(lastName)
          ? "Solo se permiten caracteres latinos en el apellido."
          : undefined,

      gender: !gender ? "El género es obligatorio." : undefined,

      endDate: !dateRegex(endDate)
        ? "Formato inválido."
        : endDate < today
          ? "La fecha de graduación no puede ser anterior a hoy."
          : undefined,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== undefined)) {
      return;
    }

    setSubmitting(true);

    const requestBody = {
      firstName,
      lastName,
      gender,
      endDate,
      degree: "INSO_DATA",
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setSubmitting(false);

      if (!response.ok) {
        const errorMessages = {
          NO_VALID_FIELDS_TO_UPDATE: "Algún dato introducido no es válido.",
          INVALID_USER_ID: "El usuario no existe.",
          INTERNAL_SERVER_ERROR:
            "Error interno del servidor. Inténtalo más tarde.",
        };
        setErrors({
          general:
            errorMessages[data?.error] || "Error al actualizar los metadatos.",
        });
        return;
      }

      localStorage.setItem("metadata", JSON.stringify(data.updatedFields));
      router.push(`/roadmap_guide/${id}`);
    } catch (error) {
      setSubmitting(false);
      setErrors({ general: "Ha ocurrido un error inesperado." });
    }
  };

  if (loading) {
    return <LoadingModal />;
  }

  return (
    <div
      className="flex flex-col items-center justify-center mt-20"
    >
      {/* Título */}
      <h1
        className="text-2xl font-bold text-center"
        style={{ color: theme.palette.primary.hex }}
      >
        ¡Queremos saber más de ti!
      </h1>

      {/* Formulario */}
      <div
        className="w-full max-w-4xl bg-white p-12 mt-12 shadow-md flex justify-center"
        style={{ borderRadius: theme.buttonRadios.xl }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-8">

          {/* Información Personal y Académica */}
          <div className="flex flex-col md:flex-row gap-8">

            {/* Información Personal */}
            <div className="flex flex-col flex-1 space-y-4">
              <h2 className="text-lg font-semibold" style={{ color: theme.palette.text.hex }}>
                Información personal
              </h2>

              {/* Nombre */}
              <div>
                <label className="text-sm flex items-center gap-1">
                  Nombre <p className="text-xs mt-1" style={{ color: theme.palette.error.hex }}>*</p>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nombre"
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                  }}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              {/* Apellidos */}
              <div>
                <label className="text-sm flex items-center gap-1">
                  Apellidos <p className="text-xs mt-1" style={{ color: theme.palette.error.hex }}>*</p>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Apellidos"
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                  }}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>

              {/* Género */}
              <div>
                <label className="text-sm flex items-center gap-1">
                  Género <p className="text-xs mt-1" style={{ color: theme.palette.error.hex }}>*</p>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                  }}
                >
                  <option value="" disabled>Género</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                  <option value="prefer not to say">Prefiero no decirlo</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">{errors.gender}</p>
                )}
              </div>
            </div>

            {/* Información Académica */}
            <div className="flex flex-col flex-1 space-y-4">
              <h2 className="text-lg font-semibold" style={{ color: theme.palette.text.hex }}>
                Información académica
              </h2>

              {/* Grado */}
              <div>
                <label className="text-sm flex items-center gap-1">
                  Grado <p className="text-xs mt-1" style={{ color: theme.palette.error.hex }}>*</p>
                </label>
                <select
                  disabled
                  required
                  value={"INSO_DATA"}
                  onChange={() => { }}
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                  }}
                >
                  <option value="" disabled>Grado</option>
                  <option value="INSO+DATA">INSO-DATA</option>
                </select>
              </div>

              {/* Fecha de Graduación */}
              <div>
                <label className="text-sm flex items-center gap-1">
                  Fecha de graduación <p className="text-xs mt-1" style={{ color: theme.palette.error.hex }}>*</p>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min="today"
                  className="block w-full p-2 border rounded-md"
                  style={{
                    borderColor: theme.palette.light.hex,
                    color: theme.palette.text.hex,
                  }}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm">{errors.endDate}</p>
                )}
              </div>
            </div>

          </div>

          {/* Botón de enviar */}
          <div className="flex flex-col items-center mt-6 space-y-4">
            <button
              type="submit"
              className="flex items-center justify-center w-64 px-6 py-3 text-white rounded-md transition duration-200"
              style={{
                backgroundColor: theme.palette.primary.hex,
                borderRadius: theme.buttonRadios.m,
                fontWeight: theme.fontWeight.semibold,
              }}
              disabled={submitting}
            >
              Enviar y comenzar test
            </button>

            {/* Mensajes de error y éxito */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </div>

        </form>
      </div>

    </div>
  );
};

export default StudentInitForm;
