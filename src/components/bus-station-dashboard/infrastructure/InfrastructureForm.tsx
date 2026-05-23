// src/components/bus-station-dashboard/infrastructure/InfrastructureForm.tsx
import React, { useState, useEffect } from "react";
import { BusStation } from "@/lib/types/bus-station";
import { Save, Building2, Image, Wrench, Navigation } from "lucide-react";

interface InfrastructureFormProps {
  station: BusStation;
  onSave?: (updatedStation: BusStation) => void;
}

const nullSafe = (value: any, defaultValue: any = "") => value ?? defaultValue;

// ─── Sous-composants UI ────────────────────────────────────────────────────

const SectionCard = ({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${color}`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-slate-700">{title}</span>
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none transition-all duration-200 placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

// ─── Composant principal ───────────────────────────────────────────────────

const InfrastructureForm: React.FC<InfrastructureFormProps> = ({ station, onSave }) => {
  const [formData, setFormData] = useState({
    nomGareRoutiere: nullSafe(station.nomGareRoutiere),
    ville: nullSafe(station.ville),
    quartier: nullSafe(station.quartier),
    description: nullSafe(station.description),
    photoUrl: nullSafe(station.imageUrl),
    services: nullSafe(station.services, []),
    horaires: nullSafe(station.horaires, "24h/7j"),
    localisation: {
      latitude: nullSafe(station.localisation?.latitude, 0),
      longitude: nullSafe(station.localisation?.longitude, 0),
    },
    estOuvert: station.estOuvert ?? true,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData({
      nomGareRoutiere: nullSafe(station.nomGareRoutiere),
      ville: nullSafe(station.ville),
      quartier: nullSafe(station.quartier),
      description: nullSafe(station.description),
      photoUrl: nullSafe(station.imageUrl),
      services: nullSafe(station.services, []),
      horaires: nullSafe(station.horaires, "24h/7j"),
      localisation: {
        latitude: nullSafe(station.localisation?.latitude, 0),
        longitude: nullSafe(station.localisation?.longitude, 0),
      },
      estOuvert: station.estOuvert ?? true,
    });
  }, [station]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    // @ts-ignore
    const checked = e.target.checked;
    setFormData((prev) => ({ ...prev, [name]: isCheckbox ? checked : value }));
  };

  const handleServicesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      services: e.target.value.split(",").map((s) => s.trim()),
    }));
  };

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    coord: "latitude" | "longitude"
  ) => {
    setFormData((prev) => ({
      ...prev,
      localisation: { ...prev.localisation, [coord]: parseFloat(e.target.value) || 0 },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave(formData as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">

      {/* En-tête */}
      <div className="mb-2">
        <h2 className="text-xl font-bold text-slate-800">Fiche Infrastructure</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Gérez les informations de votre gare routière
        </p>
      </div>

      {/* Identité */}
      <SectionCard icon={<Building2 size={15} />} title="Identité de la Gare" color="bg-blue-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nom de la gare">
            <input
              type="text"
              name="nomGareRoutiere"
              value={formData.nomGareRoutiere}
              onChange={handleChange}
              placeholder="Ex. Gare de Douala SCOP"
              className={inputClass}
            />
          </Field>
          <Field label="Ville">
            <input
              type="text"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              placeholder="Ex. Douala"
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Quartier / Adresse">
          <input
            type="text"
            name="quartier"
            value={formData.quartier}
            onChange={handleChange}
            placeholder="Ex. 48 Avenue Montorgueil"
            className={inputClass}
          />
        </Field>
        <Field label="Description">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Décrivez la gare, ses atouts…"
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </Field>
      </SectionCard>

      {/* Médias */}
      <SectionCard icon={<Image size={15} />} title="Médias" color="bg-violet-600">
        <Field label="URL de la photo de couverture">
          <input
            type="text"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
            className={inputClass}
          />
        </Field>
        {formData.photoUrl && (
          <div className="mt-1 rounded-xl overflow-hidden border border-slate-100 h-36 bg-slate-50">
            <img
              src={formData.photoUrl}
              alt="Aperçu"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </SectionCard>

      {/* Services & Horaires */}
      <SectionCard icon={<Wrench size={15} />} title="Services & Horaires" color="bg-cyan-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Services disponibles">
            <input
              type="text"
              name="services"
              value={formData.services.join(", ")}
              onChange={handleServicesChange}
              placeholder="Ex. SALLE_ATTENTE, SECURITE"
              className={inputClass}
            />
            <span className="text-xs text-slate-400">Séparez les services par des virgules</span>
          </Field>
          <Field label="Horaires d'ouverture">
            <input
              type="text"
              name="horaires"
              value={formData.horaires}
              onChange={handleChange}
              placeholder="Ex. 24h/7j"
              className={inputClass}
            />
          </Field>
        </div>

        {/* Toggle statut */}
        <Field label="Statut d'ouverture">
          <button
            type="button"
            onClick={() => setFormData((p) => ({ ...p, estOuvert: !p.estOuvert }))}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors duration-200 w-full text-left ${
              formData.estOuvert
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-slate-50 border-slate-200 text-slate-500"
            }`}
          >
            <div
              className={`relative w-10 h-5 rounded-full transition-colors duration-300 shrink-0 ${
                formData.estOuvert ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
                  formData.estOuvert ? "left-5" : "left-0.5"
                }`}
              />
            </div>
            <span className="text-sm font-medium">
              {formData.estOuvert ? "Gare actuellement ouverte" : "Gare actuellement fermée"}
            </span>
          </button>
        </Field>
      </SectionCard>

      {/* Coordonnées GPS */}
      <SectionCard icon={<Navigation size={15} />} title="Coordonnées GPS" color="bg-rose-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Latitude">
            <div className="relative">
              <input
                type="number"
                step="any"
                value={formData.localisation.latitude}
                onChange={(e) => handleLocationChange(e, "latitude")}
                placeholder="Ex. 4.0161"
                className={`${inputClass} pr-14`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-400 bg-blue-50 px-1.5 py-0.5 rounded">
                LAT
              </span>
            </div>
          </Field>
          <Field label="Longitude">
            <div className="relative">
              <input
                type="number"
                step="any"
                value={formData.localisation.longitude}
                onChange={(e) => handleLocationChange(e, "longitude")}
                placeholder="Ex. 9.7081"
                className={`${inputClass} pr-14`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-400 bg-orange-50 px-1.5 py-0.5 rounded">
                LNG
              </span>
            </div>
          </Field>
        </div>
      </SectionCard>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end pt-1 pb-4">
        <button
          type="submit"
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all duration-300 ${
            saved
              ? "bg-green-500 shadow-green-200"
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5"
          }`}
        >
          <Save size={15} />
          {saved ? "Sauvegardé !" : "Sauvegarder les modifications"}
        </button>
      </div>
    </form>
  );
};

export default InfrastructureForm;