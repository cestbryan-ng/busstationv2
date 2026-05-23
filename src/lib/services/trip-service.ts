import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";
import { Trip, TripDetails } from "@/lib/types/models/Trip";
import { PaginatedResponse } from "../types/common";
import { TripAxiosResponseInterface } from "@/lib/types/models/Trip";
import { Voyage, VoyageCreateRequestDTO, VoyageDetailsDTO } from "../types/generated-api";

// Correction 4 : slash initial cohérent
const url: string = "/voyage";

export async function retrieveAllTrips(): Promise<TripAxiosResponseInterface | null> {
    try {
        const apiResponse: AxiosResponse<TripAxiosResponseInterface> =
            await axiosInstance.get(`${url}`);
        if (apiResponse.status === 200) return apiResponse.data;
        console.warn("Unattended http code", apiResponse.status);
        return null;
    } catch (error) {
        console.error("error during retrieving trips", error);
        throw new Error("error during retrieving trips");
    }
}

export async function retrieveTripDetail(tripId: string): Promise<Trip | null> {
    if (!tripId || tripId === "") throw new Error("the trip id must not be empty");
    try {
        const apiResponse: AxiosResponse<Trip> =
            await axiosInstance.get(`${url}/byId/${tripId}`);
        if (apiResponse.status === 200) return apiResponse.data;
        console.warn("Unattended http code", apiResponse.status);
        return null;
    } catch (error) {
        console.error("error during retrieving trip detail", error);
        throw new Error("error during retrieving trip detail");
    }
}

export async function createTrip(data: VoyageCreateRequestDTO): Promise<Voyage | null> {
    try {
        // Correction 4 : slash initial ajouté
        const response: AxiosResponse<Voyage> =
            await axiosInstance.post(`${url}/create`, data);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("[trip-service] Erreur création voyage:", axiosError.response?.data || axiosError.message);
        throw axiosError;
    }
}

export async function updateTrip(
    id: string,
    data: Partial<VoyageCreateRequestDTO>
): Promise<Voyage | null> {
    try {
        //Correction 4 : slash initial ajouté
        const response: AxiosResponse<Voyage> =
            await axiosInstance.put(`${url}/${id}`, data);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error(`[trip-service] Erreur mise à jour voyage ${id}:`, axiosError.response?.data || axiosError.message);
        throw axiosError;
    }
}

export async function getTripsByAgency(
    agencyId: string
): Promise<PaginatedResponse<TripDetails> | null> {
    if (!agencyId) return null;
    try {
        //Correction 4 : slash initial ajouté
        const response: AxiosResponse<PaginatedResponse<TripDetails>> =
            await axiosInstance.get(`${url}/agence/${agencyId}/public`);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("[trip-service] Erreur récupération voyages agence:", axiosError.response?.data || axiosError.message);
        throw axiosError;
    }
}

export async function publishTrip(tripId: string): Promise<Voyage | null> {
    return await updateTrip(tripId, { statusVoyage: 'PUBLIE' });
}

export async function getTripDetailsForEdit(tripId: string): Promise<VoyageDetailsDTO> {
    try {
        // Correction 4 : slash initial ajouté
        const response: AxiosResponse<VoyageDetailsDTO> =
            await axiosInstance.get(`${url}/byId/${tripId}`);
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
}

export async function deleteVoyage(tripId: string): Promise<void> {
    try {
        //Correction 4 : slash initial ajouté
        await axiosInstance.delete(`${url}/${tripId}`);
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error(`[trip-service] Erreur suppression voyage ${tripId}:`, axiosError.response?.data || axiosError.message);
        throw axiosError;
    }
}