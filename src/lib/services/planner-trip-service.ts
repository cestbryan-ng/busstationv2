// src/lib/services/planner-trip-service.ts
import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";
import { PlannerTrip } from "@/lib/types/models/Trip";

const url: string = "/ligne-service";

export async function getPlannerTripsByAgencyId(agencyId: string): Promise<PlannerTrip[]> {
    if (!agencyId || agencyId === "") throw new Error("l'ID de l'agence ne doit pas être vide");
    try {
        const response: AxiosResponse<PlannerTrip[]> =
            await axiosInstance.get(`${url}/public/agence/${agencyId}`);
        if (response.status === 200) return response.data;
        console.warn("Code HTTP inattendu", response.status);
        return [];
    } catch (error) {
        console.error("Erreur lors de la récupération des lignes de l'agence", error);
        throw new Error("Erreur lors de la récupération des lignes de l'agence");
    }
}

export async function createPlannerTrip(tripData: Omit<PlannerTrip, 'id'>): Promise<PlannerTrip | null> {
    try {
        const response: AxiosResponse<PlannerTrip> =
            await axiosInstance.post(`${url}/create`, tripData);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("[ligne-service] Erreur création ligne:", axiosError.response?.data || axiosError.message);
        throw axiosError;
    }
}

export async function updatePlannerTrip(
    tripId: string,
    dataToUpdate: Partial<PlannerTrip>
): Promise<PlannerTrip | null> {
    try {
        const response: AxiosResponse<PlannerTrip> =
            await axiosInstance.patch(`${url}/${tripId}`, dataToUpdate);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error(`[ligne-service] Erreur mise à jour ligne ${tripId}:`, axiosError.response?.data || axiosError.message);
        throw axiosError;
    }
}

export async function deletePlannerTrip(tripId: string): Promise<void> {
    try {
        await axiosInstance.delete(`${url}/${tripId}`);
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error(`[ligne-service] Erreur suppression ligne ${tripId}:`, axiosError.response?.data || axiosError.message);
        throw axiosError;
    }
}