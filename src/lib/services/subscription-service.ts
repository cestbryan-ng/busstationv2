// src/lib/services/subscription-service.ts
import { AxiosResponse } from "axios";
import axiosInstance from "./axios-services/axiosInstance";

export interface SubscriptionPlanDTO {
    idPlan: string;
    name: string;
    price: number;
    features: string[];
    isCurrent: boolean;
    idAgenceVoyage: string;
}

export interface BillingHistoryDTO {
    idFacture: string;
    date: string;
    amount: number;
    status: "paid" | "pending" | "failed"; 
    idAgenceVoyage: string;
}

// 📢 Endpoint manquant — fallback sur données fictives jusqu'à disponibilité
export async function getAgencyPlans(agencyId: string): Promise<SubscriptionPlanDTO[]> {
    const response: AxiosResponse<SubscriptionPlanDTO[]> = await axiosInstance.get(
        `/abonnement/plans/agence/${agencyId}`
    );
    return response.data;
}

// 📢 Endpoint manquant — fallback sur données fictives jusqu'à disponibilité
export async function getBillingHistory(agencyId: string): Promise<BillingHistoryDTO[]> {
    const response: AxiosResponse<BillingHistoryDTO[]> = await axiosInstance.get(
        `/facturation/agence/${agencyId}`
    );
    return response.data;
}