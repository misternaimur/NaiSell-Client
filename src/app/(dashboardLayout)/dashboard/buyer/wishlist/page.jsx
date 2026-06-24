/** @format */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardHeading from "@/components/DashboardHeading";
import { FaTrashAlt, FaEye, FaHeart, FaShoppingCart } from "react-icons/fa";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // নির্দিষ্ট আইটেম ডিলিট করার ট্র্যাকিং

  const buyerEmail = "buyer@naisell.com"; // আপনার অথেন্টিকেশন সেশন থেকে এটি রিপ্লেস করে নেবেন

  // 📥 ডাটাবেজ থেকে উইশলিস্টের ডাটা লোড করা
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/wishlist?email=${buyerEmail}`,
      );
      const data = await res.json();
      setWishlistItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ❌ উইশলিস্ট থেকে প্রোডাক্ট রিমুভ করার ফাংশন
  const handleRemoveFromWishlist = async (id) => {
    try {
      setActionLoading(id);
      const res = await fetch(
        `http://localhost:5000/api/wishlist/${id}?email=${buyerEmail}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();

      if (data.success) {
        // রিয়েল-টাইমে স্টেট থেকে আইটেমটি বাদ দেওয়া
        setWishlistItems((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("❌ Something went wrong.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 mt-6 pb-12 text-white max-w-6xl mx-auto px-4">
      {/* 🎯 হেডিং সেকশন */}
      <DashboardHeading
        title="My Wishlist"
        description="Keep track of products you love. Save them here for future purchase or monitor price drops."
      />

      {/* 📦 উইশলিস্ট প্রোডাক্ট গ্রিড */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm tracking-wide">
          Loading your wishlist items...
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-900/20 backdrop-blur-md border border-slate-800/60 rounded-2xl shadow-2xl py-20">
          <div className="w-16 h-16 bg-slate-950/50 rounded-full flex items-center justify-center text-slate-700 mb-4 border border-slate-800">
            <FaHeart size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-300">
            Your wishlist is empty
          </h3>
          <p className="text-slate-500 text-xs mt-1 max-w-xs">
            Explore NaiSell marketplace and tap the heart icon on items you want
            to save.
          </p>
          <Link
            href="/products"
            className="mt-6 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/20 hover:opacity-90 transition-all uppercase tracking-wider"
          >
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden flex flex-col group relative transition-all duration-300 hover:border-slate-700/80 hover:-translate-y-1"
            >
              {/* প্রোডাক্ট ইমেজ */}
              <div className="relative aspect-square w-full bg-slate-950/40 overflow-hidden border-b border-slate-900">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* কন্ডিশন ট্যাগ (যেমন: Used, Like New) */}
                {item.condition && (
                  <span className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 text-cyan-400 font-medium text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {item.condition}
                  </span>
                )}

                {/* উইশলিস্ট থেকে ডিলিট করার কাস্টম ওভারলে বাটন */}
                <button
                  onClick={() => handleRemoveFromWishlist(item._id)}
                  disabled={actionLoading === item._id}
                  className="absolute top-3 right-3 p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-xl backdrop-blur-sm transition-all duration-200 shadow-md"
                  title="Remove from wishlist"
                >
                  <FaTrashAlt
                    size={12}
                    className={
                      actionLoading === item._id ? "animate-pulse" : ""
                    }
                  />
                </button>
              </div>

              {/* প্রোডাক্ট ইনফো কন্টেন্ট */}
              <div className="p-4 flex flex-col flex-grow space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {item.category || "General"}
                  </span>
                  <h3 className="font-semibold text-slate-200 text-sm line-clamp-1 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-base font-black text-emerald-400">
                    ৳ {item.price}
                  </span>
                  {item.stock <= 0 && (
                    <span className="text-[10px] font-bold text-rose-500 uppercase">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* অ্যাকশন বাটন গ্রুপ */}
                <div className="grid grid-cols-5 gap-2 pt-2 mt-auto">
                  {/* প্রোডাক্ট ডিটেইলস পেজ লিঙ্ক */}
                  <Link
                    href={`/products/${item.productId || item._id}`}
                    className="col-span-2 flex items-center justify-center p-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 text-xs font-medium transition-all"
                    title="View Product Details"
                  >
                    <FaEye size={14} />
                  </Link>

                  {/* কার্টে অ্যাড করার ডামি বা কাস্টম অ্যাকশন বাটন */}
                  <button
                    disabled={item.stock <= 0}
                    className={`col-span-3 flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                      item.stock > 0
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90"
                        : "bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    <FaShoppingCart size={12} />
                    <span>Buy</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
