"use client";

import React, { useState } from "react";

// Imports de composants
import Footer from "@/components/layouts/Footer"; // Gardé au cas où vous le vouliez
import NavBar from "@/components/layouts/customer-navbar/CustomerNavBar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { AgencyProvider } from "@/lib/contexts/AgencyContext";

export default function AgenciesLayout({ children }: { children: React.ReactNode; }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AgencyProvider>
      <div className="flex h-screen bg-slate-50">
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
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
    </AgencyProvider>
  );
}