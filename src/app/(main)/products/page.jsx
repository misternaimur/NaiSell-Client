"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button, Avatar } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { Magnifier, Hashtag } from "@gravity-ui/icons";
import { serverFetch } from "@/lib/api/server";

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

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  const categories = [
    "Electronics",
    "Gadgets",
    "Fashion",
    "Home Appliances",
    "Automobiles",
  ];
  const conditions = ["Used", "Like New", "Refurbished", "Pristine", "Good"];

  // Pagination State
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        search: search.trim(),
        category,
        condition,
      }).toString();

      const res = await serverFetch(`api/products?${queryParams}`);
      if (res && Array.isArray(res)) {
        setProducts(res);
      } else if (res && Array.isArray(res.products)) {
        setProducts(res.products);
      } else if (res && Array.isArray(res.result)) {
        setProducts(res.result);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, condition]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, condition]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-[#080c18] pb-24 pt-12 text-white px-4 sm:px-8 lg:px-16 overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
            Explore <span className="text-emerald-500">All Products</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-2xl mx-auto">
            Find the perfect deals on pre-owned and refurbished items. Use the filters below to narrow down your search.
          </p>
        </div>

        {/* 🔍 Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-lg mb-10">
          <div className="relative flex items-center col-span-1 md:col-span-2">
            <span className="absolute left-4 text-slate-500">
              <Magnifier className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search products by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-800 bg-slate-950/40 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-500">
              <Hashtag className="w-4 h-4" />
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-800 bg-slate-950/40 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex items-center">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-slate-800 bg-slate-950/40 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Conditions</option>
              {conditions.map((cond) => (
                <option key={cond} value={cond} className="bg-slate-900 text-white">
                  {cond}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 📦 Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <span className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent"></span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-lg">No products found matching the criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
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
                    <Image
                      src={
                        product.images && product.images[0]
                          ? product.images[0]
                          : product.image
                          ? product.image
                          : "https://via.placeholder.com/400x300"
                      }
                      alt={product.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />

                    {/* Condition Badge */}
                    <span
                      className={`absolute top-4 left-4 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg backdrop-blur-md ${getConditionStyle(
                        product.condition
                      )}`}
                    >
                      {product.condition || "Available"}
                    </span>

                    {/* Wishlist Button */}
                    <Button
                      isIconOnly
                      radius="full"
                      className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md hover:bg-emerald-500 text-slate-300 hover:text-white min-w-9 w-9 h-9 shadow-lg border border-slate-800/40 transition-all duration-200"
                    >
                      <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  {/* PRODUCT INFO AREA */}
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-4 bg-slate-900/10">
                    <div className="space-y-1.5">
                      <h3 className="text-sm sm:text-base font-bold text-slate-200 line-clamp-1 group-hover:text-emerald-400 transition-colors duration-200 font-sans">
                        {product.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium font-sans">
                        {product.category}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-base sm:text-lg font-black text-emerald-400">
                        ৳{product.price?.toLocaleString("en-IN") || product.price}
                      </span>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-950/60 rounded-md border border-slate-800">
                        <FontAwesomeIcon icon={faStar} className="w-2.5 h-2.5 text-amber-400" />
                        <span className="text-[11px] font-bold text-slate-300">4.8</span>
                      </div>
                    </div>

                    {/* SELLER PROFILES FOOTER */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-850">
                      <Avatar
                        size="sm"
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                          product.sellerInfo?.name || product.sellerEmail || "Seller"
                        }`}
                        className="w-6 h-6 bg-slate-850 border border-slate-800"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-400 font-sans truncate max-w-[120px]">
                          {product.sellerInfo?.name || product.sellerEmail || "Unknown Seller"}
                        </span>
                        <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                {/* Showing X–Y of Z */}
                <p className="text-xs text-slate-500 font-medium">
                  Showing{" "}
                  <span className="text-slate-300 font-bold">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, products.length)}
                  </span>{" "}
                  of <span className="text-slate-300 font-bold">{products.length}</span> products
                </p>

                {/* Page Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                    )
                    .reduce((acc, page, idx, arr) => {
                      if (idx > 0 && page - arr[idx - 1] > 1) {
                        acc.push("...");
                      }
                      acc.push(page);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="h-9 w-9 flex items-center justify-center text-slate-600 text-xs select-none"
                        >
                          ···
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setCurrentPage(item)}
                          className={`h-9 w-9 flex items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                            currentPage === item
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                              : "border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}