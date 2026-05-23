"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBusStation } from '@/context/Provider';
import { User, Mail, Phone, KeyRound, Edit, X, AlertCircle } from 'lucide-react';
import { useForm, FieldValues } from 'react-hook-form';
import { Customer } from '@/lib/types/models/BusinessActor';

// Correction 4 : suppression de LOCAL_STORAGE_KEY et mockUpdateProfile/mockChangePassword
// Les données viennent uniquement du contexte (backend)

const getInitials = (firstName?: string | null, lastName?: string | null): string => {
    const firstInitial = firstName ? firstName[0] : '';
    const lastInitial = lastName ? lastName[0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
};

const ProfileField = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null | undefined }) => (
    <div className="flex items-start py-3">
        <div className="text-blue-600 mr-4 mt-1">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-gray-500">{label}</p>
            <p className="text-base text-gray-800">{value ?? 'Non renseigné'}</p>
        </div>
    </div>
);

const Modal = ({ children, title, onClose }: { children: React.ReactNode, title: string, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full p-1">
                    <X size={24} />
                </button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);

// Correction 2 : EditProfileModal bloquée — endpoint manquant
const EditProfileModal = ({ onClose }: { user: Customer, onClose: () => void, onUpdate: (newData: Customer) => void }) => {
    return (
        <Modal title="Modifier le profil" onClose={onClose}>
            <div className="flex flex-col items-center gap-4 py-4">
                <AlertCircle className="h-12 w-12 text-orange-400" />
                <p className="text-gray-700 font-medium text-center">
                    La modification du profil n&#39;est pas encore disponible.
                </p>
                <p className="text-gray-500 text-sm text-center">
                    L&#39;endpoint <code className="bg-gray-100 px-1 rounded">PATCH /utilisateur/{'{userId}'}</code> est en attente de création par l&#39;équipe backend.
                </p>
                <button
                    onClick={onClose}
                    className="mt-2 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
                >
                    Fermer
                </button>
            </div>
        </Modal>
    );
};

// ✅ Correction 3 : ChangePasswordModal bloquée — endpoint manquant
const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <Modal title="Changer le mot de passe" onClose={onClose}>
            <div className="flex flex-col items-center gap-4 py-4">
                <AlertCircle className="h-12 w-12 text-orange-400" />
                <p className="text-gray-700 font-medium text-center">
                    Le changement de mot de passe n&#39;est pas encore disponible.
                </p>
                <p className="text-gray-500 text-sm text-center">
                    L&#39;endpoint <code className="bg-gray-100 px-1 rounded">POST /utilisateur/change-password</code> est en attente de création par l&#39;équipe backend.
                </p>
                <button
                    onClick={onClose}
                    className="mt-2 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
                >
                    Fermer
                </button>
            </div>
        </Modal>
    );
};

export default function ProfilPage() {
    const router = useRouter();
    const { userData, isLoading, isCustomerAuthenticated, isAgencyConnected, logout } = useBusStation();
    const isAuthenticated = isCustomerAuthenticated || isAgencyConnected;
    // Correction 4 : plus de localStorage — données directement depuis le contexte
    const [modalOpen, setModalOpen] = useState<'edit' | 'password' | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Correction 1 : chemin correct sans parenthèses Next.js
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !userData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <>
            {modalOpen === 'edit' && (
                <EditProfileModal
                    user={userData}
                    onClose={() => setModalOpen(null)}
                    onUpdate={() => {}} // ← no-op en attendant l'endpoint
                />
            )}
            {modalOpen === 'password' && (
                <ChangePasswordModal onClose={() => setModalOpen(null)} />
            )}

            <div className="p-4 sm:p-6 lg:p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Paramètres du Compte</h1>
                    <p className="mt-1 text-gray-500">Gérez vos informations personnelles et de sécurité.</p>
                </header>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 p-8 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 rounded-full ring-4 ring-blue-200 bg-blue-600 flex items-center justify-center">
                                <span className="text-3xl font-bold text-white">
                                    {getInitials(userData.first_name, userData.last_name)}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mt-4">
                                {userData.first_name} {userData.last_name}
                            </h2>
                            <p className="text-gray-500 mt-1">{userData.email}</p>
                            <span className="mt-4 px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                                {userData.role.join(', ')}
                            </span>
                        </div>
                        <div className="md:w-2/3 p-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Informations Personnelles</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                                <ProfileField icon={<User size={20} />} label="Prénom" value={userData.first_name} />
                                <ProfileField icon={<User size={20} />} label="Nom" value={userData.last_name} />
                                <ProfileField icon={<User size={20} />} label="Nom d'utilisateur" value={userData.username} />
                                <ProfileField icon={<User size={20} />} label="Âge" value={userData.age ? userData.age.toString() : null} />
                                <ProfileField icon={<Mail size={20} />} label="Email" value={userData.email} />
                                <ProfileField icon={<Phone size={20} />} label="Téléphone" value={userData.phone_number} />
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4">
                                <button
                                    onClick={() => setModalOpen('edit')}
                                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                                >
                                    <Edit size={16} className="mr-2" />
                                    Modifier le Profil
                                </button>
                                <button
                                    onClick={() => setModalOpen('password')}
                                    className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
                                >
                                    <KeyRound size={16} className="mr-2" />
                                    Changer le mot de passe
                                </button>
                                <button
                                    onClick={logout}
                                    className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 md:ml-auto"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}