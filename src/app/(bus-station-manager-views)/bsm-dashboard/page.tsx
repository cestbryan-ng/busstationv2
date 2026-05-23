"use client";

import React, { useMemo } from "react";
import { useBusStationManager } from "@/lib/hooks/useBusStationManager";
import StationDetails from "@/components/bus-station-dashboard/StationDetails";
import DetailedAffiliatedAgenciesList from "@/components/bus-station-dashboard/affiliated-agencies/DetailedAffiliatedAgenciesList";
import TripsChart from "@/components/bus-station-dashboard/TripsChart";
import Loader from "@/modals/Loader";
import { AlertCircle, RefreshCw, Building2, Bus, Wallet, MapPin, TrendingUp, ArrowUpRight } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    gradient: string;
    iconBg: string;
    trend?: string;
}

const StatCard = ({ title, value, icon: Icon, gradient, iconBg, trend }: StatCardProps) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-lg group cursor-default`}>
        <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute -bottom-4 -right-2 h-16 w-16 rounded-full bg-white/5" />

        <div className="relative z-10 flex items-start justify-between">
            <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/60 mb-2">{title}</p>
                <h3 className="text-2xl font-bold text-white leading-none">{value}</h3>
                {trend && (
                    <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-3 w-3 text-white/60" />
                        <span className="text-xs font-normal text-white/60">{trend}</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-xl ${iconBg} backdrop-blur-sm`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
        </div>
    </div>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="flex items-center justify-between mb-1">
        <div>
            <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
            {subtitle && <p className="text-xs font-normal text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="h-px flex-1 bg-linear-to-r from-slate-100 to-transparent mx-4" />
        <ArrowUpRight className="h-4 w-4 text-slate-300" />
    </div>
);

const BusStationDashboardPage = () => {
    const { station, agencies, tripsByDate, loading, error } = useBusStationManager();

    const stats = useMemo(() => {
        const safeAgencies = agencies || [];
        return {
            totalAgencies: safeAgencies.length,
            activeAgencies: safeAgencies.filter((a) => a.taxStatus === "payé").length,
            totalTrips: tripsByDate?.reduce((acc, curr) => acc + curr.count, 0) || 0,
            pendingTaxes: safeAgencies.filter((a) => a.taxStatus === "en retard").length,
        };
    }, [agencies, tripsByDate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-100px)]">
                <Loader message="Chargement de votre espace..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] p-4">
                <div className="p-10 text-center bg-white rounded-3xl border border-red-100 max-w-md w-full shadow-xl shadow-red-50">
                    <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
                        <AlertCircle className="h-10 w-10 text-red-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-2">Une erreur est survenue</h3>
                    <p className="text-xs font-normal text-slate-400 mb-7 leading-relaxed">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                    >
                        <RefreshCw className="h-4 w-4" /> Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">

            {/* ── KPI CARDS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Agences Affiliées"
                    value={stats.totalAgencies}
                    icon={Building2}
                    gradient="bg-gradient-to-br from-slate-800 to-slate-600"
                    iconBg="bg-white/15"
                    trend="Actives ce mois"
                />
                <StatCard
                    title="Voyages Programmés"
                    value={stats.totalTrips}
                    icon={Bus}
                    gradient="bg-gradient-to-br from-indigo-600 to-indigo-400"
                    iconBg="bg-white/15"
                    trend="Sur la période"
                />
                <StatCard
                    title="Taxes en Retard"
                    value={stats.pendingTaxes}
                    icon={Wallet}
                    gradient="bg-gradient-to-br from-rose-600 to-rose-400"
                    iconBg="bg-white/15"
                />
                <StatCard
                    title="Taux d'Occupation"
                    value="-- %"
                    icon={MapPin}
                    gradient="bg-gradient-to-br from-emerald-600 to-teal-400"
                    iconBg="bg-white/15"
                />
            </div>

            {/* ── STATION DETAILS ── */}
            {station && (
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                        <SectionHeader title="Informations de la Gare" subtitle="Données de votre établissement" />
                    </div>
                    <div className="p-6">
                        <StationDetails station={station} />
                    </div>
                </section>
            )}

            {/* ── AGENCIES LIST ── */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                    <SectionHeader
                        title="Agences Affiliées"
                        subtitle="Compagnies opérant dans votre gare"
                    />
                </div>

                {agencies && agencies.length > 0 ? (
                    <DetailedAffiliatedAgenciesList agencies={agencies} />
                ) : (
                    <div className="py-10 flex items-center gap-4 px-6 border border-dashed border-slate-200 rounded-xl mx-6 mb-6 bg-slate-50/50">
                        <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-slate-300" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Aucune agence affiliée pour le moment.</p>
                            <p className="text-xs font-normal text-slate-300 mt-0.5">Les agences ajoutées apparaîtront ici.</p>
                        </div>
                    </div>
                )}
            </section>

            {/* ── TRIPS CHART ── */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                    <SectionHeader title="Analyse des Voyages" subtitle="Évolution sur la période sélectionnée" />
                </div>

                <div className="p-6">
                    {tripsByDate && tripsByDate.length > 0 ? (
                        <TripsChart data={tripsByDate} />
                    ) : (
                        <div className="flex items-center gap-4 p-5 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                                <Bus className="h-5 w-5 text-slate-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-400">Pas assez de données disponibles.</p>
                                <p className="text-xs font-normal text-slate-300 mt-0.5">Le graphique s'affichera dès que des voyages seront enregistrés.</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BusStationDashboardPage;