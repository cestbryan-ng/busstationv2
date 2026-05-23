// src/lib/hooks/dasboard/useSubscriptionPage.ts
import { useState, useEffect } from "react";
import { useBusStation } from "@/context/Provider";
import { getAgencyByChefId } from "@/lib/services/agency-service";
import {
    getAgencyPlans,
    getBillingHistory,
    SubscriptionPlanDTO,
    BillingHistoryDTO
} from "@/lib/services/subscription-service";
import { SubscriptionPlan, BillingHistoryItem } from "@/lib/types/dashboard";

// ✅ Fallback statique — actif tant que le backend n'expose pas les endpoints
const FALLBACK_PLANS: SubscriptionPlan[] = [
    {
        name: "Basique",
        price: "30 000 FCFA/mois",
        features: ["10 voyages publiés", "Support par email", "Analyses de base"],
        isCurrent: false,
    },
    {
        name: "Pro",
        price: "65 000 FCFA/mois",
        features: [
            "Voyages illimités",
            "Support prioritaire",
            "Analyses avancées",
            "API d'intégration",
        ],
        isCurrent: true,
    },
    {
        name: "Entreprise",
        price: "Sur devis",
        features: [
            "Toutes les fonctionnalités Pro",
            "Gestion multi-utilisateurs",
            "Support dédié",
        ],
        isCurrent: false,
    },
];

const FALLBACK_BILLING: BillingHistoryItem[] = [
    { id: "inv-001", date: "2025-06-01", amount: 65000, status: "paid" },
    { id: "inv-002", date: "2025-05-01", amount: 65000, status: "paid" },
];

// Adaptateur DTO → type local
function mapPlan(dto: SubscriptionPlanDTO): SubscriptionPlan {
    return {
        name: dto.name,
        price: `${dto.price.toLocaleString()} FCFA/mois`,
        features: dto.features,
        isCurrent: dto.isCurrent,
    };
}

function mapBilling(dto: BillingHistoryDTO): BillingHistoryItem {
    return {
        id: dto.idFacture,
        date: dto.date,
        amount: dto.amount,
        status: dto.status as "paid" | "pending" | "failed", // ← cast explicite
    };
}

export function useSubscriptionPage() {
    const { userData, isLoading: isUserLoading } = useBusStation();
    const [plans, setPlans] = useState<SubscriptionPlan[]>(FALLBACK_PLANS);
    const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>(FALLBACK_BILLING);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            if (isUserLoading || !userData?.userId) return;
            setIsLoading(true);
            try {
                const agency = await getAgencyByChefId(userData.userId);
                if (!agency?.agencyId) return;

                // Plans — fallback silencieux si endpoint indisponible
                try {
                    const plansData = await getAgencyPlans(agency.agencyId);
                    if (plansData?.length > 0) setPlans(plansData.map(mapPlan));
                } catch {
                    // 📢 Endpoint /abonnement/plans/agence/{id} non disponible — fallback actif
                }

                // Historique — fallback silencieux si endpoint indisponible
                try {
                    const billingData = await getBillingHistory(agency.agencyId);
                    if (billingData?.length > 0) setBillingHistory(billingData.map(mapBilling));
                } catch {
                    // 📢 Endpoint /facturation/agence/{id} non disponible — fallback actif
                }

            } catch {
                // Erreur agence — on garde les fallbacks
            } finally {
                setIsLoading(false);
            }
        };
        initialize();
    }, [userData, isUserLoading]);

    return { plans, billingHistory, isLoading };
}