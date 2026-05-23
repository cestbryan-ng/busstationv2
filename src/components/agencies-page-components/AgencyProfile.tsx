"use client";

import { ArrowLeft, Star, MapPin, Phone, Mail, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import TripCard from "@/components/agencies-page-components/TripCard";
import { AgencyProfileProps } from "@/lib/types/ui";
import WeeklySchedule from "@/components/agencies-page-components/WeeklySchedule";
// Note: Assure-toi que AgencyProfileProps dans types/ui.ts utilise bien TravelAgency de models/Agency

export default function AgencyProfile({
  agency,
  trips,
  onBack,
  agencyId,
}: AgencyProfileProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="flex items-center text-primary hover:text-start-color transition-colors mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        {t("agenciesPage.profile.backButton")}
      </button>

      {/* Agency Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Image
            src={agency.logoUrl} // Changé: logo -> logoUrl
            alt={agency.longName} // Changé: name -> longName
            width={200}
            height={200}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {agency.longName}
            </h1>
            <div className="flex items-center mt-2">
              <MapPin className="h-5 w-5 text-gray-500 mr-1" />
              <span className="text-gray-600">{agency.location}</span>
            </div>
            <div className="flex items-center mt-2">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(agency.rating || 4)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-1 text-gray-600">
                  ({agency.rating || 4.5})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agency Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* About Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("agenciesPage.profile.aboutTitle")}
            </h2>
            <p className="text-gray-700">{agency.description}</p>
          </div>

          {/* Specialties */}
          {agency.specialties && agency.specialties.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("agenciesPage.profile.specialtiesTitle")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {agency.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-primary rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("agenciesPage.profile.contactTitle")}
            </h2>
            <div className="space-y-4">
              {agency.contact?.phone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t("agenciesPage.profile.phoneLabel")}
                    </h3>
                    <p className="text-gray-600">{agency.contact.phone}</p>
                  </div>
                </div>
              )}
              {agency.contact?.email && (
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t("agenciesPage.profile.emailLabel")}
                    </h3>
                    <p className="text-gray-600">{agency.contact.email}</p>
                  </div>
                </div>
              )}
              {agency.contact?.website && (
                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-primary mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t("agenciesPage.profile.websiteLabel")}
                    </h3>
                    <a
                      href={`https://${agency.contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {agency.contact.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Section */}
      <div className="space-y-6">
          <WeeklySchedule agencyId={agencyId} isEditable={false} />
      </div>

      {/* Trips Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t("agenciesPage.profile.tripsTitle")}
        </h2>

        {trips.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600">{t("agenciesPage.profile.noTrips")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, index) => (
              // Important : TripCard doit aussi être mis à jour pour accepter le type Trip du modèle
              // Si TripCard utilise encore l'ancien type, il faudra l'adapter aussi.
              <TripCard key={trip.idVoyage} trip={trip} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
