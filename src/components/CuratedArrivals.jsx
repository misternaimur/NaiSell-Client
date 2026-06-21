/** @format */
"use client";

import React from "react";
import { motion } from "motion/react";
import { Button, Avatar } from "@heroui/react";
// Font Awesome Icons Import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faStar,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons"; // Outline heart এর জন্য

// কন্ডিশন অনুযায়ী ব্যাজের ব্যাকগ্রাউন্ড কালার ডাইনামিক করার ফাংশন
const getConditionStyle = (condition) => {
  switch (condition?.toLowerCase()) {
    case "pristine":
      return "bg-[#00543c] text-white";
    case "like new":
      return "bg-[#e0e3df] text-[#181d1a]";
    case "refurbished":
      return "bg-[#ffddb5] text-[#633f00]";
    case "good":
    default:
      return "bg-[#ebefea] text-[#3f4943]";
  }
};

export default function CuratedArrivals({ products = [] }) {
  // Fallback ডামি ডেটা (যদি MongoDB থেকে ডেটা ফিমেল বা খালি থাকে)
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

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[#181d1a]"
          style={{ fontFamily: "Plus Jakarta Sans" }}
        >
          Curated Arrivals
        </h2>

        {/* Slider Controls */}
        <div className="flex gap-2">
          <Button
            isIconOnly
            variant="bordered"
            className="rounded-full border-[#bec9c2] hover:bg-[#ebefea] min-w-10 w-10 h-10"
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="w-3.5 h-3.5 text-[#181d1a]"
            />
          </Button>
          <Button
            isIconOnly
            variant="bordered"
            className="rounded-full border-[#bec9c2] hover:bg-[#ebefea] min-w-10 w-10 h-10"
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className="w-3.5 h-3.5 text-[#181d1a]"
            />
          </Button>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <motion.article
            key={product._id}
            whileHover={{
              y: -6,
              boxShadow: "0 12px 30px -10px rgba(0,0,0,0.08)",
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="group bg-white rounded-2xl overflow-hidden border border-[#bec9c2]/30 flex flex-col h-full shadow-[0_4px_16px_rgba(0,0,0,0.02)]"
          >
            {/* IMAGE CONTAINER */}
            <div className="relative aspect-[4/3] w-full bg-[#f1f5f0] overflow-hidden">
              <img
                src={
                  product.images && product.images[0]
                    ? product.images[0]
                    : "https://via.placeholder.com/400x300"
                }
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Condition Badge */}
              <span
                className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${getConditionStyle(product.condition)}`}
              >
                {product.condition || "Available"}
              </span>

              {/* Wishlist Button */}
              <Button
                isIconOnly
                radius="full"
                className="absolute top-3 right-3 bg-white/70 backdrop-blur-md hover:bg-white text-[#3f4943] hover:text-red-500 min-w-9 w-9 h-9 shadow-sm border border-white/40 transition-colors"
              >
                <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
              </Button>
            </div>

            {/* PRODUCT INFO AREA */}
            <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
              <div className="space-y-1">
                {/* Title */}
                <h3
                  className="text-sm sm:text-base font-bold text-[#181d1a] line-clamp-1 group-hover:text-[#00543c] transition-colors duration-200"
                  style={{ fontFamily: "Inter" }}
                >
                  {product.title}
                </h3>
                {/* Category */}
                <p
                  className="text-xs text-[#3f4943]"
                  style={{ fontFamily: "Inter" }}
                >
                  {product.category}
                </p>
              </div>

              {/* Price & Rating Row */}
              <div className="flex justify-between items-center pt-1">
                <span className="text-lg font-bold text-[#00543c]">
                  ৳{product.price?.toLocaleString("en-IN") || product.price}
                </span>

                {/* Rating Box (As per image_0b01b2.png) */}
                <div className="flex items-center gap-1 px-2 py-0.5 bg-[#f1f5f0] rounded-md">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="w-3 h-3 text-[#F2A93B]"
                  />
                  <span className="text-xs font-bold text-[#181d1a]">4.8</span>
                </div>
              </div>

              {/* SELLER PROFILES FOOTER */}
              <div className="flex items-center gap-2 pt-3 border-t border-[#bec9c2]/20">
                <Avatar
                  size="sm"
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerInfo?.name || "Seller"}`}
                  className="w-7 h-7 bg-[#d7dbd7]"
                />
                <div className="flex items-center gap-1">
                  <span
                    className="text-xs font-semibold text-[#181d1a]"
                    style={{ fontFamily: "Inter" }}
                  >
                    {product.sellerInfo?.name || "Unknown Seller"}
                  </span>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="w-3.5 h-3.5 text-[#00543c]"
                  />
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
