// src/components/dashboard-planner-page/EditableAgencySpecialties.tsx
"use client";

import { useState, useEffect } from 'react';
import { TravelAgency } from "@/lib/types/models/Agency";
import { updateAgencyDetails } from '@/lib/services/agency-service';
import { Edit, Save, XCircle, PlusCircle, X } from "lucide-react";
import toast from 'react-hot-toast';

interface EditableAgencySpecialtiesProps {
  agencyId: string;
  specialties: TravelAgency['specialties'];
  refetch: () => void;
}

export default function EditableAgencySpecialties({ agencyId, specialties, refetch }: EditableAgencySpecialtiesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentSpecialties, setCurrentSpecialties] = useState(specialties || []);
  const [newSpecialty, setNewSpecialty] = useState("");

  useEffect(() => {
    setCurrentSpecialties(specialties || []);
  }, [specialties]);

  const handleRemoveSpecialty = (indexToRemove: number) => {
    setCurrentSpecialties(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAddSpecialty = () => {
    if (newSpecialty && !currentSpecialties.includes(newSpecialty)) {
      setCurrentSpecialties(prev => [...prev, newSpecialty]);
      setNewSpecialty(""); // Reset input
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentSpecialties(specialties || []);
  };

  const handleSave = async () => {
    toast.loading('Mise à jour en cours...');
    try {
      await updateAgencyDetails(agencyId, { specialties: currentSpecialties });
      toast.dismiss();
      toast.success('Spécialités mises à jour avec succès!');
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.dismiss();
      toast.error('Erreur lors de la mise à jour.');
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Spécialités</h3>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors py-1 px-3 rounded-lg hover:bg-gray-100">
            <Edit className="w-4 h-4" /> Modifier
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="flex flex-wrap gap-3">
          {currentSpecialties.map((specialty, index) => (
            <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
              {specialty}
            </span>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {currentSpecialties.map((specialty, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                <span>{specialty}</span>
                <button onClick={() => handleRemoveSpecialty(index)} className="hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              placeholder="Nouvelle spécialité"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleAddSpecialty()}
            />
            <button onClick={handleAddSpecialty} className="flex items-center gap-2 p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex justify-end items-center gap-4 pt-4">
            <button onClick={handleCancel} className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-red-50 transition-colors">
              <XCircle className="w-5 h-5" /> Annuler
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all">
              <Save className="w-5 h-5" /> Sauvegarder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}