// src/app/(customer-view)/agency/page.tsx
"use client";

import { useState } from "react";
import AgencyCard from "@/components/agencies-page-components/AgencyCard";
import { Search, Globe, AlertCircle, RefreshCw } from "lucide-react";
import { useAgencies } from "@/lib/hooks/agency-public-hooks/useAgencies";
import Loader from "@/modals/Loader";

export default function AgenciesPage() {
  const { agencies, isLoading, error, searchQuery, setSearchQuery, refetch } =
    useAgencies();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader message="Chargement des agences..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
        >
          <RefreshCw size={16} /> Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* En-tête de la page */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Explorez Nos Agences Partenaires
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Découvrez des experts du voyage pour des aventures inoubliables.
        </p>
      </div>
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une agence..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition"
        />
      </div>

      {/* Grille des agences */}
      {agencies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {agencies.map((agency) => (
            <AgencyCard key={agency.id ?? agency.agencyId} agency={agency} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Aucune agence trouvée
          </h3>
        </div>
      )}
    </div>
  );
}
