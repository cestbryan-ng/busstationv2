// src/lib/hooks/useCoupons.ts
import { useState, useEffect, useMemo } from "react";
import { useBusStation } from "@/context/Provider";
import axiosInstance from "@/lib/services/axios-services/axiosInstance";

export interface CouponDTO {
    idCoupon: string;
    dateDebut: string;
    dateFin: string;
    statusCoupon: string;
    valeur: number;
    idHistorique: string;
    nomAgence: string;
    lieuArrive: string;
}

async function getCouponsByUser(userId: string): Promise<CouponDTO[]> {
    const response = await axiosInstance.get(`/coupon/user/${userId}`);
    return response.data || [];
}

export function useCoupons(activeTab: string) {
    const { userData, isLoading: isUserLoading } = useBusStation();
    const [coupons, setCoupons] = useState<CouponDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoupons = async () => {
            if (isUserLoading || !userData?.userId) return;
            setIsLoading(true);
            setError(null);
            try {
                const data = await getCouponsByUser(userData.userId);
                setCoupons(data);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger vos coupons.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCoupons();
    }, [userData, isUserLoading]);

    // Filtrage par statut
    const filteredCoupons = useMemo(() => {
        return coupons.filter(
            (coupon) => activeTab === "all" || coupon.statusCoupon === activeTab
        );
    }, [coupons, activeTab]);

    return { filteredCoupons, isLoading, error };
}