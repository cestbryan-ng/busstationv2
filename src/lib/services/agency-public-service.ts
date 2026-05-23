import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";
import { TravelAgency } from "@/lib/types/models/Agency";

const URL_AGENCE_VOYAGE = "/agence";

export async function getAllPublicAgencies(): Promise<TravelAgency[]> {
    try {
        const response: AxiosResponse<{ content: TravelAgency[] }> =
            await axiosInstance.get(URL_AGENCE_VOYAGE);
        return response.data.content || [];
    } catch (error) {
        console.error("[agency-public-service] Erreur récupération agences:", error);
        throw error;
    }
}

export async function getPublicAgencyById(id: string): Promise<TravelAgency | null> {
    try {
        const response: AxiosResponse<TravelAgency> =
            await axiosInstance.get(`${URL_AGENCE_VOYAGE}/${id}`);
        return response.data ?? null;
    } catch (error) {
        console.error(`[agency-public-service] Erreur récupération agence ${id}:`, error);
        return null;
    }
}