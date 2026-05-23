"use client"

import { Suspense } from "react"
import PageHeader from "@/components/dashboard/PageHeader"
import TripPlannerForm from "@/components/dashboard/trip-planning/TripPlannerForm"
import { useTripPlanner } from "@/lib/hooks/dasboard/useTripPlanner"
import Loader from "@/modals/Loader"
import { MapPin, Calendar, Users, Settings } from "lucide-react"

function TripPlannerPageContent() {
    const tripPlanner = useTripPlanner()

    if (tripPlanner.isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title={tripPlanner.isEditMode ? "Modifier un Voyage" : "Planifier un Nouveau Voyage"}
                subtitle={
                    tripPlanner.isEditMode
                        ? "Modifiez les détails de votre voyage existant"
                        : "Créez un nouveau voyage en remplissant tous les détails nécessaires"
                }
            >
                {/* Progress indicators */}
                <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-gray-700 font-medium">Itinéraire</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-gray-700 font-medium">Planning</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-gray-700 font-medium">Ressources</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Settings className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-gray-700 font-medium">Services</span>
                    </div>
                </div>
            </PageHeader>

            <TripPlannerForm hook={tripPlanner} />
        </div>
    )
}

export default function TripPlanningPage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center py-20">
                    <div className="text-center space-y-4">
                        <Loader />
                        <p className="text-gray-600">Chargement du planificateur de voyage...</p>
                    </div>
                </div>
            }
        >
            <TripPlannerPageContent />
        </Suspense>
    )
}