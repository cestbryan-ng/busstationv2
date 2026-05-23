import React from 'react';
import { GareRoutiere } from '@/lib/types/gares-routiere';

type InfoTabProps = {
    station: GareRoutiere;
}

const InfoTab = ({ station }: InfoTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">À propos de la gare</h3>
        <p className="text-gray-600 leading-relaxed">
            {station.description}
        </p>
      </div>
       <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Règlement intérieur</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Il est interdit de fumer dans l'enceinte de la gare.</li>
            <li>Veuillez arriver au moins 30 minutes avant l'heure de départ.</li>
            <li>Ne laissez pas vos bagages sans surveillance.</li>
            <li>Respectez la propreté des lieux.</li>
        </ul>
      </div>
    </div>
  );
};

export default InfoTab;
