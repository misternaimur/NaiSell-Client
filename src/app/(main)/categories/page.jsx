"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Display,
  BookOpen,
  Car,
  TShirt,
  Smartphone,
  ArrowRight,
  House,
  Thunderbolt,
  Gem,
  TagDollar,
} from "@gravity-ui/icons";

const CATEGORY_ICONS = {
  Electronics: Display,
  Furniture: BookOpen,
  Vehicles: Car,
  Fashion: TShirt,
  "Mobile Phones": Smartphone,
  Mobile: Smartphone,
  Home: House,
  Gaming: Thunderbolt,
  Sports: TagDollar,
  Jewelry: Gem,
};

const CATEGORY_COLORS = [
  "from-primary/10 to-primary/5",
  "from-secondary-container/10 to-secondary-container/5",
  "from-tertiary-container/10 to-tertiary-container/5",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories`);
        const data = await res.json();
        setCategories(data.filter(Boolean));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="min-h-screen bg-surface py-12 md:py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-4">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider font-sans">
            Browse by Category
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-on-surface font-display">
            Shop by Category
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant font-sans">
            Find exactly what you&apos;re looking for from our curated categories.
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 lg:p-8 min-h-[200px]">
                <div className="w-16 h-16 rounded-full bg-surface-container-high mx-auto mb-4" />
                <div className="h-4 bg-surface-container-high rounded w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {categories.map((cat, index) => {
              const IconComponent = CATEGORY_ICONS[cat] || Display;
              const colorClass = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

              return (
                <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}>
                  <motion.div
                    whileHover={{ y: -8, boxShadow: "0 22px 35px -10px rgba(0, 54, 60, 0.08)" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="group cursor-pointer flex flex-col items-center justify-center bg-surface-container-lowest p-6 lg:p-8 rounded-2xl border border-outline-variant/40 shadow-[0_4px_12px_rgba(0,0,0,0.01)] min-h-[180px] lg:min-h-[220px] hover:border-primary/30 transition-colors"
                  >
                    <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br ${colorClass} text-on-surface-variant flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-sm`}>
                      <IconComponent className="w-6 h-6 lg:w-7 lg:h-7" />
                    </div>
                    <span className="text-sm lg:text-base font-semibold text-on-surface tracking-tight text-center font-sans">
                      {cat}
                    </span>
                    <span className="text-xs text-outline mt-1 group-hover:text-primary transition-colors font-sans">
                      Browse <ArrowRight className="inline w-3 h-3" />
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-on-surface-variant font-sans">No categories found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
