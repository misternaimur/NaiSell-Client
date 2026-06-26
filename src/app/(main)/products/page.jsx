"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button, Avatar } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Magnifier, Hashtag } from "@gravity-ui/icons";
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

const ITEMS_PER_PAGE = 12;

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistMap, setWishlistMap] = useState({});
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);

  const { data: session } = useSession();
  const buyerEmail = session?.user?.email || "";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (condition) params.set("condition", condition);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products?${params}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, condition]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!buyerEmail) return;
      try {
        const res = await getBuyerWishlist(buyerEmail);
        const items = Array.isArray(res) ? res : [];
        const nextMap = {};
        items.forEach((item) => {
          const pid = item.productId || item._id;
          if (pid) nextMap[pid] = item._id;
        });
        setWishlistMap(nextMap);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };
    loadWishlist();
  }, [buyerEmail]);

  const handleToggleWishlist = async (product) => {
    if (!buyerEmail) return alert("Please sign in to save products.");
    const pid = product._id;
    if (wishlistMap[pid]) {
      try {
        setWishlistLoadingId(pid);
        await removeFromWishlist(wishlistMap[pid], buyerEmail);
        setWishlistMap((prev) => { const n = { ...prev }; delete n[pid]; return n; });
      } catch (e) { console.error(e); }
      finally { setWishlistLoadingId(null); }
    } else {
      try {
        setWishlistLoadingId(pid);
        await addToWishlist({ buyerEmail, productId: pid, title: product.title, image: product.images?.[0], price: product.price, sellerEmail: product.sellerEmail });
        setWishlistMap((prev) => ({ ...prev, [pid]: pid }));
      } catch (e) { console.error(e); }
      finally { setWishlistLoadingId(null); }
    }
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
    if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
    return 0;
  });

  const paginatedProducts = sortedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-surface py-10 md:py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface font-display">
            Explore <span className="text-primary">All Products</span>
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 font-sans">
            Find the perfect deals on pre-owned and refurbished items.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-2xl mb-8">
          <div className="relative flex items-center col-span-1 md:col-span-2">
            <span className="absolute left-3 text-outline"><Magnifier className="w-4 h-4" /></span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-sans placeholder-outline focus:outline-none focus:border-primary transition"
            />
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-outline"><Hashtag className="w-4 h-4" /></span>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-sans focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {["Electronics", "Furniture", "Vehicles", "Fashion", "Mobile Phones", "Gaming", "Sports", "Jewelry"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="relative flex items-center">
            <select
              value={condition}
              onChange={(e) => { setCondition(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 px-4 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-sans focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
            >
              <option value="">All Conditions</option>
              {["Pristine", "Like New", "Refurbished", "Good", "Used"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 px-4 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-sans focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
            >
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-outline-variant/30 bg-surface-container-lowest overflow-hidden">
                <div className="h-48 bg-surface-container-high" />
                <div className="p-4 space-y-2"><div className="h-4 bg-surface-container-high rounded w-3/4" /><div className="h-6 bg-surface-container-high rounded w-1/3" /></div>
              </div>
            ))}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <p className="text-on-surface-variant text-center py-16 font-sans">No products found matching the criteria.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {paginatedProducts.map((product) => (
                <Link key={product._id} href={`/products/${product._id}`}>
                  <motion.article
                    whileHover={{ y: -6, boxShadow: "0 16px 32px -12px rgba(0,0,0,0.08)" }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="group bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 flex flex-col h-full cursor-pointer hover:border-primary/30 transition-colors"
                  >
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
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleWishlist(product); }}
                        disabled={wishlistLoadingId === product._id}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          wishlistMap[product._id] ? "bg-primary text-on-primary" : "bg-surface-container-lowest/80 text-on-surface-variant hover:bg-primary hover:text-on-primary"
                        }`}
                      >
                        <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-grow justify-between">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors font-sans">{product.title}</h3>
                        <p className="text-xs text-outline font-sans">{product.category}</p>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-lg font-extrabold text-primary font-display">৳{product.price?.toLocaleString()}</span>
                        <div className="flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-primary" />
                          <span className="text-xs text-on-surface-variant font-sans truncate max-w-20">{product.sellerInfo?.name || "Seller"}</span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-2xl">
                <p className="text-xs text-outline font-sans">
                  Showing <span className="text-on-surface font-bold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, products.length)}</span> of <span className="text-on-surface font-bold">{products.length}</span> products
                </p>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-9 w-9 flex items-center justify-center rounded-xl border border-outline-variant/40 bg-surface text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition text-sm font-bold">‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce((acc, p, idx, arr) => { if (idx > 0 && p - arr[idx - 1] > 1) acc.push("..."); acc.push(p); return acc; }, [])
                    .map((item, idx) => item === "..." ? (
                      <span key={`e-${idx}`} className="h-9 w-9 flex items-center justify-center text-outline text-xs">···</span>
                    ) : (
                      <button key={item} onClick={() => setCurrentPage(item)} className={`h-9 w-9 flex items-center justify-center rounded-xl border text-xs font-bold transition-all ${currentPage === item ? "bg-primary border-primary text-on-primary shadow-sm" : "border-outline-variant/40 bg-surface text-on-surface-variant hover:bg-surface-container-high"}`}>{item}</button>
                    ))}
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-9 w-9 flex items-center justify-center rounded-xl border border-outline-variant/40 bg-surface text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition text-sm font-bold">›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
