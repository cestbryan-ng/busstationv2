export type Service = "WIFI" | "PARKING" | "RESTAURATION" | "SALLE_ATTENTE" | "TOILETTES" | "SECURITE";

export interface GareRoutiere {
    id: string;
    nom: string;
    ville: string;
    quartier: string;
    adresse: string;
    description: string;
    imageUrl: string;
    services: Service[];
    nbAgencesAffiliees: number;
    estOuvert: boolean | null;
    horaires: string;
    localisation: {
        latitude: number;
        longitude: number;
    };
}

export interface GareRoutiereDetail {
    idGareRoutiere: string;
    nomGareRoutiere: string;
    adresse: string;
    ville: string;
    quartier: string;
    description: string;
    services: Service[];
    horaires: string;
    photoUrl: string;
    nomPresident: string;
    idCoordonneeGPS: string;
    managerId: string;
    nbreAgence: number;
}