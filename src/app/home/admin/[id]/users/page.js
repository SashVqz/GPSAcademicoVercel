"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import { FaEdit, FaTrash } from "react-icons/fa";

const UserList = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontró el token de autenticación");
        }
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al obtener la lista de usuarios");
        }
  
        const data = await response.json();
  
        const enriched = data.map(user => ({
          ...user,
          hasDeletionRequest: user.metadata?.deletionRequestStatus === "pending",
        }));
  
        setUsers(enriched);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);
  

  const handleDelete = async (userId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar el usuario");
      }

      setUsers(users.filter(user => user.id !== userId));
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleEditUser = (userId) => {
    router.push(`/home/admin/${id}/users/edit/${userId}`);
  };

  const filteredUsers = users.filter(user => {
    if (!user || !user.email) return false;

    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.metadata?.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.metadata?.lastName || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <LoadingModal message="Cargando usuarios..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="container mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: theme.palette.primary.hex }}>
            Gestión de Usuarios
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/home/admin/${id}`)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: theme.palette.primary.hex,
                color: theme.palette.background.hex,
                borderRadius: "0.375rem",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.palette.dark.hex}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.palette.primary.hex}
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: `${theme.palette.error.hex}20`,
            border: `1px solid ${theme.palette.error.hex}`,
            color: theme.palette.error.hex,
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem"
          }}
        >
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden border" style={{ borderColor: theme.palette.light.hex }}>
        <div
          className="p-4 border-b flex flex-col md:flex-row gap-4 items-center"
          style={{
            backgroundColor: theme.palette.neutral.hex,
            borderBottomColor: theme.palette.light.hex
          }}
        >
          <div className="flex-grow w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="w-full px-4 py-2 border rounded-md transition-all duration-300 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderColor: theme.palette.light.hex,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            />
          </div>
          <div className="relative w-full md:w-64">
            <select
              className="appearance-none w-full px-4 py-2 pr-8 border rounded-md focus:outline-none cursor-pointer"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                borderColor: theme.palette.light.hex,
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <option value="all">Todos los roles</option>
              <option value="STUDENT">Estudiantes</option>
              <option value="TEACHER">Profesores</option>
              <option value="ADMIN">Administradores</option>
            </select>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                color: theme.palette.primary.hex
              }}
            >
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: theme.palette.lightGray.hex }}>
            <thead className="bg-gray-50">
              <tr>
                {['Email', 'Nombre', 'Rol', 'Especialización', 'Solicitud de eliminación', 'Acciones'].map(header => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.palette.darkGray.hex }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: theme.palette.background.hex }}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} style={{ transition: 'background-color 0.3s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.palette.neutral.hex} onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.palette.background.hex}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.palette.text.hex }}>{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.palette.text.hex }}>{user.metadata?.firstName} {user.metadata?.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.palette.text.hex }}>
                      {user.role === "ADMIN" ? "Admin" : user.role === "TEACHER" ? "Profesor" : "Estudiante"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.palette.text.hex }}>{user.metadata?.specialization || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.palette.text.hex }}>
                      {user.metadata?.deletionRequestStatus === 'pending' ? (
                        <span style={{ color: theme.palette.error.hex }}>Solicitud de eliminación pendiente</span>
                      ) : user.metadata?.deletionRequestStatus === 'cancelled' ? (
                        <span style={{ color: theme.palette.gray.hex }}>Solicitud cancelada</span>
                      ) : (
                        <span style={{ color: theme.palette.gray.hex }}>No se ha solicitado eliminación</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
  {user.role !== "ADMIN" && (
    <button
      onClick={() => handleEditUser(user.id)}
      title="Editar usuario"
      style={{
        color: theme.palette.primary.hex,
        borderRadius: "6px",
        padding: "6px",
        transition: "background-color 0.3s ease, color 0.3s ease"
      }}
      onMouseOver={e => e.currentTarget.style.backgroundColor = `${theme.palette.primary.hex}20`}
      onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
    >
      <FaEdit className="text-lg" />
    </button>
  )}

  {user.role !== "ADMIN" && (
    <button
      onClick={() => handleDelete(user.id)}
      title="Eliminar usuario"
      style={{
        color: theme.palette.error.hex,
        borderRadius: "6px",
        padding: "6px",
        transition: "background-color 0.3s ease, color 0.3s ease"
      }}
      onMouseOver={e => e.currentTarget.style.backgroundColor = `${theme.palette.error.hex}20`}
      onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
    >
      <FaTrash className="text-lg" />
    </button>
  )}
</div>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm" style={{ color: theme.palette.gray.hex }}>
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
};

export default UserList;