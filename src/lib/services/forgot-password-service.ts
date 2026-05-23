// src/lib/services/forgot-password-service.ts
import axiosInstance from "./axios-services/axiosInstance";

//Endpoint manquant — fallback sur simulation jusqu'à disponibilité
export async function requestPasswordReset(email: string): Promise<void> {
    await axiosInstance.post(`/utilisateur/reset-password`, { email });
}