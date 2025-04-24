"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import ErrorPopUp from "@/components/ErrorPopUp";
import { FaUsers, FaMap, FaGraduationCap } from "react-icons/fa";

const AdminActionCard = ({ icon, title, description, onClick }) => {
  // Mapeamos el icono con `react-icons` según el nombre
  const Icon = {
    users: FaUsers,
    map: FaMap,
    "graduation-cap": FaGraduationCap,
  }[icon];

  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center p-8 transition-all bg-white border rounded-lg cursor-pointer hover:shadow-lg hover:bg-gray-50"
      style={{ borderColor: theme.palette.light.hex }}
    >
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full" style={{ backgroundColor: theme.palette.primary.hex }}>
        <Icon className="text-2xl text-white" />
      </div>
      <h3 className="mb-12 text-lg font-semibold" style={{ color: theme.palette.dark.hex }}>
        {title}
      </h3>
      <p className="text-sm text-center text-gray-600">{description}</p>
    </div>
  );
};


const AdminProfile = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
          return <ErrorPopUp message="Debes iniciar sesión para ver esta página." path="/login" />;
        }
        
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.role !== "ADMIN") {
          return <ErrorPopUp message="No tienes acceso a esta página." path={`/home/${user.role.toLowerCase()}/${id}`} />;
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Error al obtener datos del usuario");
        }
        
        const userData = await response.json();
        setEmail(userData.user.email || "");
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) {
    return <LoadingModal message="Cargando perfil..." />;
  }

  if (error) {
    return <ErrorPopUp message={error} path={`/login`} />;
  }

  const adminActions = [
    {
      icon: "users",
      title: "Usuarios",
      description: "Administrar los usuarios de la plataforma, editar roles y permisos",
      path: `/home/admin/${id}/users`
    },
    {
      icon: "map", 
      title: "Roadmaps",
      description: "Crear y visualizar las rutas de aprendizaje personalizadas de los estudiantes",
      path: `/home/admin/${id}/roadmaps`
    },
    {
      icon: "graduation-cap",
      title: "Titulaciones",
      description: "Configurar grados, asignaturas y planes académicos",
      path: `/home/admin/${id}/degrees`
    }
  ];

  return (
    <div
      style={{ 
        backgroundImage: "url('/assets/fondo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="flex items-center justify-center p-5">
        <h1 className="text-4xl font-bold text-blue-800 mt-5">
          Perfil de Administrador
        </h1>
      </div>

      <div className="container px-4 py-6 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="p-4 bg-white border rounded-lg shadow-sm md:col-span-1" style={{ borderLeft: `4px solid ${theme.palette.primary.hex}` }}>
            <h2 
              className="pb-4 mb-4 text-xl font-semibold border-b"
              style={{ color: theme.palette.dark.hex, borderColor: theme.palette.light.hex }}
            >
              Información de Cuenta
            </h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 font-medium">{email}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Rol</p>
                <p className="mt-1 font-medium">Administrador</p>
              </div>
              
              <div className="pt-4 mt-4 border-t" style={{ borderColor: theme.palette.light.hex }}>
                <p className="mb-2 text-sm font-medium text-gray-500">Estado</p>
                <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                  Activo
                </span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <h2 
              className="mb-6 text-2xl font-semibold"
              style={{ color: theme.palette.dark.hex, fontFamily: "Montserrat" }}
            >
              Acciones de Administración
            </h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-3">
              {adminActions.map((action, index) => (
                <AdminActionCard
                  key={index}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  onClick={() => router.push(action.path)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;