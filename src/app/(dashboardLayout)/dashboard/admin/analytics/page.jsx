/** @format */
"use client";

import { useState, useEffect } from "react";
import DashboardHeading from "@/components/DashboardHeading";
import { getPlatformAnalytics } from "@/lib/api/adminActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    userGrowth: [],
    monthlyOrders: [],
    categoryPerformance: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await getPlatformAnalytics();
        if (isMounted && res && res.data) {
          setAnalytics(res.data);
        }
      } catch (error) {
        console.error("Failed to load platform analytics:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAnalytics();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 text-white">
        <span className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></span>
      </div>
    );
  }

  // Calculation helpers
  const maxUserGrowth = analytics.userGrowth.length > 0
    ? Math.max(...analytics.userGrowth.map((d) => d.amount ?? 0))
    : 1;

  const maxMonthlyOrders = analytics.monthlyOrders.length > 0
    ? Math.max(...analytics.monthlyOrders.map((d) => d.amount ?? 0))
    : 1;

  return (
    <div className="space-y-8 mt-6 pb-12 text-white max-w-6xl mx-auto px-4 sm:px-0">
      <DashboardHeading
        title="Platform Analytics"
        description="Deep insights into platform growth, user acquisition, and overall category performance."
      />

      {/* 📊 Main Layout (Charts Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 📈 User Growth Chart */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-200">
                User Growth Chart
              </h3>
              <p className="text-xs text-slate-500">
                New user registrations over time
              </p>
            </div>
            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-md">
              H1 2026
            </span>
          </div>

          <div className="h-56 flex items-end gap-2 sm:gap-4 pt-6 border-b border-slate-800 px-2">
            {analytics.userGrowth.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                No growth data available.
              </div>
            ) : (
              analytics.userGrowth.map((data, idx) => {
                const currentAmount = data.amount ?? 0;
                const barHeight = `${(currentAmount / maxUserGrowth) * 100}%`;
                return (
                  <div
                    key={`user-${idx}`}
                    className="flex-1 flex flex-col items-center group h-full justify-end relative"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-950 border border-slate-800 text-[10px] px-2 py-1 rounded-md text-amber-400 font-mono pointer-events-none transition-opacity duration-200 shadow-xl z-10 whitespace-nowrap">
                      {currentAmount.toLocaleString()} users
                    </div>
                    <div
                      style={{ height: barHeight }}
                      className="w-full bg-linear-to-t from-amber-600/40 to-amber-400 hover:from-amber-500 hover:to-amber-300 rounded-t-md transition-all duration-500 cursor-pointer shadow-lg shadow-amber-500/5"
                    />
                    <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase">
                      {data.month}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 📦 Monthly Orders Chart */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-200">
                Monthly Orders Chart
              </h3>
              <p className="text-xs text-slate-500">
                Total successful transactions platform-wide
              </p>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md">
              H1 2026
            </span>
          </div>

          <div className="h-56 flex items-end gap-2 sm:gap-4 pt-6 border-b border-slate-800 px-2">
            {analytics.monthlyOrders.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                No order data available.
              </div>
            ) : (
              analytics.monthlyOrders.map((data, idx) => {
                const currentAmount = data.amount ?? 0;
                const barHeight = `${(currentAmount / maxMonthlyOrders) * 100}%`;
                return (
                  <div
                    key={`order-${idx}`}
                    className="flex-1 flex flex-col items-center group h-full justify-end relative"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-950 border border-slate-800 text-[10px] px-2 py-1 rounded-md text-emerald-400 font-mono pointer-events-none transition-opacity duration-200 shadow-xl z-10 whitespace-nowrap">
                      {currentAmount.toLocaleString()} orders
                    </div>
                    <div
                      style={{ height: barHeight }}
                      className="w-full bg-linear-to-t from-emerald-600/40 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 rounded-t-md transition-all duration-500 cursor-pointer shadow-lg shadow-emerald-500/5"
                    />
                    <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase">
                      {data.month}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 🏆 Category Performance Chart */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-200">
                Category Performance
              </h3>
              <p className="text-xs text-slate-500">
                Revenue and volume distribution across top product categories
              </p>
            </div>
            <span className="text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              Top Categories <FontAwesomeIcon icon={faArrowRight} className="w-2.5 h-2.5" />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-4">
            {analytics.categoryPerformance.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 sm:col-span-2 text-center">
                No category data available.
              </p>
            ) : (
              analytics.categoryPerformance.map((cat, index) => (
                <div key={`cat-${index}`} className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-300">
                      {cat.category}
                    </span>
                    <span className="font-mono text-indigo-400 font-bold">
                      {cat.percentage}% share
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${cat.percentage ?? 0}%` }}
                      className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Generated Revenue</span>
                    <span className="text-slate-300 font-medium">
                      ৳ {cat.revenue?.toLocaleString() ?? 0}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
