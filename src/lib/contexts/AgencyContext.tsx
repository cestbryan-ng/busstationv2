"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useBusStation } from "@/context/Provider"; // Pour récupérer l'utilisateur connecté
import { getAgencyByChefId } from "@/lib/services/agency-service"; // <-- VÉRIFIEZ LE CHEMIN ET LE NOM DE LA FONCTION
import { AgenceVoyage } from "@/lib/types/generated-api"; // On utilise le vrai type de l'agence

// Interface pour le contexte
interface AgencyContextType {
  agency: AgenceVoyage | null;      // L'agence actuellement chargée
  isLoading: boolean;              // Pour afficher les loaders
  error: string | null;            // Pour gérer les erreurs
  selectedAgency: { id: string; name: string } | null;
  setSelectedAgency: (agency: { id: string; name: string }) => void;
}

// Création du contexte
const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

// Le Provider qui va "enrober" la partie agence de l'application
export const AgencyProvider = ({ children }: { children: ReactNode }) => {
  
const { userData, isLoading: isUserLoading } = useBusStation();
const [selectedAgency, setSelectedAgency] = useState<{ id: string; name: string } | null>(null);

  // États pour notre contexte
  const [agency, setAgency] = useState<AgenceVoyage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour charger les données de l'agence
    const fetchAgencyData = async (userId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const agencyData = await getAgencyByChefId(userId); // Appel à votre service
        if (agencyData) {
          setAgency(agencyData);
        } else {
          setError("Aucune agence n'est associée à cet utilisateur.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'agence:", err);
        setError("Une erreur est survenue lors du chargement des informations de l'agence.");
      } finally {
        setIsLoading(false);
      }
    };

    // On déclenche le chargement seulement si on a l'ID de l'utilisateur
    if (!isUserLoading) {
      if (userData?.userId) {
        fetchAgencyData(userData.userId);
      } else {
        // Cas où l'utilisateur n'est pas connecté ou n'a pas d'ID
        setError("Utilisateur non authentifié. Impossible de charger l'agence.");
        setIsLoading(false);
      }
    }
  }, [userData, isUserLoading]); // Le useEffect se relance si userData change

  const value = { agency, isLoading, error, selectedAgency, setSelectedAgency };

  return (
    <AgencyContext.Provider value={value}>
      {children}
    </AgencyContext.Provider>
  );
};

// Le hook personnalisé pour utiliser le contexte facilement
export const useAgency = () => {
  const context = useContext(AgencyContext);
  if (context === undefined) {
    throw new Error("useAgency doit être utilisé à l'intérieur d'un AgencyProvider");
  }
  return context;
};