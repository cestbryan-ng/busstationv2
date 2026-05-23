import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";
// Note: Assurez-vous que ces types existent ou adaptez-les aux types générés (GareRoutiereDTO, etc.)
import { BusStation, Agency, Trip, AffiliationTax, PolicyAndTax, BusStationManagerAccount } from "@/lib/types/bus-station";

// Plus de localhost:3001 !
// On utilise axiosInstance qui est déjà configuré.

export const getBusStationDetails = async (
  stationId: string
): Promise<BusStation> => {
  try {
    const response: AxiosResponse<BusStation> = await axiosInstance.get(`/gare/${stationId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bus station details", error);
    throw error;
  }
};

export const getAffiliatedAgencies = async (
  stationId: string
): Promise<Agency[]> => {
  try {
    // D'après le Swagger: GET /agence/gare-routiere/{gareRoutiereId}
    const response: AxiosResponse<Agency[]> = await axiosInstance.get(`/agence/gare-routiere/${stationId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch affiliated agencies", error);
    throw error;
  }
};

export const getTripsByAgencies = async (
  agencyIds: string[]
): Promise<Trip[]> => {
    // Cette fonctionnalité est complexe car elle demande de récupérer les voyages de plusieurs agences.
    // Le backend ne semble pas avoir d'endpoint "get trips by list of agency IDs".
    // Solution temporaire : retourner vide ou implémenter une boucle d'appels (déconseillé pour la perf).
    console.warn("getTripsByAgencies n'est pas encore implémenté côté backend");
    return [];
};

export const getAffiliationTaxes = async (
  stationId: string
): Promise<AffiliationTax[]> => {
   // Pas d'endpoint clair dans le Swagger pour "Affiliation Taxes" spécifique.
   // Peut-être lié à /politique-et-taxes ?
   console.warn("getAffiliationTaxes endpoint non trouvé dans le Swagger");
   return [];
};

export const getPoliciesAndTaxes = async (
  stationId: string
): Promise<PolicyAndTax[]> => {
  try {
      // D'après le Swagger: GET /politique-et-taxes/gare-routiere/{gareRoutiereId}
      const response: AxiosResponse<PolicyAndTax[]> = await axiosInstance.get(`/politique-et-taxes/gare-routiere/${stationId}`);
      return response.data;
  } catch (error) {
      console.error("Failed to fetch policies and taxes", error);
      throw error;
  }
};

export const getBusStationManagerAccount = async (
  busStationId: string
): Promise<BusStationManagerAccount> => {
    // Pas d'endpoint clair.
    console.warn("getBusStationManagerAccount endpoint non trouvé dans le Swagger");
    throw new Error("Endpoint not implemented");
};

/**
 * Récupère les détails d'une gare routière à partir de l'ID de son manager.
 */
export const getStationByManagerId = async (
  managerId: string
): Promise<BusStation> => {
  try {
    const response: AxiosResponse<BusStation> = await axiosInstance.get(`/gare/manager/${managerId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bus station by manager ID", error);
    throw error;
  }
};

export async function getBusStationByManagerId(
    managerId: string
): Promise<BusStation | null> {
    try {
        const response: AxiosResponse<BusStation> = await axiosInstance.get(
            `/gare/manager/${managerId}`
        );
        return response.data;
    } catch (error) {
        console.error(`[bus-station-service] Erreur récupération gare manager ${managerId}:`, error);
        throw error;
    }
}