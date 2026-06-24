/** @format */

import DashboardHeading from "@/components/DashboardHeading";
import { Card, Avatar, Chip, Button } from "@heroui/react";
import {
  FaShoppingBag,
  FaHeart,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const BuyerOverviewPage = async () => {

  const buyerStats = {
    totalOrders: 14, 
    wishlistCount: 8, 
  };

 
  const recentPurchases = [
    {
      id: "p1",
      productName: "Sony WH-1000XM4 Wireless Headphones",
      price: 22500,
      status: "Delivered",
      date: "Ordered on 18 June, 2026",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&q=80",
    },
    {
      id: "p2",
      productName: "Keychron K2 Mechanical Keyboard",
      price: 6800,
      status: "In Transit",
      date: "Ordered on 21 June, 2026",
      image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&q=80",
    },
  ];

  return (
    <div className="space-y-8 mt-6 pb-12 text-white">
      {/* 🎯 হেডিং সেকশন */}
      <DashboardHeading
        title="Welcome Back!"
        description="Track your recent purchases, manage your orders, and view your saved items."
      />

      {/* 📊 বায়ার স্ট্যাটস কার্ড গ্রিড (২টি কার্ড) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Total Orders */}
        <Card
          className="bg-slate-900/30 backdrop-blur-md border border-slate-800 shadow-xl"
          radius="xl"
        >
          <div className="p-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Total Orders
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight">
                {buyerStats.totalOrders}
              </h2>
            </div>
            <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
              <FaShoppingBag size={22} />
            </div>
          </div>
        </Card>

        {/* Wishlist Count */}
        <Card
          className="bg-slate-900/30 backdrop-blur-md border border-slate-800 shadow-xl"
          radius="xl"
        >
          <div className="p-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Wishlist Count
              </span>
              <h2 className="text-3xl font-black text-pink-400 tracking-tight">
                {buyerStats.wishlistCount}
              </h2>
            </div>
            <div className="p-3.5 bg-pink-500/10 text-pink-400 rounded-2xl border border-pink-500/20">
              <FaHeart size={22} />
            </div>
          </div>
        </Card>
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
          {recentPurchases.map((item) => (
            <Card
              key={item.id}
              className="bg-slate-900/20 backdrop-blur-md border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 shadow-lg"
              radius="xl"
            >
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* প্রোডাক্ট ইনফো */}
                <div className="flex items-center gap-4">
                  <Avatar
                    radius="xl"
                    src={item.image}
                    className="w-16 h-16 border border-slate-700 object-cover"
                  />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-100 max-w-md line-clamp-1">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <FaClock size={11} /> {item.date}
                    </p>
                    <p className="text-sm font-black text-emerald-400 mt-1">
                      ৳{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* স্ট্যাটাস ও অ্যাকশন বাটন */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-800/60 sm:border-none pt-3 sm:pt-0">
                  <Chip
                    className="capitalize border-none text-xs font-bold"
                    color={item.status === "Delivered" ? "success" : "primary"}
                    size="sm"
                    variant="flat"
                    startContent={
                      item.status === "Delivered" ? (
                        <FaCheckCircle size={12} className="ml-1" />
                      ) : null
                    }
                  >
                    {item.status}
                  </Chip>

                  <Button
                    size="sm"
                    variant="bordered"
                    className="border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-xs rounded-xl"
                  >
                    Track Order
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerOverviewPage;
