"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Star, AlertCircle, MessageSquare } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { useFeedbackPage } from "@/lib/hooks/dasboard/useFeedbackPage";
import Loader from "@/modals/Loader";

const FeedbackPage = () => {
  const { t } = useTranslation();
  // Utilisation du hook
  const { feedbacks, isLoading, error } = useFeedbackPage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
        <AlertCircle className="mx-auto h-10 w-10 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={t("dashboard.feedback.title") || "Avis Clients"}
        subtitle={t("dashboard.feedback.subtitle") || "Consultez les retours de vos voyageurs."}
      />

      {feedbacks.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">Aucun avis reçu pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
            {feedbacks.map((fb) => (
            <div
                key={fb.id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
                <div className="flex items-start justify-between">
                <div>
                    <h4 className="font-semibold text-gray-900">
                    {fb.customerName}
                    </h4>
                    <p className="text-sm text-gray-500">
                    {t("dashboard.feedback.onTrip")} &quot;{fb.tripName}&quot;
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                    <span className="font-bold text-yellow-700 text-sm mr-1">{fb.rating}</span>
                    {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${
                        i < fb.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                    />
                    ))}
                </div>
                </div>
                <p className="mt-3 text-gray-700 italic border-l-4 border-gray-100 pl-3">
                &quot;{fb.comment}&quot;
                </p>
                <p className="mt-3 text-right text-xs text-gray-400 font-medium">{fb.date}</p>
            </div>
            ))}
        </div>
      )}
    </>
  );
};

export default FeedbackPage;