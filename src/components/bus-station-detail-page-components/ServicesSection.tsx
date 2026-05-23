import React from 'react';
import { Wifi, ParkingSquare, Utensils, Armchair, ShieldCheck, LucideProps } from 'lucide-react';

const serviceIconMap: { [key: string]: { icon: React.FC<LucideProps> | null; label: string } } = {
  WIFI: { icon: Wifi, label: 'Wi-Fi Gratuit' },
  PARKING: { icon: ParkingSquare, label: 'Parking Sécurisé' },
  RESTAURATION: { icon: Utensils, label: 'Restauration' },
  SALLE_ATTENTE: { icon: Armchair, label: "Salle d'attente" },
  SECURITE: { icon: ShieldCheck, label: 'Sécurité 24/7' },
  TOILETTES: { icon: null, label: 'Toilettes' },
};

type ServicesSectionProps = {
  services: string[];
};

const ServicesSection = ({ services }: ServicesSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Services & Commodités</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {services.map((serviceKey) => {
          const service = serviceIconMap[serviceKey];
          if (!service) return null;
          const Icon = service.icon;
          return (
            <div key={serviceKey} className="flex flex-col items-center justify-center text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-blue-600 mb-2">
                {Icon ? <Icon size={28} /> : <span className="text-2xl">🚻</span>}
              </div>
              <span className="text-sm font-medium text-gray-700">{service.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesSection;
