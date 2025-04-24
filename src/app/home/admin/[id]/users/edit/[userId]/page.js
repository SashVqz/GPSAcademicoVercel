"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});

const UserDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; 
  const userId = params?.userId; 
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("user");
  
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  
  const tabs = [
    { id: "user", label: "Información de Usuario" },
    { id: "metadata", label: "Metadatos de Usuario" },
    { id: "log", label: "Log de Cambios" }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
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
          throw new Error(errorData.error || "Error al obtener los datos de usuarios");
        }

        const allUsers = await response.json();
        const foundUser = allUsers.find(u => u.id === userId);
        
        if (!foundUser) {
          throw new Error("Usuario no encontrado");
        }
        
        setUser(foundUser);
        setEmail(foundUser.email || "");
        setRole(foundUser.role || "");
        setFirstName(foundUser.metadata?.firstName || "");
        setLastName(foundUser.metadata?.lastName || "");
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró el token de autenticación");
      
      const updateData = {};
      
      if (email && email !== user.email) updateData.email = email;
      if (role && role !== user.role) updateData.role = role;
      
      const metadataUpdate = {};
      if (firstName !== undefined && firstName !== user.metadata?.firstName) metadataUpdate.firstName = firstName;
      if (lastName !== undefined && lastName !== user.metadata?.lastName) metadataUpdate.lastName = lastName;
      if (Object.keys(metadataUpdate).length > 0) updateData.metadata = metadataUpdate;
      if (changePassword && password) updateData.password = password;
      
      if (Object.keys(updateData).length === 0) {
        setSuccess("No se han realizado cambios");
        setSaving(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error || "Error al actualizar el usuario");
      

      setSuccess("Usuario actualizado correctamente");
      
      if (responseData.updatedUser) {
        setUser({...user, ...responseData.updatedUser});
      } else {
        const updatedUser = {...user};
        if (updateData.email) updatedUser.email = updateData.email;
        if (updateData.role) updatedUser.role = updateData.role;
        
        if (updateData.metadata) updatedUser.metadata = {...(updatedUser.metadata || {}), ...updateData.metadata};
        
        setUser(updatedUser);  
        if (updateData.email) setEmail(updateData.email);
        if (updateData.role) setRole(updateData.role);
      }
      
      setPassword("");
      setChangePassword(false);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/home/admin/${id}/users`);
  };

  const renderMetadata = () => {
    if (!user?.metadata) return <p>No hay información de metadatos disponible.</p>;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(user.metadata).map(([key, value]) => {
          if (key === 'updateHistory') return null;
          
          return (
            <div key={key} className="border rounded-md p-4 bg-gray-50">
              <h3 className="font-semibold text-blue-600 mb-2 capitalize">{key}</h3>
              <div className="text-sm">
                {renderMetadataValue(value)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMetadataValue = (value) => {
    if (value === null || value === undefined) return "No disponible";
    
    if (typeof value === "object" && !Array.isArray(value)) {
      return (
        <div className="pl-4 border-l-2 border-gray-200">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="mb-2">
              <span className="font-medium capitalize">{subKey}: </span>
              <span>{renderMetadataValue(subValue)}</span>
            </div>
          ))}
        </div>
      );
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return "No hay elementos";
      
      return (
        <ul className="list-disc pl-5">
          {value.map((item, index) => (
            <li key={index} className="mb-1">
              {typeof item === "object" 
                ? Object.entries(item).map(([k, v]) => 
                    <div key={k} className="pl-2">
                      <span className="font-medium capitalize">{k}: </span>
                      <span>{v?.toString() || "No disponible"}</span>
                    </div>
                  )
                : item?.toString() || "No disponible"}
            </li>
          ))}
        </ul>
      );
    }
    
    return value.toString();
  };

  const renderActivityLog = () => {
    const updateHistory = user?.updateHistory || [];
    
    if (updateHistory.length === 0) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p className="text-yellow-700">No hay historial de actividad disponible para este usuario.</p>
          <p className="text-sm text-yellow-600 mt-2">
            El historial de actividad se registra cuando se realizan cambios en el perfil del usuario.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {updateHistory.map((entry, index) => {
          if (!entry || !entry.timestamp || !Array.isArray(entry.changes)) {
            return (
              <div key={index} className="bg-red-50 border border-red-200 p-4 rounded">
                <p className="text-red-600">Entrada de registro inválida</p>
              </div>
            );
          }
          
          return (
            <div 
              key={index} 
              className="bg-white border rounded-lg shadow-sm overflow-hidden"
            >
              <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {`#${updateHistory.length - index}`}
                </span>
              </div>
              <div className="p-4">
                {entry.changes.map((change, changeIndex) => {
                  if (!change || !change.field) {
                    return (
                      <div key={changeIndex} className="mb-4 pb-4 border-b last:border-b-0">
                        <p className="text-red-600">Cambio inválido</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div 
                      key={changeIndex} 
                      className="mb-4 pb-4 border-b last:border-b-0"
                    >
                      <div className="font-semibold text-blue-600 mb-2 capitalize">
                        {change.field}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-red-600 mb-1">Valor anterior:</div>
                          <pre className="bg-red-50 p-2 rounded text-xs overflow-auto max-h-40">
                            {change.oldValue !== undefined && change.oldValue !== null
                              ? typeof change.oldValue === 'object' 
                                ? JSON.stringify(change.oldValue, null, 2)
                                : change.oldValue.toString()
                              : 'No disponible'}
                          </pre>
                        </div>
                        <div>
                          <div className="text-xs text-green-600 mb-1">Nuevo valor:</div>
                          <pre className="bg-green-50 p-2 rounded text-xs overflow-auto max-h-40">
                            {change.newValue !== undefined && change.newValue !== null
                              ? typeof change.newValue === 'object'
                                ? JSON.stringify(change.newValue, null, 2)
                                : change.newValue.toString()
                              : 'No disponible'}
                          </pre>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">
            Usuario: {user?.email || 'Cargando...'}
          </h1>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver
          </button>
        </div>  
      </div>
      
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {loading ? (
        <LoadingModal message="Cargando datos del usuario..." />
      ) : !user ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Usuario no encontrado.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          {activeTab === "user" && (
            <>
              <div 
                className="p-4 border-b border-gray-200"
                style={{ 
                  backgroundColor: theme.palette.neutral.hex, 
                  borderBottomColor: theme.palette.light.hex 
                }}
              >
                <h2 className="text-lg font-semibold text-gray-700">Información del usuario</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md transition-all duration-300 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ 
                        borderColor: theme.palette.light.hex,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                      disabled={user.role === "ADMIN"} 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol
                    </label>
                    <div className="relative">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="appearance-none w-full px-4 py-2 pr-8 border rounded-md 
                        transition-all duration-300 focus:outline-none focus:ring-2 
                        focus:ring-blue-500 focus:border-transparent cursor-pointer"
                        style={{
                          borderColor: theme.palette.light.hex,
                          backgroundColor: 'white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                        disabled={user.role === "ADMIN"}
                      >
                        <option value="STUDENT">Estudiante</option>
                        <option value="TEACHER">Profesor</option>
                        <option value="ADMIN">Administrador</option>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md transition-all duration-300 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ 
                        borderColor: theme.palette.light.hex,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md transition-all duration-300 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ 
                        borderColor: theme.palette.light.hex,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="changePassword"
                        checked={changePassword}
                        onChange={(e) => setChangePassword(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="changePassword" className="text-sm font-medium text-gray-700">
                        Cambiar contraseña
                      </label>
                    </div>
                    
                    {changePassword && (
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nueva contraseña"
                        className="w-full px-4 py-2 border rounded-md transition-all duration-300 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{ 
                          borderColor: theme.palette.light.hex,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                      />
                    )}
                    {changePassword && (
                      <p className="text-xs text-gray-500 mt-1">
                        La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 carácter especial
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    disabled={saving}
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === "metadata" && (
            <div className="p-6">
              {renderMetadata()}
            </div>
          )}

          {activeTab === "log" && (
            <div className="p-6">
              {renderActivityLog()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDetail;