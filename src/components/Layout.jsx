import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import GoBackButton from "./GoBackButton";
import { Rocket } from "lucide-react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Hide "Go Back" on dashboard and contact page
  const hideGoBack = location.pathname === "/dashboard" || location.pathname === "/contact";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-md transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:static`}
      >
        {/* Sidebar header */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
          <Rocket className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-lg text-gray-800">Social-Earn</span>
        </div>

        <Sidebar closeMenu={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar (mobile only) */}
        <header className="sm:hidden flex items-center justify-between bg-white shadow px-4 py-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <Rocket className="w-6 h-6 text-blue-600" />
            Trendwatch Social Media Promotion
          </Link>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Close" : "Menu"}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 sm:ml-64 transition-all duration-300">
          {!hideGoBack && <GoBackButton />}
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black bg-opacity-30 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}