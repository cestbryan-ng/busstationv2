import { useState, useEffect } from "react";
import { GareRoutiere } from "@/lib/types/gares-routiere"; // type frontend
import { GareRoutiereDetail } from "@/lib/types/models/GareRoutiere"; // type backend
import { TravelAgency } from "@/lib/types/models/Agency";
import { Trip } from "@/lib/types/models/Trip";
// 1. On change les imports ici pour prendre les fonctions de filtrage
import {
  getGareById,
  getAgencesByGareId,
  getDepartsByGareId,
} from "@/lib/services/gare-service";

export function useGareDetails(gareId: string) {
  const [gare, setGare] = useState<GareRoutiere | null>(null);
  const [agences, setAgences] = useState<TravelAgency[]>([]);
  const [departs, setDeparts] = useState<Trip[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gareId) {
      fetchFullDetails(gareId);
    }
  }, [gareId]);

  async function fetchFullDetails(id: string) {
    setIsLoading(true);
    setError(null);
    try {
      // 2. On passe l'ID aux fonctions de récupération
      const [gareData, agencesData, departsData] = await Promise.all([
        getGareById(id),
        getAgencesByGareId(id), // Récupère uniquement les agences de CETTE gare
        getDepartsByGareId(id), // Récupère uniquement les départs de CETTE gare
      ]);

      if (gareData) {
        const mapped: GareRoutiere = {
          id: gareData.idGareRoutiere,
          nom: gareData.nomGareRoutiere,
          ville: gareData.ville,
          quartier: gareData.quartier,
          adresse: gareData.adresse,
          description: gareData.description,
          imageUrl: gareData.photoUrl,
          services: gareData.services,
          nbAgencesAffiliees: gareData.nbreAgence,
          horaires: gareData.horaires,
          estOuvert: null, 
          localisation: {
            latitude: 0,
            longitude: 0,
          },
        };
        setGare(mapped);
        setAgences(agencesData || []);
        setDeparts(departsData || []);
      } else {
        setError("Gare introuvable.");
      }
    } catch (err) {
      setError("Erreur lors du chargement des données.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    gare,
    agences,
    departs,
    isLoading,
    error,
    refetch: () => fetchFullDetails(gareId),
  };
}
