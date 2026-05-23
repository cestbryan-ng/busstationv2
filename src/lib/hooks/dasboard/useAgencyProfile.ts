// src/lib/hooks/dasboard/useAgencyProfile.ts
import { useState, useEffect } from "react";
import { useBusStation } from "@/context/Provider";
import { getAgencyByChefId } from "@/lib/services/agency-service";
import { getTripsByAgency } from "@/lib/services/trip-service";
import { TravelAgency } from "@/lib/types/models/Agency";
import { TripDetails } from "@/lib/types/models/Trip";

export function useAgencyProfile() {
    const { userData, isLoading: isUserLoading } = useBusStation();
    const [agency, setAgency] = useState<TravelAgency | null>(null);
    const [activeTrips, setActiveTrips] = useState<TripDetails[]>([]);
    const [cancelledTrips, setCancelledTrips] = useState<TripDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        const initialize = async () => {
            if (isUserLoading || !userData?.userId) return;
            setIsLoading(true);
            setApiError(null);

            try {
                // Chargement de l'agence
                const agencyData = await getAgencyByChefId(userData.userId);
                if (!agencyData?.agencyId) {
                    setApiError("Aucune agence associée à votre compte.");
                    setIsLoading(false);
                    return;
                }
                setAgency(agencyData);

                // Chargement des voyages
                const tripsResponse = await getTripsByAgency(agencyData.agencyId);
                const allTrips = tripsResponse?.content ?? [];

                // Filtrage par statut
                setActiveTrips(
                    allTrips.filter((t) => t.statusVoyage === "PUBLIE")
                );
                setCancelledTrips(
                    allTrips.filter((t) => t.statusVoyage === "ANNULE")
                );

            } catch (error) {
                console.error(error);
                setApiError("Erreur lors du chargement du profil.");
            } finally {
                setIsLoading(false);
            }
        };

        initialize();
    }, [userData, isUserLoading]);

    return {
        agency,
        activeTrips,
        cancelledTrips,
        isLoading,
        apiError,
    };
}