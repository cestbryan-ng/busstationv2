// src/components/dashboard/settings/ProfileSettings.tsx
"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useProfileSettings } from "@/lib/hooks/dasboard/useProfileSettings";
import Loader from "@/modals/Loader";

const ProfileSettings = () => {
    const { t } = useTranslation();
    const {
        form,
        isLoading,
        isSubmitting,
        apiError,
        successMessage,
        onSubmit,
    } = useProfileSettings();

    const { register, handleSubmit, formState: { errors } } = form;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">

                {/* Feedback erreur */}
                {apiError && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-700 font-medium">{apiError}</p>
                    </div>
                )}

                {/* Feedback succès */}
                {successMessage && (
                    <div className="flex items-center gap-2 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <p className="text-sm text-green-700 font-medium">{successMessage}</p>
                    </div>
                )}

                {/* Nom de l'agence */}
                <div>
                    <label htmlFor="longName" className="block text-sm font-medium text-gray-700">
                        Nom de l&apos;agence
                    </label>
                    <input
                        type="text"
                        id="longName"
                        {...register("longName")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                    {errors.longName && (
                        <p className="mt-1 text-xs text-red-500">{errors.longName.message}</p>
                    )}
                </div>

                {/* Email de contact */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email de contact
                    </label>
                    <input
                        type="email"
                        id="email"
                        {...register("email")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Message d'accueil */}
                <div>
                    <label htmlFor="greetingMessage" className="block text-sm font-medium text-gray-700">
                        Message d&apos;accueil
                    </label>
                    <textarea
                        id="greetingMessage"
                        rows={3}
                        {...register("greetingMessage")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                </div>
            </div>

            {/* Bouton submit */}
            <div className="mt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sauvegarde...
                        </>
                    ) : (
                        t("dashboard.settings.saveChanges")
                    )}
                </button>
            </div>
        </form>
    );
};

export default ProfileSettings;