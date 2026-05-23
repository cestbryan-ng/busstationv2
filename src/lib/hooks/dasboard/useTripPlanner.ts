import React, { useState, useEffect, useCallback } from "react";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from 'next/navigation';
import { TripPlannerFormType, tripPlannerSchema } from "@/lib/types/schema/tripSchema";
import { useBusStation } from "@/context/Provider";
import { getAgencyByChefId } from "@/lib/services/agency-service";
import { createTrip, updateTrip, getTripDetailsForEdit } from "@/lib/services/trip-service";
import { getVehiclesByAgency } from "@/lib/services/vehicule-service";
import { getDriversByAgency } from "@/lib/services/chauffeur-service";
import { getAllClassVoyagesByAgence } from "@/lib/services/class-voyage-service";
import { Vehicule, VoyageCreateRequestDTO, ClassVoyage } from "@/lib/types/generated-api";
import { Customer } from "@/lib/types/models/BusinessActor";
import { Amenity } from "@/lib/types/generated-api/models/VoyageCreateRequestDTO";

type ResourceState<T> = {
    data: T[];
    isLoading: boolean;
    error: string | null;
};

const normalizeTime = (time: string): string => {
    if (!time) return time;
    return time.length >= 5 ? time.slice(0, 5) : time;
};

const toISODateTime = (date: string, time: string): string => {
    const t = normalizeTime(time);
    return `${date}T${t}:00`; // Format ISO local simplifié souvent suffisant, ou ajoutez 'Z' si besoin UTC
};

const getAxiosErrorMessage = (error: unknown): string | null => {
    const err = error as AxiosError<{ message?: string }>
    const status = err?.response?.status
    const message = err?.response?.data?.message || err?.message
    if (!status && !message) return null

    if (status) {
        return `Erreur API (${status})${message ? `: ${message}` : ""}`
    }
    return message || null
}

export function useTripPlanner() {
    const { userData, isLoading: isUserLoading } = useBusStation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editingTripId = searchParams.get('edit');

    const [agencyId, setAgencyId] = useState<string | null>(null);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const [vehicles, setVehicles] = useState<ResourceState<Vehicule>>({ data: [], isLoading: true, error: null });
    const [drivers, setDrivers] = useState<ResourceState<Customer>>({ data: [], isLoading: true, error: null });
    const [travelClasses, setTravelClasses] = useState<ResourceState<ClassVoyage>>({ data: [], isLoading: true, error: null });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formApiError, setFormApiError] = useState<string | null>(null);

    const form = useForm<TripPlannerFormType>({ resolver: zodResolver(tripPlannerSchema) });

    const loadResource = useCallback(async <T>(fetcher: () => Promise<T[] | null>, setter: React.Dispatch<React.SetStateAction<ResourceState<T>>>, resourceName: string) => {
        setter(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const data = await fetcher();
            setter({ data: data || [], isLoading: false, error: null });
        } catch (error) {
            console.error(`Erreur de chargement pour ${resourceName}:`, error);
            const detailed = getAxiosErrorMessage(error)
            setter({ data: [], isLoading: false, error: detailed || `Échec du chargement (${resourceName}).` });
        }
    }, []);

    useEffect(() => {
        if (isUserLoading || !userData?.userId) return;

        const initialize = async () => {
            try {
                const agency = await getAgencyByChefId(userData.userId);
                if (!agency?.agencyId) {
                    setFormApiError("Agence non trouvée.");
                    setIsPageLoading(false);
                    return;
                }

                setAgencyId(agency.agencyId);
                form.setValue("agenceVoyageId", agency.agencyId);

                await Promise.all([
                    loadResource(() => getVehiclesByAgency(agency.agencyId), setVehicles, "véhicules"),
                    loadResource(() => getDriversByAgency(agency.agencyId), setDrivers, "chauffeurs"),
                    loadResource(() => getAllClassVoyagesByAgence(agency.agencyId), setTravelClasses, "classes"),
                ]);

                if (editingTripId) {
                    const tripDetails = await getTripDetailsForEdit(editingTripId);
                    // Remplissage du formulaire en mode édition
                    form.reset({
                        titre: tripDetails.titre,
                        description: tripDetails.description,
                        lieuDepart: tripDetails.lieuDepart,
                        pointDeDepart: tripDetails.pointDeDepart,
                        lieuArrive: tripDetails.lieuArrive,
                        pointArrivee: tripDetails.pointArrivee,
                        dateDepartPrev: tripDetails.dateDepartPrev
                            ? String(tripDetails.dateDepartPrev).split('T')[0] : "",
                        heureArrive: tripDetails.heureArrive
                            ? String(tripDetails.heureArrive).split('T')[1]?.substring(0, 5) : "",
                        heureDepartEffectif: tripDetails.heureDepartEffectif
                            ? String(tripDetails.heureDepartEffectif).split('T')[1]?.substring(0, 5) : "",
                        dateLimiteReservation: tripDetails.dateLimiteReservation
                            ? String(tripDetails.dateLimiteReservation).split('T')[0] : "",
                        dateLimiteConfirmation: tripDetails.dateLimiteConfirmation
                            ? String(tripDetails.dateLimiteConfirmation).split('T')[0] : "",
                        nbrPlaceReservable: tripDetails.nbrPlaceReservable,
                        vehiculeId: tripDetails.vehicule?.idVehicule,       // ✅ correct
                        chauffeurId: tripDetails.chauffeur?.userId,          // ✅ correct
                        classVoyageId: undefined,                            // en attente backend
                        agenceVoyageId: agency.agencyId,
                        amenities: tripDetails.amenities as unknown as Array<Amenity> | undefined,
                    });
                }
            } catch (error) {
                console.error(error);
                const detailed = getAxiosErrorMessage(error)
                setFormApiError(detailed || "Erreur d'initialisation de la page.");
            } finally {
                setIsPageLoading(false);
            }
        };

        initialize();

    }, [userData, isUserLoading, form, loadResource, editingTripId, searchParams]);

    const handleSubmitForm = async (data: TripPlannerFormType, status: 'EN_ATTENTE' | 'PUBLIE') => {
        setIsSubmitting(true);
        setFormApiError(null);

        if (status === 'PUBLIE') {
            if (!data.vehiculeId || !data.chauffeurId || !data.classVoyageId) {
                setFormApiError("Veuillez sélectionner une classe, un véhicule et un chauffeur avant de publier.");
                setIsSubmitting(false);
                return;
            }
        }

        const { nbrPlaceReservable, chauffeurId, vehiculeId, classVoyageId, ...restOfData } = data;

        // Construction propre du payload
        const payload: Partial<VoyageCreateRequestDTO> = {
            ...restOfData,
            nbrPlaceReservable,
            nbrPlaceRestante: nbrPlaceReservable,
            statusVoyage: status,
            heureArrive: toISODateTime(data.dateDepartPrev, data.heureArrive),
            heureDepartEffectif: toISODateTime(data.dateDepartPrev, data.heureDepartEffectif),
            nbrPlaceConfirm: 0,
            nbrPlaceReserve: 0,
            // TODO: actif quand backend ajoute prixClassique/prixVip dans VoyageCreateRequestDTO
            // prixClassique: data.prixClassique,
            // prixVip: data.prixVip,
        };

        if (chauffeurId) payload.chauffeurId = chauffeurId;
        if (vehiculeId) payload.vehiculeId = vehiculeId;
        if (classVoyageId) payload.classVoyageId = classVoyageId;

        try {
            if (editingTripId) {
                await updateTrip(editingTripId, payload as VoyageCreateRequestDTO);
                setSuccessMessage("Voyage mis à jour avec succès !");
            } else {
                await createTrip(payload as VoyageCreateRequestDTO);
                setSuccessMessage("Voyage créé avec succès !");
            }
            setIsSuccess(true);

            // Redirection après un court délai pour laisser le temps de voir le message
            setTimeout(() => {
                router.push(status === 'EN_ATTENTE' ? '/dashboard/drafts' : '/dashboard/marketplace');
            }, 1000);

        } catch (err) {
            console.error(err);
            setFormApiError("Une erreur est survenue lors de la sauvegarde.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        onSubmit: handleSubmitForm,
        isLoading: isPageLoading,
        isSubmitting,
        isSuccess,
        successMessage,
        formApiError,
        vehicles,
        drivers,
        travelClasses,
        isEditMode: !!editingTripId,
        setIsSuccess,
        reloadVehicles: () => {
            if (agencyId) loadResource(
                () => getVehiclesByAgency(agencyId),
                setVehicles,
                "véhicules"
            );
        },
        reloadDrivers: () => {
            if (agencyId) loadResource(
                () => getDriversByAgency(agencyId),
                setDrivers,
                "chauffeurs"
            );
        },
        reloadClasses: () => {
            if (agencyId) loadResource(
                () => getAllClassVoyagesByAgence(agencyId),
                setTravelClasses,
                "classes"
            );
        },
    };
}