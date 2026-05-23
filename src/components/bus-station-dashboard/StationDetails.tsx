import React from "react";
// On garde tes imports, mais on ajoute des icônes pour le style
import { MapPin, Info, Shield, Coffee, Car, User, Clock, Edit } from "lucide-react";

// On définit une interface locale qui correspond VRAIMENT à ton JSON backend
// (Tu pourras mettre ça dans tes types globaux plus tard)
interface StationDetailsProps {
  station: {
    nomGareRoutiere: string;  // C'était "nom" avant (faux)
    description?: string;
    ville?: string;
    quartier?: string;        // C'était "adresse" avant (faux)
    photoUrl?: string;
    nomPresident?: string;
    services?: string[];
    horaires?: string;
    [key: string]: any;       // Pour accepter d'autres champs
  };
}

const getServiceIcon = (service: string) => {
  // Petite fonction pour mettre une icône selon le service
  const s = service.toUpperCase();
  if (s.includes("SECURITE")) return <Shield className="h-3 w-3" />;
  if (s.includes("SALLE")) return <Coffee className="h-3 w-3" />;
  if (s.includes("PARKING")) return <Car className="h-3 w-3" />;
  return <Info className="h-3 w-3" />;
};

const StationDetails: React.FC<StationDetailsProps> = ({ station }) => {
  if (!station) return null;

  // Image par défaut si le backend n'envoie pas de photoUrl
  // J'ai mis une image de bus générique propre
  const bgImage = station.photoUrl || "https://images.unsplash.com/photo-1570125909232-eb2b97649c42?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
      
      {/* 1. BANNIÈRE & TITRE */}
      <div className="relative h-40 bg-gray-900">
        {/* Image de fond avec filtre sombre pour lire le texte */}
        <img 
          src={bgImage} 
          alt={station.nomGareRoutiere} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
        
        {/* Infos principales superposées */}
        <div className="absolute bottom-4 left-6 text-white">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
            {station.nomGareRoutiere}
          </h2>
          <div className="flex items-center gap-2 text-gray-200 text-sm font-medium">
            <MapPin className="h-4 w-4 text-primary-400" />
            <span>
              {station.quartier ? `${station.quartier}, ` : ""} 
              {station.ville || "Localisation inconnue"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. CORPS DE LA CARTE */}
      <div className="p-6 flex flex-col md:flex-row gap-8">
        
        {/* Colonne Gauche : Infos & Description */}
        <div className="flex-1 space-y-5">
          {/* Badges d'info rapide */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-100">
              <User className="h-4 w-4" />
              <span>Manager: {station.nomPresident || "Non défini"}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-100">
              <Clock className="h-4 w-4" />
              <span>{station.horaires || "Ouvert 24h/7j"}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Info className="h-3 w-3" /> À propos
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {station.description || "Aucune description n'a été fournie pour cette gare routière."}
            </p>
          </div>
        </div>

        {/* Colonne Droite : Services & Actions */}
        <div className="md:w-1/3 flex flex-col justify-between border-l border-gray-100 md:pl-6">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Services
            </h3>
            <div className="flex flex-wrap gap-2">
              {station.services && station.services.length > 0 ? (
                station.services.map((service, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {getServiceIcon(service)}
                    {service.replace('_', ' ')}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-xs italic">Aucun service listé</span>
              )}
            </div>
          </div>

          <button className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Edit className="h-4 w-4" />
            Modifier les infos
          </button>
        </div>

      </div>
    </div>
  );
};

export default StationDetails;