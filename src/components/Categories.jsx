"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Display,
  BookOpen,
  Car,
  TShirt,
  Smartphone,
  ArrowRight,
} from "@gravity-ui/icons";

const CATEGORIES = [
  {
    id: 1,
    name: "Electronics",
    icon: Display,
    href: "/categories/electronics",
  },
  { id: 2, name: "Furniture", icon: BookOpen, href: "/categories/furniture" },
  { id: 3, name: "Vehicles", icon: Car, href: "/categories/vehicles" },
  { id: 4, name: "Fashion", icon: TShirt, href: "/categories/fashion" },
  { id: 5, name: "Mobile", icon: Smartphone, href: "/categories/mobile" },
];

export default function Categories() {
  return (
    <section className="relative w-full max-w-[1600px] min-h-[739px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-24 py-12 md:py-16 bg-surface overflow-hidden flex items-center">
      <div className="w-full mx-auto">
        {/* HEADER AREA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 lg:mb-16 gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-bold tracking-tight text-on-surface font-display">
              Shop by Category
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant font-sans">
              Curated selections from our most trusted sellers.
            </p>
          </div>

          {/* View All Categories Link */}
          <Link
            href="/categories"
            className="group flex items-center gap-2 text-sm lg:text-base font-semibold text-primary hover:text-primary/95 transition-colors duration-200 font-sans"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* CATEGORIES GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-6 xl:gap-8">
          {CATEGORIES.map((category) => {
            const IconComponent = category.icon;

            return (
              <Link key={category.id} href={category.href} className="block">
                <motion.div
                  whileHover={{
                    y: -8,
                    boxShadow: "0 22px 35px -10px rgba(0, 54, 60, 0.08)",
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group cursor-pointer flex flex-col items-center justify-center bg-surface-container-lowest p-6 sm:p-8 lg:p-10 xl:p-12 rounded-2xl border border-outline-variant/40 shadow-[0_4px_12px_rgba(0,0,0,0.01)] h-full min-h-[180px] lg:min-h-[220px] xl:min-h-[260px]"
                >
                  {/* Icon Wrapper */}
                  <div className="w-14 h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full bg-primary/5 text-on-surface-variant flex items-center justify-center mb-5 xl:mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                    <IconComponent className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
                  </div>

                  {/* Category Name */}
                  <span className="text-sm lg:text-base xl:text-lg font-semibold text-on-surface tracking-tight text-center transition-colors duration-200 group-hover:text-primary font-sans">
                    {category.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
