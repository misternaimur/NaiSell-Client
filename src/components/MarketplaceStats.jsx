"use client";

import React from "react";
import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faStore,
  faUsers,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function MarketplaceStats({ stats }) {
  const displayStats = [
    {
      id: "products",
      label: "Total Products",
      value: stats?.totalProducts ?? 12450,
      icon: faBoxOpen,
    },
    {
      id: "sellers",
      label: "Total Sellers",
      value: stats?.totalSellers ?? 1820,
      icon: faStore,
    },
    {
      id: "buyers",
      label: "Total Buyers",
      value: stats?.totalBuyers ?? 9430,
      icon: faUsers,
    },
    {
      id: "orders",
      label: "Completed Orders",
      value: stats?.completedOrders ?? 8940,
      icon: faCircleCheck,
    },
  ];

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k+";
    }
    return num;
  };

  return (
    <section className="bg-primary py-16 md:py-20 px-4 sm:px-6 lg:px-12 text-white relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary-container/10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {displayStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="flex flex-col items-center text-center space-y-3 p-4 rounded-xl hover:bg-white/5 transition-colors duration-300"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-full bg-white/10 text-secondary-container flex items-center justify-center text-xl shadow-inner">
                <FontAwesomeIcon icon={stat.icon} />
              </div>

              {/* Counter Value */}
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
                {formatNumber(stat.value)}
              </h3>

              {/* Label */}
              <p className="text-xs sm:text-sm text-on-primary-container font-medium uppercase tracking-wider font-sans">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
