export interface ContactInfo {
  email: string;
  phone: string;
  website: string;
}

export interface TravelAgency {
  agencyId: string; // Correspond à 'id' dans l'ancien mock
  organisationId: string;
  userId: string;
  longName: string; // Correspond à 'name' pour l'affichage principal
  shortName: string;
  location: string;
  socialNetwork: string;
  description: string;
  greetingMessage: string;
  logoUrl: string; // Correspond à 'logo'

  // Nouveaux champs pour l'UI (optionnels pour être compatible avec le backend strict s'il ne les renvoie pas encore)
  rating?: number;
  specialties?: string[];
  contact?: ContactInfo;
  gareIds?: string[]; // Pour le filtrage par gare
  id?: string; // Ajout de l'ID pour les liens
}
