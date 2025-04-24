import { useState, useEffect } from 'react';

export const useSummary = ({ baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}`, token, role }) => {
    const [latestSummary, setLatestSummary] = useState(null);
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

    const getLatestSummary = async (studentId = null) => {
        if (!validateToken()) return null;
        
        resetMessages();
        setLoading(true);
        
        try {
            let url = studentId ? `${baseUrl}/summary/${studentId}/latest` : `${baseUrl}/summary/latest`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || data.message || 'Error al obtener el último informe');
            }
            
            const data = await response.json();
            
            if (!data || !data.summary) throw new Error('No se encontró ningún informe');
            setLatestSummary(data.summary);
            return data.summary;
        } catch (err) {
            console.error("Error fetching latest summary:", err);
            setError(err.message || 'Error al obtener el último informe');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const generateSummary = async () => {
        if (!validateToken() || role !== "STUDENT") return null;
        
        resetMessages();
        setLoading(true);
        
        try {
            const response = await fetch(`${baseUrl}/summary`, {
                method: 'POST',
                headers
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || data.message || 'Error al generar el informe');
            }
            
            const data = await response.json();
            if (!data || !data.summary) throw new Error('No se pudo generar el informe');
            setLatestSummary(data.summary);
            setSuccess('Informe generado correctamente');
            return data.summary;
        } catch (err) {
            console.error("Error generating summary:", err);
            setError(err.message || 'Error al generar el informe');
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            setLatestSummary(null);
            setError(null);
            setSuccess(null);
        };
    }, []);

    return {
        latestSummary,
        loading,
        error,
        success,
        resetMessages,
        getLatestSummary,
        ...(role === "STUDENT" ? { generateSummary } : {})
    };
};