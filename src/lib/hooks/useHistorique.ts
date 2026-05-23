// src/lib/hooks/useHistorique.ts
import { useState, useEffect } from "react";
import { useBusStation } from "@/context/Provider";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";

// DTO backend brut
export interface HistoriqueDTO {
    idHistorique: string;
    statusHistorique: string;
    dateReservation: string;
    dateConfirmation: string;
    dateAnnulation: string;
    causeAnnulation: string;
    origineAnnulation: string;
    tauxAnnulation: number;
    compensation: number;
    idReservation: string;
}

// DTO réservation enrichie
export interface ReservationDetailsDTO {
    idReservation: string;
    lieuDepart: string;
    lieuArrive: string;
    pointDeDepart: string;
    pointArrivee: string;
    heureDepart: string;
    heureArrive: string;
    dateDepart: string;
    nomAgence: string;
    statusVoyage: string;
    passagers: {
        nom: string;
        telephone: string;
        carteID: string;
        age: number;
        genre: string;
        siege: string;
        prixBillet: number;
    }[];
}

// DTO enrichi combiné
export interface HistoriqueEnrichi extends HistoriqueDTO {
    reservation: ReservationDetailsDTO | null;
}

async function getHistoriqueByUser(userId: string): Promise<HistoriqueDTO[]> {
    const response = await axiosInstance.get(`/historique/reservation/${userId}`);
    return response.data || [];
}

async function getReservationById(reservationId: string): Promise<ReservationDetailsDTO | null> {
    try {
        const response = await axiosInstance.get(`/reservation/${reservationId}`);
        return response.data;
    } catch {
        return null;
    }
}

export function useHistorique() {
    const { userData, isLoading: isUserLoading } = useBusStation();
    const [historiques, setHistoriques] = useState<HistoriqueEnrichi[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistorique = async () => {
            if (isUserLoading || !userData?.userId) return;
            setIsLoading(true);
            setError(null);
            try {
                // Étape 1 : récupérer les historiques
                const data = await getHistoriqueByUser(userData.userId);

                // Étape 2 : enrichir chaque historique via GET /reservation/{id}
                // Fallback Option B — à remplacer quand backend enrichit directement
                const enriched = await Promise.all(
                    data.map((h) =>
                        getReservationById(h.idReservation)
                            .then((r) => ({ ...h, reservation: r }))
                            .catch(() => ({ ...h, reservation: null }))
                    )
                );
                setHistoriques(enriched);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger votre historique.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistorique();
    }, [userData, isUserLoading]);

    // Séparation réservations / annulations
    const reservations = historiques.filter(
        (h) => h.statusHistorique !== "ANNULE"
    );
    const annulations = historiques.filter(
        (h) => h.statusHistorique === "ANNULE"
    );

    return { historiques, reservations, annulations, isLoading, error };
}