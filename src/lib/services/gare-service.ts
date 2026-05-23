import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";
import { GareRoutiere, GareRoutiereDetail, Service } from "@/lib/types/models/GareRoutiere";
import { TravelAgency } from "@/lib/types/models/Agency";
import { Trip } from "@/lib/types/models/Trip";
import { PaginatedResponse } from "@/lib/types/models/PaginatedResponse";

const BASE_URL_GARE = "/gare";
const BASE_URL_AGENCE = "/agence";
const BASE_URL_VOYAGE = "/voyage"; 

/**
 * Récupère la liste de toutes les gares routières.
 */
export async function getAllGares(
    selectedServices: Service[] = []
): Promise<GareRoutiere[] | null> {
    try {
        const params: { services?: string } = {};
        if (selectedServices.length > 0) {
            params.services = selectedServices.join(',');
        }
        const response: AxiosResponse<PaginatedResponse<GareRoutiereDetail>> =
            await axiosInstance.get(BASE_URL_GARE, { params });

        if (response.status === 200) {
            return response.data.content.map((g) => ({
                id: g.idGareRoutiere,
                nom: g.nomGareRoutiere,
                ville: g.ville,
                quartier: g.quartier,
                adresse: g.adresse,
                description: g.description,
                imageUrl: g.photoUrl,
                services: g.services,
                nbAgencesAffiliees: g.nbreAgence,
                estOuvert: null,
                horaires: g.horaires,
                localisation: { latitude: 0, longitude: 0 },
            }));
        }
        return null;
    } catch (error) {
        console.error("[GareService] Erreur récupération gares:", error);
        throw error;
    }
}

/**
 * Récupère les détails d'une gare routière par son ID.
 */
export async function getGareById(id: string): Promise<GareRoutiereDetail | null> {
    if (!id) throw new Error("L'ID de la gare est requis");
    try {
        const response: AxiosResponse<GareRoutiereDetail> =
            await axiosInstance.get(`${BASE_URL_GARE}/${id}`);
        if (response.status === 200) return response.data;
        console.warn("[GareService] Code HTTP inattendu:", response.status);
        return null;
    } catch (error) {
        console.error(`[GareService] Erreur récupération gare ${id}:`, error);
        throw error;
    }
}

/**
 * Récupère les agences présentes dans une gare spécifique.
 */
export async function getAgencesByGareId(
    gareId: string
): Promise<TravelAgency[] | null> {
    try {
        const response: AxiosResponse<TravelAgency[]> =
            await axiosInstance.get(`${BASE_URL_AGENCE}/gare-routiere/${gareId}`);
        if (response.status === 200) return response.data;
        return null;
    } catch (error) {
        console.error(`[GareService] Erreur getAgencesByGareId ${gareId}:`, error);
        return [];
    }
}


export async function getDepartsByGareId(
    gareId: string
): Promise<Trip[] | null> {
    try {
        const response: AxiosResponse<Trip[]> =
            await axiosInstance.get(`${BASE_URL_VOYAGE}/gare/${gareId}`);
        if (response.status === 200) return response.data;
        return [];
    } catch (error) {
        console.error(`[GareService] Erreur getDepartsByGareId ${gareId}:`, error);
        return [];
    }
}