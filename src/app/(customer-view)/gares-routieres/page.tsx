"use client";

import React from "react";
import HeroSection from "@/components/bus-stations-page-components/HeroSection";
import SearchBar from "@/components/bus-stations-page-components/SearchBar";
import FilterBadges from "@/components/bus-stations-page-components/FilterBadges";
import StationCard from "@/components/bus-stations-page-components/StationCard";
import { useGaresRoutieres } from "@/lib/hooks/gare-hooks/useGaresRoutieres";
import Loader from "@/modals/Loader";
import { AlertCircle, RefreshCw } from "lucide-react";

const GaresRoutieresPage = () => {
  const {
    gares,
    isLoading,
    error,
    setSearchQuery,
    selectedServices,
    handleServiceToggle,
    allServices,
    refetch,
  } = useGaresRoutieres();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader message="Chargement des gares..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-center px-4">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <AlertCircle size={48} className="text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={20} />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <HeroSection />

      <div className="mt-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <SearchBar
            onSearchChange={setSearchQuery}
            placeholder="Chercher par nom de gare ou par ville..."
          />
          <div className="text-sm text-gray-500 font-medium">
            {gares.length} gare(s) trouvée(s)
          </div>
        </div>

        {allServices.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              Filtrer par services :
            </h2>
            <FilterBadges
              services={allServices}
              selectedServices={selectedServices}
              onServiceToggle={handleServiceToggle}
            />
          </div>
        )}
      </div>

      <div className="mt-8">
        {gares.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gares.map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun résultat
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos filtres ou votre recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GaresRoutieresPage;
