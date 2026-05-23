"use client";

import { useRouter } from "next/navigation";
import AgencyProfile from "@/components/agencies-page-components/AgencyProfile";
import { ArrowLeft, Frown } from "lucide-react";
import Link from "next/link";
import React, { use } from "react";
import { useAgencyPublicDetails } from "@/lib/hooks/agency-public-hooks/useAgencyPublicDetails";
import Loader from "@/modals/Loader";

export default function AgencyDetailPage({
  params,
}: {
  params: Promise<{ agencyId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);

  // L'ID doit correspondre à 'agencyId' dans ton fichier db.json (ex: "agency-01")
  const agencyId = resolvedParams.agencyId;

  const { agency, trips, isLoading, error } = useAgencyPublicDetails(agencyId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader message="Chargement du profil de l'agence..." />
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-20">
        <Frown className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Agence non trouvée</h2>
        <p className="text-gray-500 mt-2">
          {error || "L'agence demandée n'existe pas."}
        </p>
        <div className="mt-4 text-xs text-gray-400">
          ID recherché : {agencyId}
        </div>
        <Link href="/agency">
          <button className="mt-6 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste des agences
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AgencyProfile
        agency={agency}
        trips={trips}
        agencyId={agencyId}
        onBack={() => router.back()}
      />
    </div>
  );
}
