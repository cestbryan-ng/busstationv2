// src/components/dashboard-planner-page/EditableAgencyContact.tsx
"use client";

import { useState, useEffect } from 'react';
import { TravelAgency } from "@/lib/types/models/Agency";
import { updateAgencyDetails } from '@/lib/services/agency-service';
import EditableTextField from '@/ui/EditableTextField';
import { Edit, Save, XCircle, Mail, Phone, Globe } from "lucide-react";
import toast from 'react-hot-toast';

interface EditableAgencyContactProps {
  agencyId: string;
  contact: TravelAgency['contact'];
  refetch: () => void;
}

const ContactRow = ({ icon: Icon, value, href }: { icon: React.ElementType, value: string, href: string }) => (
    <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-md text-primary hover:underline">{value}</a>
    </div>
);

export default function EditableAgencyContact({ agencyId, contact, refetch }: EditableAgencyContactProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: contact?.phone || '',
    email: contact?.email || '',
    website: contact?.website || '',
  });

  useEffect(() => {
    setFormData({
      phone: contact?.phone || '',
      email: contact?.email || '',
      website: contact?.website || '',
    });
  }, [contact]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      phone: contact?.phone || '',
      email: contact?.email || '',
      website: contact?.website || '',
    });
  };

  const handleSave = async () => {
    toast.loading('Mise à jour en cours...');
    try {
      await updateAgencyDetails(agencyId, { contact: formData });
      toast.dismiss();
      toast.success('Contacts mis à jour avec succès!');
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
        <h3 className="text-2xl font-bold text-gray-800">Contacts</h3>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors py-1 px-3 rounded-lg hover:bg-gray-100">
            <Edit className="w-4 h-4" /> Modifier
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          {formData.phone && <ContactRow icon={Phone} value={formData.phone} href={`tel:${formData.phone}`} />}
          {formData.email && <ContactRow icon={Mail} value={formData.email} href={`mailto:${formData.email}`} />}
          {formData.website && <ContactRow icon={Globe} value={formData.website} href={`https://${formData.website}`} />}
        </div>
      ) : (
        <div className="space-y-4">
          <EditableTextField label="Téléphone" id="phone" value={formData.phone} onChange={handleInputChange} />
          <EditableTextField label="Email" id="email" value={formData.email} onChange={handleInputChange} />
          <EditableTextField label="Site Web" id="website" value={formData.website} onChange={handleInputChange} />
          
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