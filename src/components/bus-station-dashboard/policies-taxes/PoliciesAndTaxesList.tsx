// src/components/bus-station-dashboard/policies-taxes/PoliciesAndTaxesList.tsx
import React from "react";
import { PolicyAndTax } from "@/lib/types/bus-station";
import { FileText, Tag, CalendarDays, Landmark, ScrollText, ExternalLink } from "lucide-react";

interface PoliciesAndTaxesListProps {
  policiesAndTaxes: PolicyAndTax[];
}

// ─── Category Badge ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { className: string; icon: React.ElementType }> = {
  Taxe: {
    className: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    icon: Landmark,
  },
  Politique: {
    className: "bg-violet-500/10 text-violet-600 border border-violet-500/20",
    icon: ScrollText,
  },
};

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const config = CATEGORY_CONFIG[category] ?? {
    className: "bg-slate-100 text-slate-500 border border-slate-200",
    icon: Tag,
  };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${config.className}`}>
      <Icon className="h-3 w-3" />
      {category}
    </span>
  );
};

// ─── Policy Card ─────────────────────────────────────────────────────────────

const PolicyCard: React.FC<{ item: PolicyAndTax }> = ({ item }) => (
  <div className="group flex flex-col bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200 relative">
    {/* Accent line */}
    <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

    <div className="p-5 flex flex-col gap-3 flex-1">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800 leading-snug">
          {item.title}
        </h3>
        <CategoryBadge category={item.category} />
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-xs font-normal text-slate-400 leading-relaxed line-clamp-3">
          {item.description}
        </p>
      )}

      {/* Meta info */}
      <div className="mt-auto pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Montant</p>
            <p className="text-xs font-semibold text-slate-700">
              {item.amount ? `${item.amount.toLocaleString("fr-FR")} FCFA` : "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Effectif</p>
            <p className="text-xs font-semibold text-slate-700">
              {item.effectiveDate ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Document link */}
    {item.documentUrl && (
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <a
          href={item.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          <FileText className="h-3.5 w-3.5" />
          Voir le document
          <ExternalLink className="h-3 w-3 opacity-60" />
        </a>
      </div>
    )}
  </div>
);

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
      <ScrollText className="h-5 w-5 text-slate-400" />
    </div>
    <p className="text-sm font-semibold text-slate-800">Aucune politique ou taxe</p>
    <p className="text-xs font-normal text-slate-400 mt-1 max-w-xs">
      Les règlements et taxes configurés apparaîtront ici.
    </p>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const PoliciesAndTaxesList: React.FC<PoliciesAndTaxesListProps> = ({ policiesAndTaxes }) => {
  const taxes = policiesAndTaxes.filter((p) => p.category === "Taxe").length;
  const policies = policiesAndTaxes.filter((p) => p.category !== "Taxe").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Politiques &amp; Taxes</h2>
          <p className="text-xs font-normal text-slate-400 mt-0.5">
            Gestion des règlements et des taxes de la gare routière.
          </p>
        </div>

        {/* Summary pills */}
        {policiesAndTaxes.length > 0 && (
          <div className="flex items-center gap-2">
            {taxes > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                <Landmark className="h-3 w-3" /> {taxes} taxe{taxes > 1 ? "s" : ""}
              </span>
            )}
            {policies > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-violet-500/10 text-violet-600 border border-violet-500/20">
                <ScrollText className="h-3 w-3" /> {policies} politique{policies > 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {policiesAndTaxes.length === 0 ? (
          <EmptyState />
        ) : (
          policiesAndTaxes.map((item) => <PolicyCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
};

export default PoliciesAndTaxesList;