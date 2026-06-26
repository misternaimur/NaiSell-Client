/** @format */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

import DashboardHeading from "@/components/DashboardHeading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faShoppingBag,
  faCoins,
  faClock,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import {
  getSellerStats,
  getSellerProducts,
  deleteProduct,
} from "@/lib/api/sellerActions"; // ⚡ প্রয়োজনীয় সব অ্যাকশন ইমপোর্ট করা হলো

const MyProducts = () => {
  // Live Database States
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [products, setProducts] = useState([]); // 📦 সেলারের প্রোডাক্ট লিস্টের স্টেট
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const sellerEmail = session?.user?.email || "";

  // 🔄 ডাটাবেজ থেকে নির্দিষ্ট সেলারের লাইভ স্ট্যাটিস্টিকস এবং প্রোডাক্ট লিস্ট নিয়ে আসা
  useEffect(() => {
    let isMounted = true;

    const fetchSellerData = async () => {
      if (!sellerEmail) return;
      if (isMounted) setLoading(true);

      try {
        // ১. সেলারের ওভারভিউ স্ট্যাটস নিয়ে আসা
        const statsData = await getSellerStats(sellerEmail);
        // ২. সেলারের নির্দিষ্ট প্রোডাক্ট লিস্ট নিয়ে আসা
        const productsData = await getSellerProducts({ email: sellerEmail });

        if (isMounted) {
          // স্ট্যাটস আপডেট
          if (statsData && statsData.success) {
            setStats({
              totalProducts: statsData.stats?.totalProducts || 0,
              totalSales: statsData.stats?.totalSales || 0,
              totalRevenue: statsData.stats?.totalRevenue || 0,
              pendingOrders: statsData.stats?.pendingOrders || 0,
            });
          }

          // প্রোডাক্ট লিস্ট আপডেট (ডাটাবেজ থেকে অ্যারে রিটার্ন হলে)
          if (Array.isArray(productsData)) {
            setProducts(productsData);
          } else if (productsData && productsData.success) {
            setProducts(productsData.products || []);
          }
        }
      } catch (error) {
        console.error("Error fetching live dashboard data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSellerData();

    return () => {
      isMounted = false; // ক্লিনআপ
    };
  }, [sellerEmail]);

  // প্রোডাক্ট ডিলিট হ্যান্ডলার লজিক
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await deleteProduct(id);
        if (res.success) {
          // ডিলিট সফল হলে স্টেট থেকে ইনস্ট্যান্ট রিমুভ করে দেওয়া
          setProducts(products.filter((prod) => prod._id !== id));
          // স্ট্যাটস কাউন্ট ১ কমিয়ে দেওয়া
          setStats((prev) => ({
            ...prev,
            totalProducts: prev.totalProducts - 1,
          }));
        }
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  // স্ট্যাটস কার্ডের ডেটা অ্যারে অবজেক্ট
  const cardItems = [
    {
      title: "Your Products",
      value: `${stats.totalProducts} pcs`,
      desc: "Number of products listed by you",
      icon: <FontAwesomeIcon icon={faBox} className="w-5 h-5 text-cyan-400" />,
      bgGradient: "from-cyan-500/10 to-transparent",
      borderColor: "hover:border-cyan-500/30",
    },
    {
      title: "Total Sales",
      value: stats.totalSales,
      desc: "Total completed sales volume",
      icon: (
        <FontAwesomeIcon
          icon={faShoppingBag}
          className="w-5 h-5 text-emerald-400"
        />
      ),
      bgGradient: "from-emerald-500/10 to-transparent",
      borderColor: "hover:border-emerald-500/30",
    },
    {
      title: "Total Revenue",
      value: `৳ ${stats.totalRevenue.toLocaleString()}`,
      desc: "Earnings from completed orders",
      icon: (
        <FontAwesomeIcon icon={faCoins} className="w-5 h-5 text-amber-400" />
      ),
      bgGradient: "from-amber-500/10 to-transparent",
      borderColor: "hover:border-amber-500/30",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      desc: "Orders waiting for your action",
      icon: (
        <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-rose-400" />
      ),
      bgGradient: "from-rose-500/10 to-transparent",
      borderColor: "hover:border-rose-500/30",
    },
  ];

  return (
    <div className="space-y-10 mt-6 pb-12 text-white max-w-6xl mx-auto px-4 sm:px-0">
      <DashboardHeading
        title="My Products & Overview"
        description="Manage your inventory, monitor sales, and check product approval status."
      />

      {/* 📦 ১. লাইভ স্ট্যাটস গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse bg-surface-container/60 border border-outline-variant/60 rounded-2xl"
              />
            ))
          : cardItems.map((card, index) => (
              <div
                key={index}
                className="relative overflow-hidden group p-5 bg-surface-container border border-outline-variant/60 rounded-2xl shadow-sm transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                      {card.title}
                    </p>
                    <h3 className="text-2xl font-bold font-mono tracking-tight text-on-surface">
                      {card.value}
                    </h3>
                  </div>
                  <div className="p-3 bg-surface-container-high rounded-xl border border-outline-variant group-hover:scale-110 transition-transform flex items-center justify-center w-11 h-11">
                    {card.icon}
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant/80 mt-4 font-medium">
                  {card.desc}
                </p>
              </div>
            ))}
      </div>

      {/* 🛍️ ২. লাইভ প্রোডাক্ট লিস্ট টেবিল/গ্রিড সেকশন */}
      <div className="bg-surface-container border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-on-surface">
              Products Inventory
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              List of all products uploaded by {sellerEmail}
            </p>
          </div>
          <span className="px-3 py-1 bg-primary/10 text-xs font-semibold rounded-full text-primary border border-primary/20">
            Total: {products.length} Items
          </span>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse bg-surface-container-high/40 rounded-xl"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant font-medium">
            No products found! Please add some products to see them here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs font-semibold uppercase tracking-wider border-b border-outline-variant">
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Condition</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-sm text-on-surface">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-on-surface/5 transition-colors"
                  >
                    {/* প্রোডাক্ট ইমেজ ও টাইটেল */}
                    <td className="p-4 pl-6 flex items-center gap-4">
                      <img
                        src={product.image || "/placeholder-image.png"}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg bg-surface-container-high border border-outline-variant/60 shadow"
                      />
                      <div>
                        <h4 className="font-semibold text-on-surface line-clamp-1 max-w-[180px]">
                          {product.title}
                        </h4>
                        <span className="text-[10px] text-on-surface-variant/80 font-mono">
                          ID: {product._id?.substring(0, 8)}...
                        </span>
                      </div>
                    </td>

                    {/* ক্যাটাগরি */}
                    <td className="p-4 text-on-surface-variant">{product.category}</td>

                    {/* কন্ডিশন */}
                    <td className="p-4">
                      <span className="text-xs bg-surface-container px-2 py-1 rounded border border-outline-variant text-on-surface-variant">
                        {product.condition}
                      </span>
                    </td>

                    {/* প্রাইস */}
                    <td className="p-4 font-mono font-semibold text-secondary">
                      ৳ {Number(product.price).toLocaleString()}
                    </td>

                    {/* স্টক */}
                    <td className="p-4 font-mono text-on-surface-variant">
                      {product.stock} pcs
                    </td>

                    {/* স্ট্যাটাস ব্যাজ */}
                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                          product.status === "Approved"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : product.status === "Pending"
                              ? "bg-secondary/10 text-secondary border-secondary/20"
                              : "bg-error/10 text-error border-error/20"
                        }`}
                      >
                        {product.status || "Pending"}
                      </span>
                    </td>

                    {/* অ্যাকশন বাটনসমূহ */}
                    <td className="p-4 text-center pr-6">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          title="Edit Product"
                          className="p-2 bg-surface-container-high hover:bg-primary/20 hover:text-primary rounded-lg border border-outline-variant transition-all"
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="w-3.5 h-3.5"
                          />
                        </button>
                        <button
                          title="Delete Product"
                          onClick={() => handleDelete(product._id)}
                          className="p-2 bg-surface-container-high hover:bg-error/20 hover:text-error rounded-lg border border-outline-variant transition-all"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="w-3.5 h-3.5"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// রিয়্যাক্ট কনভেনশন অনুযায়ী ফার্স্ট লেটার ক্যাপিটাল করা হলো
export default MyProducts;
