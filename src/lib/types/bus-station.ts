// src/lib/types/bus-station.ts

export interface Location {
  latitude: number;
  longitude: number;
}

export interface BusStation {
  id: string;
  nom: string;
  nomGareRoutiere: string;
  ville: string;
  quartier: string;
  adresse: string;
  localisation: Location;
  description: string;
  imageUrl: string;
  services: string[];
  nbAgencesAffiliees: number;
  estOuvert: boolean;
  horaires: string;
}

export interface Agency {
  id: string;
  idAgenceVoyage: string;
  organisationId: string;
  userId: string;
  longName: string;
  shortName: string;
  logoUrl: string;
  location: string;
  description: string;
  greetingMessage: string;
  rating: number;
  specialties: string[];
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  gareIds: string[];
}

export interface Trip {
    idVoyage: string;
    titre: string;
    description: string;
    dateDepartPrev: string;
    lieuDepart: string;
    dateDepartEffectif: string;
    dateArriveEffectif: string;
    lieuArrive: string;
    heureDepartEffectif: string;
    dureeVoyage: string;
    heureArrive: string;
    nbrPlaceReservable: number;
    nbrPlaceRestante: number;
    datePublication: string;
    dateLimiteReservation: string;
    dateLimiteConfirmation: string;
    statusVoyage: string;
    smallImage: string;
    bigImage: string;
    nomClasseVoyage: string;
    prix: number;
    nomAgence: string;
    agencyId: string;
    pointDeDepart: string;
    pointArrivee: string;
    vehicule: {
      idVehicule: string;
      nom: string;
      modele: string;
      description: string;
      nbrPlaces: number;
      lienPhoto: string;
      idAgenceVoyage: string;
      plaqueMatricule: string;
    };
    placeReservees: any[];
    amenities: any[];
    id: string;
}

export interface TripsByDate {
    date: string;
    count: number;
}

export interface AffiliationTax {
  id: string;
  agencyId: string;
  stationId: string;
  amount: number;
  dueDate: string;
  status: "payé" | "en attente" | "en retard";
  paymentDate: string | null;
}

export interface PolicyAndTax {
  id: string;
  stationId: string;
  title: string;
  description: string;
  category: "Politique" | "Taxe";
  amount: number | null;
  effectiveDate: string;
  documentUrl: string | null;
}

export interface BusStationManagerAccount {
  id: string;
  busStationId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  lastLogin: string;
}
