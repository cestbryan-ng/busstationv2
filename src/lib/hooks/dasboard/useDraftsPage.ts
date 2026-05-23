import { useState, useEffect, useCallback } from 'react';
import { useBusStation } from '@/context/Provider';
import { getAgencyByChefId } from '@/lib/services/agency-service';
import { getTripsByAgency, publishTrip, deleteVoyage } from '@/lib/services/trip-service';
import { TripDetails } from "@/lib/types/models/Trip";
import {useNavigation} from "@/lib/hooks/useNavigation";

export function useDraftsPage() {

    const { userData } = useBusStation();
    const [drafts, setDrafts] = useState<TripDetails[]>([]);
    const [agencyId, setAgencyId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);


    const [canOpenConfirmationModal, setCanOpenConfirmationModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [draftToDelete, setDraftToDelete] = useState<TripDetails | null>(null);


    const [canOpenPublishModal, setCanOpenPublishModal] = useState(false);
    const [publishMessage, setPublishMessage] = useState("");
    const [draftToPublish, setDraftToPublish] = useState<TripDetails | null>(null);
    const navigate = useNavigation();

    const fetchDrafts = useCallback(async (id: string) => {
        setIsLoading(true);
        setApiError(null);
        try {
            const response = await getTripsByAgency(id);
            const draftTrips = response?.content?.filter(t => t.statusVoyage === 'EN_ATTENTE') || [];
            setDrafts(draftTrips);
        } catch (error) {
            console.error(error);
            setApiError("Impossible de charger les brouillons.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userData?.userId) {
            getAgencyByChefId(userData.userId).then(agency => {
                if (agency?.agencyId) {
                    setAgencyId(agency.agencyId);
                    fetchDrafts(agency.agencyId).then(() => console.info("success"));
                } else {
                    setApiError("Agence non trouvée.");
                    setIsLoading(false);
                }
            }).catch(() => {
                setApiError("Erreur de récupération de l'agence.");
                setIsLoading(false);
            });
        }
    }, [userData, fetchDrafts]);



    function handleEdit(tripId: string): void
    {
        if (tripId)
        {
           navigate.onGoTroTripPlanningEditMode(tripId);
        } else {
            navigate.onGoToTripPlanning();
        }
    }


    function openConfirmModal(draft: TripDetails): void {
        if (draft && draft.idVoyage) {
            setConfirmationMessage(`Êtes-vous sûr de vouloir supprimer le brouillon "${draft.titre}" ?`);
            setDraftToDelete(draft);
            setCanOpenConfirmationModal(true);
        } else {
            setConfirmationMessage("");
            setApiError("Une erreur est survenue, veuillez réessayer plus tard");
        }
    }


    function openPublishModal(draft: TripDetails): void {
        if (draft && draft.idVoyage) {
            setPublishMessage(`Voulez-vous publier le voyage "${draft.titre}" ? Il sera visible par tous les clients.`);
            setDraftToPublish(draft);
            setCanOpenPublishModal(true);
        } else {
            setPublishMessage("");
            setApiError("Une erreur est survenue, veuillez réessayer plus tard");
        }
    }


    async function handleDelete(): Promise<void> {
        if (!draftToDelete || !draftToDelete.idVoyage) return;

        // On rend le composant réactif immédiatement pour une meilleure UX
        setDrafts(prev => prev.filter(d => d.idVoyage !== draftToDelete.idVoyage));
        setCanOpenConfirmationModal(false);

        try {
            await deleteVoyage(draftToDelete.idVoyage);
        } catch (error) {
            console.error(error);
            setApiError("Erreur lors de la suppression. Le brouillon pourrait réapparaître.");
            // Si l'API échoue, on recharge la liste pour être synchro avec le backend
            if (agencyId) {
                await fetchDrafts(agencyId);
            }
        } finally {
            setDraftToDelete(null); // Nettoyage
        }
    }


    async function handlePublish(): Promise<void> {
        if (!agencyId || !draftToPublish || !draftToPublish.idVoyage) return;

        setIsLoading(true);
        setApiError(null);

        try {
            await publishTrip(draftToPublish.idVoyage);
            await fetchDrafts(agencyId); // Recharge la liste pour que le brouillon disparaisse
            setCanOpenPublishModal(false);
        } catch (error) {
            console.error(error);
            setApiError("Erreur lors de la publication, veuillez réessayer plus tard");
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        apiError,
        drafts,
        handleEdit,
        handlePublish,
        handleDelete,
        canOpenConfirmationModal,
        setCanOpenConfirmationModal,
        confirmationMessage,
        openConfirmModal,
        canOpenPublishModal,
        setCanOpenPublishModal,
        publishMessage,
        openPublishModal
    };
}