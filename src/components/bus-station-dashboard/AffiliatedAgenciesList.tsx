// src/components/bus-station-dashboard/AffiliatedAgenciesList.tsx

import React from "react";
import { AgencyWithTaxStatus } from "@/lib/hooks/useBusStationDashboard";
import Image from "next/image";
import Link from "next/link";
import { Building2, CalendarClock, Coins, ChevronRight, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

interface AffiliatedAgenciesListProps {
  agencies: AgencyWithTaxStatus[];
}

// ─── Tax Status Badge ───────────────────────────────────────────────────────

const TAX_STATUS_CONFIG = {
  payé: {
    label: "Payé",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  },
  "en attente": {
    label: "En attente",
    icon: Clock,
    className: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  },
  "en retard": {
    label: "En retard",
    icon: AlertTriangle,
    className: "bg-red-500/10 text-red-400 border border-red-500/20",
  },
} as const;

const TaxStatusBadge: React.FC<{ status: AgencyWithTaxStatus["taxStatus"] }> = ({ status }) => {
  if (!status) return null;
  const config = TAX_STATUS_CONFIG[status] ?? {
    label: status,
    icon: Clock,
    className: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
  };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

// ─── Agency Card ────────────────────────────────────────────────────────────

const AgencyCard: React.FC<{ agency: AgencyWithTaxStatus; index: number }> = ({ agency, index }) => {
  const initials = agency.longName
    ?.split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase() ?? "AG";

  return (
    <Link
      href={`/agency/${agency.idAgenceVoyage}`}
      className="group relative flex flex-col bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top accent line on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo / Avatar */}
            <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
              {agency.logoUrl ? (
                <Image
                  src={agency.logoUrl}
                  alt={agency.longName}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-xs font-semibold text-slate-500">{initials}</span>
              )}
            </div>

            {/* Name */}
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-800 truncate leading-tight">
                {agency.longName}
              </h3>
              {agency.shortName && (
                <p className="text-xs font-normal text-slate-400 truncate">{agency.shortName}</p>
              )}
            </div>
          </div>

          <TaxStatusBadge status={agency.taxStatus} />
        </div>

        {/* Description */}
        {agency.description && (
          <p className="text-xs font-normal text-slate-400 leading-relaxed line-clamp-2">
            {agency.description}
          </p>
        )}

        {/* Tax info */}
        {agency.taxStatus && (
          <div className="mt-auto pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
            {agency.taxAmount != null && (
              <div className="flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Montant</p>
                  <p className="text-xs font-semibold text-slate-700">
                    {agency.taxAmount.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
              </div>
            )}
            {agency.taxDueDate && (
              <div className="flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Échéance</p>
                  <p className="text-xs font-semibold text-slate-700">{agency.taxDueDate}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA row */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-normal text-slate-400">Voir les détails</span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-200" />
      </div>
    </Link>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
      <Building2 className="h-5 w-5 text-slate-400" />
    </div>
    <p className="text-sm font-semibold text-slate-800">Aucune agence affiliée</p>
    <p className="text-xs font-normal text-slate-400 mt-1 max-w-xs">
      Les agences ajoutées apparaîtront ici une fois enregistrées dans le système.
    </p>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const AffiliatedAgenciesList: React.FC<AffiliatedAgenciesListProps> = ({ agencies }) => {
  const total = agencies.length;
  const paid = agencies.filter((a) => a.taxStatus === "payé").length;
  const pending = agencies.filter((a) => a.taxStatus === "en attente").length;
  const late = agencies.filter((a) => a.taxStatus === "en retard").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Agences Affiliées</h2>
          <p className="text-xs font-normal text-slate-400 mt-0.5">
            {total} agence{total !== 1 ? "s" : ""} enregistrée{total !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Summary pills */}
        {total > 0 && (
          <div className="flex items-center gap-2">
            {paid > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" /> {paid} payée{paid > 1 ? "s" : ""}
              </span>
            )}
            {pending > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <Clock className="h-3 w-3" /> {pending} en attente
              </span>
            )}
            {late > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-600 border border-red-500/20">
                <AlertTriangle className="h-3 w-3" /> {late} en retard
              </span>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agencies.length === 0 ? (
          <EmptyState />
        ) : (
          agencies.map((agency, i) => {
              console.log("agency:", agency);
              return <AgencyCard key={agency.idAgenceVoyage} agency={agency} index={i} />
          })
        )}
      </div>
    </div>
  );
};

export default AffiliatedAgenciesList;