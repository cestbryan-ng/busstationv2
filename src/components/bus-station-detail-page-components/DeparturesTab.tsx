import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Added
import { Trip } from '@/lib/types/models/Trip'; // Updated import
import { Clock, MapPin, Bus, Tag, Ticket } from 'lucide-react';

type DeparturesTabProps = {
  departs: Trip[]; // Updated prop type
};

const DeparturesTab = ({ departs }: DeparturesTabProps) => {
  return (
    <div>
      {/* Vue pour les grands écrans */}
      <div className="hidden md:block">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agence</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {departs.map(depart => (
              <tr key={depart.idVoyage}> {/* Updated key */}
                <td className="py-4 px-4 whitespace-nowrap font-bold text-gray-900">{depart.heureDepartEffectif}</td> {/* Updated property */}
                <td className="py-4 px-4 whitespace-nowrap">{depart.lieuArrive}</td> {/* Updated property */}
                <td className="py-4 px-4 whitespace-nowrap flex items-center">
                  {/* Changed from depart.logoAgenceUrl to depart.smallImage */}
                  <Image src={depart.smallImage} alt={depart.nomAgence} width={24} height={24} className="mr-2 rounded-full" />
                  {depart.nomAgence}
                </td>
                <td className="py-4 px-4 whitespace-nowrap font-semibold">{depart.prix.toLocaleString('fr-FR')} FCFA</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <Link href={`/marketplace/booking/${depart.idVoyage}`} className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium text-center">Réserver</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue pour les petits écrans */}
      <div className="md:hidden space-y-4">
        {departs.map(depart => (
          <div key={depart.idVoyage} className="bg-white rounded-lg shadow p-4"> {/* Updated key */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-bold text-gray-800">{depart.lieuArrive}</p> {/* Updated property */}
                <div className="flex items-center text-sm text-gray-500 mt-1">
                   {/* Changed from depart.logoAgenceUrl to depart.smallImage */}
                   <Image src={depart.smallImage} alt={depart.nomAgence} width={20} height={20} className="mr-1.5 rounded-full" />
                   {depart.nomAgence}
                </div>
              </div>
              <div className="text-lg font-bold text-blue-600">{depart.heureDepartEffectif}</div> {/* Updated property */}
            </div>
            <div className="mt-4 border-t pt-4 flex justify-between items-center">
                <p className="text-base font-semibold text-gray-700">{depart.prix.toLocaleString('fr-FR')} FCFA</p>
                <Link href={`/marketplace/booking/${depart.idVoyage}`} className="inline-block px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium text-center">Réserver</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeparturesTab;
