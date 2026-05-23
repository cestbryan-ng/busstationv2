"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { fadeInUp, staggerContainer } from "@/lib/animations/animationTool";
import { JSX } from "react";
import { Building, MapPin, Phone, Mail, Info, XCircle, Clock, AlertCircle } from "lucide-react";
import { useAgencyProfile } from "@/lib/hooks/dasboard/useAgencyProfile";
import Loader from "@/modals/Loader";

export default function AgencyProfilePage(): JSX.Element {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const { agency, activeTrips, cancelledTrips, isLoading, apiError } = useAgencyProfile();

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

    if (apiError) {
        return (
            <>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <AlertCircle className="h-12 w-12 text-red-500" />
                    <p className="text-gray-700 font-medium">{apiError}</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white py-16">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="container mx-auto px-4"
                >
                    <motion.h1
                        variants={fadeInUp}
                        className="text-4xl font-bold text-gray-800 mb-8"
                    >
                        Profil de l&#39;Agence
                    </motion.h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* ✅ Infos Agence — données réelles */}
                        <motion.div
                            variants={fadeInUp}
                            className="bg-white shadow-lg rounded-lg p-6"
                        >
                            <ul className="space-y-4 mb-6">
                                <li className="flex items-center">
                                    <Building className="w-6 h-6 text-primary mr-3" />
                                    <span className="font-medium text-gray-700">
                                        {agency?.longName ?? "—"}
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <MapPin className="w-6 h-6 text-primary mr-3" />
                                    <span className="text-gray-700">
                                        {agency?.location ?? "—"}
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <Phone className="w-6 h-6 text-primary mr-3" />
                                    <span className="text-gray-700">
                                        {agency?.contact?.phone ?? "—"}
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <Mail className="w-6 h-6 text-primary mr-3" />
                                    <span className="text-gray-700">
                                        {agency?.contact?.email ?? "—"}
                                    </span>
                                </li>
                            </ul>
                            <h3 className="text-xl font-semibold mb-2 flex items-center">
                                <Info className="w-5 h-5 text-primary mr-2" />
                                À propos
                            </h3>
                            <p className="text-gray-600">
                                {agency?.description ?? "Aucune description disponible."}
                            </p>
                        </motion.div>

                        {/* ✅ Voyages — données réelles */}
                        <motion.section
                            variants={staggerContainer}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            className="space-y-8"
                        >
                            {/* Voyages en cours */}
                            <motion.div
                                variants={fadeInUp}
                                className="bg-white rounded-lg shadow p-6"
                            >
                                <div className="flex items-center mb-4">
                                    <Clock className="w-8 h-8 text-primary mr-3" />
                                    <h3 className="text-lg font-semibold">
                                        Voyages en cours ({activeTrips.length})
                                    </h3>
                                </div>
                                {activeTrips.length === 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        Aucun voyage en cours.
                                    </p>
                                ) : (
                                    <ul className="text-gray-600 space-y-1">
                                        {activeTrips.map((trip) => (
                                            <li key={trip.idVoyage}>
                                                {trip.lieuDepart} → {trip.lieuArrive}{" "}
                                                ({String(trip.dateDepartPrev).split("T")[0]})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>

                            {/* Voyages annulés */}
                            <motion.div
                                variants={fadeInUp}
                                className="bg-white rounded-lg shadow p-6"
                            >
                                <div className="flex items-center mb-4">
                                    <XCircle className="w-8 h-8 text-primary mr-3" />
                                    <h3 className="text-lg font-semibold">
                                        Voyages annulés ({cancelledTrips.length})
                                    </h3>
                                </div>
                                {cancelledTrips.length === 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        Aucun voyage annulé.
                                    </p>
                                ) : (
                                    <ul className="text-gray-600 space-y-1">
                                        {cancelledTrips.map((trip) => (
                                            <li key={trip.idVoyage}>
                                                {trip.lieuDepart} → {trip.lieuArrive}{" "}
                                                ({String(trip.dateDepartPrev).split("T")[0]})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        </motion.section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </>
    );
}