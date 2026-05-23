import { useEffect, useState } from "react";
import { SearchFilterType } from "@/app/(customer-view)/market-place/page";
import { Wifi, Snowflake, Usb, Coffee, Cookie, Zap, Monitor } from "lucide-react";
import { Trip } from "@/lib/types/models/Trip";
import { retrieveAllTrips } from "@/lib/services/trip-service";

export function useMarketPlace() {

    const [availableTrips, setAvailableTrips] = useState<Partial<Trip>[] | null>(null);
    const [filteredTrips, setFilteredTrips] = useState<Partial<Trip>[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [searchFilters, setSearchFilters] = useState<SearchFilterType>({
        departure: "",
        arrival: "",
        date: "",
    });

    useEffect(() => {
        fetchAvailableTrips();
    }, []);

    useEffect(() => {
        filterTrips();
    }, [activeFilter, availableTrips]);

    function filterTrips() {
        if (activeFilter === "all") {
            setFilteredTrips(availableTrips);
        } else {
            const filtered = availableTrips && availableTrips.filter(
                (trip) => trip.lieuDepart === activeFilter || trip.lieuArrive === activeFilter
            );
            setFilteredTrips(filtered ?? null);
        }
    }

    async function fetchAvailableTrips() {
        setIsLoading(true);
        await retrieveAllTrips()
            .then((result) => {
                if (result) {
                    // Correction 2 : uniquement les voyages PUBLIE sur la marketplace
                    const publishedTrips = result.content.filter(
                        (trip) => trip.statusVoyage === 'PUBLIE'
                    );
                    setAvailableTrips(publishedTrips);
                    setFilteredTrips(publishedTrips);
                } else {
                    setFilteredTrips(null);
                    setAvailableTrips(null);
                }
            })
            .catch(() => {
                setAvailableTrips(null);
                setFilteredTrips(null);
                setError("Something went wrong when retrieving all trips. If the problem persists please contact support@busstation.com or +237 690878909");
            })
            .finally(() => setIsLoading(false));
    }

    function handleSearch() {
        if (!availableTrips) return;
        let filtered = [...availableTrips];

        if (searchFilters.departure.trim() !== "") {
            filtered = filtered.filter((trip) =>
                trip?.lieuDepart?.toLowerCase().includes(searchFilters.departure.toLowerCase())
            );
        }

        if (searchFilters.arrival.trim() !== "") {
            filtered = filtered.filter((trip) =>
                trip?.lieuArrive?.toLowerCase().includes(searchFilters.arrival.toLowerCase())
            );
        }

        //Correction 4 : filtre par date implémenté
        if (searchFilters.date.trim() !== "") {
            filtered = filtered.filter((trip) => {
                if (!trip.dateDepartPrev) return false;
                const tripDate = String(trip.dateDepartPrev).split("T")[0];
                return tripDate === searchFilters.date;
            });
        }

        setFilteredTrips(filtered);
    }

    function getClassColor(className: string) {
        switch (className.toLowerCase()) {
            case "vip": return "bg-blue-600 text-white";
            case "premium": return "bg-blue-500 text-white";
            case "standard": return "bg-blue-400 text-white";
            case "economy": return "bg-gray-500 text-white";
            default: return "bg-gray-500 text-white";
        }
    }

    //Correction 3 : getAmenityIcon complet
    function getAmenityIcon(amenity: string) {
        switch (amenity.toLowerCase()) {
            case "wifi": return <Wifi className="h-4 w-4" />;
            case "ac": return <Snowflake className="h-4 w-4" />;
            case "usb": return <Usb className="h-4 w-4" />;
            case "beverages": return <Coffee className="h-4 w-4" />;
            case "snacks": return <Cookie className="h-4 w-4" />;
            case "power_outlets": return <Zap className="h-4 w-4" />;
            case "entertainment": return <Monitor className="h-4 w-4" />;
            default: return null;
        }
    }

    return {
        handleSearch,
        getAmenityIcon,
        getClassColor,
        isLoading,
        filteredTrips,
        activeFilter,
        setActiveFilter,
        searchFilters,
        setSearchFilters,
        error,
    };
}