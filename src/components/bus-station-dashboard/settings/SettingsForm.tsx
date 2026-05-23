// src/components/bus-station-dashboard/settings/SettingsForm.tsx
import React, { useState, useEffect } from "react";
import { BusStationManagerAccount } from "@/lib/types/bus-station";
import { User, Mail, Phone, Briefcase, Clock, Save, ShieldCheck } from "lucide-react";

interface SettingsFormProps {
  account: BusStationManagerAccount;
  onSave?: (updatedAccount: BusStationManagerAccount) => void;
}

// ─── Field ───────────────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  icon: React.ElementType;
  value: string;
  type?: string;
  name?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field: React.FC<FieldProps> = ({
  id, label, icon: Icon, value, type = "text", name, readOnly = false, onChange,
}) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
      <Icon className="h-3 w-3" />
      {label}
      {readOnly && (
        <span className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-400 border border-slate-200 normal-case tracking-normal">
          <ShieldCheck className="h-2.5 w-2.5" /> Lecture seule
        </span>
      )}
    </label>
    <input
      id={id}
      name={name ?? id}
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={[
        "w-full h-9 px-3 rounded-lg border text-sm font-normal transition-colors duration-150 outline-none",
        readOnly
          ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
          : "bg-white border-slate-200 text-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 hover:border-slate-300",
      ].join(" ")}
    />
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const SettingsForm: React.FC<SettingsFormProps> = ({ account, onSave }) => {
  const [formData, setFormData] = useState<BusStationManagerAccount>(account);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(account);
  }, [account]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-sm font-semibold text-slate-800">Paramètres du compte</h2>
        <p className="text-xs font-normal text-slate-400 mt-0.5">
          Gérez les informations de votre compte administrateur.
        </p>
      </div>

      {/* Form card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">

        {/* Section: Informations personnelles */}
        <div className="px-6 pt-5 pb-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 pb-4 border-b border-slate-100">
            Informations personnelles
          </p>
        </div>

        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="name"
            label="Nom complet"
            icon={User}
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Field
            id="email"
            label="Email"
            icon={Mail}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Field
            id="phone"
            label="Téléphone"
            icon={Phone}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Section: Compte */}
        <div className="px-6 pt-2 pb-1 border-t border-slate-100">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 pb-4 border-b border-slate-100">
            Informations du compte
          </p>
        </div>

        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="role"
            label="Rôle"
            icon={Briefcase}
            value={formData.role}
            readOnly
          />
          <Field
            id="lastLogin"
            label="Dernière connexion"
            icon={Clock}
            value={new Date(formData.lastLogin).toLocaleString("fr-FR")}
            readOnly
          />
        </div>

        {/* Footer: submit */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Modifications sauvegardées
            </span>
          )}
          {!saved && <span />}

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
          >
            <Save className="h-3.5 w-3.5" />
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;