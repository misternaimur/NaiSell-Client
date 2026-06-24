/** @format */

import Image from "next/image";
import DashboardHeading from "@/components/DashboardHeading";
import {
  FaShoppingBag,
  FaHeart,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

// 🎯 ডেমো ডাটা ফেলে দিয়ে props হিসেবে ডাটা রিসিভ করা হচ্ছে
const BuyerOverviewPage = ({ buyerStats, recentPurchases = [] }) => {
  return (
    <div className="space-y-8 mt-6 pb-12 text-white">
      {/* 🎯 হেডিং সেকশন */}
      <DashboardHeading
        title="Welcome Back!"
        description="Track your recent purchases, manage your orders, and view your saved items."
      />

      {/* 📊 বায়ার স্ট্যাটস কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Total Orders */}
        <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800 shadow-xl rounded-2xl">
          <div className="p-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Total Orders
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight">
                {buyerStats?.totalOrders || 0}
              </h2>
            </div>
            <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
              <FaShoppingBag size={22} />
            </div>
          </div>
        </div>

        {/* Wishlist Count */}
        <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800 shadow-xl rounded-2xl">
          <div className="p-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Wishlist Count
              </span>
              <h2 className="text-3xl font-black text-pink-400 tracking-tight">
                {buyerStats?.wishlistCount || 0}
              </h2>
            </div>
            <div className="p-3.5 bg-pink-500/10 text-pink-400 rounded-2xl border border-pink-500/20">
              <FaHeart size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* 📦 Recent Purchases সেকশন */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-wide">
            Recent Purchases
          </h3>
          <span className="text-xs text-cyan-400 font-semibold cursor-pointer hover:underline flex items-center gap-1">
            View Order History <FaArrowRight size={10} />
          </span>
        </div>

        {/* পারচেজ লিস্ট কন্টেইনার */}
        <div className="space-y-4">
          {recentPurchases.length > 0 ? (
            recentPurchases.map((item) => (
              <div
                key={item.id || item._id}
                className="bg-slate-900/20 backdrop-blur-md border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 shadow-lg rounded-2xl"
              >
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* প্রোডাক্ট ইনফো */}
                  <div className="flex items-center gap-4">
                    {/* ইমেজ না থাকলে ফার্স্ট লেটার দেখানোর লজিক */}
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName || "Product"}
                        width={64}
                        height={64}
                        className="rounded-2xl border border-slate-700 object-cover w-16 h-16 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 text-xl font-black shrink-0 shadow-inner">
                        {item.productName
                          ? item.productName[0].toUpperCase()
                          : "P"}
                      </div>
                    )}

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-100 max-w-md line-clamp-1">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <FaClock size={11} /> {item.date}
                      </p>
                      <p className="text-sm font-black text-emerald-400 mt-1">
                        ৳{item.price?.toLocaleString("en-IN") || 0}
                      </p>
                    </div>
                  </div>

                  {/* স্ট্যাটাস ও অ্যাকশন বাটন */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-800/60 sm:border-none pt-3 sm:pt-0">
                    <span
                      className={`capitalize text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        item.status === "Delivered"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {item.status === "Delivered" && (
                        <FaCheckCircle size={12} />
                      )}
                      {item.status || "Pending"}
                    </span>

                    <button className="border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-xs px-3 py-1.5 rounded-xl transition-colors duration-200">
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // যদি কোনো পারচেজ হিস্ট্রি না থাকে
            <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              No recent purchases found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerOverviewPage;
