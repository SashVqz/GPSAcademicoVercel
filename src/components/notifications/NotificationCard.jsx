import React from 'react';
import { theme } from "@/constants/theme";

const NotificationCard = ({ 
  notification, 
  isSelected, 
  onSelect, 
  onMarkAsRead, 
  onMarkAsUnread, 
  onDelete, 
  studentInfo 
}) => {
  const formattedDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const notificationDate = new Date(date);
    notificationDate.setHours(0, 0, 0, 0);
    
    const differenceInDays = Math.floor(
      (today - notificationDate) / (1000 * 60 * 60 * 24)
    );
    
    if (differenceInDays === 0) {
      return `Hoy ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (differenceInDays === 1) {
      return `Ayer ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (differenceInDays < 7) {
      const weekday = new Intl.DateTimeFormat('es', { weekday: 'long' }).format(date);
      return `${weekday} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return new Intl.DateTimeFormat('es', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
  };
  
  const handleSelect = () => {
    onSelect(notification);
  };
  
  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    onMarkAsRead(notification);
  };
  
  const handleMarkAsUnread = (e) => {
    e.stopPropagation();
    onMarkAsUnread(notification);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que deseas eliminar esta notificación?')) {
      onDelete(notification.id);
    }
  };
  
  return (
    <div 
      className={`p-4 border-b hover:bg-gray-50 transition cursor-pointer ${
        isSelected ? 'bg-blue-50' : notification.read ? '' : 'bg-gray-50'
      }`}
      onClick={handleSelect}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 
            className={`text-sm font-medium truncate ${
              notification.read ? 'text-gray-700' : 'text-black font-semibold'
            }`}
          >
            {notification.title || 'Sin título'}
          </h3>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {formattedDate(notification.timestamp || notification.createdAt)}
          </p>
        </div>
        
        {!notification.read && (
          <span 
            className="h-2 w-2 rounded-full mt-1"
            style={{ backgroundColor: theme.palette.primary.hex }}
          ></span>
        )}
      </div>
      
      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
        {notification.body || 'Sin contenido'}
      </p>
      
      {studentInfo && (
        <div className="mt-2 text-xs font-medium" style={{ color: theme.palette.primary.hex }}>
          De: {studentInfo.firstName} {studentInfo.lastName}
        </div>
      )}
      
      <div className="mt-3 flex justify-end items-center gap-2">
        {notification.read ? (
          <button 
            onClick={handleMarkAsUnread}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
          >
            <i className="bi bi-envelope mr-1"></i>
            Marcar como no leído
          </button>
        ) : (
          <button 
            onClick={handleMarkAsRead}
            className="text-xs px-2 py-1 rounded hover:bg-blue-50"
            style={{ color: theme.palette.primary.hex }}
          >
            <i className="bi bi-envelope-open mr-1"></i>
            Marcar como leído
          </button>
        )}
        
        <button 
          onClick={handleDelete}
          className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
        >
          <i className="bi bi-trash mr-1"></i>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;