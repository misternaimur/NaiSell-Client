"use client";

import React from 'react';

const DashboardLayout = ({children}) => {
    return (
      <div className="min-h-screen flex bg-[#080c18] text-white">
        <aside className="w-64 bg-[#1a1f2e] border-r border-[#333] p-4">
          sidebar 
        </aside>
        <div className="flex-1 p-4">
          {children}
        </div>
      </div>
    );
};

export default DashboardLayout;