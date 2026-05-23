"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Loader from "@/modals/Loader";
import DetailHeader from "@/components/bus-station-detail-page-components/DetailHeader";
import ServicesSection from "@/components/bus-station-detail-page-components/ServicesSection";
import TabsSection from "@/components/bus-station-detail-page-components/TabsSection";
import { useGareDetails } from "@/lib/hooks/gare-hooks/useGareDetails";

type GareDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

const GareDetailPage = ({ params }: GareDetailProps) => {
  const resolvedParams = use(params);
  const router = useRouter();

  // Utilisation du hook qui récupère le json-server
  const { gare, agences, departs, isLoading, error } = useGareDetails(
    resolvedParams.id
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader message="Chargement des informations..." />
      </div>
    );
  }

  if (error || !gare) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-center px-4">
        <AlertCircle size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Impossible d'afficher la gare
        </h2>
        <p className="text-gray-500 mb-6">
          {error || "La gare demandée n'existe pas."}
        </p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={20} />
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Bouton retour mobile */}
      <button
        onClick={() => router.back()}
        className="md:hidden flex items-center text-gray-600 mb-4"
      >
        <ArrowLeft size={20} className="mr-2" />
        Retour
      </button>

      <DetailHeader station={gare} />

      <ServicesSection services={gare.services} />

      {/* Les données passées ici viennent maintenant du serveur JSON */}
      <TabsSection station={gare} agences={agences} departs={departs} />

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Emplacement</h2>
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden relative h-100">
          <div className="relative w-full h-full">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={`https://maps.google.com/maps?q=${gare.localisation.latitude},${gare.localisation.longitude}&z=15&output=embed`}
              className="absolute inset-0"
            />

            {/* Marqueur clignotant par-dessus */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-12 h-12 bg-red-500 rounded-full animate-ping opacity-75"></div>
              <div className="absolute top-0 left-0 w-12 h-12 bg-red-600 rounded-full border-4 border-white shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GareDetailPage;