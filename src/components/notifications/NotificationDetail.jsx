import React from 'react';
import { theme } from "@/constants/theme";
import { exportToPDF } from './exportSummary';

const NotificationDetail = ({ 
  notification,
  studentInfo,
  latestSummary,
  summaryLoading,
  summaryError,
  getStudentLatestSummary
}) => {
  const handleDownloadSummary = () => {
    if (!latestSummary) return;
    
    try {
      const pdfExporter = exportToPDF(latestSummary);
      pdfExporter.download();
    } catch (err) {
      console.error("Error downloading summary:", err);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return 'Fecha desconocida';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Detalle de notificación
        </h3>
        {latestSummary && (
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
            {notification.title || "Sin título"}
          </h2>
          
          <div className="flex flex-wrap text-sm text-gray-600 gap-x-4 gap-y-2">
            {notification.senderRole === "STUDENT" && studentInfo && (
              <span className="flex items-center">
                <i className="bi bi-person-fill mr-1"></i>
                {studentInfo.firstName} {studentInfo.lastName}
              </span>
            )}
            
            <span className="flex items-center">
              <i className="bi bi-calendar-event mr-1"></i>
              {formatDate(notification.timestamp || notification.createdAt)}
            </span>
            
            <span className={`flex items-center ${notification.read ? 'text-gray-400' : 'text-blue-600'}`}>
              <i className={`bi ${notification.read ? 'bi-envelope-open-fill' : 'bi-envelope-fill'} mr-1`}></i>
              {notification.read ? 'Marcado como leído' : 'No leído'}
            </span>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg mb-6">
          <p className="whitespace-pre-line">
            {notification.body || "Sin contenido"}
          </p>
        </div>
        
        {notification.senderRole === "STUDENT" && studentInfo && (
          <div className="mb-6">
            <button
              onClick={() => {
                if (studentInfo.id) {
                  window.open(`/profile/student/${studentInfo.id}`, '_blank');
                }
              }}
              className="text-sm px-3 py-1 rounded flex items-center"
              style={{ 
                backgroundColor: `${theme.palette.primary.hex}20`,
                color: theme.palette.primary.hex
              }}
            >
              <i className="bi bi-person-badge mr-2"></i>
              Ver perfil del estudiante
            </button>
          </div>
        )}
        
        {notification.senderRole === "STUDENT" && studentInfo && (
          <div>
            {summaryError ? (
              <div className="text-center py-4 text-red-500">
                Error al cargar el informe: {summaryError}
              </div>
            ) : summaryLoading ? (
              <div className="text-center p-4">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" style={{ color: theme.palette.primary.hex }}></div>
                <p className="mt-2 text-sm text-gray-600">Cargando informe del estudiante...</p>
              </div>
            ) : latestSummary ? (
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium" style={{ color: theme.palette.primary.hex }}>
                    Informe académico
                  </h3>
                  <span className="text-xs text-gray-500">
                    Generado el {formatDate(latestSummary.createdAt)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Información del estudiante</h4>
                    <p className="text-sm">Nombre: {latestSummary.studentInfo.firstName} {latestSummary.studentInfo.lastName}</p>
                    <p className="text-sm">Grado: {latestSummary.studentInfo.degree || "No especificado"}</p>
                    <p className="text-sm">Años completados: {Array.isArray(latestSummary.studentInfo.yearsCompleted) ? latestSummary.studentInfo.yearsCompleted.join(", ") : "No especificado"}</p>
                  </div>
                  
                  {latestSummary.academicInfo && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Información académica</h4>
                      <p className="text-sm">Nota media: {latestSummary.academicInfo.averageGrade ? latestSummary.academicInfo.averageGrade.toFixed(2) : "N/A"}</p>
                      <p className="text-sm">Créditos obtenidos: {latestSummary.academicInfo.earnedCredits} de {latestSummary.academicInfo.totalCredits}</p>
                    </div>
                  )}
                </div>
                
                {(latestSummary.strengths?.topSubjects?.length > 0 || 
                 latestSummary.strengths?.strongProgrammingLanguages?.length > 0) && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Fortalezas</h4>
                    
                    {latestSummary.strengths.topSubjects?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-medium">Mejores asignaturas:</p>
                        <ul className="text-sm list-disc pl-5">
                          {latestSummary.strengths.topSubjects.map((subject, i) => (
                            <li key={i}>
                              {subject.name}: {subject.grade.toFixed(1)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {latestSummary.strengths.strongProgrammingLanguages?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Lenguajes de programación destacados:</p>
                        <p className="text-sm">{latestSummary.strengths.strongProgrammingLanguages.join(', ')}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {(latestSummary.weaknesses?.weakSubjects?.length > 0 || 
                 latestSummary.weaknesses?.weakProgrammingLanguages?.length > 0) && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Áreas de mejora</h4>
                    
                    {latestSummary.weaknesses.weakSubjects?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-medium">Asignaturas a mejorar:</p>
                        <ul className="text-sm list-disc pl-5">
                          {latestSummary.weaknesses.weakSubjects.map((subject, i) => (
                            <li key={i}>
                              {subject.name}: {subject.grade.toFixed(1)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {latestSummary.weaknesses.weakProgrammingLanguages?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Lenguajes a reforzar:</p>
                        <p className="text-sm">{latestSummary.weaknesses.weakProgrammingLanguages.join(', ')}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {latestSummary.roadmapProgress?.name && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Progreso en Roadmap</h4>
                    <p className="text-sm">Roadmap: {latestSummary.roadmapProgress.name}</p>
                    
                    {typeof latestSummary.roadmapProgress.completedCheckpoints === 'number' && 
                    typeof latestSummary.roadmapProgress.totalCheckpoints === 'number' && (
                      <div className="mt-1">
                        <p className="text-sm mb-1">
                          Progreso: {Math.round((latestSummary.roadmapProgress.completedCheckpoints / latestSummary.roadmapProgress.totalCheckpoints) * 100)}% 
                          ({latestSummary.roadmapProgress.completedCheckpoints} de {latestSummary.roadmapProgress.totalCheckpoints})
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ 
                              width: `${Math.round((latestSummary.roadmapProgress.completedCheckpoints / latestSummary.roadmapProgress.totalCheckpoints) * 100)}%`,
                              backgroundColor: theme.palette.primary.hex
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 border rounded-lg">
                <p className="text-gray-500 mb-4">No hay informe académico disponible para este estudiante.</p>
                <button
                  onClick={() => {
                    if (studentInfo && studentInfo.id) {
                      getStudentLatestSummary(studentInfo.id);
                    }
                  }}
                  className="px-4 py-2 text-sm rounded-md"
                  style={{ 
                    backgroundColor: theme.palette.primary.hex,
                    color: 'white'
                  }}
                >
                  <i className="bi bi-arrow-repeat mr-2"></i>
                  Intentar cargar informe
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDetail;