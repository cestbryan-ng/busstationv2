// src/components/agencies-page-components/weekly-schedule/WeeklyScheduleList.tsx
"use client";

import { PlannerTrip } from '@/lib/types/models/Trip';
import { Clock, MapPin } from 'lucide-react';

interface WeeklyScheduleListProps {
  daysOfWeek: string[];
  dailySchedules: PlannerTrip[][][];
}

const categoryColors: { [key: string]: { bg: string; border: string } } = {
  'VIP': { bg: 'bg-purple-500', border: 'border-purple-700' },
  'Classic': { bg: 'bg-blue-500', border: 'border-blue-700' },
  'Premium': { bg: 'bg-yellow-500', border: 'border-yellow-700' },
  'Nocturne': { bg: 'bg-indigo-800', border: 'border-indigo-900' },
};

const getCategoryColor = (category: string) => {
  return categoryColors[category] || { bg: 'bg-gray-400', border: 'border-gray-600' };
};

export default function WeeklyScheduleList({ daysOfWeek, dailySchedules }: WeeklyScheduleListProps) {
  return (
    <div className="p-4 md:hidden">
      {daysOfWeek.map((day, dayIndex) => {
        const dayHasTrips = dailySchedules[dayIndex] && dailySchedules[dayIndex].flat().length > 0;
        if (!dayHasTrips) return null;

        return (
          <div key={day} className="mb-4">
            <h3 className="font-bold text-lg text-gray-700 border-b-2 border-gray-200 pb-1 mb-2">{day}</h3>
            <div className="space-y-2">
              {dailySchedules[dayIndex].flat().map(trip => {
                const colors = getCategoryColor(trip.category);
                return (
                  <div key={trip.id} className={`p-2 rounded-lg border-l-4 ${colors.bg} ${colors.border} text-white`}>
                    <div className="font-bold flex items-center gap-1.5"><MapPin className="w-4 h-4" /><span className="truncate">{trip.title}</span></div>
                    <div className="text-sm flex items-center gap-1.5"><Clock className="w-4 h-4" /><span>{`${trip.startTime} - ${trip.endTime}`}</span></div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
