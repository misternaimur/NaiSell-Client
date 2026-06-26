/** @format */
"use client";

import { useState, useEffect } from "react";
import DashboardHeading from "@/components/DashboardHeading";
import { getAdminOverviewStats } from "@/lib/api/adminActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBoxesStacked,
  faCartShopping,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getAdminOverviewStats();
        if (isMounted && res && res.stats) {
          setStats({
            totalUsers: res.stats.totalUsers || 0,
            totalProducts: res.stats.totalProducts || 0,
            totalOrders: res.stats.totalOrders || 0,
          });
        }
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 mt-6 pb-12 text-on-background max-w-6xl mx-auto px-4 sm:px-0">
      {/* 🚀 Dashboard Heading */}
      <DashboardHeading
        title="Admin Overview"
        description="Monitor platform health, total users, listed products, and platform-wide orders at a glance."
      />

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <span className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="bg-surface-container border border-outline-variant/60 p-6 rounded-2xl shadow-sm flex items-center justify-between transition-all hover:border-secondary/30 hover:bg-surface-container-high">
            <div className="space-y-2">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Total Users
              </p>
              <h3 className="text-3xl font-black text-secondary">
                {stats.totalUsers.toLocaleString()}
              </h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
              <FontAwesomeIcon icon={faUsers} className="w-6 h-6" />
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-surface-container border border-outline-variant/60 p-6 rounded-2xl shadow-sm flex items-center justify-between transition-all hover:border-primary/30 hover:bg-surface-container-high">
            <div className="space-y-2">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Total Products
              </p>
              <h3 className="text-3xl font-black text-primary">
                {stats.totalProducts.toLocaleString()}
              </h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FontAwesomeIcon icon={faBoxesStacked} className="w-6 h-6" />
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-surface-container border border-outline-variant/60 p-6 rounded-2xl shadow-sm flex items-center justify-between transition-all hover:border-primary/30 hover:bg-surface-container-high">
            <div className="space-y-2">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Total Orders
              </p>
              <h3 className="text-3xl font-black text-primary">
                {stats.totalOrders.toLocaleString()}
              </h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FontAwesomeIcon icon={faCartShopping} className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Security Banner */}
      <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6 sm:p-8 flex items-center gap-6 mt-8">
        <div className="w-16 h-16 shrink-0 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
          <FontAwesomeIcon icon={faShieldHalved} className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-secondary mb-1">
            System Secured
          </h4>
          <p className="text-sm text-on-surface-variant">
            You are viewing this panel with Administrative Privileges. All actions taken here affect the entire platform. Please proceed with caution.
          </p>
        </div>
      </div>
    </div>
  );
}
