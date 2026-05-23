import { useState, useEffect, useMemo } from "react";
import { GareRoutiere, Service } from "@/lib/types/models/GareRoutiere"; // Import Service
import { getAllGares } from "@/lib/services/gare-service";

const ALL_POSSIBLE_SERVICES: Service[] = ["WIFI", "PARKING", "RESTAURATION", "SALLE_ATTENTE", "TOILETTES", "SECURITE"];

export function useGaresRoutieres() {
  const [gares, setGares] = useState<GareRoutiere[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // États de filtrage
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState<Service[]>([]); // Use Service[]

  useEffect(() => {
    fetchGares(selectedServices); // Pass selectedServices
  }, [selectedServices]); // Depend on selectedServices

  async function fetchGares(servicesToFilter: Service[] = []) { // Accept servicesToFilter
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllGares(servicesToFilter); // Pass servicesToFilter
      if (data) {
        setGares(data);
      } else {
        setGares([]);
        setError("Impossible de récupérer les données des gares.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors du chargement des gares.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleServiceToggle = (service: Service) => { // Use Service
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const filteredGares = useMemo(() => {
    return gares.filter((gare) => {
        const matchesQuery =
            (gare.nom ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (gare.ville ?? '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesQuery;
    });
  }, [gares, searchQuery]);


  return {
    gares: filteredGares,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedServices,
    handleServiceToggle,
    allServices: ALL_POSSIBLE_SERVICES, // Provide all possible services
    refetch: () => fetchGares(selectedServices), // Refetch with current selected services
  };
}