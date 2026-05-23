import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Briefcase, MapPin } from 'lucide-react';
// Import du bon type frontend
import { GareRoutiere } from '@/lib/types/gares-routiere';

type StationCardProps = {
    station: GareRoutiere;
};

const StationCard = ({ station }: StationCardProps) => {
    return (
        // id et non idGareRoutiere
        <Link href={`/gares-routieres/${station.id}`} className="block group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl">
                <div className="relative h-48 w-full">
                    <Image
                        // imageUrl et non photoUrl
                        src={station.imageUrl || '/placeholder-station.jpg'}
                        // nom et non nomGareRoutiere
                        alt={`Photo de ${station.nom}`}
                        fill
                        // layout/objectFit deprecated → style
                        style={{ objectFit: 'cover' }}
                        className="transition-opacity duration-300 group-hover:opacity-90"
                    />
                </div>
                <div className="p-4">
                    {/* nom et non nomGareRoutiere */}
                    <h3 className="text-lg font-bold text-gray-800 truncate">{station.nom}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin size={14} className="mr-1.5" />
                        <span>{station.quartier}, {station.ville}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            <Briefcase size={14} className="mr-1.5" />
                            {/* nbAgencesAffiliees et non nbreAgence */}
                            <span className="font-semibold">{station.nbAgencesAffiliees} agences</span>
                        </div>
                        <div className={`text-xs font-semibold py-1 px-2.5 rounded-full ${
                            // estOuvert et non isOpen — null → badge neutre
                            station.estOuvert === true
                                ? 'bg-green-100 text-green-700'
                                : station.estOuvert === false
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-500'
                        }`}>
                            {station.estOuvert === true
                                ? 'Ouvert'
                                : station.estOuvert === false
                                    ? 'Fermé'
                                    : '—'
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default StationCard;