import { useState, useEffect } from "react";
import { useBusStation } from "@/context/Provider";
import { getAgencyByChefId } from "@/lib/services/agency-service";
// import { getFeedbacksByAgency } from "@/lib/services/feedback-service"; // À créer plus tard
import { Feedback } from "@/lib/types/dashboard";

// DONNÉES TEMPORAIRES (À supprimer une fois l'endpoint /feedbacks/agence/{id} disponible)
const MOCK_FEEDBACKS: Feedback[] = [
    {
        id: "fb-1",
        customerName: "Claire Durand",
        tripName: "Safari à Waza",
        rating: 5,
        comment: "Une expérience inoubliable ! Le guide était fantastique et l'organisation parfaite.",
        date: "2025-05-23",
    },
    {
        id: "fb-2",
        customerName: "Lucas Bernard",
        tripName: "Safari à Waza",
        rating: 4,
        comment: "Très bon voyage. Juste un petit bémol sur le confort du véhicule pour les longs trajets.",
        date: "2025-05-24",
    },
];

export function useFeedbackPage() {
    const { userData } = useBusStation();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            // On attend que l'utilisateur soit chargé
            if (!userData?.userId) return;

            setIsLoading(true);
            try {
                // 1. Récupération de l'agence liée à l'utilisateur
                const agency = await getAgencyByChefId(userData.userId);

                if (agency?.agencyId) {
                    // ------------------------------------------------------------
                    // TODO: DÉCOMMENTER CECI QUAND LE BACKEND AURA CRÉÉ L'ENDPOINT
                    // const data = await getFeedbacksByAgency(agency.agencyId);
                    // setFeedbacks(data);
                    // ------------------------------------------------------------

                    // En attendant, on simule un délai réseau et on renvoie les données mockées
                    console.warn("[useFeedbackPage] Endpoint manquant : Utilisation de données fictives.");
                    setTimeout(() => {
                        setFeedbacks(MOCK_FEEDBACKS);
                        setIsLoading(false);
                    }, 800);
                } else {
                    setError("Aucune agence trouvée pour cet utilisateur.");
                    setIsLoading(false);
                }
            } catch (err) {
                console.error(err);
                setError("Impossible de charger les avis clients.");
                setIsLoading(false);
            }
        };

        fetchFeedbacks();
    }, [userData]);

    return {
        feedbacks,
        isLoading,
        error
    };
}