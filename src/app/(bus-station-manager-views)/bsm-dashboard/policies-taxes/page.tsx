"use client";

import React from "react";
import { usePoliciesAndTaxes } from "@/lib/hooks/usePoliciesAndTaxes";
import PoliciesAndTaxesList from "@/components/bus-station-dashboard/policies-taxes/PoliciesAndTaxesList";
import Loader from "@/modals/Loader";
import { AlertCircle, RefreshCw } from "lucide-react";

const PoliciesTaxesPage = () => {
    const { policiesAndTaxes, loading, error } = usePoliciesAndTaxes();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <p className="text-sm font-semibold text-slate-800">Erreur de chargement</p>
                <p className="text-xs font-normal text-slate-400 mt-1 max-w-xs">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <PoliciesAndTaxesList policiesAndTaxes={policiesAndTaxes} />
        </div>
    );
};

export default PoliciesTaxesPage;