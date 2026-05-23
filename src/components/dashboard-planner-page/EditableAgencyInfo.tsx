// src/components/dashboard-planner-page/EditableAgencyInfo.tsx
"use client";

import { useState, useEffect } from 'react';
import { TravelAgency } from "@/lib/types/models/Agency";
import { updateAgencyDetails } from '@/lib/services/agency-service';
import EditableTextField from '@/ui/EditableTextField';
import EditableTextareaField from '@/ui/EditableTextareaField';
import { Edit, Save, XCircle } from "lucide-react";
import toast from 'react-hot-toast';

interface EditableAgencyInfoProps {
  agency: TravelAgency;
  refetch: () => void;
}

export default function EditableAgencyInfo({ agency, refetch }: EditableAgencyInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    longName: agency.longName,
    shortName: agency.shortName,
    location: agency.location,
    description: agency.description,
  });

  // Effect to reset form data if the base agency prop changes
  useEffect(() => {
    setFormData({
      longName: agency.longName,
      shortName: agency.shortName,
      location: agency.location,
      description: agency.description,
    });
  }, [agency]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original state
    setFormData({
        longName: agency.longName,
        shortName: agency.shortName,
        location: agency.location,
        description: agency.description,
    });
  };

  const handleSave = async () => {
    toast.loading('Mise à jour en cours...');
    try {
      await updateAgencyDetails(agency.agencyId, formData);
      toast.dismiss();
      toast.success('Informations mises à jour avec succès!');
      setIsEditing(false);
      refetch(); // Trigger re-fetch in the parent component
    } catch (error) {
      toast.dismiss();
      toast.error('Erreur lors de la mise à jour.');
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Informations Générales</h3>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors py-1 px-3 rounded-lg hover:bg-gray-100">
            <Edit className="w-4 h-4" /> Modifier
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <div><h4 className="text-sm font-medium text-gray-500">Nom complet</h4><p>{formData.longName}</p></div>
          <div><h4 className="text-sm font-medium text-gray-500">Nom court</h4><p>{formData.shortName}</p></div>
          <div><h4 className="text-sm font-medium text-gray-500">Localisation</h4><p>{formData.location}</p></div>
          <div><h4 className="text-sm font-medium text-gray-500">Description</h4><p className="whitespace-pre-wrap">{formData.description}</p></div>
        </div>
      ) : (
        <div className="space-y-4">
          <EditableTextField label="Nom complet de l'agence" id="longName" value={formData.longName} onChange={handleInputChange} />
          <EditableTextField label="Nom court" id="shortName" value={formData.shortName} onChange={handleInputChange} />
          <EditableTextField label="Localisation" id="location" value={formData.location} onChange={handleInputChange} />
          <EditableTextareaField label="Description" id="description" value={formData.description} onChange={handleInputChange} />
          
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