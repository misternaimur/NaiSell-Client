/** @format */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DashboardHeading from "@/components/DashboardHeading";
import { useSession } from "@/lib/auth-client";
import { getBuyerStats, getBuyerOrders } from "@/lib/api/buyerActions";
import {
  FaShoppingBag,
  FaHeart,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const BuyerOverviewPage = () => {
  const { data: session, isPending } = useSession();
  const [buyerStats, setBuyerStats] = useState({
    totalOrders: 0,
    wishlistCount: 0,
  });
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const buyerEmail = session?.user?.email || "";

  useEffect(() => {
    let isMounted = true;

    const fetchBuyerData = async () => {
      if (!buyerEmail) return;
      try {
        setLoading(true);
        const statsData = await getBuyerStats(buyerEmail);
        const ordersData = await getBuyerOrders(buyerEmail);

        if (isMounted) {
          if (statsData) {
            setBuyerStats({
              totalOrders: statsData.totalOrders || 0,
              wishlistCount: statsData.wishlistCount || 0,
            });
          }
          if (Array.isArray(ordersData)) {
            const mappedOrders = ordersData.slice(0, 5).map((order) => ({
              _id: order._id,
              productName: order.product?.title || "Product Purchase",
              image: order.product?.images?.[0] || "",
              price: order.totalAmount || 0,
              date: order.orderDate ? new Date(order.orderDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }) : "Recent",
              status: order.status || "Pending",
            }));
            setRecentPurchases(mappedOrders);
          }
        }
      } catch (error) {
        console.error("Error fetching live buyer data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!isPending && buyerEmail) {
      fetchBuyerData();
    }
  }, [buyerEmail, isPending]);

  if (isPending || loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <span className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6 pb-12 text-on-background">
      {/* 🎯 হেডিং সেকশন */}
      <DashboardHeading
        title="Welcome Back!"
        description="Track your recent purchases, manage your orders, and view your saved items."
      />

      {/* 📊 বায়ার স্ট্যাটস কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Total Orders */}
        <div className="bg-surface-container border border-outline-variant/60 shadow-sm rounded-2xl">
          <div className="p-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                Total Orders
              </span>
              <h2 className="text-3xl font-black text-on-surface tracking-tight">
                {buyerStats?.totalOrders || 0}
              </h2>
            </div>
            <div className="p-3.5 bg-primary/10 text-primary rounded-2xl border border-primary/20">
              <FaShoppingBag size={22} />
            </div>
          </div>
        </div>

        {/* Wishlist Count */}
        <div className="bg-surface-container border border-outline-variant/60 shadow-sm rounded-2xl">
          <div className="p-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                Wishlist Count
              </span>
              <h2 className="text-3xl font-black text-secondary tracking-tight">
                {buyerStats?.wishlistCount || 0}
              </h2>
            </div>
            <div className="p-3.5 bg-secondary/10 text-secondary rounded-2xl border border-secondary/20">
              <FaHeart size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* 📦 Recent Purchases সেকশন */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-on-background tracking-wide">
            Recent Purchases
          </h3>
          <Link href="/dashboard/buyer/orders" className="text-xs text-primary font-semibold cursor-pointer hover:underline flex items-center gap-1">
            View Order History <FaArrowRight size={10} />
          </Link>
        </div>

        {/* পারচেজ লিস্ট কন্টেইনার */}
        <div className="space-y-4">
          {recentPurchases.length > 0 ? (
            recentPurchases.map((item) => (
              <div
                key={item.id || item._id}
                className="bg-surface-container-low border border-outline-variant/50 hover:border-outline-variant/80 transition-all duration-300 shadow-sm rounded-2xl"
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
                        className="rounded-2xl border border-outline-variant object-cover w-16 h-16 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary text-xl font-black shrink-0 shadow-inner">
                        {item.productName
                          ? item.productName[0].toUpperCase()
                          : "P"}
                      </div>
                    )}

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-on-surface max-w-md line-clamp-1">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                        <FaClock size={11} /> {item.date}
                      </p>
                      <p className="text-sm font-black text-primary mt-1">
                        ৳{item.price?.toLocaleString("en-IN") || 0}
                      </p>
                    </div>
                  </div>

                  {/* স্ট্যাটাস ও অ্যাকশন বাটন */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-outline-variant/40 sm:border-none pt-3 sm:pt-0">
                    <span
                      className={`capitalize text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        item.status === "Delivered" || item.status === "Paid"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {(item.status === "Delivered" || item.status === "Paid") && (
                        <FaCheckCircle size={12} />
                      )}
                      {item.status || "Pending"}
                    </span>

                    <button className="border border-outline hover:bg-on-surface/5 text-on-surface-variant hover:text-on-surface font-medium text-xs px-3 py-1.5 rounded-xl transition-colors duration-200">
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // যদি কোনো পারচেজ হিস্ট্রি না থাকে
            <div className="text-center py-8 text-sm text-on-surface-variant border border-dashed border-outline-variant rounded-2xl">
              No recent purchases found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerOverviewPage;
