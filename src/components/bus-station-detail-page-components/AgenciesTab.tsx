import React from "react";
import Image from "next/image";
import Link from "next/link";
import { TravelAgency as Agency } from "@/lib/types/models/Agency";

type AgenciesTabProps = {
  agences: Agency[];
};

const AgenciesTab = ({ agences }: AgenciesTabProps) => {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {agences.map((agence) => (
          <Link
            href={`/agency/${agence.agencyId}`}
            key={agence.agencyId}
            className="block p-4 bg-gray-50 rounded-lg text-center transition-shadow hover:shadow-md"
            passHref
          >
            <div className="relative h-20 w-full mb-2">
              <Image
                src={agence.logoUrl || "/image.png"}
                alt={`Logo de ${agence.shortName}`}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {agence.shortName}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AgenciesTab;
