// src/lib/hooks/useBusStationManager.ts
import { useState, useEffect } from "react";
import { useBusStation } from "@/context/Provider";
import { getBusStationByManagerId } from "@/lib/services/bus-station-service";
import {
    useBusStationDashboard,
    AgencyWithTaxStatus
} from "@/lib/hooks/useBusStationDashboard";
import { BusStation, Trip, TripsByDate } from "@/lib/types/bus-station";

interface UseBusStationManagerReturn {
    station: BusStation | null;
    agencies: AgencyWithTaxStatus[];
    trips: Trip[];
    tripsByDate: TripsByDate[];
    loading: boolean;
    error: string | null;
}

export function useBusStationManager(): UseBusStationManagerReturn {
    const { userData, isLoading: isUserLoading } = useBusStation();
    const [stationId, setStationId] = useState<string>("");
    const [initError, setInitError] = useState<string | null>(null);
    const [initLoading, setInitLoading] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            if (isUserLoading || !userData?.userId) return;
            setInitLoading(true);
            try {
                const stationData = await getBusStationByManagerId(userData.userId);
                // CORRECTION : Détection de l'ID selon le format backend idGareRoutiere ou id
                const realId = (stationData as any)?.idGareRoutiere || (stationData as any)?.id;
                
                if (realId) {
                    setStationId(realId);
                } else {
                    setInitError("Aucune gare routière associée à votre compte.");
                }
            } catch (error) {
                console.error("Init Error:", error);
                setInitError("Erreur lors de la récupération de la gare routière.");
            } finally {
                setInitLoading(false);
            }
        };
        initialize();
    }, [userData, isUserLoading]);

    const dashboard = useBusStationDashboard(stationId);

    return {
        ...dashboard,
        loading: initLoading || dashboard.loading,
        error: initError || dashboard.error,
    };
}