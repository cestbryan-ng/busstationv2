"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "@/components/layouts/Footer";
import NavBar from "@/components/layouts/customer-navbar/CustomerNavBar";
import BusStationDashboardSidebar from "@/components/bus-station-dashboard/BusStationDashboardSidebar";
import { getBusStationNavLinks } from "./bsm-dashboard/busStationNavLink";
import { useBusStation } from "@/context/Provider";

export default function BusStationManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { t } = useTranslation();
    const { menuItems, secondaryMenuItems } = getBusStationNavLinks(t);
    const { logout } = useBusStation();

    return (
        <div className="flex h-screen bg-slate-50">
            <BusStationDashboardSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                menuItems={menuItems}
                secondaryMenuItems={secondaryMenuItems}
                logout={logout}
            />
            <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <NavBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1">
                    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
                        {children}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}