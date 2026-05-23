"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { fadeInUp, staggerContainer } from "@/lib/animations/animationTool";
import { JSX } from "react";
import { User, Mail, Phone, MapPin, Award, TrendingUp, TrendingDown } from "lucide-react";
import { ClipboardList, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useBusStation } from "@/context/Provider";
import { useHistorique } from "@/lib/hooks/useHistorique";
import Loader from "@/modals/Loader";

export default function ProfilePage(): JSX.Element {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const { userData, isLoading: isUserLoading } = useBusStation();
    const { historiques, reservations, annulations, isLoading: isHistoriqueLoading } = useHistorique();

    const isLoading = isUserLoading || isHistoriqueLoading;
    const stats = [
        {
            icon: TrendingUp,
            title: "Voyages réussis",
            value: String(reservations.filter(h => h.statusHistorique === "TERMINE").length)
        },
        {
            icon: TrendingDown,
            title: "Annulations",
            value: String(annulations.length)
        },
        {
            icon: Award,
            title: "Réservations totales",
            value: String(historiques.length)
        },
        {
            icon: MapPin,
            title: "Destinations",
            value: String(
                new Set(
                    historiques
                        .map(h => h.reservation?.lieuArrive)
                        .filter(Boolean)
                ).size
            )
        },
    ];

    // Initiales pour l'avatar
    const getInitials = (firstName?: string | null, lastName?: string | null): string => {
        return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center min-h-screen">
                    <Loader />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="container mx-auto px-4 py-16"
                >
                    {/* Section de profil */}
                    <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
                        <div className="h-48 bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            {/*Correction 3 : avatar avec initiales réelles */}
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center">
                                <span className="text-4xl font-bold text-white">
                                    {getInitials(userData?.first_name, userData?.last_name)}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            {/*Correction 3 : nom réel */}
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {userData?.first_name} {userData?.last_name}
                            </h1>
                            <p className="text-gray-600">
                                {userData?.role?.join(', ') ?? 'Voyageur'}
                            </p>
                            <div className="mt-4 flex space-x-4">
                                {/*Correction 6 : lien vers le dashboard profil */}
                                <Link
                                    href="/profil"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Modifier le profil
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/*Correction 4 : stats dynamiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white rounded-lg shadow p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <stat.icon className="w-6 h-6 text-blue-500" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/*Correction 3 : informations personnelles réelles */}
                    <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow-lg p-6 mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations personnelles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border-b pb-4">
                                <div className="flex items-center text-gray-600 mb-2">
                                    <User className="w-5 h-5 text-blue-500 mr-2" />
                                    <span>Nom complet</span>
                                </div>
                                <p className="font-medium text-gray-900">
                                    {userData?.first_name} {userData?.last_name}
                                </p>
                            </div>
                            <div className="border-b pb-4">
                                <div className="flex items-center text-gray-600 mb-2">
                                    <Mail className="w-5 h-5 text-blue-500 mr-2" />
                                    <span>Email</span>
                                </div>
                                <p className="font-medium text-gray-900">
                                    {userData?.email ?? '—'}
                                </p>
                            </div>
                            <div className="border-b pb-4">
                                <div className="flex items-center text-gray-600 mb-2">
                                    <Phone className="w-5 h-5 text-blue-500 mr-2" />
                                    <span>Téléphone</span>
                                </div>
                                <p className="font-medium text-gray-900">
                                    {userData?.phone_number ?? '—'}
                                </p>
                            </div>
                            <div className="border-b pb-4">
                                <div className="flex items-center text-gray-600 mb-2">
                                    <User className="w-5 h-5 text-blue-500 mr-2" />
                                    <span>Nom d&#39;utilisateur</span>
                                </div>
                                <p className="font-medium text-gray-900">
                                    @{userData?.username ?? '—'}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* ✅ Correction 5 : historique réel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Historique des réservations */}
                        <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center mb-6">
                                <ClipboardList className="w-8 h-8 text-blue-500 mr-3" />
                                <h3 className="text-xl font-semibold">Historique des Réservations</h3>
                            </div>
                            {reservations.length === 0 ? (
                                <p className="text-gray-500 text-sm">Aucune réservation.</p>
                            ) : (
                                <div className="space-y-4">
                                    {reservations.slice(0, 3).map((h) => (
                                        <div key={h.idHistorique} className="border-l-4 border-blue-500 pl-4">
                                            <p className="text-sm text-gray-500">
                                                {h.dateReservation
                                                    ? String(h.dateReservation).split('T')[0]
                                                    : '—'}
                                            </p>
                                            <p className="font-medium text-gray-900">
                                                {h.reservation?.lieuDepart ?? '—'} → {h.reservation?.lieuArrive ?? '—'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Réservation #{h.idReservation}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <div className="space-y-8">
                            {/* Confirmations */}
                            <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                                    <h3 className="text-xl font-semibold">Confirmations</h3>
                                </div>
                                {reservations.filter(h => h.dateConfirmation).length === 0 ? (
                                    <p className="text-gray-500 text-sm">Aucune confirmation.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {reservations
                                            .filter(h => h.dateConfirmation)
                                            .slice(0, 2)
                                            .map((h) => (
                                                <div key={h.idHistorique} className="border-l-4 border-green-500 pl-4">
                                                    <p className="text-sm text-gray-500">
                                                        {String(h.dateConfirmation).split('T')[0]}
                                                    </p>
                                                    <p className="font-medium text-gray-900">
                                                        Réservation #{h.idReservation} confirmée
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Annulations */}
                            <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center mb-4">
                                    <XCircle className="w-8 h-8 text-red-500 mr-3" />
                                    <h3 className="text-xl font-semibold">Annulations</h3>
                                </div>
                                {annulations.length === 0 ? (
                                    <p className="text-gray-500 text-sm">Aucune annulation.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {annulations.slice(0, 2).map((h) => (
                                            <div key={h.idHistorique} className="border-l-4 border-red-500 pl-4">
                                                <p className="text-sm text-gray-500">
                                                    {h.dateAnnulation
                                                        ? String(h.dateAnnulation).split('T')[0]
                                                        : '—'}
                                                </p>
                                                <p className="font-medium text-gray-900">
                                                    Réservation #{h.idReservation} annulée
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </>
    );
}