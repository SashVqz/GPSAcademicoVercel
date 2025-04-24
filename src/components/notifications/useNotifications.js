import { useState, useEffect } from 'react';

export const useNotifications = ({ baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}`, token, role }) => {
    const [notifications, setNotifications] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        unreadCount: 0,
        hasMore: false,
        nextCursor: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const validateToken = () => {
        if (!token) {
            setError('Token no disponible. Inicie sesión nuevamente.');
            return false;
        }
        return true;
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const resetMessages = () => {
        setError(null);
        setSuccess(null);
    };

    const getNotifications = async (params = {}) => {
        if (!validateToken() || role !== 'TEACHER') return null;
        
        resetMessages();
        setLoading(true);
        
        try {
            const queryParams = new URLSearchParams();
            if (params.limit) queryParams.append('limit', params.limit);
            if (params.startAfter) queryParams.append('startAfter', params.startAfter);
            if (params.onlyUnread !== undefined) queryParams.append('onlyUnread', params.onlyUnread);
            
            const url = `${baseUrl}/student/teacher/notification${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || data.message || 'Error al obtener las notificaciones');
            }
            
            const data = await response.json();
            if (!data || typeof data !== 'object') throw new Error('Formato de respuesta no válido');
            
            setNotifications(data.notifications || []);
            setPagination({
                total: data.pagination?.total || 0,
                unreadCount: data.pagination?.unreadCount || 0,
                hasMore: data.pagination?.hasMore || false,
                nextCursor: data.pagination?.nextCursor || null
            });
            
            return data;
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setError(err.message || 'Error al obtener las notificaciones');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getNotificationsFromStudent = async (studentId, params = {}) => {
        if (!validateToken() || role !== 'TEACHER') return null;
        if (!studentId) {
          setError('ID de estudiante no proporcionado');
          return null;
        }
        
        resetMessages();
        setLoading(true);
        
        try {
          const queryParams = new URLSearchParams();
          
          if (params.limit) queryParams.append('limit', params.limit);
          if (params.startAfter) queryParams.append('startAfter', params.startAfter);
          if (params.onlyUnread !== undefined) queryParams.append('onlyUnread', params.onlyUnread);
          
          const response = await fetch(`${baseUrl}/student/teacher/notification/${studentId}?${queryParams.toString()}`, {
            method: 'GET',
            headers
          });
          
        } catch (err) {
          console.error("Error fetching notifications from student:", err);
          setError(err.message || 'Error al obtener las notificaciones del estudiante');
          return null;
        } finally {
          setLoading(false);
        }
    };

    const sendNotificationToTeacher = async (teacherId, message) => {
        if (!validateToken() || role !== 'STUDENT') return null;
        if (!teacherId) {
            setError('ID de profesor no proporcionado');
            return null;
        }
        
        if (!message || !message.trim()) {
            setError('El mensaje no puede estar vacío');
            return null;
        }
        
        resetMessages();
        setLoading(true);
        
        try {
            const response = await fetch(`${baseUrl}/student/teacher/notification`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ teacherId, message })
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || data.message || 'Error al enviar la notificación al profesor');
            }

            const data = await response.json();
            
            setSuccess('Mensaje enviado correctamente al profesor');
            return data;
        } catch (err) {
            console.error("Error sending notification to teacher:", err);
            setError(err.message || 'Error al enviar la notificación al profesor');
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            setNotifications([]);
            setPagination({
                total: 0,
                unreadCount: 0,
                hasMore: false,
                nextCursor: null
            });
            setError(null);
            setSuccess(null);
        };
    }, []);
    
    return {
        notifications,
        pagination,
        loading,
        error,
        success,
        resetMessages,
        getNotifications,
        ...(role === 'TEACHER' ? { getNotificationsFromStudent } : {}),
        ...(role === 'STUDENT' ? { sendNotificationToTeacher } : {})
    };
};