import Cookies from 'js-cookie';

class OffersSyncService {
    constructor() {
        this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;
        this.userId = this.getUserIdFromCookie();
    }

    getUserIdFromCookie() {
        return Cookies.get('user_tracking_id') || null;
    }

    getStorageKey(baseKey) {
        const userId = this.getUserIdFromCookie();
        return `${baseKey}_${userId || 'guest'}`;
    }

    async syncWithBackend() {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const response = await fetch(`${this.baseUrl}/metadata`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.warn("Failed to fetch user metadata for syncing");
                return null;
            }

            const data = await response.json();
            return data.metadata?.jobOffers || [];
        } catch (error) {
            console.error("Error fetching offers from backend:", error);
            return null;
        }
    }

    async updateBackendOffers(offers) {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            const response = await fetch(`${this.baseUrl}/metadata`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobOffers: offers
                })
            });

            return response.ok;
        } catch (error) {
            console.error("Error updating backend offers:", error);
            return false;
        }
    }

    async deleteOffersFromBackend(offers) {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            const response = await fetch(`${this.baseUrl}/metadata`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobOffers: offers
                })
            });

            return response.ok;
        } catch (error) {
            console.error("Error deleting offers from backend:", error);
            return false;
        }
    }

    // Fusiona ofertas locales y del backend dando prioridad a las locales (visitas, etc.)
    mergeOffers(localOffers, backendOffers) {
        if (!backendOffers || !Array.isArray(backendOffers)) return localOffers;
        if (!localOffers || !Array.isArray(localOffers)) return backendOffers;

        const offerMap = new Map();

        localOffers.forEach(offer => {
            if (offer && offer.url) {
                offerMap.set(offer.url, offer);
            }
        });

        backendOffers.forEach(offer => {
            if (offer && offer.url && !offerMap.has(offer.url)) {
                offerMap.set(offer.url, offer);
            } else if (offer && offer.url) {
                const localOffer = offerMap.get(offer.url);
                const visitCount = Math.max(localOffer.visitCount || 0, offer.visitCount || 0);
                const lastVisited = new Date(Math.max(
                    new Date(localOffer.lastVisited || 0).getTime(),
                    new Date(offer.lastVisited || 0).getTime()
                )).toISOString();

                offerMap.set(offer.url, {
                    ...offer,
                    visitCount,
                    lastVisited
                });
            }
        });

        return Array.from(offerMap.values());
    }

    async performFullSync() {
        try {
            // Obtener ofertas favoritas del backend
            const backendOffers = await this.syncWithBackend();
            if (!backendOffers) return false;

            // Obtener ofertas favoritas del localStorage
            const favoritesKey = this.getStorageKey("favoriteJobOffers");
            const localFavorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]");

            // Merge local y backend
            const mergedOffers = this.mergeOffers(localFavorites, backendOffers);

            // Actualizar localStorage
            localStorage.setItem(favoritesKey, JSON.stringify(mergedOffers));

            // Si hay cambios, actualizar también en el backend
            if (JSON.stringify(backendOffers) !== JSON.stringify(mergedOffers)) await this.updateBackendOffers(mergedOffers);
            
            return mergedOffers;
        } catch (error) {
            console.error("Error during full offer sync:", error);
            return false;
        }
    }
    
    validateOfferStructure(offer) {
        const requiredFields = ['title', 'url'];
        return offer && typeof offer === 'object' && requiredFields.every(field => offer[field] !== undefined);
    }
    
    prepareOfferForStorage(offer) {
        if (!this.validateOfferStructure(offer)) {
            console.error("Invalid offer structure:", offer);
            return null;
        }
        
        return {
            title: offer.title || "Oferta sin título",
            url: offer.url,
            source: offer.source || "LinkedIn",
            date: offer.date || new Date().toISOString(),
            favoriteDate: offer.favoriteDate || new Date().toISOString(),
            lastVisited: offer.lastVisited || new Date().toISOString(),
            visitCount: offer.visitCount || 1,
            jobType: offer.jobType || "",
            location: offer.location || "",
            company: offer.company || "",
            keywords: offer.keywords || ""
        };
    }
    
    getRecentOffers() {
        const recentOffersKey = this.getStorageKey("recentJobOffers");
        try {
            return JSON.parse(localStorage.getItem(recentOffersKey) || "[]");
        } catch (error) {
            console.error("Error reading recent offers:", error);
            return [];
        }
    }
    
    getFavoriteOffers() {
        const favoritesKey = this.getStorageKey("favoriteJobOffers");
        try {
            return JSON.parse(localStorage.getItem(favoritesKey) || "[]");
        } catch (error) {
            console.error("Error reading favorite offers:", error);
            return [];
        }
    }
    
    saveRecentOffer(offer) {
        const preparedOffer = this.prepareOfferForStorage(offer);
        if (!preparedOffer) return false;
        
        const recentOffersKey = this.getStorageKey("recentJobOffers");
        const currentOffers = this.getRecentOffers();
        
        const existingOfferIndex = currentOffers.findIndex(o => o.url === preparedOffer.url);
        let updatedOffers = [...currentOffers];
        
        if (existingOfferIndex >= 0) {
            const existingOffer = updatedOffers[existingOfferIndex];
            updatedOffers[existingOfferIndex] = {
                ...existingOffer,
                visitCount: (existingOffer.visitCount || 0) + 1,
                lastVisited: new Date().toISOString()
            };
        } else {
            updatedOffers = [
                preparedOffer,
                ...updatedOffers
            ].slice(0, 20);
        }
        
        localStorage.setItem(recentOffersKey, JSON.stringify(updatedOffers));
        return true;
    }
    
    toggleFavoriteOffer(offer) {
        const preparedOffer = this.prepareOfferForStorage(offer);
        if (!preparedOffer) return false;
        
        const favoritesKey = this.getStorageKey("favoriteJobOffers");
        const currentFavorites = this.getFavoriteOffers();
        
        const existingOfferIndex = currentFavorites.findIndex(o => o.url === preparedOffer.url);
        let updatedFavorites;
        
        if (existingOfferIndex >= 0) {
            updatedFavorites = currentFavorites.filter(o => o.url !== preparedOffer.url);
        } else {
            updatedFavorites = [...currentFavorites, preparedOffer];
        }
        
        localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
        
        this.updateBackendOffers(updatedFavorites).catch(error => {
            console.warn("Failed to update favorites in backend:", error);
        });
        
        return existingOfferIndex >= 0 ? "removed" : "added";
    }
    
    isOfferFavorite(offerUrl) {
        const favorites = this.getFavoriteOffers();
        return favorites.some(offer => offer.url === offerUrl);
    }
    
    async deleteOffer(offerUrl) {
        const favoritesKey = this.getStorageKey("favoriteJobOffers");
        const favorites = this.getFavoriteOffers();
        
        const offerToDelete = favorites.find(offer => offer.url === offerUrl);
        if (!offerToDelete) return false;
        
        const updatedFavorites = favorites.filter(offer => offer.url !== offerUrl);
        localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
        
        try {
            await this.deleteOffersFromBackend([offerToDelete]);
            return true;
        } catch (error) {
            console.error("Error deleting offer:", error);
            return false;
        }
    }
    
    async deleteOffers(offerUrls) {
        if (!Array.isArray(offerUrls) || offerUrls.length === 0) return false;
        
        const favoritesKey = this.getStorageKey("favoriteJobOffers");
        const favorites = this.getFavoriteOffers();
        
        const offersToDelete = favorites.filter(offer => offerUrls.includes(offer.url));
        if (offersToDelete.length === 0) return false;
        
        const updatedFavorites = favorites.filter(offer => !offerUrls.includes(offer.url));
        localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
        
        try {
            await this.deleteOffersFromBackend(offersToDelete);
            return true;
        } catch (error) {
            console.error("Error deleting offers:", error);
            return false;
        }
    }
    
    async clearAllOffers() {
        const recentOffersKey = this.getStorageKey("recentJobOffers");
        const favoritesKey = this.getStorageKey("favoriteJobOffers");
        
        const favorites = this.getFavoriteOffers();
        localStorage.setItem(recentOffersKey, JSON.stringify([]));
        localStorage.setItem(favoritesKey, JSON.stringify([]));
        
        if (favorites.length > 0) {
            try {
                await this.deleteOffersFromBackend(favorites);
            } catch (error) {
                console.warn("Failed to clear offers in backend:", error);
            }
        }
        
        return true;
    }
}

export default OffersSyncService;