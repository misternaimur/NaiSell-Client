/** @format */
"use client";

import { useState, useEffect } from "react";
import DashboardHeading from "@/components/DashboardHeading";
import { getSellerAnalytics } from "@/lib/api/sellerActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCircleDollarToSlot,
  faCartShopping,
  faBoxesStacked,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
// 💡 সেশন থেকে লগইন করা ইউজারের ইমেইল বের করার হুক
import { useSession } from "@/lib/auth-client";

const SalesAnalyticsPage = () => {
  const { data: session, isPending: sessionLoading } = useSession();

  const [analyticsData, setAnalyticsData] = useState(null);
  const [totalProductsCount, setTotalProductsCount] = useState(0); // 💡 প্রোডাক্ট কাউন্ট স্টেট
  const [loading, setLoading] = useState(true);

  const sellerEmail = session?.user?.email;

  useEffect(() => {
    const fetchAnalyticsAndProducts = async () => {
      if (!sellerEmail) return;

      try {
        setLoading(true);

        // ১. এনালিটিক্স ডেটা ফেচ করা
        const analyticsRes = await getSellerAnalytics(sellerEmail);
        let targetData = null;
        if (analyticsRes) {
          targetData = analyticsRes.result || analyticsRes.data || analyticsRes;
        }

        // ২. 💡 প্রোডাক্ট এপিআই থেকে ডেটা ফেচ করে এই সেলারের টোটাল প্রোডাক্ট কাউন্ট বের করা
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const productsRes = await fetch(`${apiUrl}/api/products`);

        let fetchedProductsCount = 0;
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          // এপিআই স্ট্রাকচার অনুযায়ী অ্যারে খুঁজে বের করা (res.data বা সরাসরি res)
          const allProducts = Array.isArray(productsData)
            ? productsData
            : productsData.data || productsData.result || [];

          // লগইন করা সেলারের ইমেইলের সাথে ফিল্টার করে টোটাল কাউন্ট বের করা
          const sellerProducts = allProducts.filter(
            (prod) => prod.sellerEmail === sellerEmail,
          );
          fetchedProductsCount = sellerProducts.length;
        }

        // ৩. স্টেট সেট করা
        setTotalProductsCount(fetchedProductsCount);
        setAnalyticsData({
          stats: {
            totalRevenue: targetData?.stats?.totalRevenue ?? 0,
            totalOrders:
              targetData?.stats?.totalOrders ??
              targetData?.stats?.totalSales ??
              0,
            conversionRate: targetData?.stats?.conversionRate ?? "0.0%",
          },
          monthlySales: Array.isArray(targetData?.monthlySales)
            ? targetData.monthlySales
            : [],
          topProducts: Array.isArray(targetData?.topProducts)
            ? targetData.topProducts
            : [],
        });
      } catch (error) {
        console.error("Error fetching data for analytics page:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!sessionLoading) {
      fetchAnalyticsAndProducts();
    }
  }, [sellerEmail, sessionLoading]);

  if (sessionLoading || loading) {
    return (
      <div className="flex justify-center py-24 text-white">
        <span className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center py-24 text-slate-400 text-sm">
        Please log in to view your sales analytics.
      </div>
    );
  }

  const salesArray = analyticsData?.monthlySales || [];
  const maxSalesAmount =
    salesArray.length > 0
      ? Math.max(...salesArray.map((d) => d.amount ?? 0))
      : 1;

  return (
    <div className="space-y-8 mt-6 pb-12 text-white max-w-6xl mx-auto px-4 sm:px-0">
      <DashboardHeading
        title="Sales Analytics"
        description="Visual representation of your store's business performance. Track trends, revenue flows, and your top-performing products."
      />

      {/* 📊 Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Total Revenue */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-2xl font-bold text-emerald-400">
              ৳ {analyticsData?.stats?.totalRevenue?.toLocaleString() ?? 0}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FontAwesomeIcon icon={faCircleDollarToSlot} className="w-5 h-5" />
          </div>
        </div>

        {/* 2. Total Products (ডাইনামিকালি ফিল্টার করা কাউন্ট) */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Products
            </p>
            <h3 className="text-2xl font-bold text-slate-100">
              {totalProductsCount} Items
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FontAwesomeIcon icon={faBoxesStacked} className="w-5 h-5" />
          </div>
        </div>

        {/* 3. Total Orders */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Orders
            </p>
            <h3 className="text-2xl font-bold text-slate-100">
              {analyticsData?.stats?.totalOrders ?? 0} Orders
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <FontAwesomeIcon icon={faCartShopping} className="w-5 h-5" />
          </div>
        </div>

        {/* 4. Conversion Rate */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Conversion Rate
            </p>
            <h3 className="text-2xl font-bold text-amber-400">
              {analyticsData?.stats?.conversionRate ?? "0.0%"}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 📊 Main Layout (Charts Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales Trend */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-200">
                Monthly Sales Trend
              </h3>
              <p className="text-xs text-slate-500">
                Visual performance of total cashflow generated monthly
              </p>
            </div>
            <span className="text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              H1 2026{" "}
              <FontAwesomeIcon icon={faArrowRight} className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Chart Display */}
          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-6 border-b border-slate-800 px-2">
            {salesArray.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                No monthly analytical trends available.
              </div>
            ) : (
              salesArray.map((data) => {
                const currentAmount = data.amount ?? 0;
                const barHeight = `${(currentAmount / maxSalesAmount) * 100}%`;
                return (
                  <div
                    key={data.month}
                    className="flex-1 flex flex-col items-center group h-full justify-end relative"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-950 border border-slate-800 text-[11px] px-2 py-1 rounded-md text-cyan-400 font-mono pointer-events-none transition-opacity duration-200 shadow-xl z-10 whitespace-nowrap">
                      ৳{currentAmount.toLocaleString()}
                    </div>
                    <div
                      style={{ height: barHeight }}
                      className="w-full bg-linear-to-t from-cyan-600/40 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 rounded-t-lg transition-all duration-500 cursor-pointer shadow-lg shadow-cyan-500/5 group-hover:shadow-cyan-400/20"
                    />
                    <span className="text-xs text-slate-400 mt-2 font-medium">
                      {data.month}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-200">
              Top Selling Products
            </h3>
            <p className="text-xs text-slate-500">
              Highest grossing listed assets inside NaiSell
            </p>
          </div>

          <div className="space-y-5 pt-2">
            {analyticsData?.topProducts?.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                No top products registered yet.
              </p>
            ) : (
              analyticsData?.topProducts?.map((product, index) => (
                <div
                  key={product.id || product._id || `prod-${index}`}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-300 truncate max-w-45">
                      {product.title}
                    </span>
                    <span className="font-mono text-slate-400 font-semibold">
                      {product.sales} sold
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${product.percentage ?? 0}%` }}
                      className="h-full bg-linear-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                    <span>Share Velocity</span>
                    <span className="text-emerald-400 font-medium">
                      ৳ {product.revenue?.toLocaleString() ?? 0}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsPage;
