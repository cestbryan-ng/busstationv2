import { useState, useEffect } from "react";
import { getPoliciesAndTaxes } from "@/lib/services/bus-station-service";
import { getBusStationByManagerId } from "@/lib/services/bus-station-service";
import { PolicyAndTax } from "@/lib/types/bus-station";
import { useBusStation } from "@/context/Provider";

export const usePoliciesAndTaxes = () => { // ← suppression du paramètre stationId
    const { userData, isLoading: isUserLoading } = useBusStation();
    const [policiesAndTaxes, setPoliciesAndTaxes] = useState<PolicyAndTax[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (isUserLoading || !userData?.userId) return;
            try {
                setLoading(true);

                // ✅ Récupération dynamique du stationId
                const station = await getBusStationByManagerId(userData.userId);
                if (!station?.id) {
                    setError("Aucune gare routière associée à votre compte.");
                    return;
                }

                const data = await getPoliciesAndTaxes(station.id);
                setPoliciesAndTaxes(data);
            } catch (err) {
                setError("Failed to fetch policies and taxes");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userData, isUserLoading]);

    return { policiesAndTaxes, loading, error };
};