/** @format */

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button, Avatar } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faStar,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useSession } from "@/lib/auth-client";
import {
  addToWishlist,
  getBuyerWishlist,
  removeFromWishlist,
} from "@/lib/api/buyerActions";

// ডার্ক থিমের সাথে সামঞ্জস্যপূর্ণ ডাইনামিক ব্যাজ স্টাইল
const getConditionStyle = (condition) => {
  switch (condition?.toLowerCase()) {
    case "pristine":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "like new":
      return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
    case "refurbished":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "good":
    default:
      return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
  }
};

export default function CuratedArrivals({ products = [] }) {
  const [wishlistMap, setWishlistMap] = useState({});
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
  const { data: session } = useSession();
  const buyerEmail = session?.user?.email || "";

  const displayProducts =
    products.length > 0
      ? products
      : [
          {
            _id: "product001",
            title: "Classic Heritage Leather Tote",
            category: "Luxury Accessories",
            condition: "Pristine",
            price: 45000,
            images: [
              "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
            ],
            sellerInfo: { name: "Sarah M." },
          },
          {
            _id: "product002",
            title: "Midnight Series X Console",
            category: "Gaming & Tech",
            condition: "Like New",
            price: 38000,
            images: [
              "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=600",
            ],
            sellerInfo: { name: "David K." },
          },
          {
            _id: "product003",
            title: "Ultra Titanium Smartwatch",
            category: "Wearables",
            condition: "Refurbished",
            price: 29900,
            images: [
              "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600",
            ],
            sellerInfo: { name: "Elena R." },
          },
          {
            _id: "product004",
            title: "Aviator Gold-Frame Shades",
            category: "Accessories",
            condition: "Good",
            price: 12000,
            images: [
              "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600",
            ],
            sellerInfo: { name: "James T." },
          },
        ];

  useEffect(() => {
    const loadWishlist = async () => {
      if (!buyerEmail) {
        setWishlistMap({});
        return;
      }

      try {
        const res = await getBuyerWishlist(buyerEmail);
        const items = Array.isArray(res)
          ? res
          : Array.isArray(res?.products)
            ? res.products
            : Array.isArray(res?.result)
              ? res.result
              : [];

        const nextMap = {};
        items.forEach((item) => {
          const productId = item.productId || item.product?._id || item._id;
          if (productId) {
            nextMap[productId] = item._id;
          }
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

    const productId = product._id || product.id;
    const existingItemId = wishlistMap[productId];

    if (existingItemId) {
      try {
        setWishlistLoadingId(productId);
        const res = await removeFromWishlist(existingItemId, buyerEmail);
        if (res?.success !== false) {
          setWishlistMap((prev) => {
            const next = { ...prev };
            delete next[productId];
            return next;
          });
        }
      } catch (error) {
        console.error("Error removing product from wishlist:", error);
      } finally {
        setWishlistLoadingId(null);
      }
      return;
    }

    try {
      setWishlistLoadingId(productId);
      const payload = {
        email: buyerEmail,
        productId,
        title: product.title,
        image: product.images?.[0] || product.image || "",
        price: product.price,
        category: product.category,
        condition: product.condition,
        stock: product.stock ?? 1,
      };

      const res = await addToWishlist(payload);
      if (res?.success !== false) {
        const savedId =
          res?.item?._id || res?._id || res?.data?._id || productId;
        setWishlistMap((prev) => ({ ...prev, [productId]: savedId }));
      }
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
    } finally {
      setWishlistLoadingId(null);
    }
  };

  return (
    <section className="relative w-full py-24 px-4 sm:px-8 lg:px-16 overflow-hidden bg-[#080c18] border-y border-slate-900/50 shadow-2xl">
      {/* 💡 আল্ট্রা-ওয়াইড ব্যাকগ্রাউন্ড গ্লো ইফেক্ট */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* কন্টেন্ট বাউন্ডারি - যা বড় স্ক্রিনেও দুই পাশ সুন্দরভাবে এলাইনড রাখবে */}
      <div className="max-w-[1400px] mx-auto">
        {/* SECTION HEADER */}
        <div className="relative z-10 flex justify-between items-end mb-14">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-display">
              Curated <span className="text-emerald-500">Arrivals</span>
            </h2>
            <p className="text-xs sm:text-base text-slate-400 mt-2">
              Handpicked premium products just for you
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex gap-3">
            <Button
              isIconOnly
              variant="bordered"
              className="rounded-xl border-slate-800 hover:bg-slate-900/60 min-w-11 w-11 h-11 transition-all duration-200"
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="w-4 h-4 text-slate-300"
              />
            </Button>
            <Button
              isIconOnly
              variant="bordered"
              className="rounded-xl border-slate-800 hover:bg-slate-900/60 min-w-11 w-11 h-11 transition-all duration-200"
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="w-4 h-4 text-slate-300"
              />
            </Button>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <motion.article
              key={product._id}
              whileHover={{
                y: -8,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-slate-900/30 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-850 flex flex-col h-full transition-all duration-300 shadow-xl"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
                <img
                  src={
                    product.images && product.images[0]
                      ? product.images[0]
                      : "https://via.placeholder.com/400x300"
                  }
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />

                {/* Condition Badge */}
                <span
                  className={`absolute top-4 left-4 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg backdrop-blur-md ${getConditionStyle(product.condition)}`}
                >
                  {product.condition || "Available"}
                </span>

                {/* Wishlist Button */}
                <Button
                  isIconOnly
                  radius="full"
                  onClick={() => handleToggleWishlist(product)}
                  disabled={wishlistLoadingId === (product._id || product.id)}
                  className={`absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md min-w-9 w-9 h-9 shadow-lg border border-slate-800/40 transition-all duration-200 ${
                    wishlistMap[product._id || product.id]
                      ? "bg-emerald-500 text-white"
                      : "text-slate-300 hover:bg-emerald-500 hover:text-white"
                  }`}
                >
                  <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* PRODUCT INFO AREA */}
              <div className="p-5 flex flex-col flex-grow justify-between space-y-4 bg-slate-900/10">
                <div className="space-y-1.5">
                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-200 line-clamp-1 group-hover:text-emerald-400 transition-colors duration-200 font-sans">
                    {product.title}
                  </h3>
                  {/* Category */}
                  <p className="text-xs text-slate-500 font-medium font-sans">
                    {product.category}
                  </p>
                </div>

                {/* Price & Rating Row */}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-base sm:text-lg font-black text-emerald-400">
                    ৳{product.price?.toLocaleString("en-IN") || product.price}
                  </span>

                  <Link
                    href={`/products/${product._id || product.id}`}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    View details
                  </Link>
                </div>

                {/* SELLER PROFILES FOOTER */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-850">
                  <Avatar
                    size="sm"
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerInfo?.name || "Seller"}`}
                    className="w-6 h-6 bg-slate-850 border border-slate-800"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-400 font-sans">
                      {product.sellerInfo?.name || "Unknown Seller"}
                    </span>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="w-3 h-3 text-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
