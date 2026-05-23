// src/lib/hooks/dasboard/useProfileSettings.ts
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBusStation } from "@/context/Provider";
import { getAgencyByChefId } from "@/lib/services/agency-service";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";

const profileSettingsSchema = z.object({
    longName: z.string().min(1, "Le nom de l'agence est requis"),
    email: z.string().email("Email invalide"),
    greetingMessage: z.string().optional(),
});

export type ProfileSettingsFormType = z.infer<typeof profileSettingsSchema>;

export function useProfileSettings() {
    const { userData, isLoading: isUserLoading } = useBusStation();
    const [agencyId, setAgencyId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const form = useForm<ProfileSettingsFormType>({
        resolver: zodResolver(profileSettingsSchema),
    });

    // Chargement des données de l'agence au montage
    useEffect(() => {
        const initialize = async () => {
            if (isUserLoading || !userData?.userId) return;
            setIsLoading(true);
            setApiError(null);
            try {
                const agency = await getAgencyByChefId(userData.userId);
                if (agency?.agencyId) {
                    setAgencyId(agency.agencyId);
                    // Pré-remplissage des champs avec les vraies données
                    form.reset({
                        longName: agency.longName || '',
                        email: agency.contact?.email || '',
                        greetingMessage: agency.greetingMessage || '',
                    });
                } else {
                    setApiError("Aucune agence associée à votre compte.");
                }
            } catch (error) {
                console.error(error);
                setApiError("Erreur lors du chargement des informations de l'agence.");
            } finally {
                setIsLoading(false);
            }
        };
        initialize();
    }, [userData, isUserLoading, form]);

    async function onSubmit(data: ProfileSettingsFormType): Promise<void> {
        if (!agencyId) {
            setApiError("ID de l'agence introuvable.");
            return;
        }
        setIsSubmitting(true);
        setApiError(null);
        setSuccessMessage(null);

        try {
            await axiosInstance.patch(`/agence/${agencyId}`, {
                longName: data.longName,
                greetingMessage: data.greetingMessage,
                contact: {
                    email: data.email,
                },
            });
            setSuccessMessage("Informations mises à jour avec succès.");
        } catch (error) {
            console.error(error);
            setApiError("Erreur lors de la mise à jour. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        form,
        isLoading,
        isSubmitting,
        apiError,
        successMessage,
        onSubmit,
    };
}