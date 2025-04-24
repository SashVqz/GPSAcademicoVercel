"use client";

import React, { useState, useEffect } from "react";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import { nameRegex } from "@/utils/ValidatorRegex";
import { teacherSpecializations } from "@/constants/teacherSpecializations";

const TeacherInitForm = () => {
  const [errors, setErrors] = useState({});
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user")).role === "STUDENT") {
      router.push(`/data_complete/student/${params.id}`);
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }

        const data = await response.json();
        const metadata = data.metadata || {}; // Asegurar que metadata no sea undefined

        // Si metadata está vacío, mostrar el formulario en lugar de redirigir
        if (Object.keys(metadata).length === 0) {
          setLoading(false);
          return;
        } else {
          setRedirecting(true);
          router.push(`/profile/teacher/${params.id}`);
        }

        // Asignar valores a los estados
        setFirstName(metadata.firstName || "");
        setLastName(metadata.lastName || "");
        setGender(metadata.gender || "");
        setSpecialization(metadata.specialization || "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [params.id, router]);

  const validateField = (field, value) => {
    let error = "";
    if (!value.trim()) {
      error = `El campo ${field} es obligatorio.`;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error || undefined,
    }));
  };

  const handleChange = (field, value, setter) => {
    setter(value);
    validateField(field, value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

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
    };

    if (specialization.trim()) {
      requestBody.specialization = specialization;
    }

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
          USER_NOT_FOUND: "El usuario no existe.",
          NO_VALID_FIELDS_TO_UPDATE: "No hay cambios válidos en los campos.",
          INTERNAL_SERVER_ERROR:
            "Error interno del servidor. Inténtalo más tarde.",
        };
        setErrors({
          general:
            errorMessages[data?.error] || "Error al actualizar los metadatos.",
        });
        return;
      } else {
        setLoading(true);

        const oldMetadata = JSON.parse(localStorage.getItem("metadata")) || {};
        const updatedMetadata = { ...oldMetadata, ...data.updatedFields };
        localStorage.setItem("metadata", JSON.stringify(updatedMetadata));


        router.push(`/profile/teacher/${params.id}`);

      }
    } catch (error) {
      setSubmitting(false);
      setErrors({ general: "Ha ocurrido un error inesperado." });
    }
  };

  if (loading || redirecting) {
    return <LoadingModal />;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-20">
        <h1
          className="text-xl font-bold text-center"
          style={{ color: theme.palette.primary.hex, fontFamily: "Montserrat" }}
        >
          ¡Queremos saber más de ti!
        </h1>
        <div className="w-full max-w-4xl m-10 p-6 bg-white rounded-lg shadow-xl">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 grid grid-cols-2 gap-4"
          >
            {/* Información personal */}
            <div className="m-4 space-y-3">
              <h2
                className="text-lg font-semibold mb-1"
                style={{ color: theme.palette.text.hex }}
              >
                Información personal
              </h2>
              <input
                type="text"
                value={firstName || ""}
                onChange={(e) =>
                  handleChange("Nombre", e.target.value, setFirstName)
                }
                placeholder="Nombre"
                className="block w-full p-2 border border-gray-300 rounded-md"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                }}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}

              <input
                type="text"
                value={lastName}
                onChange={(e) =>
                  handleChange("Apellido", e.target.value, setLastName)
                }
                placeholder="Apellido"
                className="block w-full p-2 border border-gray-300 rounded-md"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                }}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>

            {/* Género y Especialización */}
            <div className="m-4 space-y-3">
              <h2
                className="text-lg font-semibold mb-1"
                style={{ color: theme.palette.text.hex }}
              >
                Género
              </h2>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                }}
              >
                <option value="">Selecciona tu género</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="prefer not to say">Prefiero no decirlo</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender}</p>
              )}

              <h2
                className="text-lg font-semibold mb-1"
                style={{ color: theme.palette.text.hex }}
              >
                Especialización
              </h2>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="block w-full p-2 border rounded-md"
                style={{
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                }}
              >
                <option value="">Selecciona tu especialización</option>
                {teacherSpecializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="col-span-2 bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={submitting}
            >
              {submitting ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default TeacherInitForm;
