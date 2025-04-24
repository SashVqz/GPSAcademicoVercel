import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

export const useJobOffers = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [recentOffers, setRecentOffers] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userEligibility, setUserEligibility] = useState({
        canSearchJobs: false,
        canSearchInternships: false,
        isEligible: false,
        message: ""
    });
    const [searchParams, setSearchParams] = useState({
        keywords: "",
        location: "Spain",
        jobType: "I", 
        datePosted: "r604800",
        remote: false
    });

    const getUserIdFromCookie = () => {
        const cookieUserId = Cookies.get('user_tracking_id');
        if (cookieUserId) {
            return cookieUserId;
        }
        
        const newUserId = uuidv4();
        Cookies.set('user_tracking_id', newUserId, { expires: 365, sameSite: 'strict' });
        return newUserId;
    };

    const getUserStorageKey = (baseKey) => {
        const id = getUserIdFromCookie();
        return `${baseKey}_${id || 'guest'}`;
    };

    const initializeLocalStorage = () => {
        const id = getUserIdFromCookie();
        setUserId(id);
        
        const recentJobsKey = getUserStorageKey("recentJobOffers");
        const favoritesKey = getUserStorageKey("favoriteJobOffers");
        
        if (!localStorage.getItem(recentJobsKey)) {
            localStorage.setItem(recentJobsKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(favoritesKey)) {
            localStorage.setItem(favoritesKey, JSON.stringify([]));
        }
    };

    const determineUserEligibility = (metadata) => {
        if (!metadata || !metadata.yearsCompleted || !Array.isArray(metadata.yearsCompleted)) {
            return {
                canSearchJobs: true, 
                canSearchInternships: true,
                isEligible: true,
                message: "No se encontró información sobre años completados."
            };
        }

        const completedYears = metadata.yearsCompleted.map(Number);
        const specialization = metadata.specialization || "";
        
        const canSearchJobs = completedYears.includes(3) || completedYears.includes(4);
        const inSecondYear = completedYears.includes(2);
        const canSearchInternships = inSecondYear || canSearchJobs; 
        const isEligible = canSearchJobs || canSearchInternships;
        
        let message = "";
        if (!isEligible) {
            message = "Debes haber completado segundo de carrera para buscar prácticas.";
        } else if (canSearchJobs) {
            message = "Puedes buscar tanto empleos como prácticas.";
        } else if (canSearchInternships) {
            message = "Puedes buscar prácticas relacionadas con tu especialización.";
        }

        return {
            canSearchJobs,
            canSearchInternships,
            isEligible,
            message
        };
    };

    const syncOffersWithBackend = async (currentFavorites) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return currentFavorites;
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                console.warn("Failed to fetch user metadata for syncing");
                return currentFavorites;
            }
            
            const data = await response.json();
            const userData = data.metadata;
            
            let backendOffers = [];
            if (userData && userData.jobOffers && Array.isArray(userData.jobOffers)) {
                backendOffers = userData.jobOffers;
            }
            
            const offerMap = new Map();
            currentFavorites.forEach(offer => {
                if (offer && offer.url) {
                    offerMap.set(offer.url, offer);
                }
            });
            
            backendOffers.forEach(offer => {
                if (offer && offer.url && !offerMap.has(offer.url)) {
                    offerMap.set(offer.url, offer);
                }
            });
            
            const mergedOffers = Array.from(offerMap.values());
            const favoritesKey = getUserStorageKey("favoriteJobOffers");
            localStorage.setItem(favoritesKey, JSON.stringify(mergedOffers));
            
            if (JSON.stringify(backendOffers) !== JSON.stringify(mergedOffers)) {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        jobOffers: mergedOffers
                    })
                });
            }
            
            return mergedOffers;
        } catch (error) {
            console.error("Error syncing with backend:", error);
            return currentFavorites;
        }
    };

    useEffect(() => {
        initializeLocalStorage();
        
        const fetchUserData = async () => {
            setLoading(true);
            try {
                loadSavedOffers();
                
                const token = localStorage.getItem("token");
                if (!token) {
                    console.log("No token found, setting default user eligibility");
                    setUserEligibility({
                        canSearchJobs: true, 
                        canSearchInternships: true,
                        isEligible: true,
                        message: "Configuración por defecto: acceso completo."
                    });
                    setLoading(false);
                    return;
                }
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    console.log("Failed to fetch user metadata, using default settings");
                    setUserEligibility({
                        canSearchJobs: true, 
                        canSearchInternships: true,
                        isEligible: true,
                        message: "No se pudo obtener tu perfil. Acceso completo activado."
                    });
                    setLoading(false);
                    return;
                }
                
                const data = await response.json();
                const userData = data.metadata;
                setUser(userData);
                
                const eligibility = determineUserEligibility(userData);
                setUserEligibility(eligibility);
                
                if (userData && userData.jobOffers && Array.isArray(userData.jobOffers)) {
                    const favoritesKey = getUserStorageKey("favoriteJobOffers");
                    const localFavorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
                    const syncedFavorites = await syncOffersWithBackend(localFavorites);
                    setFavorites(syncedFavorites);
                }

                if (userData) {
                    let keywords = userData.specialization || "";
                    
                    if (userData.skills && Array.isArray(userData.skills) && userData.skills.length > 0) {
                        const topSkills = userData.skills
                            .slice(0, 3)
                            .map(skill => typeof skill === 'string' ? skill : skill.skill)
                            .filter(Boolean)
                            .join(" ");
                            
                        if (topSkills && !keywords.includes(topSkills)) {
                            keywords = keywords ? `${keywords} ${topSkills}` : topSkills;
                        }
                    }
                    
                    let jobType = "I";
                    if (eligibility.canSearchJobs) jobType = ""; 
                    
                    let location = "Spain";
                    if (userData.location) location = userData.location;
                    
                    setSearchParams({
                        keywords: keywords.trim(),
                        location: location,
                        jobType: jobType,
                        datePosted: "r604800",
                        remote: false 
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserEligibility({
                    canSearchJobs: true, 
                    canSearchInternships: true,
                    isEligible: true,
                    message: "Error al cargar perfil. Modo completo activado."
                });
            } finally {
                setLoading(false);
            }
        };
        
        fetchUserData();
    }, []);

    const loadSavedOffers = () => {
        try {
            console.log("Loading saved offers");
            const recentOffersKey = getUserStorageKey("recentJobOffers");
            const favoritesKey = getUserStorageKey("favoriteJobOffers");
            
            const allSavedOffers = JSON.parse(localStorage.getItem(recentOffersKey) || "[]");
            console.log("Loaded recent offers:", allSavedOffers.length);
            setRecentOffers(allSavedOffers);
            
            const allSavedFavorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
            console.log("Loaded favorite offers:", allSavedFavorites.length);
            setFavorites(allSavedFavorites);
            
        } catch (error) {
            console.error("Error loading saved offers:", error);
            setRecentOffers([]);
            setFavorites([]);
        }
    };

    const saveOffer = (offer) => {
        try {
            console.log("Saving offer:", offer);
            if (!offer || !offer.url) {
                console.error("Invalid offer object:", offer);
                return;
            }
            
            if (!validateOfferTypeForUser(offer)) {
                console.warn("Offer type doesn't match user eligibility, but saving anyway for tracking");
            }
            
            const recentOffersKey = getUserStorageKey("recentJobOffers");
            const currentOffers = JSON.parse(localStorage.getItem(recentOffersKey) || "[]");
            const existingOfferIndex = currentOffers.findIndex(o => o.url === offer.url);
            let updatedOffers = [...currentOffers];
            
            if (existingOfferIndex >= 0) {
                const existingOffer = updatedOffers[existingOfferIndex];
                updatedOffers[existingOfferIndex] = {
                    ...existingOffer,
                    visitCount: (existingOffer.visitCount || 0) + 1,
                    lastVisited: new Date().toISOString()
                };
                console.log("Updated existing offer, new count:", updatedOffers[existingOfferIndex].visitCount);
            } else {
                const newOffer = {
                    ...offer,
                    visitCount: 1,
                    lastVisited: new Date().toISOString()
                };
                updatedOffers = [newOffer, ...updatedOffers].slice(0, 20);
                console.log("Added new offer to recent list");
            }
            
            localStorage.setItem(recentOffersKey, JSON.stringify(updatedOffers));
            setRecentOffers(updatedOffers);
            console.log("Recent offers saved to localStorage, count:", updatedOffers.length);
        } catch (error) {
            console.error("Error saving offer:", error);
        }
    };

    const validateOfferTypeForUser = (offer) => {
        if (!userEligibility.isEligible || !offer.jobType) return true;
        if (offer.jobType === "I" && userEligibility.canSearchInternships) return true;
        if (offer.jobType !== "I" && userEligibility.canSearchJobs) return true;
        return false;
    };

    const toggleFavorite = async (offer) => {
        try {
            setSaving(true);
            console.log("Toggling favorite for offer:", offer.title);
            
            if (!offer || !offer.url) {
                console.error("Invalid offer object for favorite:", offer);
                setSaving(false);
                return;
            }
            
            if (!validateOfferTypeForUser(offer)) {
                console.warn("Attempting to favorite an offer type not matching user eligibility");
            }
            
            const favoritesKey = getUserStorageKey("favoriteJobOffers");
            const currentFavorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
            const offerIndex = currentFavorites.findIndex(o => o.url === offer.url);
            let updatedFavorites = [...currentFavorites];
            
            if (offerIndex >= 0) {
                console.log("Removing from favorites");
                updatedFavorites = updatedFavorites.filter(o => o.url !== offer.url);
            } else {
                console.log("Adding to favorites");
                const offerToSave = {
                    title: offer.title || "Oferta sin título",
                    url: offer.url,
                    source: offer.source || "LinkedIn",
                    date: offer.date || new Date().toISOString(),
                    favoriteDate: new Date().toISOString(),
                    lastVisited: offer.lastVisited || new Date().toISOString(),
                    visitCount: offer.visitCount || 1,
                    jobType: offer.jobType || searchParams.jobType || "",
                    location: offer.location || searchParams.location || "",
                    company: offer.company || "",
                    keywords: offer.keywords || searchParams.keywords || ""
                };
                updatedFavorites = [...updatedFavorites, offerToSave];
            }
            
            localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
            setFavorites(updatedFavorites);
            console.log("Favorites updated in localStorage, count:", updatedFavorites.length);
            
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    console.log("Syncing favorites with backend");
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            jobOffers: updatedFavorites
                        })
                    });
                    
                    if (!response.ok) {
                        console.warn("Failed to update job offers in database, but saved locally");
                    } else {
                        console.log("Favorites synced with backend successfully");
                    }
                } catch (serverError) {
                    console.error("Error saving to server:", serverError);
                }
            }
        } catch (error) {
            console.error("Error saving favorite:", error);
        } finally {
            setSaving(false);
        }
    };

    const deleteJobOffer = async (offerUrl) => {
        try {
            setSaving(true);
            console.log("Deleting job offer:", offerUrl);
            
            const favoritesKey = getUserStorageKey("favoriteJobOffers");
            const currentFavorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
            const offerToDelete = currentFavorites.find(offer => offer.url === offerUrl);
            
            if (!offerToDelete) {
                console.error("Offer not found for deletion:", offerUrl);
                return false;
            }
            
            const updatedFavorites = currentFavorites.filter(offer => offer.url !== offerUrl);
            localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
            setFavorites(updatedFavorites);
            
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    console.log("Deleting offer from backend");
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            jobOffers: [offerToDelete]
                        })
                    });
                    
                    if (!response.ok) {
                        console.warn("Failed to delete job offer from database, but removed locally");
                    } else {
                        console.log("Offer deleted from backend successfully");
                    }
                } catch (serverError) {
                    console.error("Error deleting from server:", serverError);
                }
            }
            
            return true;
        } catch (error) {
            console.error("Error deleting job offer:", error);
            return false;
        } finally {
            setSaving(false);
        }
    };

    const clearAllOffers = async () => {
        try {
            setSaving(true);
            console.log("Clearing all offers");
            
            const recentOffersKey = getUserStorageKey("recentJobOffers");
            const favoritesKey = getUserStorageKey("favoriteJobOffers");
            const currentFavorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
            
            localStorage.setItem(recentOffersKey, JSON.stringify([]));
            localStorage.setItem(favoritesKey, JSON.stringify([]));
            
            setRecentOffers([]);
            setFavorites([]);
            
            const token = localStorage.getItem("token");
            if (token && currentFavorites.length > 0) {
                try {
                    console.log("Deleting all offers from backend");
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            jobOffers: currentFavorites
                        })
                    });
                    
                    if (!response.ok) {
                        console.warn("Failed to delete job offers from database, but cleared locally");
                    } else {
                        console.log("All offers deleted from backend successfully");
                    }
                } catch (serverError) {
                    console.error("Error clearing from server:", serverError);
                }
            }
            
            return true;
        } catch (error) {
            console.error("Error clearing all offers:", error);
            return false;
        } finally {
            setSaving(false);
        }
    };

    const clearRecentOffers = () => {
        try {
            console.log("Clearing recent offers");
            const recentOffersKey = getUserStorageKey("recentJobOffers");
            localStorage.setItem(recentOffersKey, JSON.stringify([]));
            setRecentOffers([]);
            return true;
        } catch (error) {
            console.error("Error clearing recent offers:", error);
            return false;
        }
    };

    const handleOfferClick = (e, title, source = "LinkedIn") => {
        const url = e.currentTarget.href;
        console.log(`Clicked offer: "${title}" (${url})`);
        
        let detectedJobType = searchParams.jobType;
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes("práctica") || lowerTitle.includes("intern") || lowerTitle.includes("becario")) {
            detectedJobType = "I";
        } else if (lowerTitle.includes("full") || lowerTitle.includes("completa") || lowerTitle.includes("tiempo completo")) {
            detectedJobType = "F";
        } else if (lowerTitle.includes("part") || lowerTitle.includes("parcial") || lowerTitle.includes("tiempo parcial")) {
            detectedJobType = "P";
        }
        
        const offer = {
            title: title || "Oferta sin título",
            url: url,
            date: new Date().toISOString(),
            source: source,
            keywords: searchParams.keywords,
            jobType: detectedJobType,
            location: extractLocationFromUrl(url) || searchParams.location,
            company: extractCompanyFromTitle(title) || ""
        };
        
        saveOffer(offer);
    };

    const extractLocationFromUrl = (url) => {
        try {
            const urlObj = new URL(url);
            const searchParams = new URLSearchParams(urlObj.search);
            return searchParams.get("location") || "";
        } catch {
            return "";
        }
    };

    const extractCompanyFromTitle = (title) => {
        const atPattern = /\bat\s+([^-]+)$/i;
        const dashPattern = /-\s*([^-]+)$/;
        
        let match = title.match(atPattern);
        if (match && match[1]) return match[1].trim();
        
        match = title.match(dashPattern);
        if (match && match[1]) return match[1].trim();
        
        return "";
    };

    const generateLinkedInUrl = () => {
        const baseUrl = "https://www.linkedin.com/jobs/search/";
        const params = new URLSearchParams();
        
        let finalKeywords = searchParams.keywords;
        let jobType = searchParams.jobType;
        
        if (!userEligibility.canSearchJobs && userEligibility.canSearchInternships) {
            jobType = "I";
            
            const internKeywords = ["práctica", "prácticas", "internship", "becario"];
            const hasInternKeyword = internKeywords.some(key => 
                finalKeywords.toLowerCase().includes(key)
            );
            
            if (!hasInternKeyword) finalKeywords = `${finalKeywords} prácticas`;
        }
        
        if (finalKeywords) params.append("keywords", finalKeywords);
        
        if (searchParams.location) {
            let location = searchParams.location;
            if (!location.toLowerCase().includes("spain") && !location.toLowerCase().includes("españa")) location += ", Spain";
            params.append("location", location);
        }
        
        if (jobType) params.append("f_JT", jobType);
        params.append("f_E", "1");
        
        if (searchParams.datePosted) params.append("f_TPR", searchParams.datePosted);
        if (searchParams.remote) params.append("f_WT", "2");
        
        params.append("sortBy", "R");
        params.append("geoId", "105646813"); 
        params.append("distance", "25");
        
        return `${baseUrl}?${params.toString()}`;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === "jobType" && value !== "I" && !userEligibility.canSearchJobs) {
            alert("Solo puedes buscar prácticas según tu año académico.");
            return;
        }
        
        setSearchParams(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const isFavorite = (offerUrl) => {
        return favorites.some(o => o.url === offerUrl);
    };

    return {
        user,
        loading,
        saving,
        recentOffers,
        favorites,
        searchParams,
        setSearchParams,
        userEligibility,
        userId,
        loadSavedOffers,
        saveOffer,
        toggleFavorite,
        isFavorite,
        handleOfferClick,
        generateLinkedInUrl,
        handleInputChange,
        syncOffersWithBackend,
        deleteJobOffer,
        clearAllOffers,
        clearRecentOffers
    };
};