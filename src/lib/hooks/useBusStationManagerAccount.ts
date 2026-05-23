import { useState, useEffect } from "react";
import { getBusStationManagerAccount, getBusStationByManagerId } from "@/lib/services/bus-station-service";
import { BusStationManagerAccount } from "@/lib/types/bus-station";
import { useBusStation } from "@/context/Provider";

export const useBusStationManagerAccount = () => { 
    const { userData, isLoading: isUserLoading } = useBusStation();
    const [account, setAccount] = useState<BusStationManagerAccount | null>(null);
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

                const data = await getBusStationManagerAccount(station.id);
                setAccount(data);
            } catch (err) {
                setError("Failed to fetch manager account data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userData, isUserLoading]);

    return { account, loading, error };
};