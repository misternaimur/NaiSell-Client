"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function TrustedSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/sellers/top`);
        const data = await res.json();
        setSellers(data);
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-surface border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-container-high rounded w-64 mx-auto" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-surface-container-high rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (sellers.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12 bg-surface border-t border-outline-variant/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider font-sans">
            Top Sellers
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-display">
            Trusted Sellers Showcase
          </h2>
          <p className="text-sm text-on-surface-variant font-sans">
            Meet our most active and trusted sellers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-6">
          {sellers.map((seller, index) => (
            <motion.div
              key={seller.email}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link href={`/sellers/${encodeURIComponent(seller.email)}`}>
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 text-center hover:border-primary/30 transition-colors cursor-pointer h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    {seller.image ? (
                      <img src={seller.image} alt={seller.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <FontAwesomeIcon icon={faStore} className="text-primary" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-on-surface truncate font-sans">{seller.name}</p>
                  <p className="text-xs text-outline font-sans">{seller.totalProducts} listings</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
