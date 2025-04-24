import React, { useState } from 'react';
import { theme } from "@/constants/theme";

const NotificationFilters = ({ 
  activeTab, 
  onTabChange, 
  students, 
  selectedStudent, 
  onStudentSelect, 
  unreadCount, 
  totalCount,
  onMarkAllAsRead
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = searchTerm.trim() === ''
    ? students
    : students.filter(student => 
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4" style={{ color: theme.palette.dark.hex }}>
        Notificaciones
      </h2>
      
      <div className="space-y-2">
        <button
          onClick={() => onTabChange('all')}
          className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-colors ${
            activeTab === 'all' 
              ? 'bg-blue-50' 
              : 'hover:bg-gray-50'
          }`}
          style={{ 
            color: activeTab === 'all' ? theme.palette.primary.hex : theme.palette.text.hex 
          }}
        >
          <div className="flex items-center">
            <i className="bi bi-inbox mr-2"></i>
            <span>Todas</span>
          </div>
          {totalCount > 0 && (
            <span className="text-xs font-medium py-0.5 px-2 rounded-full bg-gray-100">
              {totalCount}
            </span>
          )}
        </button>
        
        <button
          onClick={() => onTabChange('unread')}
          className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-colors ${
            activeTab === 'unread' 
              ? 'bg-blue-50' 
              : 'hover:bg-gray-50'
          }`}
          style={{ 
            color: activeTab === 'unread' ? theme.palette.primary.hex : theme.palette.text.hex 
          }}
        >
          <div className="flex items-center">
            <i className="bi bi-envelope mr-2"></i>
            <span>No leídas</span>
          </div>
          {unreadCount > 0 && (
            <span 
              className="text-xs font-medium py-0.5 px-2 rounded-full" 
              style={{ 
                backgroundColor: theme.palette.primary.hex + '20',
                color: theme.palette.primary.hex
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>
      
      {unreadCount > 0 && (
        <button
          onClick={onMarkAllAsRead}
          className="mt-3 w-full text-sm px-3 py-2 rounded-md flex items-center justify-center transition-colors border"
          style={{ 
            borderColor: theme.palette.light.hex,
            color: theme.palette.dark.hex,
          }}
        >
          <i className="bi bi-envelope-open mr-2"></i>
          <span>Marcar todas como leídas</span>
        </button>
      )}
      
      {students.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3 text-sm flex items-center">
            <i className="bi bi-people mr-2"></i>
            <span>Estudiantes</span>
            <span className="ml-auto text-xs text-gray-500">{students.length}</span>
          </h3>
          
          <div className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pr-8 text-sm border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: theme.palette.light.hex,
                  color: theme.palette.text.hex,
                }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i className="bi bi-search text-gray-400"></i>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-8 cursor-pointer"
                >
                  <i className="bi bi-x-circle text-gray-400 hover:text-gray-600"></i>
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
            <button
              onClick={() => onStudentSelect(null)}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center transition-colors ${
                !selectedStudent ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              style={{ 
                color: !selectedStudent ? theme.palette.primary.hex : theme.palette.text.hex 
              }}
            >
              <div className="flex items-center">
                <i className="bi bi-people-fill mr-2"></i>
                <span>Todos los estudiantes</span>
              </div>
            </button>
            
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => onStudentSelect(student)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center transition-colors ${
                    selectedStudent?.id === student.id 
                      ? 'bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  style={{ 
                    color: selectedStudent?.id === student.id ? theme.palette.primary.hex : theme.palette.text.hex 
                  }}
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white mr-2 text-xs font-medium"
                    style={{ backgroundColor: theme.palette.primary.hex }}
                  >
                    {student.firstName?.[0]}{student.lastName?.[0]}
                  </div>
                  <span className="truncate">
                    {student.firstName} {student.lastName}
                  </span>
                </button>
              ))
            ) : (
              <div className="text-center py-3 text-sm text-gray-500">
                No se encontraron estudiantes
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationFilters;