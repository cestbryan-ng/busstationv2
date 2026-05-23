"use client"

import { JSX, useState } from "react"
import { Calendar, Timer, MapPin, MapPinIcon as MapPinHouse, Filter, Ticket, Download, Grid3X3, List, AlertCircle } from "lucide-react"
import { useCoupons } from "@/lib/hooks/useCoupons"
import Loader from "@/modals/Loader"

export default function Coupons(): JSX.Element {
    const [activeTab, setActiveTab] = useState<string>("all")
    const [downloadingCoupon, setDownloadingCoupon] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    //  Données réelles depuis le backend
    const { filteredCoupons, isLoading, error } = useCoupons(activeTab)

    const loadHtml2Pdf = async () => {
        if (typeof window !== 'undefined' && !(window as any).html2pdf) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script')
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
                script.onload = () => resolve((window as any).html2pdf)
                script.onerror = reject
                document.head.appendChild(script)
            })
        }
        return (window as any).html2pdf
    }

    const generateQRCodeUrl = (couponId: string) => {
        const qrData = `COUPON:${couponId}:${new Date().getTime()}`
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=1d4ed8`
    }

    const downloadCoupon = async (coupon: any) => {
        setDownloadingCoupon(coupon.idCoupon)
        try {
            const html2pdf = await loadHtml2Pdf()
            const element = document.createElement('div')
            element.innerHTML = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border: 3px solid #2563eb; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 25px; text-align: center;">
                        <div style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">🎫 COUPON DE REMBOURSEMENT</div>
                        <div style="font-size: 16px; opacity: 0.9;">Annulation de Voyage</div>
                    </div>
                    <div style="padding: 30px;">
                        <div style="text-align: center; margin: 25px 0; padding: 20px; background: #f0fdf4; border-radius: 8px; border: 2px solid #22c55e;">
                            <div style="font-size: 36px; font-weight: bold; color: #22c55e;">${coupon.valeur.toLocaleString()} FCFA</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0;">
                            <div style="text-align: center;">
                                <div style="font-size: 12px; color: #6b7280;">Agence</div>
                                <div style="font-size: 16px; font-weight: 600;">${coupon.nomAgence}</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 12px; color: #6b7280;">Destination</div>
                                <div style="font-size: 16px; font-weight: 600;">${coupon.lieuArrive}</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 12px; color: #6b7280;">Date Début</div>
                                <div style="font-size: 16px; font-weight: 600;">${new Date(coupon.dateDebut).toLocaleDateString("fr-FR")}</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 12px; color: #6b7280;">Date Fin</div>
                                <div style="font-size: 16px; font-weight: 600;">${new Date(coupon.dateFin).toLocaleDateString("fr-FR")}</div>
                            </div>
                        </div>
                        <div style="text-align: center; margin-top: 25px;">
                            <img src="${generateQRCodeUrl(coupon.idCoupon)}" alt="QR Code" width="120" height="120">
                            <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">ID: ${coupon.idCoupon}</div>
                        </div>
                        <div style="background: #fef3c7; color: #92400e; padding: 10px; text-align: center; font-weight: bold; margin: 20px -30px -30px -30px;">
                            ⚠️ Valide jusqu'au ${new Date(coupon.dateFin).toLocaleDateString("fr-FR", { dateStyle: "full" })}
                        </div>
                    </div>
                </div>
            `
            const options = {
                margin: 0.5,
                filename: `coupon-${coupon.idCoupon}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            }
            await html2pdf().set(options).from(element).save()
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error)
            alert('Erreur lors du téléchargement du PDF. Veuillez réessayer.')
        } finally {
            setDownloadingCoupon(null)
        }
    }

    const getStatusColor = (status: string) => {
        return status === "VALIDE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }

    const applyFilterStyle = () => {
        return "cursor-pointer px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
    }

    // ✅ États loading / erreur
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader message="Chargement de vos coupons..." />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-gray-600">{error}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-gray-100 rounded-xl shadow-sm mb-8 p-6 border border-gray-200">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Coupons</h1>
                            <p className="text-gray-600">Gérez vos coupons de remboursement et suivez leur validité</p>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                            <Ticket className="h-6 w-6" />
                            <span className="text-lg font-semibold">{filteredCoupons.length} Coupons</span>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex flex-wrap gap-3">
                        {["all", "VALIDE", "EXPIRE"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${applyFilterStyle()} ${
                                    activeTab === tab
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-200"
                                }`}
                            >
                                {tab === "all" ? "Tous les Coupons" : tab === "VALIDE" ? "Valides" : "Expirés"}
                            </button>
                        ))}
                        <button className="cursor-pointer px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 shadow-sm flex items-center gap-2 border-2 border-gray-200">
                            <Filter className="h-4 w-4" />
                            Plus de Filtres
                        </button>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-white rounded-lg p-1 border-2 border-gray-200">
                        {(['grid', 'list'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    viewMode === mode
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {mode === 'grid'
                                    ? <Grid3X3 className="h-4 w-4" />
                                    : <List className="h-4 w-4" />
                                }
                            </button>
                        ))}
                    </div>
                </div>

                {/* Coupons Grid/List — structure inchangée */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCoupons.map((coupon) => (
                            <div key={coupon.idCoupon} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group border border-gray-200">
                                <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 text-white relative overflow-hidden">
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(coupon.statusCoupon)}`}>
                                            {coupon.statusCoupon}
                                        </span>
                                    </div>
                                    <div className="text-center relative z-10">
                                        <Ticket className="h-8 w-8 mx-auto mb-2" />
                                        <h2 className="text-xl font-bold mb-1">Coupon de Remboursement</h2>
                                        <p className="text-blue-100 text-sm">Annulation de Voyage</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <p className="text-sm text-gray-500">Coupon ID</p>
                                            <p className="font-bold text-blue-800 text-lg">{coupon.idCoupon}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-600">{coupon.valeur.toLocaleString()}</p>
                                            <p className="text-sm text-green-600 font-medium">FCFA</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                                <MapPin className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Agence</p>
                                                <p className="font-semibold text-gray-900">{coupon.nomAgence}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                                                <MapPinHouse className="h-4 w-4 text-red-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Destination</p>
                                                <p className="font-semibold text-gray-900">{coupon.lieuArrive}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                                                <Calendar className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Valide du</p>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(coupon.dateDebut).toLocaleDateString("fr-FR", { dateStyle: "medium" })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                                                <Timer className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Valide jusqu&#39;au</p>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(coupon.dateFin).toLocaleDateString("fr-FR", { dateStyle: "medium" })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
                                        <img src={generateQRCodeUrl(coupon.idCoupon)} alt="QR Code" className="w-16 h-16 mx-auto mb-2 border border-gray-300 rounded" />
                                        <p className="text-xs text-gray-500">Code de vérification</p>
                                    </div>
                                    {coupon.statusCoupon === "VALIDE" && (
                                        <div className="flex gap-2 justify-center items-center">
                                            <button
                                                onClick={() => downloadCoupon(coupon)}
                                                disabled={downloadingCoupon === coupon.idCoupon}
                                                className="cursor-pointer px-6 bg-primary text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {downloadingCoupon === coupon.idCoupon
                                                    ? <div className="animate-spin w-5 h-5 border-2 border-white rounded-full"></div>
                                                    : <Download className="h-6 w-6" />
                                                }
                                            </button>
                                        </div>
                                    )}
                                    {coupon.statusCoupon === "EXPIRE" && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                                            <p className="text-red-600 font-medium text-sm">Coupon expiré</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredCoupons.map((coupon) => (
                            <div key={coupon.idCoupon} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6 flex-1">
                                            <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shrink-0">
                                                <Ticket className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">{coupon.idCoupon}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(coupon.statusCoupon)}`}>
                                                        {coupon.statusCoupon}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-500">Agence</p>
                                                        <p className="font-medium text-gray-900">{coupon.nomAgence}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Destination</p>
                                                        <p className="font-medium text-gray-900">{coupon.lieuArrive}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Début</p>
                                                        <p className="font-medium text-gray-900">{new Date(coupon.dateDebut).toLocaleDateString("fr-FR")}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Fin</p>
                                                        <p className="font-medium text-gray-900">{new Date(coupon.dateFin).toLocaleDateString("fr-FR")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 shrink-0">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-green-600">{coupon.valeur.toLocaleString()}</p>
                                                <p className="text-sm text-green-600 font-medium">FCFA</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <img src={generateQRCodeUrl(coupon.idCoupon)} alt="QR Code" className="w-12 h-12 border border-gray-300 rounded" />
                                                {coupon.statusCoupon === "VALIDE" && (
                                                    <button
                                                        onClick={() => downloadCoupon(coupon)}
                                                        disabled={downloadingCoupon === coupon.idCoupon}
                                                        className="cursor-pointer ml-3 bg-primary text-gray-700 rounded-lg px-4 py-1.5 font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {downloadingCoupon === coupon.idCoupon
                                                            ? <div className="animate-spin w-4 h-4 border-2 border-white rounded-full"></div>
                                                            : <Download className="h-5 w-5 text-white" />
                                                        }
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {filteredCoupons.length === 0 && (
                    <div className="text-center py-12">
                        <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500 mb-2">Aucun coupon trouvé</h3>
                        <p className="text-gray-400">Essayez d&#39;ajuster vos filtres pour voir plus de résultats.</p>
                    </div>
                )}
            </div>
        </div>
    )
}