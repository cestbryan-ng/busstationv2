import React from "react";

export type StatCardData = {
  label: string;
  value: string;
  currency?: string;
  change: string;
  gradient:string
  changeType: "increase" | "decrease";
  icon: React.ElementType;
};

export type ResourceTab = "vehicles" | "drivers" | "employees"|"classes";






export type Trip = {
  id: string;
  title: string;
  departureLocation: string;
  destinationLocation: string;
  departureDate: string;
  returnDate?: string;
  price: number;
  description?: string;
  vehicleId: string;
  driverId: string;
  capacity: number;
  reservations: number;
  route: string;


  status: "on_schedule" | "completed" | "cancelled"; // Statut du voyage
};


export interface Feedback {
  id: string;
  customerName: string;
  tripName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SubscriptionPlan {
  name: string;
  price: string;
  features: string[];
  isCurrent: boolean;
}

export interface BillingHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
}




export type ResourceStatus = 'available' | 'in_use' | 'maintenance';
export type DriverStatus = 'available' | 'on_trip' | 'on_leave';
export type TripStatus = 'published' | 'completed' | 'cancelled';

/*

export interface CalendarEvent {
  id: string; // idVoyage
  title: string; // titre du voyage
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any; // Pour react-big-calendar
  status: 'EN_ATTENTE' | 'PUBLIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
}
*/