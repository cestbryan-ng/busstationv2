import { AxiosResponse } from "axios";
import axiosInstance from "./axios-services/axiosInstance";
import { TravelAgencyFormType } from "@/lib/types/schema/travelAgencySchema";
import { TravelAgency } from "@/lib/types/models/Agency";

export async function createAgency(
    data: TravelAgencyFormType
): Promise<TravelAgency | null> {
    try {
        const response: AxiosResponse<TravelAgency> = await axiosInstance.post(
            "/agence",
            data
        );
        if (response.status === 201 || response.status === 200) {
            console.log(response);
            return response.data;
        } else {
            console.warn("Unattended HTTP code", response.status, response.data);
            return null;
        }
    } catch (error) {
        console.error("Error when creating the agency", error);
        throw error;
    }
}

export async function getAgencyByChefId(
    chefId: string
): Promise<TravelAgency | null> {
    if (!chefId) {
        console.error("[agency-service] ID du chef d'agence manquant.");
        return null;
    }
    try {
        const response: AxiosResponse<TravelAgency> = await axiosInstance.get(
            `/agence/chef-agence/${chefId}`
        );
        if (response.status === 200) return response.data;
        if (response.status === 404) return null;
        return null;
    } catch (error) {
        console.error(`[agency-service] Erreur récupération agence chef ${chefId}:`, error);
        throw error;
    }
}

export async function updateAgencyDetails(
    agencyId: string,
    data: Partial<TravelAgency>
): Promise<TravelAgency | null> {
    try {
        // ✅ PATCH et non PUT — conforme au Swagger
        const response: AxiosResponse<TravelAgency> = await axiosInstance.patch(
            `/agence/${agencyId}`,
            data
        );
        if (response.status === 200) return response.data;
        return null;
    } catch (error) {
        console.error(`[agency-service] Erreur mise à jour agence ${agencyId}:`, error);
        throw error;
    }
}