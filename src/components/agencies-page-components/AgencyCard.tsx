"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { TravelAgency } from "@/lib/types/models/Agency"; // Import correct

interface AgencyCardProps {
  agency: TravelAgency;
}

export default function AgencyCard({ agency }: AgencyCardProps) {
  return (
    <Link
      href={`/agency/${agency.id}`} 
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="relative h-40">
        <Image
          src={agency.logoUrl} // Changé: logo -> logoUrl
          alt={`${agency.longName} logo`} // Changé: name -> longName
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {agency.longName} {/* Changé: name -> longName */}
        </h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-4 w-4 mr-1.5" />
          <span>{agency.location}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            {/* Gestion sécurisée si rating est undefined */}
            <span className="font-semibold text-gray-700">
              {agency.rating || 4.5}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 justify-end">
            {/* Gestion sécurisée si specialties est undefined */}
            {agency.specialties?.slice(0, 2).map((spec) => (
              <span
                key={spec}
                className="px-2 py-1 text-xs bg-blue-100 text-primary font-medium rounded-full"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
