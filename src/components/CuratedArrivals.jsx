"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button, Avatar } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCheckCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "@/lib/auth-client";
import {
  addToWishlist,
  getBuyerWishlist,
  removeFromWishlist,
} from "@/lib/api/buyerActions";

const getConditionStyle = (condition) => {
  switch (condition?.toLowerCase()) {
    case "pristine":
      return "bg-primary/10 text-primary border border-primary/20";
    case "like new":
      return "bg-secondary-container/20 text-secondary-container border border-secondary-container/30";
    case "refurbished":
      return "bg-tertiary-container/20 text-on-tertiary-container border border-tertiary-container/30";
    case "good":
    default:
      return "bg-outline-variant/30 text-outline border border-outline-variant/40";
  }
};

export default function CuratedArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistMap, setWishlistMap] = useState({});
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
  const { data: session } = useSession();
  const buyerEmail = session?.user?.email || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products?limit=8`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!buyerEmail) {
        setWishlistMap({});
        return;
      }
      try {
        const res = await getBuyerWishlist(buyerEmail);
        const items = Array.isArray(res) ? res : [];
        const nextMap = {};
        items.forEach((item) => {
          const productId = item.productId || item._id;
          if (productId) nextMap[productId] = item._id;
        });
        setWishlistMap(nextMap);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };
    loadWishlist();
  }, [buyerEmail]);

  const handleToggleWishlist = async (product) => {
    if (!buyerEmail) {
      alert("Please sign in to save products to your wishlist.");
      return;
    }
    const productId = product._id;
    const existingItemId = wishlistMap[productId];

    if (existingItemId) {
      try {
        setWishlistLoadingId(productId);
        await removeFromWishlist(existingItemId, buyerEmail);
        setWishlistMap((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      } finally {
        setWishlistLoadingId(null);
      }
      return;
    }

    try {
      setWishlistLoadingId(productId);
      await addToWishlist({
        buyerEmail,
        productId,
        title: product.title,
        image: product.images?.[0] || "",
        price: product.price,
        sellerEmail: product.sellerEmail,
      });
      setWishlistMap((prev) => ({ ...prev, [productId]: productId }));
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    } finally {
      setWishlistLoadingId(null);
    }
  };

  return (
    <section className="relative w-full py-16 md:py-24 px-4 sm:px-8 lg:px-16 overflow-hidden bg-surface">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-10 md:mb-14">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-on-surface font-display">
              Curated <span className="text-primary">Arrivals</span>
            </h2>
            <p className="text-sm text-on-surface-variant mt-2 font-sans">
              Handpicked premium products just for you
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/90 transition-colors font-sans"
          >
            View All <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-outline-variant/30 bg-surface-container-lowest overflow-hidden">
                <div className="h-48 bg-surface-container-high" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-surface-container-high rounded w-3/4" />
                  <div className="h-3 bg-surface-container-high rounded w-1/2" />
                  <div className="h-6 bg-surface-container-high rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-on-surface-variant text-center py-12 font-sans">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Link key={product._id} href={`/products/${product._id}`}>
                <motion.article
                  whileHover={{ y: -6, boxShadow: "0 16px 32px -12px rgba(0,0,0,0.08)" }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="group bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 flex flex-col h-full cursor-pointer hover:border-primary/30 transition-colors"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full bg-surface-container-high overflow-hidden">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/400x300"}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${getConditionStyle(product.condition)}`}>
                      {product.condition || "Available"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleWishlist(product);
                      }}
                      disabled={wishlistLoadingId === product._id}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        wishlistMap[product._id]
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-lowest/80 text-on-surface-variant hover:bg-primary hover:text-on-primary"
                      }`}
                    >
                      <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors font-sans">
                        {product.title}
                      </h3>
                      <p className="text-xs text-outline font-sans">{product.category}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-extrabold text-primary font-display">
                        ৳{product.price?.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-primary" />
                        <span className="text-xs text-on-surface-variant font-sans">
                          {product.sellerInfo?.name || "Seller"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile View All */}
        {products.length > 0 && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary font-sans"
            >
              View All Products <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
