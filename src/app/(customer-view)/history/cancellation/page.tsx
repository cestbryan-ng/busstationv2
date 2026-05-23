'use client';

import React, { useState } from 'react';
import {
    MapPin, Clock, User, CreditCard, UserCircle, Euro, X,
    Calendar, Ban, Phone, AlertTriangle, Search, Filter,
    Eye, Building, Timer
} from 'lucide-react';
import TransparentModal from "@/modals/TransparentModal";
import { Tooltip } from "antd";
import { useHistorique, HistoriqueEnrichi } from "@/lib/hooks/useHistorique";
import Loader from "@/modals/Loader";
import { AlertCircle } from "lucide-react";

type FilterType = 'all' | 'client' | 'agence';

export default function CancellationHistoryVoyage(): React.ReactElement {
    const { annulations, isLoading, error } = useHistorique();
    const [selectedReservation, setSelectedReservation] = useState<HistoriqueEnrichi | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterBy, setFilterBy] = useState<FilterType>('all');

    const formatTime = (timeString: string): string => {
        if (!timeString) return '--:--';
        return new Date(timeString).toLocaleTimeString('fr-FR', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredAnnulations = annulations.filter((h) => {
        const r = h.reservation;
        const passager = r?.passagers?.[0];
        const matchesSearch = searchTerm === '' ||
            (passager?.nom ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.idHistorique.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r?.lieuDepart ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r?.lieuArrive ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterBy === 'all' ||
            (h.origineAnnulation ?? '').toLowerCase() === filterBy;
        return matchesSearch && matchesFilter;
    });

    const getInitiatorBadge = (initiator: string): string => {
        if (initiator?.toLowerCase() === 'client') return 'bg-blue-100 text-blue-800 border-blue-200';
        if (initiator?.toLowerCase() === 'agence') return 'bg-orange-100 text-orange-800 border-orange-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusBadge = (status: string): string => {
        return status === 'VIP'
            ? 'bg-purple-100 text-purple-800 border-purple-200'
            : 'bg-green-100 text-green-800 border-green-200';
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader message="Chargement des annulations..." />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-gray-600">{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gray-100 rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Voyages Annulés</h1>
                            <p className="text-gray-600">Historique de vos réservations annulées</p>
                        </div>
                        <div className="flex items-center gap-2 text-red-600">
                            <Ban className="h-6 w-6" />
                            <span className="text-lg font-semibold">{filteredAnnulations.length} Annulation(s)</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" placeholder="Rechercher par nom, ID, ville..."
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Filter className="h-5 w-5 text-gray-400" />
                            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value as FilterType)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="all">Tous les initiateurs</option>
                                <option value="client">Client</option>
                                <option value="agence">Agence</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAnnulations.map((h) => {
                        const r = h.reservation;
                        const passager = r?.passagers?.[0];
                        return (
                            <div key={h.idHistorique}
                                className="bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-red-300">
                                <div className="bg-linear-to-r from-red-50 to-red-100 p-4 border-b border-red-200">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-semibold text-gray-900">#{h.idHistorique}</h3>
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(r?.statusVoyage ?? '')}`}>
                                                {r?.statusVoyage ?? '—'}
                                            </span>
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                                Annulé
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">{passager?.nom ?? '—'}</span>
                                    </div>
                                </div>
                                <div className="p-4 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-blue-100 p-1.5 rounded-lg"><MapPin className="h-4 w-4 text-blue-600" /></div>
                                            <div>
                                                <p className="text-xs text-gray-600">Départ</p>
                                                <p className="font-medium text-sm">{r?.lieuDepart ?? '—'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-green-100 p-1.5 rounded-lg"><MapPin className="h-4 w-4 text-green-600" /></div>
                                            <div>
                                                <p className="text-xs text-gray-600">Arrivée</p>
                                                <p className="font-medium text-sm">{r?.lieuArrive ?? '—'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-red-100 p-1.5 rounded-lg"><AlertTriangle className="h-4 w-4 text-red-600" /></div>
                                        <div>
                                            <p className="text-xs text-gray-600">Annulé par</p>
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getInitiatorBadge(h.origineAnnulation)}`}>
                                                {h.origineAnnulation ?? '—'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-10 flex justify-center">
                                        <button onClick={() => setSelectedReservation(h)}
                                            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                                            <Eye className="h-4 w-4" /> Voir les détails
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredAnnulations.length === 0 && (
                    <div className="text-center py-12">
                        <Ban className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500 mb-2">Aucune annulation trouvée</h3>
                        <p className="text-gray-400">Essayez d&#39;ajuster vos filtres.</p>
                    </div>
                )}

                {/* Modal détails */}
                <TransparentModal isOpen={selectedReservation !== null}>
                    {selectedReservation && (() => {
                        const h = selectedReservation;
                        const r = h.reservation;
                        const passager = r?.passagers?.[0];
                        return (
                            <div className="flex items-center justify-center p-4">
                                <div className="bg-white shadow-2xl rounded-xl max-w-5xl w-full relative max-h-[90vh] overflow-y-auto">
                                    <div className="bg-linear-to-r from-red-500 to-red-600 p-6 text-white relative">
                                        <Tooltip title="Fermer" placement="top">
                                            <button onClick={() => setSelectedReservation(null)}
                                                className="cursor-pointer absolute top-6 right-4 text-white bg-white/50 hover:bg-white/70 rounded-full p-2 transition-all">
                                                <X className="h-6 w-6" />
                                            </button>
                                        </Tooltip>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-white/20"><Ban className="h-8 w-8" /></div>
                                            <div>
                                                <h2 className="text-2xl font-bold">Détails de l&#39;Annulation</h2>
                                                <p className="text-red-100">Réservation #{h.idHistorique}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {/* Voyage */}
                                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <MapPin className="h-5 w-5 text-blue-500" /> Informations du Voyage
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {[
                                                    { label: "Départ", value: r?.lieuDepart, icon: MapPin, color: "blue" },
                                                    { label: "Arrivée", value: r?.lieuArrive, icon: MapPin, color: "green" },
                                                    { label: "Date", value: r?.dateDepart, icon: Calendar, color: "purple" },
                                                    { label: "Heure Départ", value: formatTime(r?.heureDepart ?? ''), icon: Clock, color: "yellow" },
                                                    { label: "Heure Arrivée", value: formatTime(r?.heureArrive ?? ''), icon: Timer, color: "teal" },
                                                    { label: "Statut", value: r?.statusVoyage, icon: CreditCard, color: "pink" },
                                                ].map(({ label, value, icon: Icon, color }) => (
                                                    <div key={label} className="flex items-center gap-3">
                                                        <div className={`bg-${color}-100 p-2 rounded-lg`}>
                                                            <Icon className={`h-5 w-5 text-${color}-600`} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">{label}</p>
                                                            <p className="font-semibold text-gray-900">{value ?? '—'}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Passager */}
                                        <div className="bg-blue-50 rounded-xl p-6 mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <User className="h-5 w-5 text-blue-500" /> Informations Passager
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-100 p-2 rounded-lg"><UserCircle className="h-5 w-5 text-blue-600" /></div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Nom</p>
                                                        <p className="font-semibold text-gray-900">{passager?.nom ?? '—'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-green-100 p-2 rounded-lg"><Phone className="h-5 w-5 text-green-600" /></div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Téléphone</p>
                                                        <p className="font-semibold text-gray-900">{passager?.telephone ?? '—'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Annulation */}
                                        <div className="bg-red-50 rounded-xl p-6 mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <AlertTriangle className="h-5 w-5 text-red-500" /> Détails de l&#39;Annulation
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-red-100 p-2 rounded-lg"><UserCircle className="h-5 w-5 text-red-600" /></div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Initiateur</p>
                                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getInitiatorBadge(h.origineAnnulation)}`}>
                                                            {h.origineAnnulation ?? '—'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-orange-100 p-2 rounded-lg"><Calendar className="h-5 w-5 text-orange-600" /></div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Date d&#39;annulation</p>
                                                        <p className="font-semibold text-gray-900">{h.dateAnnulation ?? '—'}</p>
                                                    </div>
                                                </div>
                                                <div className="col-span-full flex items-start gap-3">
                                                    <div className="bg-yellow-100 p-2 rounded-lg"><AlertTriangle className="h-5 w-5 text-yellow-600" /></div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Cause</p>
                                                        <p className="font-semibold text-gray-900">{h.causeAnnulation ?? '—'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Agence + Remboursement */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-green-50 rounded-xl p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Building className="h-5 w-5 text-green-500" /> Agence
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-green-100 p-2 rounded-lg"><Building className="h-5 w-5 text-green-600" /></div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Nom</p>
                                                        <p className="font-semibold text-gray-900">{r?.nomAgence ?? '—'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-purple-50 rounded-xl p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Euro className="h-5 w-5 text-purple-500" /> Remboursement
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-purple-100 p-2 rounded-lg"><Euro className="h-5 w-5 text-purple-600" /></div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Montant remboursé</p>
                                                        <p className="text-2xl font-bold text-purple-600">
                                                            {h.compensation?.toLocaleString() ?? '—'} FCFA
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </TransparentModal>
            </div>
        </div>
    );
}