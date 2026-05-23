'use client';

import React, { useState } from 'react';
import {
    MapPin, Clock, User, CreditCard, UserCircle, Euro, X,
    Calendar, Phone, Search, Filter, Eye, Timer, Download,
    QrCode, Ticket, Users, Car
} from 'lucide-react';
import TransparentModal from "@/modals/TransparentModal";
import { useHistorique, HistoriqueEnrichi } from "@/lib/hooks/useHistorique";
import Loader from "@/modals/Loader";
import { AlertCircle } from "lucide-react";

export default function HistoriqueVoyage(): React.ReactElement {
    const { reservations, isLoading, error } = useHistorique();
    const [selectedReservation, setSelectedReservation] = useState<HistoriqueEnrichi | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterBy, setFilterBy] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const formatTime = (timeString: string): string => {
        if (!timeString) return '--:--';
        return new Date(timeString).toLocaleTimeString('fr-FR', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    const generateQRCode = (id: string): string => {
        const qrData = encodeURIComponent(`HISTORIQUE:${id}`);
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;
    };

    const downloadTicket = (): void => {
        if (!selectedReservation) return;
        const r = selectedReservation.reservation;
        const passager = r?.passagers?.[0];

        const ticketContent = `
            <!DOCTYPE html><html lang="fr"><head><title>Billet #${selectedReservation.idHistorique}</title>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { background: #4f46e5; color: white; padding: 20px; border-radius: 8px; text-align: center; }
                .section { margin: 20px 0; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .label { font-size: 12px; color: #64748b; }
                .value { font-weight: bold; color: #1e293b; }
            </style></head><body>
            <div class="header"><h1>🚌 Billet de Voyage #${selectedReservation.idHistorique}</h1></div>
            <div class="section">
                <h3>Itinéraire</h3>
                <div class="grid">
                    <div><div class="label">Départ</div><div class="value">${r?.lieuDepart ?? '—'}</div></div>
                    <div><div class="label">Arrivée</div><div class="value">${r?.lieuArrive ?? '—'}</div></div>
                    <div><div class="label">Heure départ</div><div class="value">${formatTime(r?.heureDepart ?? '')}</div></div>
                    <div><div class="label">Date</div><div class="value">${r?.dateDepart ?? '—'}</div></div>
                </div>
            </div>
            <div class="section">
                <h3>Passager</h3>
                <div class="grid">
                    <div><div class="label">Nom</div><div class="value">${passager?.nom ?? '—'}</div></div>
                    <div><div class="label">Siège</div><div class="value">${passager?.siege ?? '—'}</div></div>
                    <div><div class="label">Prix</div><div class="value">${passager?.prixBillet?.toLocaleString() ?? '—'} FCFA</div></div>
                </div>
            </div>
            </body></html>
        `;
        const blob = new Blob([ticketContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `billet-${selectedReservation.idHistorique}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const filteredReservations = reservations.filter((h) => {
        const r = h.reservation;
        const passager = r?.passagers?.[0];
        const matchesSearch = searchTerm === '' ||
            (passager?.nom ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.idHistorique.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r?.lieuDepart ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r?.lieuArrive ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterBy === 'all' ||
            (r?.statusVoyage ?? '').toLowerCase() === filterBy;
        const matchesStatus = statusFilter === 'all' ||
            h.statusHistorique === statusFilter;
        return matchesSearch && matchesFilter && matchesStatus;
    });

    const getStatusBadge = (status: string): string => {
        return status === 'VIP'
            ? 'bg-purple-100 text-purple-800 border-purple-200'
            : 'bg-green-100 text-green-800 border-green-200';
    };

    const getStateBadge = (state: string): string => {
        switch (state) {
            case 'EN_COURS': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'TERMINE': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader message="Chargement de votre historique..." />
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Historique des Voyages</h1>
                            <p className="text-gray-600">Consultez et téléchargez vos billets de voyage</p>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                            <Ticket className="h-6 w-6" />
                            <span className="text-lg font-semibold">{filteredReservations.length} Réservation(s)</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, ID, ville..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Filter className="h-5 w-5 text-gray-400" />
                            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="all">Tous les types</option>
                                <option value="vip">VIP</option>
                                <option value="standard">Standard</option>
                            </select>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="all">Tous les statuts</option>
                                <option value="EN_COURS">En cours</option>
                                <option value="EN_ATTENTE">En attente</option>
                                <option value="TERMINE">Terminé</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReservations.map((h) => {
                        const r = h.reservation;
                        const passager = r?.passagers?.[0];
                        return (
                            <div key={h.idHistorique}
                                className="bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300">
                                <div className="bg-linear-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-semibold text-gray-900">#{h.idHistorique}</h3>
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(r?.statusVoyage ?? '')}`}>
                                                {r?.statusVoyage ?? '—'}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStateBadge(h.statusHistorique)}`}>
                                                {h.statusHistorique}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">{passager?.nom ?? '—'}</span>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
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
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-purple-100 p-1.5 rounded-lg"><Calendar className="h-4 w-4 text-purple-600" /></div>
                                            <div>
                                                <p className="text-xs text-gray-600">Date</p>
                                                <p className="font-medium text-sm">{r?.dateDepart ?? '—'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-yellow-100 p-1.5 rounded-lg"><Clock className="h-4 w-4 text-yellow-600" /></div>
                                            <div>
                                                <p className="text-xs text-gray-600">Heure</p>
                                                <p className="font-medium text-sm">{formatTime(r?.heureDepart ?? '')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-green-100 p-1.5 rounded-lg"><Euro className="h-4 w-4 text-green-600" /></div>
                                            <div>
                                                <p className="text-xs text-gray-600">Prix</p>
                                                <p className="font-medium text-sm">{passager?.prixBillet?.toLocaleString() ?? '—'} FCFA</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-orange-100 p-1.5 rounded-lg"><Car className="h-4 w-4 text-orange-600" /></div>
                                            <div>
                                                <p className="text-xs text-gray-600">Siège</p>
                                                <p className="font-medium text-sm">{passager?.siege ?? '—'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-center">
                                        <button onClick={() => setSelectedReservation(h)}
                                            className="cursor-pointer bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2">
                                            <Eye className="h-4 w-4" /> Voir les détails
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredReservations.length === 0 && (
                    <div className="text-center py-12">
                        <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500 mb-2">Aucune réservation trouvée</h3>
                        <p className="text-gray-400">Essayez d&#39;ajuster vos filtres.</p>
                    </div>
                )}

                {/* Modal détails */}
                <TransparentModal isOpen={selectedReservation !== null}>
                    {selectedReservation && (() => {
                        const r = selectedReservation.reservation;
                        const passager = r?.passagers?.[0];
                        return (
                            <div className="flex items-center justify-center p-4">
                                <div className="bg-white shadow-2xl rounded-xl max-w-5xl w-full relative max-h-[90vh] overflow-y-auto">
                                    <div className="bg-linear-to-r from-blue-500 to-purple-600 p-6 text-white relative">
                                        <button onClick={() => setSelectedReservation(null)}
                                            className="cursor-pointer absolute top-6 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all">
                                            <X className="h-6 w-6" />
                                        </button>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/20 p-3 rounded-xl"><Ticket className="h-8 w-8" /></div>
                                            <div>
                                                <h2 className="text-2xl font-bold">Détails de la Réservation</h2>
                                                <p className="text-blue-100">Billet #{selectedReservation.idHistorique}</p>
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
                                                    { label: "Départ", value: r?.lieuDepart, color: "blue", icon: MapPin },
                                                    { label: "Arrivée", value: r?.lieuArrive, color: "green", icon: MapPin },
                                                    { label: "Date", value: r?.dateDepart, color: "purple", icon: Calendar },
                                                    { label: "Heure Départ", value: formatTime(r?.heureDepart ?? ''), color: "yellow", icon: Clock },
                                                    { label: "Heure Arrivée", value: formatTime(r?.heureArrive ?? ''), color: "teal", icon: Timer },
                                                    { label: "Statut", value: r?.statusVoyage, color: "pink", icon: CreditCard },
                                                ].map(({ label, value, color, icon: Icon }) => (
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {[
                                                    { label: "Nom", value: passager?.nom, icon: UserCircle, color: "blue" },
                                                    { label: "Carte ID", value: passager?.carteID, icon: CreditCard, color: "green" },
                                                    { label: "Âge", value: passager?.age ? `${passager.age} ans` : '—', icon: Clock, color: "purple" },
                                                    { label: "Genre", value: passager?.genre, icon: Users, color: "pink" },
                                                    { label: "Siège", value: passager?.siege, icon: Car, color: "orange" },
                                                    { label: "Téléphone", value: passager?.telephone, icon: Phone, color: "indigo" },
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
                                        {/* Financier + QR */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-purple-50 rounded-xl p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Euro className="h-5 w-5 text-purple-500" /> Prix du billet
                                                </h3>
                                                <p className="text-2xl font-bold text-purple-600">
                                                    {passager?.prixBillet?.toLocaleString() ?? '—'} FCFA
                                                </p>
                                            </div>
                                            <div className="bg-green-50 rounded-xl p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <QrCode className="h-5 w-5 text-green-500" /> Code QR
                                                </h3>
                                                <div className="flex items-center justify-center">
                                                    <img src={generateQRCode(selectedReservation.idHistorique)}
                                                        alt="QR Code" className="w-24 h-24 border-2 border-green-300 rounded-lg" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex justify-center">
                                            <button onClick={downloadTicket}
                                                className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-semibold">
                                                <Download className="h-5 w-5" /> Télécharger le Billet
                                            </button>
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