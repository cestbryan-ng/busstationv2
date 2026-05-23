import { useState, useEffect } from "react";
import { TravelAgency } from "@/lib/types/models/Agency";
import { Trip } from "@/lib/types/models/Trip";
import { getPublicAgencyById } from "@/lib/services/agency-public-service";
import { getTripsByAgency } from "@/lib/services/trip-service";

export function useAgencyPublicDetails(agencyId: string) {
  const [agency, setAgency] = useState<TravelAgency | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (agencyId) {
      fetchDetails(agencyId);
    }
  }, [agencyId]);

  async function fetchDetails(id: string) {
    setIsLoading(true);
    setError(null);
    try {
      // MODIFICATION 2 : Appel parallèle avec les services corrigés
      const [agencyData, tripsResponse] = await Promise.all([
        getPublicAgencyById(id),
        getTripsByAgency(id),
      ]);

      if (agencyData) {
        setAgency(agencyData);
        // getTripsByAgency retourne une PaginatedResponse, on prend le contenu
        setTrips(tripsResponse?.content || []);
      } else {
        setError("Agence introuvable.");
      }
    } catch (err) {
      setError("Erreur lors du chargement des détails.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    agency,
    trips,
    isLoading,
    error,
    refetch: () => fetchDetails(agencyId),
  };
}