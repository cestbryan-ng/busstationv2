// Type Definition for Bus Station (Frontend DTO)
export interface GareRoutiere {
  id: string; // UUID
  nom: string; // Ex: "Gare Routière de Mvan"
  ville: string; // Ex: "Yaoundé"
  quartier: string; // Ex: "Mvan"
  adresse: string; // Adresse textuelle complète

  // Coordonnées pour l'affichage sur la carte (Leaflet/Google Maps)
  localisation: {
    latitude: number;
    longitude: number;
  };

  description: string; // Texte de présentation
  imageUrl: string; // URL de l'image de couverture

  // Liste des services disponibles (à afficher sous forme d'icônes)
  services: string[]; // Ex: ["WIFI", "TOILETTES", "PARKING", "RESTAURATION", "SALLE_ATTENTE"]

  // Statistiques pour l'affichage des badges
  nbAgencesAffiliees: number;

  // État d'ouverture (Optionnel)
  estOuvert: boolean | null;
  horaires?: string; // Ex: "24h/24" ou "05h00 - 23h00"
}

// Type pour l'onglet "Agences Présentes"
export interface AgenceSommaire {
  id: string;
  nom: string;
  logoUrl: string;
  lignesDesservies: string[]; // Ex: ["Douala", "Bafoussam"] - Juste pour info visuelle
}

// Type pour l'onglet "Prochains Départs" (Tableau dynamique)
export interface VoyageDepart {
  id: string;
  heureDepart: string; // Format ISO ou Time string
  villeDestination: string;
  nomAgence: string;
  logoAgenceUrl: string;
  prix: number;
  typeVehicule: string; // Ex: "VIP", "Classique"
  placesRestantes: number;
}
