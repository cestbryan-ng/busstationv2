'use client';

import React, { useState } from 'react';
import { GareRoutiere } from '@/lib/types/gares-routiere';
import { Trip } from '@/lib/types/models/Trip'; // New import
import { TravelAgency as Agency } from '@/lib/types/models/Agency'; // New import
import AgenciesTab from './AgenciesTab';
import DeparturesTab from './DeparturesTab';
import InfoTab from './InfoTab';
import { Users, Bus, Info } from 'lucide-react';

type TabsSectionProps = {
  station: GareRoutiere;
  agences: Agency[]; // Updated type
  departs: Trip[]; // Updated type
};

type Tab = 'agences' | 'departs' | 'infos';

const TabsSection = ({ station, agences, departs }: TabsSectionProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('agences');

  const tabs = [
    { id: 'agences', label: 'Agences Présentes', icon: <Users size={16} /> },
    { id: 'departs', label: 'Prochains Départs', icon: <Bus size={16} /> },
    { id: 'infos', label: 'Infos Pratiques', icon: <Info size={16} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'agences':
        return <AgenciesTab agences={agences} />;
      case 'departs':
        return <DeparturesTab departs={departs} />;
      case 'infos':
        return <InfoTab station={station} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`
                flex items-center whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default TabsSection;
