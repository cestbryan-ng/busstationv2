import { useState, useEffect, useMemo } from "react";
import { getAllPublicAgencies } from "@/lib/services/agency-public-service";
import { TravelAgency } from "@/lib/types/models/Agency";

export function useAgencies() {
    const [agencies, setAgencies] = useState<TravelAgency[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchAgencies();
    }, []);

    async function fetchAgencies() {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAllPublicAgencies();
            setAgencies(data);
        } catch (err) {
            setError("Impossible de charger les agences.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    const filteredAgencies = useMemo(() => {
        return agencies.filter(
            (agency) =>
                (agency.longName ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                // ✅ Correction : sécurisation contre null/undefined
                (agency.location ?? '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [agencies, searchQuery]);

    return {
        agencies: filteredAgencies,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        refetch: fetchAgencies,
    };
}