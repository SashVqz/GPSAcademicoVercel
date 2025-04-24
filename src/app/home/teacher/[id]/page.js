"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/constants/theme";
import "@fontsource/montserrat";
import dynamic from "next/dynamic";
const LoadingModal = dynamic(() => import("@/components/LoadingModal"), {
  ssr: false,
});
import ErrorPopUp from "@/components/ErrorPopUp";
import NotificationCard from "@/components/notifications/NotificationCard";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import { exportToPDF } from "@/components/notifications/exportSummary";

const TeacherHomePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState({
    total: 0,
    unreadCount: 0,
    hasMore: false,
    nextCursor: null
  });
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        setError("No se encontró un token de autenticación");
        setLoading(false);
      }
    }
  }, []);
  
  useEffect(() => {
    if (!token) return;
    
    const fetchTeacherData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error("Error al obtener los datos del profesor");
        
        const data = await response.json();
        setTeacher(data.metadata);
      } catch (err) {
        console.error("Error fetching teacher data:", err);
        setError("Error al cargar los datos del profesor");
      }
    };
    
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/student/teacher/getAllStudents`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error("Error al obtener la lista de estudiantes");
        
        const data = await response.json();
        if (Array.isArray(data)) {
          setStudents(data);
        } else if (data.message === "No students found") {
          setStudents([]);
        } else {
          throw new Error("Formato de respuesta inesperado");
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Error al cargar la lista de estudiantes");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeacherData();
    fetchStudents();
  }, [token]);
  
  useEffect(() => {
    if (!token) return;
    fetchNotifications();
  }, [token, activeTab, selectedStudent]);

  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab === "unread") params.append("onlyUnread", "true");
      
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/teacher/notification`;
      
      if (selectedStudent) {
        params.append("studentId", selectedStudent.id);
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/student/teacher/notification/byStudent`;
      }
      
      if (params.toString()) url = `${url}?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener notificaciones");
      }
      
      const data = await response.json();
      
      setNotifications(data.notifications || []);
      setPagination({
        total: data.pagination?.total || 0,
        unreadCount: data.pagination?.unreadCount || 0,
        hasMore: data.pagination?.hasMore || false,
        nextCursor: data.pagination?.nextCursor || null
      });
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Error al cargar las notificaciones");
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    
    if (!notification.read) await updateNotificationStatus(notification.id, true);
    if (notification.senderRole === "STUDENT" && notification.senderId) fetchStudentSummary(notification.senderId);
  };
  
  const updateNotificationStatus = async (notificationId, read) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/student/teacher/notification`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notificationId, read })
      });
      
      if (!response.ok) {
        throw new Error("Error al actualizar la notificación");
      }
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read } : n
        )
      );
      
      setPagination(prev => ({
        ...prev,
        unreadCount: read 
          ? Math.max(0, prev.unreadCount - 1)
          : prev.unreadCount + 1
      }));
      
    } catch (err) {
      console.error("Error updating notification status:", err);
      setError("Error al actualizar el estado de la notificación");
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/student/teacher/notification/read-all`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Error al marcar todas las notificaciones como leídas");
      }
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      setPagination(prev => ({
        ...prev,
        unreadCount: 0
      }));
      
      setSuccessMessage("Todas las notificaciones han sido marcadas como leídas");
      setTimeout(() => setSuccessMessage(""), 3000);
      
    } catch (err) {
      console.error("Error marking all as read:", err);
      setError("Error al marcar todas las notificaciones como leídas");
    }
  };
  
  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/student/teacher/notification/${notificationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Error al eliminar la notificación");
      }
      
      // Remove notification from the local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Update total count in pagination
      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        unreadCount: selectedNotification?.read 
          ? prev.unreadCount 
          : Math.max(0, prev.unreadCount - 1)
      }));
      
      // If the deleted notification was selected, clear selection
      if (selectedNotification?.id === notificationId) {
        setSelectedNotification(null);
        setSummary(null);
      }
      
      setSuccessMessage("Notificación eliminada correctamente");
      setTimeout(() => setSuccessMessage(""), 3000);
      
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("Error al eliminar la notificación");
    }
  };
  
  const fetchStudentSummary = async (studentId) => {
    setSummaryLoading(true);
    setSummary(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/summary/${studentId}/latest`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.status === 404) {
        setSummary(null);
        return;
      }
      
      if (!response.ok) {
        throw new Error("Error al obtener el informe del estudiante");
      }
      
      const data = await response.json();
      setSummary(data.summary);
      
    } catch (err) {
      console.error("Error fetching student summary:", err);
    } finally {
      setSummaryLoading(false);
    }
  };
  
  const handleDownloadSummary = () => {
    if (!summary) return;
    
    try {
      const pdfExporter = exportToPDF(summary);
      pdfExporter.download();
    } catch (err) {
      console.error("Error downloading summary:", err);
      setError("Error al descargar el informe");
    }
  };

  const handleMarkAsRead = (notification) => {
    updateNotificationStatus(notification.id, true);
  };
  
  const handleMarkAsUnread = (notification) => {
    updateNotificationStatus(notification.id, false);
  };
  
  if (loading) return <LoadingModal message="Cargando panel de profesor..." />;
  if (error) return <ErrorPopUp message={error} path="/login" />;
  
  return (
    <div 
      style={{ 
        backgroundImage: "url('/assets/fondo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh"
      }}
    >
      {successMessage && (
        <div className="container mx-auto mt-4 px-4">
          <div 
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-sm flex items-center justify-between"
            role="alert"
          >
            <div className="flex items-center">
              <i className="bi bi-check-circle-fill mr-2"></i>
              <span>{successMessage}</span>
            </div>
            <button 
              onClick={() => setSuccessMessage("")}
              className="text-green-700 hover:text-green-900"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="container mx-auto mt-4 px-4">
          <div 
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm flex items-center justify-between"
            role="alert"
          >
            <div className="flex items-center">
              <i className="bi bi-exclamation-triangle-fill mr-2"></i>
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError("")}
              className="text-red-700 hover:text-red-900"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      )}
      
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <NotificationFilters 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              students={students}
              selectedStudent={selectedStudent}
              onStudentSelect={setSelectedStudent}
              unreadCount={pagination.unreadCount}
              totalCount={pagination.total}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {activeTab === "unread" ? "Notificaciones no leídas" : "Todas las notificaciones"}
                  {selectedStudent && ` de ${selectedStudent.firstName} ${selectedStudent.lastName}`}
                </h3>
              </div>
              
              {notificationsLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" style={{ color: theme.palette.primary.hex }}></div>
                  <p className="mt-4 text-gray-600">Cargando notificaciones...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <i className="bi bi-inbox text-4xl mb-4 block"></i>
                  <p>No hay notificaciones {activeTab === "unread" ? "sin leer" : ""}{selectedStudent ? ` de ${selectedStudent.firstName}` : ""}.</p>
                </div>
              ) : (
                <ul role="list" className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <li key={notification.id}>
                      <NotificationCard
                        notification={notification}
                        isSelected={selectedNotification?.id === notification.id}
                        onSelect={handleNotificationClick}
                        onMarkAsRead={handleMarkAsRead}
                        onMarkAsUnread={handleMarkAsUnread}
                        onDelete={handleDeleteNotification}
                        studentInfo={notification.senderRole === 'STUDENT' ? students.find(s => s.id === notification.senderId) : null}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {selectedNotification && (
              <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b flex justify-between items-center">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Detalle de notificación
                  </h3>
                  {summary && (
                    <button
                      onClick={handleDownloadSummary}
                      className="text-sm px-3 py-1 rounded flex items-center"
                      style={{ 
                        backgroundColor: `${theme.palette.primary.hex}20`,
                        color: theme.palette.primary.hex
                      }}
                    >
                      <i className="bi bi-download mr-2"></i>
                      Descargar informe
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-1" style={{ color: theme.palette.primary.hex }}>
                      {selectedNotification.title || "Sin título"}
                    </h2>
                    
                    <div className="flex flex-wrap text-sm text-gray-600 gap-x-4 gap-y-2">
                      {selectedNotification.senderRole === "STUDENT" && (
                        <span className="flex items-center">
                          <i className="bi bi-person-fill mr-1"></i>
                          {students.find(s => s.id === selectedNotification.senderId)?.firstName || "Estudiante"} {students.find(s => s.id === selectedNotification.senderId)?.lastName || ""}
                        </span>
                      )}
                      
                      <span className="flex items-center">
                        <i className="bi bi-calendar-event mr-1"></i>
                        {new Date(selectedNotification.timestamp || selectedNotification.createdAt).toLocaleString()}
                      </span>
                      
                      <span className={`flex items-center ${selectedNotification.read ? 'text-gray-400' : 'text-blue-600'}`}>
                        <i className={`bi ${selectedNotification.read ? 'bi-envelope-open-fill' : 'bi-envelope-fill'} mr-1`}></i>
                        {selectedNotification.read ? 'Leído' : 'No leído'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg mb-6">
                    <p className="whitespace-pre-line">
                      {selectedNotification.body || "Sin contenido"}
                    </p>
                  </div>
                  
                  {summaryLoading ? (
                    <div className="text-center p-4">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" style={{ color: theme.palette.primary.hex }}></div>
                      <p className="mt-2 text-sm text-gray-600">Cargando informe del estudiante...</p>
                    </div>
                  ) : summary ? (
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4" style={{ color: theme.palette.primary.hex }}>
                        Informe académico
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Información del estudiante</h4>
                          <p className="text-sm">Nombre: {summary.studentInfo.firstName} {summary.studentInfo.lastName}</p>
                          <p className="text-sm">Grado: {summary.studentInfo.degree || "No especificado"}</p>
                          <p className="text-sm">Años completados: {Array.isArray(summary.studentInfo.yearsCompleted) ? summary.studentInfo.yearsCompleted.join(", ") : "No especificado"}</p>
                        </div>
                        
                        {summary.academicInfo && (
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">Información académica</h4>
                            <p className="text-sm">Nota media: {summary.academicInfo.averageGrade ? summary.academicInfo.averageGrade.toFixed(2) : "N/A"}</p>
                            <p className="text-sm">Créditos obtenidos: {summary.academicInfo.earnedCredits} de {summary.academicInfo.totalCredits}</p>
                          </div>
                        )}
                      </div>
                      
                      {(summary.strengths?.topSubjects?.length > 0 || 
                       summary.strengths?.strongProgrammingLanguages?.length > 0) && (
                        <div className="mt-4">
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Fortalezas</h4>
                          
                          {summary.strengths.topSubjects?.length > 0 && (
                            <div className="mb-2">
                              <p className="text-sm font-medium">Mejores asignaturas:</p>
                              <ul className="text-sm list-disc pl-5">
                                {summary.strengths.topSubjects.map((subject, i) => (
                                  <li key={i}>
                                    {subject.name}: {subject.grade.toFixed(1)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {summary.strengths.strongProgrammingLanguages?.length > 0 && (
                            <div>
                              <p className="text-sm font-medium">Lenguajes de programación destacados:</p>
                              <p className="text-sm">{summary.strengths.strongProgrammingLanguages.join(', ')}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : selectedNotification.senderRole === "STUDENT" ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay informe académico disponible para este estudiante.
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHomePage;