import { JSX, useCallback, useEffect, useState } from "react";
import {
    Coffee, Shield, Usb, Wifi, Wind,
    Monitor, Cookie, Zap, Armchair, Bath, Luggage,
    Baby, PawPrint, ArrowRight, Utensils,
    Headphones, Percent, Clock
} from "lucide-react";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { retrieveTripDetail } from "@/lib/services/trip-service";
import { Trip } from "@/lib/types/models/Trip";
import { Amenity } from "@/lib/types/generated-api/models/VoyageCreateRequestDTO";

export type equipmentOnBusType = {
    icon: JSX.ElementType;
    label: string;
    color: string;
};

//  Correction 1 : mapping dynamique amenities → équipements
const AMENITY_MAP: Record<Amenity, equipmentOnBusType> = {
    WIFI: { icon: Wifi, label: "Free WiFi", color: "text-blue-600" },
    BEVERAGES: { icon: Coffee, label: "Boissons", color: "text-orange-600" },
    USB: { icon: Usb, label: "USB Charging", color: "text-green-600" },
    AC: { icon: Wind, label: "Climatisation", color: "text-cyan-600" },
    SNACKS: { icon: Cookie, label: "Collations", color: "text-amber-600" },
    POWER_OUTLETS: { icon: Zap, label: "Prises électriques", color: "text-yellow-600" },
    ENTERTAINMENT: { icon: Monitor, label: "Divertissement", color: "text-purple-600" },
    COMFORTABLE_SEATS: { icon: Armchair, label: "Sièges confortables", color: "text-red-600" },
    RESTROOMS: { icon: Bath, label: "Toilettes", color: "text-indigo-600" },
    LUGGAGE_STORAGE: { icon: Luggage, label: "Rangement bagages", color: "text-gray-600" },
    CHILD_SEATS: { icon: Baby, label: "Sièges enfant", color: "text-pink-600" },
    PET_FRIENDLY: { icon: PawPrint, label: "Animaux autorisés", color: "text-orange-500" },
    AIRPORT_PICKUP: { icon: ArrowRight, label: "Ramassage aéroport", color: "text-teal-600" },
    AIRPORT_DROP_OFF: { icon: ArrowRight, label: "Dépôt aéroport", color: "text-teal-600" },
    MEAL_SERVICE: { icon: Utensils, label: "Service repas", color: "text-emerald-600" },
    ONBOARD_GUIDE: { icon: Headphones, label: "Guide à bord", color: "text-violet-600" },
    SEAT_SELECTION: { icon: Armchair, label: "Sélection de siège", color: "text-blue-500" },
    GROUP_DISCOUNTS: { icon: Percent, label: "Réductions groupes", color: "text-green-600" },
    LATE_CHECK_IN: { icon: Clock, label: "Enregistrement tardif", color: "text-yellow-500" },
    LATE_CHECK_OUT: { icon: Clock, label: "Départ tardif", color: "text-yellow-500" },
};

export function useTripDetails(idVoyage: string) {
    const [reservationSuccessMessage, setReservationSuccessMessage] = useState<string>("");
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [canOpenPaymentModal, setCanOpenPaymentModal] = useState<boolean>(false);
    // ✅ Correction 3 : isLoading initialisé à true — évite flash de contenu vide
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tripDetails, setTripDetail] = useState<Trip>({
        amenities: [],
        bigImage: "",
        dateArriveEffectif: "",
        dateDepartEffectif: "",
        dateDepartPrev: "",
        dateLimiteConfirmation: "",
        dateLimiteReservation: "",
        datePublication: "",
        description: "",
        dureeVoyage: "",
        heureArrive: "",
        heureDepartEffectif: "",
        idVoyage: "",
        lieuArrive: "",
        lieuDepart: "",
        nbrPlaceReservable: 0,
        nbrPlaceRestante: 0,
        nomAgence: "",
        nomClasseVoyage: "",
        placeReservees: [],
        pointArrivee: "",
        pointDeDepart: "",
        prix: 0,
        smallImage: "",
        statusVoyage: "EN_ATTENTE",
        titre: "",
        vehicule: {
            idVehicule: "",
            nom: "",
            modele: "",
            description: "",
            nbrPlaces: 0,
            lienPhoto: "",
            idAgenceVoyage: "",
            plaqueMatricule: "",
        },
    });
    const [canOpenReservationModal, setCanOpenReservationModal] = useState<boolean>(false);
    const [axiosError, setAxiosError] = useState<string | null>(null);

    //  Correction 2 : smallImage + bigImage — plus de doublon
    const images = [
        tripDetails.smallImage || tripDetails.bigImage,
        tripDetails.bigImage,
    ].filter(Boolean); // ← supprime les chaînes vides

    //  Correction 1 : équipements dynamiques depuis tripDetails.amenities
    const equipmentsOnBus: equipmentOnBusType[] = (tripDetails.amenities || [])
        .map((amenity) => AMENITY_MAP[amenity as Amenity])
        .filter(Boolean);

    async function fetchTripDetails(idVoyage: string) {
        if (!idVoyage || idVoyage === "")
            throw new Error("id Voyage must not be null or empty");
        setIsLoading(true);
        setAxiosError(null);
        await retrieveTripDetail(idVoyage)
            .then((result) => {
                if (result) {
                    setTripDetail(result);
                } else {
                    setAxiosError(
                        "Something went wrong when retrieving the trip details, please refresh!"
                    );
                }
            })
            .catch(() => {
                setAxiosError(
                    "Something went wrong when retrieving the trip details, please refresh!"
                );
            })
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        if (idVoyage) {
            fetchTripDetails(idVoyage).then(() => console.log("success!"));
        }
    }, [idVoyage]);

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const previousImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        const timer = setInterval(nextImage, 5000);
        return () => clearInterval(timer);
    }, [nextImage]);

    return {
        nextImage,
        previousImage,
        equipmentsOnBus,
        currentImageIndex,
        isLoading,
        images,
        setCurrentImageIndex,
        setCanOpenReservationModal,
        canOpenReservationModal,
        tripDetails,
        axiosError,
        canOpenPaymentModal,
        setCanOpenPaymentModal,
        reservationSuccessMessage,
        setReservationSuccessMessage,
    };
}