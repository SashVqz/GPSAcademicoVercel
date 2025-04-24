"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import ErrorPopUp from "@/components/ErrorPopUp";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import SidebarNavigation from "@/components/teacher_profile/SidebarNavigationTeacher";
import Pupils from "@components/teacher_profile/Pupils";
import PersonalInfo from "@/components/teacher_profile/PersonalInfo";

const TeacherProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params?.id;

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [studentsError, setStudentsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("personal");
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const init = () => {
      if (typeof window === "undefined") return;

      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        router.push("/login");
        return;
      }
      setToken(storedToken);

      let storedUser = null;
      try {
        storedUser = JSON.parse(localStorage.getItem("user"));
      } catch {
        router.push("/login");
        return;
      }

      if (!storedUser?.id || !storedUser?.role) {
        router.push("/login");
        return;
      }

      if (storedUser.id !== id) {
        const targetRole = storedUser.role.toLowerCase();
        router.push(`/${targetRole}/profile/${storedUser.id}`);
        return;
      }

      setAuthChecking(false); // Validación completa
    };

    init();
  }, [id]);

  const fetchData = async () => {
    if (!token || !id) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener metadatos del profesor");
      }
      const data = await response.json();
      if (!data.metadata) {
        router.push(`/data_complete/teacher/${id}`);
        return;
      }
      const metadata = data.metadata || {};

      setShowModal(Object.keys(metadata).length === 0);

      setFirstName(metadata.firstName);
      setLastName(metadata.lastName);
      setGender(metadata.gender);
      setSpecialization(metadata.specialization);
      setDeletionRequested(data.metadata?.deletionRequestStatus === "pending");

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (!token || !id) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/teacher/getAllStudents`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener la lista de estudiantes");
      }

      const data = await response.json();

      setStudents(data.message === "No students found" ? [] : data);
    } catch (error) {
      setStudentsError(error.message);
    }
  };

  useEffect(() => {
    if (authChecking) return;
    fetchData();
    fetchStudents();
  }, [token, id]);


  const handleRequestDeletion = async (reason) => {
    if (deletionRequested) return; // Protección en estado local

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/deletionRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data?.message || "No se pudo procesar la solicitud." };
      }

      setDeletionRequested(true);

      return {
        success: true,
        requestId: data.requestId,
        status: data.status,
        requestDate: data.requestDate,
      };
    } catch (error) {
      return { success: false, message: "Error de red o inesperado al solicitar la baja." };
    }
  };


  const handleCancelDeletion = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/deletionRequest`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data?.message || "No se pudo cancelar la solicitud.",
        };
      }

      setDeletionRequested(false);

      return {
        success: true,
        cancelledAt: data.cancelledAt,
        count: data.count,
      };
    } catch (error) {
      return { success: false, message: "Error de red o inesperado al cancelar la solicitud." };
    }
  };

  const getWelcomeMessage = () => {
    if (gender === "male") return "Bienvenido";
    if (gender === "female") return "Bienvenida";
    return "Bienvenid@";
  };

  return (
    <>
      {isLoading && <LoadingModal message="Cargando perfil..." />}

      {!isLoading && showModal && (
        <ErrorPopUp
          message={"Debes completar tus datos básicos"}
          path={`/data_complete/teacher/${id}`}
        />
      )}

      {!isLoading && !showModal && (
        <div className="flex flex-col items-center min-h-screen p-6">
          <h1
            className="text-3xl font-bold text-center pt-20 pb-10"
            style={{
              color: theme.palette.primary.hex,
              fontFamily: "Montserrat",
            }}
          >
            {getWelcomeMessage()} {firstName || "Usuario"}
          </h1>

          <div className="bg-white w-full min-w-full md:win-w-screen rounded-lg">
            <div className="w-full max-w-8xl flex flex-col md:flex-row">
              <div className="w-full md:w-64 overflow-x-auto md:overflow-visible">
                <SidebarNavigation
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                />
              </div>

              <div className="flex-1 p-6">
                {activeSection === "personal" && (
                  <PersonalInfo
                    firstName={firstName}
                    lastName={lastName}
                    gender={gender}
                    specialization={specialization}
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    setGender={setGender}
                    setSpecialization={setSpecialization}
                    deletionRequested={deletionRequested}
                    setDeletionRequested={setDeletionRequested}
                    handleRequestDeletion={handleRequestDeletion}
                    handleCancelDeletion={handleCancelDeletion}
                  />

                )}

                {activeSection === "pupils" && (
                  <Pupils
                    students={students}
                    setStudents={setStudents}
                    token={token}
                    setToken={setToken}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherProfile;
