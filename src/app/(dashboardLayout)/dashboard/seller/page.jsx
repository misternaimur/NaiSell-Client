/** @format */
"use client";

import { useEffect, useState } from "react";
import DashboardHeading from "@/components/DashboardHeading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faShoppingBag,
  faCoins,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

// import { getSellerStats } from "@/lib/api/sellerActions";

const DashboardOverview = () => {
  // Live Database States
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  // 🔄 ডাটাবেজ থেকে সেলারের লাইভ স্ট্যাটিস্টিকস নিয়ে আসা
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        // const data = await getSellerStats("seller@naisell.com");
        // setStats(data);

        // ডেমো ডেটা (API রেডি হলে উপরের লাইন কমেন্টআউট করবেন)
        setStats({
          totalProducts: 42,
          totalSales: 128,
          totalRevenue: 84500,
          pendingOrders: 5,
        });
      } catch (error) {
        console.error("Error fetching live dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // স্ট্যাটস কার্ডের ডেটা অ্যারে অবজেক্ট (FontAwesome আইকনসহ)
  const cardItems = [
    {
      title: "Total Products",
      value: `${stats.totalProducts} pcs`,
      desc: "Number of products listed by you",
      icon: <FontAwesomeIcon icon={faBox} className="w-5 h-5 text-cyan-400" />,
      bgGradient: "from-cyan-500/10 to-transparent",
      borderColor: "hover:border-cyan-500/30",
    },
    {
      title: "Total Sales",
      value: stats.totalSales,
      desc: "Total completed sales volume",
      icon: (
        <FontAwesomeIcon
          icon={faShoppingBag}
          className="w-5 h-5 text-emerald-400"
        />
      ),
      bgGradient: "from-emerald-500/10 to-transparent",
      borderColor: "hover:border-emerald-500/30",
    },
    {
      title: "Total Revenue",
      value: `৳ ${stats.totalRevenue.toLocaleString()}`,
      desc: "Earnings from completed orders",
      icon: (
        <FontAwesomeIcon icon={faCoins} className="w-5 h-5 text-amber-400" />
      ),
      bgGradient: "from-amber-500/10 to-transparent",
      borderColor: "hover:border-amber-500/30",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      desc: "Orders waiting for your action",
      icon: (
        <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-rose-400" />
      ),
      bgGradient: "from-rose-500/10 to-transparent",
      borderColor: "hover:border-rose-500/30",
    },
  ];

  return (
    <div className="space-y-8 mt-6 pb-12 text-white max-w-6xl mx-auto px-4 sm:px-0">
      <DashboardHeading
        title="Dashboard Overview"
        description="Monitor your real-time business statistics, sales velocity, and pending actions."
      />

      {/* 📦 লাইভ স্ট্যাটস গ্রিড */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse bg-slate-900/40 border border-slate-800 rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cardItems.map((card, index) => (
            <div
              key={index}
              className={`relative overflow-hidden group p-5 bg-gradient-to-br ${card.bgGradient} bg-slate-900/40 backdrop-blur-md border border-slate-800 ${card.borderColor} rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-bold font-mono tracking-tight text-slate-100">
                    {card.value}
                  </h3>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 group-hover:scale-110 transition-transform flex items-center justify-center w-11 h-11">
                  {card.icon}
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4 font-medium">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
