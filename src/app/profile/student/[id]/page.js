"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import SidebarNavigation from "@/components/student_profile/SidebarNavigation";
import PersonalInfo from "@/components/student_profile/PersonalInfo";
import Languages from "@/components/student_profile/Languages";
import ProgrammingLanguages from "@/components/student_profile/ProgrammingLanguages";
import Certifications from "@/components/student_profile/Certifications";
import WorkExperience from "@/components/student_profile/WorkExperience";
import ExpedienteAcademico from "@/components/student_profile/ExpedienteAcademico";
import ShowTutor from "@/components/student_profile/ShowTutor";
import ActivityLog from "@/components/student_profile/ActivityLog";

import { convertTimestampToDate } from "@/utils/FirebaseDateUtils";

const StudentProfile = () => {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");

  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] = useState(() => {
    const section = searchParams.get("section");
    return section || "personal";
  });

  const [languages, setLanguages] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [degree, setDegree] = useState("");
  const [yearsCompleted, setYearsCompleted] = useState("");
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [gender, setGender] = useState("");
  const [academicRecord, setAcademicRecord] = useState([]);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [updateHistory, setUpdateHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error obteniendo los metadatos");
        }

        const data = await response.json();

        if (!data.metadata) {
          router.push(`/data_complete/student/${id}`);
          return;
        }

        setFirstName(data.metadata.firstName || "");
        setLastName(data.metadata.lastName || "");
        setDegree(data.metadata.degree || "");
        setYearsCompleted(data.metadata.yearsCompleted || "");
        setLanguages(data.metadata.languages || []);
        setSpecialization(data.metadata.specialization || "");
        setSkills(data.metadata.programming_languages || []);
        setCertifications(data.metadata.certifications || []);
        setWorkExperience(data.metadata.workExperience || []);
        setGender(data.metadata.gender || "");
        setDeletionRequested(data.metadata?.deletionRequestStatus === "pending");
        setUpdateHistory(data.updateHistory || []); 

        setEndDate(convertTimestampToDate(data.metadata.endDate));
        setBirthDate(convertTimestampToDate(data.metadata.birthDate));

        if (data.metadata.AH?.subjects) setAcademicRecord(data.metadata.AH.subjects);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAcademicRecord = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/AH`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Error obteniendo expediente académico.");
        const data = await response.json();
        if (data.subjects) setAcademicRecord(data.subjects);
      } catch (error) {
        setError(error.message);
      }
    };

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      router.push("/login");
      return;
    }

    if (user.role !== "STUDENT" || user.id !== id) {
      router.push(`/unauthorized`);
      return;
    }

    fetchData();
    fetchAcademicRecord();
  }, []);


  const handleUpdateMetadata = async (updates) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorMessages = {
          NO_VALID_FIELDS_TO_UPDATE: "No hay cambios válidos.",
          INVALID_USER_ID: "Usuario no encontrado.",
          INTERNAL_SERVER_ERROR: "Error en el servidor.",
        };
        const data = await response.json();
        setError(errorMessages[data?.error] || "Error actualizando los metadatos.");
        return false;
      }

      const data = await response.json();
      
      if (data.updatedFields) {
        Object.entries(data.updatedFields).forEach(([key, value]) => {
          if (key.startsWith("metadata.")) {
            const fieldName = key.replace("metadata.", "");
            
            switch (fieldName) {
              case "languages":
                setLanguages(value || []);
                break;
              case "programming_languages":
                setSkills(value || []);
                break;
              case "certifications":
                setCertifications(value || []);
                break;
              case "workExperience":
                setWorkExperience(value || []);
                break;
              case "firstName":
                setFirstName(value || "");
                break;
              case "lastName":
                setLastName(value || "");
                break;
              case "gender":
                setGender(value || "");
                break;
              case "specialization":
                setSpecialization(value || "");
                break;
              case "birthDate":
                setBirthDate(convertTimestampToDate(value));
                break;
              case "endDate":
                setEndDate(convertTimestampToDate(value));
                break;
            }
          }
        });
      }

      if (data.updateHistory) setUpdateHistory(data.updateHistory);
      return true;
    } catch (error) {
      setError("Error inesperado al actualizar los datos.");
      return false;
    }
  };

  const handleDeleteLanguage = async (languageObj) => {
    const languageList = languageObj.languages.map(lang => ({
      _id: lang._id,
      language: lang.language,
      level: lang.level
    }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          languages: languageList
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.errors?.[0] || "Error eliminando el idioma.");
      }

      const data = await response.json();
      
      // Actualiza el estado de languages con los datos que retorna el servidor
      if (data.deletedFields && data.deletedFields.includes("metadata.languages")) {
        setLanguages([]); // Si se eliminaron todos los idiomas
      } else if (data.updatedFields && data.updatedFields["metadata.languages"]) {
        setLanguages(data.updatedFields["metadata.languages"]);
      }
      
      if (data.updateHistory) setUpdateHistory(data.updateHistory);
      return true;
    } catch (error) {
      console.error("Error al eliminar idioma:", error.message);
      return false;
    }
  };

  const handleDeleteSkill = async (skillObj) => {
    const skillList = skillObj.skills.map(sk => ({
      _id: sk._id,
      name: sk.name,
      level: sk.level
    }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          programming_languages: skillList
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.errors?.[0] || "Error eliminando skill.");
      }

      const data = await response.json();
      
      if (data.deletedFields && data.deletedFields.includes("metadata.programming_languages")) {
        setSkills([]); // Si se eliminaron todos los skills
      } else if (data.updatedFields && data.updatedFields["metadata.programming_languages"]) {
        setSkills(data.updatedFields["metadata.programming_languages"]);
      }
      
      if (data.updateHistory) setUpdateHistory(data.updateHistory);
      return true;
    } catch (error) {
      console.log("Error al eliminar skill:", error.message);
      return false;
    }
  };

  const handleDeleteCertifications = async (certObj) => {
    const certificationList = certObj.certifications.map(cert => ({
      _id: cert._id, 
      name: cert.name,
      date: cert.date,
      institution: cert.institution
    }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          certifications: certificationList,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.errors?.[0] || "Error eliminando certificaciones.");
      }

      const data = await response.json();
      
      // Actualiza el estado de certificaciones con los datos que retorna el servidor
      if (data.deletedFields && data.deletedFields.includes("metadata.certifications")) {
        setCertifications([]); // Si se eliminaron todas las certificaciones
      } else if (data.updatedFields && data.updatedFields["metadata.certifications"]) {
        setCertifications(data.updatedFields["metadata.certifications"]);
      }
      
      // Actualiza el historial de cambios
      if (data.updateHistory) {
        setUpdateHistory(data.updateHistory);
      }
      
      return true;
    } catch (error) {
      console.log("Error al eliminar certificaciones:", error.message);
      return false;
    }
  };

  const handleDeleteWorkExperience = async (workExpObj) => {
    const workExpList = workExpObj.workExperience.map(work => ({
      _id: work._id, // Incluye el _id para identificación precisa
      jobType: work.jobType,
      startDate: work.startDate,
      endDate: work.endDate,
      company: work.company,
      description: work.description,
      responsibilities: work.responsibilities
    }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          workExperience: workExpList,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.errors?.[0] || "Error eliminando experiencia laboral.");
      }

      const data = await response.json();
      
      // Actualiza el estado de workExperience con los datos que retorna el servidor
      if (data.deletedFields && data.deletedFields.includes("metadata.workExperience")) {
        setWorkExperience([]); // Si se eliminaron todas las experiencias
      } else if (data.updatedFields && data.updatedFields["metadata.workExperience"]) {
        setWorkExperience(data.updatedFields["metadata.workExperience"]);
      }
      
      // Actualiza el historial de cambios
      if (data.updateHistory) {
        setUpdateHistory(data.updateHistory);
      }
      
      return true;
    } catch (error) {
      console.log("Error al eliminar experiencia laboral:", error.message);
      return false;
    }
  };

  const handleSaveGrades = async (updatedGrades) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/AH`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ grades: updatedGrades }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error actualizando expediente académico.");
      }

      // Actualiza el expediente académico después de guardar
      await fetchAcademicRecord();
      
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const fetchAcademicRecord = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/AH`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error obteniendo expediente académico.");
      }

      const data = await response.json();
      if (data.subjects) {
        setAcademicRecord(data.subjects);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Función específica para actualizar los datos personales
  const handleSavePersonalInfo = (updatedData) => {
    return handleUpdateMetadata(updatedData);
  };

  const handleRequestDeletion = async (reason) => {
    if (deletionRequested) return { success: false, message: "Ya existe una solicitud pendiente" }; // Protección en estado local

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

  // Mensaje de bienvenida según el género
  const getWelcomeMessage = () => {
    if (gender === "male") return "Bienvenido";
    if (gender === "female") return "Bienvenida";
    return "Bienvenid@";
  };

  return (
    <>
      {loading ? (
        <LoadingModal /> // Se muestra mientras se cargan los datos
      ) : (
        <div className="flex flex-col items-center min-h-screen p-6">
          <h1
            className="text-3xl font-bold text-center pt-10 pb-10"
            style={{ color: theme.palette.primary.hex, fontFamily: "Montserrat" }}
          >
            {getWelcomeMessage()} {firstName || "Usuario"}
          </h1>

          <div className="bg-white rounded-lg w-full min-w-full md:min-w-screen">

            {/* Diseño responsive */}
            <div className="w-full max-w-8xl flex flex-col md:flex-row">
              <div className="w-full md:w-64 overflow-x-auto md:overflow-visible">
                <SidebarNavigation
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                />
              </div>

              {/* Secciones con actualización a la BD */}
              <div className="flex-1 p-6">
                {activeSection === "personal" && (
                  <PersonalInfo
                    firstName={firstName}
                    lastName={lastName}
                    degree={degree}
                    yearsCompleted={yearsCompleted}
                    endDate={endDate}
                    birthDate={birthDate}
                    gender={gender}
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    setBirthDate={setBirthDate}
                    setGender={setGender}
                    setEndDate={setEndDate}
                    onSave={handleSavePersonalInfo}
                    deletionRequested={deletionRequested}
                    handleRequestDeletion={handleRequestDeletion}
                    handleCancelDeletion={handleCancelDeletion}
                  />

                )}
                {activeSection === "languages" && (
                  <Languages
                    languages={languages}
                    setLanguages={setLanguages}
                    onSave={handleSavePersonalInfo}
                    onDelete={handleDeleteLanguage}
                  />
                )}
                {activeSection === "programming" && (
                  <ProgrammingLanguages
                    skills={skills}
                    setSkills={setSkills}
                    onSave={handleSavePersonalInfo}
                    onDelete={handleDeleteSkill}
                  />
                )}
                {activeSection === "certifications" &&
                  <Certifications
                    certifications={certifications}
                    setCertifications={setCertifications}
                    onSave={handleSavePersonalInfo}
                    onDelete={handleDeleteCertifications}
                  />
                }
                {activeSection === "employee" &&
                  <WorkExperience
                    workExperience={workExperience}
                    setWorkExperience={setWorkExperience}
                    onSave={handleSavePersonalInfo}
                    onDelete={handleDeleteWorkExperience}
                  />
                }
                {activeSection === "AH" && (
                  <ExpedienteAcademico
                    academicRecord={academicRecord}
                    onSave={handleSaveGrades}
                    yearsCompleted={yearsCompleted}
                    degree={degree}
                  />
                )}

                {activeSection === "showTutor" && (
                  <ShowTutor
                  />
                )}

                {activeSection === "activityLog" && (
                  <ActivityLog
                    updateHistory={updateHistory}
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

export default StudentProfile;