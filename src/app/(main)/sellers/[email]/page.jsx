"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faArrowLeft, faStar, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function SellerProfilePage() {
  const params = useParams();
  const sellerEmail = decodeURIComponent(params.email);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products?email=${encodeURIComponent(sellerEmail)}`
        );
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch seller products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [sellerEmail]);

  const sellerName = products[0]?.sellerInfo?.name || sellerEmail.split("@")[0];

  return (
    <section className="min-h-screen bg-surface py-8 md:py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-6 font-sans">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Products</span>
        </Link>

        {/* Seller Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <FontAwesomeIcon icon={faStore} className="text-2xl text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-on-surface font-display">{sellerName}</h1>
                <FontAwesomeIcon icon={faCheckCircle} className="text-primary" />
              </div>
              <p className="text-sm text-outline font-sans">{sellerEmail}</p>
            </div>
          </div>

          <div className="flex gap-6 mt-4 pt-4 border-t border-outline-variant/20">
            <div>
              <p className="text-lg font-extrabold text-on-surface font-display">{products.length}</p>
              <p className="text-xs text-outline font-sans">Listings</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-on-surface font-display">Verified</p>
              <p className="text-xs text-outline font-sans">Seller Status</p>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <h2 className="text-lg font-bold text-on-surface font-display mb-4">Products by {sellerName}</h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-outline-variant/30 bg-surface-container-lowest overflow-hidden">
                <div className="h-48 bg-surface-container-high" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-surface-container-high rounded w-3/4" />
                  <div className="h-6 bg-surface-container-high rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-on-surface-variant text-center py-12 font-sans">No products listed yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link key={product._id} href={`/products/${product._id}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <div className="aspect-square bg-surface-container-high">
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold text-on-surface truncate font-sans">{product.title}</p>
                    <p className="text-lg font-extrabold text-primary font-display">৳{product.price?.toLocaleString()}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
