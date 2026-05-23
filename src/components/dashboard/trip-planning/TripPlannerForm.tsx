"use client"

import type React from "react"
import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import {
  Save,
  Send,
  AlertCircle,
  RefreshCw,
  FileText,
  MapPin,
  Calendar,
  Users,
  Car,
  Navigation,
  Info,
  CheckCircle,
  Plus,
  X,
  Wifi,
  Wind,
  Usb,
  Cookie,
  Coffee,
  Zap,
  Monitor,
} from "lucide-react"
import InputField from "@/ui/InputField"
import TextareaField from "@/ui/TextareaField"
import SelectField, {Option} from "@/ui/SelectField"
import type { useTripPlanner } from "@/lib/hooks/dasboard/useTripPlanner"
import { SuccessModal } from "@/modals/SuccessModal"
import TransparentModal from "@/modals/TransparentModal"
import type {UseFormRegisterReturn} from "react-hook-form"
import {Amenity} from "@/lib/types/generated-api/models/VoyageCreateRequestDTO";
import {ClassVoyage, Vehicule} from "@/lib/types/generated-api";
import {Customer} from "@/lib/types/models/BusinessActor";

interface TripPlannerFormProps {
  hook: ReturnType<typeof useTripPlanner>
}

// Composant pour gérer l'affichage d'un select avec chargement/erreur
const ResourceSelect: React.FC<{
  resourceState: {
    isLoading: boolean;
    error: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
  }
  options: {
    label: string;
    value: string
  }[]
  onReload: () => void
  label: string
  id: string
  register: UseFormRegisterReturn,
  errorMsg: string | undefined
  icon?: React.ReactNode
}> = ({ resourceState, options, onReload, label, id, register, errorMsg, icon }) => (
    <div>
      {resourceState.error ? (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Erreur de chargement</p>
                <p className="text-xs text-red-500">{resourceState.error}</p>
              </div>
              <button
                  type="button"
                  onClick={onReload}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Réessayer"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
      ) : !resourceState.isLoading && options.length === 0 ? (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center gap-3 text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Aucune donnée disponible</p>
                <p className="text-xs text-amber-700">Ajoute d&apos;abord une ressource (ou recharge la page) puis réessaie.</p>
              </div>
              <button
                type="button"
                onClick={onReload}
                className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                title="Recharger"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
      ) : (
          <SelectField
              id={id}
              options={options}
              register={register}
              error={errorMsg}
              label={label}
              icon={icon}
              disabled={resourceState.isLoading}
          />
      )}
    </div>
)

const TripPlannerForm: React.FC<TripPlannerFormProps> = ({ hook }) => {
  const {
    form,
    onSubmit,
    isSubmitting,
    isSuccess,
    successMessage,
    setIsSuccess,
    formApiError,
    isEditMode,
    vehicles,
    drivers,
    travelClasses,
    reloadVehicles,
    reloadDrivers,
    reloadClasses,
  } = hook

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = form



  const watchedAmenities = watch("amenities") || []


  const toggleAmenity = (value: Amenity) => {
    const currentAmenities = watchedAmenities || []
    const newAmenities = currentAmenities.includes(value)
        ? currentAmenities.filter((item: string) => item !== value)
        : [...currentAmenities, value]

    setValue("amenities", newAmenities);
  }

  const vehicleOptions: Option[] = vehicles.data.map((vehicle: Vehicule) => ({
    label: `${vehicle.nom} (${vehicle.plaqueMatricule}) - ${vehicle.nbrPlaces} places`,
    value: vehicle.idVehicule!,
  }))

  const driverOptions: Option[] = drivers.data.map((driver: Customer) => ({
    label: `${driver.first_name} ${driver.last_name}`,
    value: driver.userId!,
  }))

  const travelClassOptions: Option[] = travelClasses.data.map((classVoyage: ClassVoyage) => ({
    label: `${classVoyage.nom} (${classVoyage.prix} FCFA)`,
    value: classVoyage.idClassVoyage!,
  }))

  const amenitiesList = [
    {
      value: "WIFI" as Amenity,
      label: "Wi-Fi",
      icon: Wifi,
      bgActive: "border-blue-300 bg-blue-100",
      bgHover: "hover:bg-blue-50 hover:border-blue-300",
      iconColor: "text-blue-500",
      textActive: "text-black"
    },
    {
      value: "AC" as Amenity,
      label: "Climatisation",
      icon: Wind,
      bgActive: "border-cyan-300 bg-cyan-100",
      bgHover: "hover:bg-cyan-50 hover:border-cyan-300",
      iconColor: "text-cyan-500",
      textActive: "text-black"
    },
    {
      value: "USB" as Amenity,
      label: "Ports USB",
      icon: Usb,
      bgActive: "border-green-300 bg-green-100",
      bgHover: "hover:bg-green-50 hover:border-green-300",
      iconColor: "text-green-500",
      textActive: "text-black"
    },
    {
      value: "SNACKS" as Amenity,
      label: "Collations",
      icon: Cookie,
      bgActive: "border-amber-300 bg-amber-100",
      bgHover: "hover:bg-amber-50 hover:border-amber-300",
      iconColor: "text-amber-500",
      textActive: "text-black"
    },
    {
      value: "BEVERAGES" as Amenity,
      label: "Boissons",
      icon: Coffee,
      bgActive: "border-orange-300 bg-orange-100",
      bgHover: "hover:bg-orange-50 hover:border-orange-300",
      iconColor: "text-orange-500",
      textActive: "text-black"
    },
    {
      value: "POWER_OUTLETS" as Amenity,
      label: "Prises électriques",
      icon: Zap,
      bgActive: "border-yellow-300 bg-yellow-100",
      bgHover: "hover:bg-yellow-50 hover:border-yellow-300",
      iconColor: "text-yellow-500",
      textActive: "text-black"
    },
    {
      value: "ENTERTAINMENT" as Amenity,
      label: "Divertissement",
      icon: Monitor,
      bgActive: "border-purple-300 bg-purple-100",
      bgHover: "hover:bg-purple-50 hover:border-purple-300",
      iconColor: "text-purple-500",
      textActive: "text-black"
    },
  ]
  
  useEffect(() => {
      if (isEditMode) return; // ← ne pas écraser les données du mode édition
      setValue("lieuDepart", "Yaoundé", { shouldValidate: true })
      setValue("pointDeDepart", "Gare de Mvan", { shouldValidate: true })
      setValue("lieuArrive", "Douala", { shouldValidate: true })
      setValue("pointArrivee", "Gare de Bonamoussadi", { shouldValidate: true })
  }, [setValue, isEditMode])

  useEffect(() => {
      if (isEditMode) return; // ← ne pas écraser les données du mode édition
      setValue("titre", "Yaoundé-Douala", { shouldValidate: true })
      setValue(
          "description",
          "Voyage Yaoundé - Douala avec un départ planifié, réservation simple et services à bord selon le type choisi.",
          { shouldValidate: true },
      )
  }, [setValue, isEditMode])

  useEffect(() => {
      if (isEditMode) return; // ← ne pas écraser les données du mode édition
      const currentDate = getValues("dateDepartPrev")
      if (!currentDate) {
          const today = new Date().toISOString().slice(0, 10)
          setValue("dateDepartPrev", today, { shouldValidate: true })
      }
  }, [getValues, setValue, isEditMode])

  type WeekdayKey = "LUNDI" | "MARDI" | "MERCREDI" | "JEUDI" | "VENDREDI" | "SAMEDI" | "DIMANCHE"
  type ScheduleSlot = {
    day: WeekdayKey
    time: string
    kind: "VIP" | "CLASSIQUE"
    isCustom?: boolean
  }

  const weekdays: { key: WeekdayKey; label: string }[] = useMemo(
    () => [
      { key: "LUNDI", label: "Lundi" },
      { key: "MARDI", label: "Mardi" },
      { key: "MERCREDI", label: "Mercredi" },
      { key: "JEUDI", label: "Jeudi" },
      { key: "VENDREDI", label: "Vendredi" },
      { key: "SAMEDI", label: "Samedi" },
      { key: "DIMANCHE", label: "Dimanche" },
    ],
    [],
  )

  const fixedSlots: ScheduleSlot[] = useMemo(
    () => [
      { day: "LUNDI", time: "06:00", kind: "VIP" },
      { day: "LUNDI", time: "15:30", kind: "VIP" },
      { day: "LUNDI", time: "22:00", kind: "VIP" },

      { day: "MARDI", time: "06:00", kind: "VIP" },
      { day: "MARDI", time: "15:30", kind: "VIP" },
      { day: "MARDI", time: "22:00", kind: "VIP" },

      { day: "MERCREDI", time: "06:00", kind: "VIP" },
      { day: "MERCREDI", time: "15:30", kind: "VIP" },
      { day: "MERCREDI", time: "22:00", kind: "VIP" },

      { day: "JEUDI", time: "06:00", kind: "VIP" },
      { day: "JEUDI", time: "15:30", kind: "VIP" },
      { day: "JEUDI", time: "22:00", kind: "VIP" },

      { day: "VENDREDI", time: "06:00", kind: "VIP" },
      { day: "VENDREDI", time: "15:00", kind: "VIP" },
      { day: "VENDREDI", time: "22:00", kind: "VIP" },

      { day: "SAMEDI", time: "05:30", kind: "VIP" },
      { day: "SAMEDI", time: "15:30", kind: "VIP" },
      { day: "SAMEDI", time: "22:00", kind: "VIP" },

      { day: "DIMANCHE", time: "06:00", kind: "VIP" },
      { day: "DIMANCHE", time: "15:30", kind: "VIP" },
      { day: "DIMANCHE", time: "22:00", kind: "VIP" },

      { day: "LUNDI", time: "05:00", kind: "CLASSIQUE" },
      { day: "MARDI", time: "05:00", kind: "CLASSIQUE" },
      { day: "MERCREDI", time: "05:00", kind: "CLASSIQUE" },
      { day: "JEUDI", time: "05:00", kind: "CLASSIQUE" },
      { day: "VENDREDI", time: "05:00", kind: "CLASSIQUE" },
      { day: "SAMEDI", time: "04:30", kind: "CLASSIQUE" },
      { day: "DIMANCHE", time: "05:00", kind: "CLASSIQUE" },
    ],
    [],
  )

  const [customSlots, setCustomSlots] = useState<ScheduleSlot[]>([])
  const [newSlotDay, setNewSlotDay] = useState<WeekdayKey>("LUNDI")
  const [newSlotTime, setNewSlotTime] = useState<string>("")
  const [newSlotKind, setNewSlotKind] = useState<ScheduleSlot["kind"]>("CLASSIQUE")

  const newSlotKindRef = useRef<ScheduleSlot["kind"]>(newSlotKind)
  useEffect(() => {
    newSlotKindRef.current = newSlotKind
  }, [newSlotKind])

  const heureDepartEffectif = watch("heureDepartEffectif")

  const normalizeTime = (time: string): string => {
    if (!time) return time
    const trimmed = time.trim()
    const hhmmss = trimmed.match(/^([01]?\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    if (hhmmss) return `${hhmmss[1].padStart(2, "0")}:${hhmmss[2]}`

    const hhmm = trimmed.match(/^([01]?\d|2[0-3]):([0-5]\d)$/)
    if (hhmm) return `${hhmm[1].padStart(2, "0")}:${hhmm[2]}`

    const hForm = trimmed.match(/^([01]?\d|2[0-3])h([0-5]\d)$/)
    if (hForm) return `${hForm[1].padStart(2, "0")}:${hForm[2]}`

    return trimmed
  }

  const allSlotsByDay = useMemo(() => {
    const merged = [...fixedSlots, ...customSlots]

    const map: Record<WeekdayKey, ScheduleSlot[]> = {
      LUNDI: [],
      MARDI: [],
      MERCREDI: [],
      JEUDI: [],
      VENDREDI: [],
      SAMEDI: [],
      DIMANCHE: [],
    }

    for (const slot of merged) {
      map[slot.day].push({ ...slot, time: normalizeTime(slot.time) })
    }

    for (const day of Object.keys(map) as WeekdayKey[]) {
      const sorted = map[day].sort((a, b) => a.time.localeCompare(b.time))

      const byTime = new Map<string, ScheduleSlot>()
      for (const slot of sorted) {
        const existing = byTime.get(slot.time)
        if (!existing) {
          byTime.set(slot.time, slot)
          continue
        }

        // Une seule entrée par heure. Si VIP et CLASSIQUE partagent la même heure, on garde VIP.
        // On garde aussi l'info "custom" si l'un des deux est custom.
        const shouldReplace = existing.kind !== "VIP" && slot.kind === "VIP"
        const mergedCustom = Boolean(existing.isCustom || slot.isCustom)
        const next = shouldReplace ? { ...slot, isCustom: mergedCustom } : { ...existing, isCustom: mergedCustom }
        byTime.set(slot.time, next)
      }

      map[day] = Array.from(byTime.values()).sort((a, b) => a.time.localeCompare(b.time))
    }

    return map
  }, [customSlots, fixedSlots])

  const allTimes = useMemo(() => {
    const set = new Set<string>()
    for (const day of weekdays) {
      for (const slot of allSlotsByDay[day.key]) set.add(slot.time)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [allSlotsByDay, weekdays])

  const addCustomSlot = () => {
    if (!newSlotTime) return
    const normalizedTime = normalizeTime(newSlotTime)
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(normalizedTime)) return

    const kind = newSlotKindRef.current

    const exists = [...fixedSlots, ...customSlots].some(
      (s) => s.day === newSlotDay && normalizeTime(s.time) === normalizedTime,
    )
    if (exists) {
      setNewSlotTime("")
      return
    }

    setCustomSlots((prev) => [
      ...prev,
      {
        day: newSlotDay,
        time: normalizedTime,
        kind,
        isCustom: true,
      },
    ])
    setNewSlotTime("")
  }

  const removeCustomSlot = (day: WeekdayKey, time: string, kind: ScheduleSlot["kind"]) => {
    setCustomSlots((prev) => prev.filter((s) => !(s.day === day && s.time === time && s.kind === kind)))
  }

  const selectDepartureTime = (time: string) => {
    setValue("heureDepartEffectif", normalizeTime(time), { shouldValidate: true, shouldDirty: true })
  }

  return (
      <>
        <TransparentModal isOpen={isSuccess}>
          <SuccessModal
              canOpenSuccessModal={() => setIsSuccess(false)}
              message={successMessage}
          />
        </TransparentModal>

        <div className="max-w-5xl mx-auto">
          {/* Information Banner */}
          <div className="mb-8 bg-linear-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                <Info className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isEditMode ? "Modification de voyage" : "Création de voyage"}
                </h3>
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  {isEditMode
                      ? "Vous modifiez un voyage existant. Tous les changements seront sauvegardés automatiquement. Vous pouvez choisir de mettre à jour le brouillon ou de republier directement."
                      : "Créez votre voyage en remplissant les informations ci-dessous. Vous pouvez sauvegarder en brouillon pour continuer plus tard, ou publier directement pour le rendre visible aux clients."
                  }
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-orange-700">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Sauvegarde automatique
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Modification illimitée
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {/* Erreur globale */}
            {formApiError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-red-600 shrink-0" />
                    <div>
                      <h4 className="text-lg font-semibold text-red-800 mb-1">Erreur de soumission</h4>
                      <p className="text-red-700">{formApiError}</p>
                    </div>
                  </div>
                </div>
            )}

            {/* Informations Générales */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-linear-to-r from-blue-50 to-blue-100 px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Informations Générales</h2>
                    <p className="text-sm text-gray-600 mt-1">Titre et description de votre voyage</p>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <InputField
                    id="titre"
                    label="Titre du voyage"
                    register={register("titre")}
                    error={errors.titre?.message}
                    placeholder="Ex: Douala - Yaoundé Express"
                    readOnly
                />
                <TextareaField
                    id="description"
                    label="Description"
                    register={register("description")}
                    error={errors.description?.message}
                    placeholder="Décrivez votre voyage, les services inclus, les arrêts prévus..."
                    readOnly
                />
              </div>
            </div>

            {/* Itinéraire */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-linear-to-r from-emerald-50 to-emerald-100 px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Itinéraire</h2>
                    <p className="text-sm text-gray-600 mt-1">Points de départ et d&apos;arrivée</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Départ */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-emerald-100">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Navigation className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Point de Départ</h3>
                    </div>
                    <InputField
                        id="lieuDepart"
                        label="Ville de Départ"
                        register={register("lieuDepart")}
                        error={errors.lieuDepart?.message}
                        placeholder="Ex: Yaoundé"
                        readOnly
                    />
                    <InputField
                        id="pointDeDepart"
                        label="Point de Départ précis"
                        register={register("pointDeDepart")}
                        error={errors.pointDeDepart?.message}
                        placeholder="Ex: Gare de Mvan"
                        readOnly
                    />
                  </div>

                  {/* Arrivée */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-red-100">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Point d&#39;Arrivée</h3>
                    </div>
                    <InputField
                        id="lieuArrive"
                        label="Ville d'Arrivée"
                        register={register("lieuArrive")}
                        error={errors.lieuArrive?.message}
                        placeholder="Ex: Douala"
                        readOnly
                    />
                    <InputField
                        id="pointArrivee"
                        label="Point d'Arrivée précis"
                        register={register("pointArrivee")}
                        error={errors.pointArrivee?.message}
                        placeholder="Ex: Gare de Bonamoussadi"
                        readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Planning et Horaires */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-linear-to-r from-purple-50 to-purple-100 px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Planning et Horaires</h2>
                    <p className="text-sm text-gray-600 mt-1">Dates et heures du voyage</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Heure de départ (planning)</label>
                    <div className="rounded-2xl border border-purple-200 bg-linear-to-r from-purple-50 to-white p-5">
                      <div className="overflow-x-auto">
                        <div className="min-w-245">
                          <div className="grid grid-cols-[repeat(7,minmax(120px,1fr))] gap-3">
                            {weekdays.map((day) => (
                              <div key={day.key} className="text-sm font-bold text-gray-900 text-center px-2 py-2 truncate">
                                {day.label}
                              </div>
                            ))}
                            {allTimes.map((time) => (
                              <Fragment key={time}>
                                {weekdays.map((day) => {
                                  const slot = allSlotsByDay[day.key].find((s) => s.time === time)
                                  const isSelected = heureDepartEffectif === time
                                  const badgeClasses = "bg-amber-100 text-amber-800 border-amber-200"
                                  const customClasses = slot?.isCustom ? "border-dashed" : ""
                                  if (!slot) {
                                    return (
                                      <div
                                        key={`${day.key}-${time}-empty`}
                                        className="px-2 py-3 rounded-xl border border-gray-100 bg-white/60"
                                      />
                                    )
                                  }

                                  return (
                                    <div key={`${day.key}-${time}-${slot.kind}`} className="px-2 py-2">
                                      <button
                                        type="button"
                                        onClick={() => selectDepartureTime(time)}
                                        className={`w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all duration-200 ${customClasses} ${isSelected ? "border-purple-400 bg-purple-100" : "border-gray-200 bg-white hover:border-purple-300"}`}
                                        title={`Choisir ${time}`}
                                      >
                                        <span className="text-sm font-extrabold text-gray-900 tabular-nums">{time}</span>
                                        {slot.kind === "VIP" && (
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClasses}`}>VIP</span>
                                        )}
                                      </button>

                                      {slot.isCustom && (
                                        <button
                                          type="button"
                                          onClick={() => removeCustomSlot(slot.day, slot.time, slot.kind)}
                                          className="mt-2 w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-700"
                                        >
                                          <X className="h-3 w-3" />
                                          Supprimer
                                        </button>
                                      )}
                                    </div>
                                  )
                                })}
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-purple-100">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Jour</label>
                            <select
                              value={newSlotDay}
                              onChange={(e) => setNewSlotDay(e.target.value as WeekdayKey)}
                              className="w-full cursor-pointer appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white text-gray-900 transition-all duration-200 hover:border-purple-300"
                            >
                              {weekdays.map((d) => (
                                <option key={d.key} value={d.key}>
                                  {d.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Heure (HH:MM)</label>
                            <input
                              type="time"
                              value={newSlotTime}
                              onChange={(e) => setNewSlotTime(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white text-gray-900 transition-all duration-200 hover:border-purple-300"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                            <select
                              value={newSlotKind}
                              onChange={(e) => setNewSlotKind(e.target.value as ScheduleSlot["kind"])}
                              className="w-full cursor-pointer appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white text-gray-900 transition-all duration-200 hover:border-purple-300"
                            >
                              <option value="CLASSIQUE">Classique</option>
                              <option value="VIP">VIP</option>
                            </select>
                          </div>

                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={addCustomSlot}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-purple-300 rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100 hover:border-purple-400 transition-all duration-200 font-medium"
                            >
                              <Plus className="h-4 w-4" />
                              Ajouter un horaire
                            </button>
                          </div>
                        </div>

                        {errors.heureDepartEffectif?.message && (
                          <p className="text-red-500 text-xs mt-2">{errors.heureDepartEffectif?.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <InputField
                      id="heureArrive"
                      type="time"
                      label="Heure d'arrivée prévue"
                      placeholder="--:--"
                      register={register("heureArrive")}
                      error={errors.heureArrive?.message}
                  />

                  <InputField
                      id="dateLimiteReservation"
                      type="date"
                      label="Date Limite Réservation"
                      placeholder="jj/mm/aaaa"
                      register={register("dateLimiteReservation")}
                      error={errors.dateLimiteReservation?.message}
                  />

                  <InputField
                      id="dateLimiteConfirmation"
                      type="date"
                      label="Date Limite Confirmation"
                      placeholder="jj/mm/aaaa"
                      register={register("dateLimiteConfirmation")}
                      error={errors.dateLimiteConfirmation?.message}
                  />
                </div>

                <input type="hidden" {...register("heureDepartEffectif")} />
                <input type="hidden" {...register("dateDepartPrev")} />
              </div>
            </div>

            {/* Capacité */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-linear-to-r from-indigo-50 to-indigo-100 px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Capacité</h2>
                    <p className="text-sm text-gray-600 mt-1">Nombre de places disponibles</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="max-w-md">
                  <InputField
                      id="nbrPlaceReservable"
                      type="number"
                      label="Nombre de places"
                      register={register("nbrPlaceReservable")}
                      error={errors.nbrPlaceReservable?.message}
                      placeholder="Ex: 50"
                  />
                </div>
              </div>
            </div>

            {/* Prix */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-linear-to-r from-yellow-50 to-yellow-100 px-8 py-5 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Prix</h2>
                            <p className="text-sm text-gray-600 mt-1">Prix du voyage par passager</p>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <div className="max-w-md">
                        {/* ✅ Un seul champ prix — correspond à VoyageCreateRequestDTO.prix */}
                        <InputField
                            id="prix"
                            type="number"
                            label="Prix par passager (FCFA)"
                            register={register("prix")}
                            error={errors.prix?.message}
                            placeholder="Ex: 5000"
                        />
                    </div>
                </div>
            </div>

            {/* Ressources */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-linear-to-r from-teal-50 to-teal-100 px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                    <Car className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Ressources</h2>
                    <p className="text-sm text-gray-600 mt-1">Véhicule, chauffeur et classe de voyage</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <ResourceSelect
                      resourceState={travelClasses}
                      options={travelClassOptions}
                      onReload={reloadClasses}
                      label="Classe de Voyage"
                      id="classVoyageId"
                      register={register("classVoyageId")}
                      errorMsg={errors.classVoyageId?.message}
                  />
                  <ResourceSelect
                      resourceState={vehicles}
                      options={vehicleOptions}
                      onReload={reloadVehicles}
                      label="Véhicule"
                      id="vehiculeId"
                      register={register("vehiculeId")}
                      errorMsg={errors.vehiculeId?.message}
                  />
                  <ResourceSelect
                      resourceState={drivers}
                      options={driverOptions}
                      onReload={reloadDrivers}
                      label="Chauffeur"
                      id="chauffeurId"
                      register={register("chauffeurId")}
                      errorMsg={errors.chauffeurId?.message}
                  />
                </div>
              </div>
            </div>

            {/* Services et Équipements */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-linear-to-r from-rose-50 to-rose-100 px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Services et Équipements</h2>
                    <p className="text-sm text-gray-600 mt-1">Sélectionnez les services inclus dans ce voyage</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                {/* Hidden input pour react-hook-form */}
                <input type="hidden" {...register("amenities")} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {amenitiesList.map((amenity) => {
                    const IconComponent = amenity.icon
                    const isSelected = watchedAmenities.includes(amenity.value)

                    return (
                        <button
                            key={amenity.value}
                            type="button"
                            onClick={() => toggleAmenity(amenity.value)}
                            className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 group ${isSelected? `${amenity.bgActive} border-2 shadow-lg transform scale-105` : `border-gray-200 ${amenity.bgHover}`}`}
                        >
                          <IconComponent className={`h-5 w-5 transition-colors ${amenity.iconColor}`}/>
                          <span className={`text-sm font-medium transition-colors ${isSelected ? amenity.textActive : "text-gray-700 group-hover:text-gray-900"}`}>
                            {amenity.label}
                          </span>
                          {isSelected && (
                              <CheckCircle className={`h-4 w-4 ${amenity.iconColor} ml-auto`} />
                          )}
                        </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`p-4 ${formApiError && "flex justify between gap-20"}`}>

              <p className="text-red-600 font-semibold mt-4 text-md ">{formApiError}</p>

              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <button
                    type="button"
                    onClick={handleSubmit((data) => onSubmit(data, "EN_ATTENTE"))}
                    disabled={isSubmitting}
                    className="cursor-pointer flex items-center justify-center gap-3 px-8 py-4 border-2 border-orange-300 rounded-xl text-orange-700 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  <Save className="h-5 w-5"/>
                  {isEditMode ? "Mettre à jour le brouillon" : "Enregistrer en brouillon"}
                </button>
                <button
                    type="button"
                    onClick={handleSubmit((data) => onSubmit(data, "PUBLIE"))}
                    disabled={isSubmitting}
                    className="cursor-pointer flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
                >
                  <Send className="h-5 w-5"/>
                  {isEditMode ? "Mettre à jour et Publier" : "Publier le voyage"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </>
  )
}

export default TripPlannerForm