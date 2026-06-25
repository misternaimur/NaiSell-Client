/** @format */

"use client";

import React from "react";
import DashboardSideBar from "@/components/DashboardSideBar";
import ProtectedRoute from "@/components/ProtectedRoute";

const DashboardLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-[#080c18] text-white overflow-hidden">
        {/* বামপাশে ডাইনামিক সাইডবার */}
        <DashboardSideBar />

        {/* ডানপাশে মেইন কন্টেন্ট এরিয়া */}
        <main className="flex-1 h-screen overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
