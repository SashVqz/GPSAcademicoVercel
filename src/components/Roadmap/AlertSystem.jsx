import React, { useState, useEffect } from 'react';
import { theme } from '../../constants/theme';

const AlertSystem = ({ 
    academicRecord,
    yearsCompleted, 
    firstName, 
    lastName, 
    languages,
    skills,
    certifications,
    workExperience,
    dni,
    gender
}) => {
    const [alerts, setAlerts] = useState([]);
    const [lastUpdateDate, setLastUpdateDate] = useState(null);
    const [dismissedAlerts, setDismissedAlerts] = useState([]);

    useEffect(() => {
        const storedDismissedAlerts = localStorage.getItem('dismissedAlerts');
        if (storedDismissedAlerts) setDismissedAlerts(JSON.parse(storedDismissedAlerts));
    }, []);

    useEffect(() => {
        const fetchLastUpdateDate = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setLastUpdateDate(data.metadata?.updatedAt ? new Date(data.metadata.updatedAt) : null);
                }
            } catch (error) {
                console.error("Error fetching last update date:", error);
            }
        };

        fetchLastUpdateDate();
    }, []);

    useEffect(() => {
        const generateAlerts = () => {
            const newAlerts = [];

            if (!academicRecord || academicRecord.length === 0) {
                newAlerts.push({
                    id: 'academic-record',
                    type: 'warning',
                    message: 'Completa tu expediente académico para obtener una mejor orientación profesional.',
                });
            }

            const currentYear = getCurrentAcademicYear(yearsCompleted);
            if (currentYear === "1º" || currentYear === "2º") {
                newAlerts.push({
                    id: 'early-career',
                    type: 'info',
                    message: 'En tu primer o segundo año, algunas funcionalidades de orientación profesional están limitadas.',
                });
            }

            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            if (!lastUpdateDate || lastUpdateDate < sixMonthsAgo) {
                newAlerts.push({
                    id: 'data-update',
                    type: 'reminder',
                    message: 'Tus datos están desactualizados. Te recomendamos actualizarlos para una mejor orientación.',
                });
            }

            const profileCompletionPercentage = calculateProfileCompletion();
            if (profileCompletionPercentage < 50) {
                newAlerts.push({
                    id: 'profile-completion',
                    type: 'info',
                    message: `Tu perfil solo está completado al ${profileCompletionPercentage}%. ¡Complétalo para mejores recomendaciones!`,
                });
            }

            const filteredAlerts = newAlerts.filter(alert => 
                !dismissedAlerts.includes(alert.id)
            );

            setAlerts(filteredAlerts);
        };

        generateAlerts();
    }, [academicRecord, yearsCompleted, lastUpdateDate, dismissedAlerts, firstName, lastName, dni, gender, languages, skills, certifications, workExperience]);

    const getCurrentAcademicYear = (yearsCompleted) => {
        if (!yearsCompleted) return "1º";
        const year = Array.isArray(yearsCompleted) ? Math.max(...yearsCompleted) : parseInt(yearsCompleted);
        
        if (isNaN(year)) return "1º";
        if (year === 0) return "1º";
        if (year >= 4) return "4º";
        return `${year + 1}º`;
    };

    const calculateProfileCompletion = () => {
        let completed = 0;
        const totalSections = 7;

        if (firstName && lastName) completed++;
        if (dni) completed++;
        if (gender) completed++;
        if (languages && languages.length > 0) completed++;
        if (skills && skills.length > 0) completed++;
        if (certifications && certifications.length > 0) completed++;
        if (workExperience && workExperience.length > 0) completed++;

        return Math.round((completed / totalSections) * 100);
    };

    const getAlertColor = (type) => {
        switch(type) {
            case 'warning': return 'bg-yellow-100 border-yellow-400 text-yellow-700';
            case 'info': return 'bg-blue-100 border-blue-400 text-blue-700';
            case 'reminder': return 'bg-green-100 border-green-400 text-green-700';
            default: return 'bg-gray-100 border-gray-400 text-gray-700';
        }
    };

    const dismissAlert = (alertId) => {
        const updatedDismissedAlerts = [...dismissedAlerts, alertId];
        setDismissedAlerts(updatedDismissedAlerts);
        
        localStorage.setItem('dismissedAlerts', JSON.stringify(updatedDismissedAlerts));
    };

    if (alerts.length === 0) return null;

    return (
        <div className="space-y-4 mb-6">
            {alerts.map((alert, index) => (
                <div 
                    key={index} 
                    className={`p-4 border-l-4 rounded-md relative ${getAlertColor(alert.type)}`}
                >
                    <button
                        onClick={() => dismissAlert(alert.id)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        aria-label="Dismiss alert"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div className="flex items-center pr-8">
                        <p className="text-sm">{alert.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AlertSystem;