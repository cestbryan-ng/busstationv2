"use client";

import React from "react";
import { useBusStationManager } from "@/lib/hooks/useBusStationManager";
import InfrastructureForm from "@/components/bus-station-dashboard/infrastructure/InfrastructureForm";
import Loader from "@/modals/Loader";
import { AlertCircle, RefreshCw } from "lucide-react";

const InfrastructurePage = () => {
    const { station, loading, error } = useBusStationManager();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
                <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                <h3 className="mt-2 text-lg font-semibold">Erreur de chargement</h3>
                <p className="mt-1 text-sm">
                    Une erreur est survenue lors du chargement des données de la gare.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl flex items-center gap-2 mx-auto hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    <RefreshCw className="h-4 w-4" /> Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {station && <InfrastructureForm station={station} />}
        </div>
    );
};

export default InfrastructurePage;