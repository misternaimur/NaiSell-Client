/** @format */

"use client";

import { useSession, authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaSignOutAlt,
  FaThLarge,
  FaShoppingBag,
  FaHeart,
  FaHistory,
  FaUser,
  FaPlusSquare,
  FaBoxes,
  FaClipboardList,
  FaChartBar,
  FaUsers,
  FaUserShield,
  FaCheckCircle,
} from "react-icons/fa";

const DashboardSideBar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/login";
          },
        },
      });
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  // 1. Buyer Menu Items
  const buyerMenu = [
    {
      key: "overview",
      label: "Overview",
      icon: FaThLarge,
      href: "/dashboard/buyer",
    },
    {
      key: "orders",
      label: "My Orders",
      icon: FaShoppingBag,
      href: "/dashboard/buyer/orders",
    },
    {
      key: "wishlist",
      label: "Wishlist",
      icon: FaHeart,
      href: "/dashboard/buyer/wishlist",
    },
    {
      key: "payments",
      label: "Payment History",
      icon: FaHistory,
      href: "/dashboard/buyer/payments",
    },
    {
      key: "profile",
      label: "Profile Management",
      icon: FaUser,
      href: "/dashboard/buyer/profile",
    },
  ];

  // 2. Seller Menu Items
  const sellerMenu = [
    {
      key: "overview",
      label: "Overview",
      icon: FaThLarge,
      href: "/dashboard/seller",
    },
    {
      key: "add-product",
      label: "Add Product",
      icon: FaPlusSquare,
      href: "/dashboard/seller/add-product",
    },
    {
      key: "my-products",
      label: "My Products",
      icon: FaBoxes,
      href: "/dashboard/seller/my-products",
    },
    {
      key: "manage-orders",
      label: "Manage Orders",
      icon: FaClipboardList,
      href: "/dashboard/seller/manage-orders",
    },
    {
      key: "analytics",
      label: "Sales Analytics",
      icon: FaChartBar,
      href: "/dashboard/seller/analytics",
    },
  ];

  // 3. Admin Menu Items
  const adminMenu = [
    {
      key: "overview",
      label: "Overview",
      icon: FaThLarge,
      href: "/dashboard/admin",
    },
    {
      key: "users",
      label: "Manage Users",
      icon: FaUsers,
      href: "/dashboard/admin/users",
    },
    {
      key: "products",
      label: "Manage Products",
      icon: FaCheckCircle,
      href: "/dashboard/admin/products",
    },
    {
      key: "orders",
      label: "Manage Orders",
      icon: FaClipboardList,
      href: "/dashboard/admin/orders",
    },
    {
      key: "analytics",
      label: "Platform Analytics",
      icon: FaChartBar,
      href: "/dashboard/admin/analytics",
    },
  ];

  const role = session?.user?.role?.toLowerCase() || "buyer";
  const menuItems =
    role === "seller" ? sellerMenu : role === "admin" ? adminMenu : buyerMenu;

  // ডাইনামিক রোল থিম (অ্যাক্টিভ লিংকের ব্যাকগ্রাউন্ড এবং বর্ডার কালার সেট করার জন্য)
  const activeTheme =
    role === "admin"
      ? "text-white bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-amber-500/20"
      : role === "seller"
        ? "text-white bg-gradient-to-r from-teal-500/20 to-cyan-500/10 border-teal-500/20"
        : "text-white bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border-emerald-500/20";

  // আইকন ব্যাকগ্রাউন্ড থিম
  const activeIconTheme =
    role === "admin"
      ? "bg-amber-500 text-white"
      : role === "seller"
        ? "bg-teal-500 text-white"
        : "bg-emerald-500 text-white";

  // ইন্ডিকেটর ডট কালার
  const activeDotTheme =
    role === "admin"
      ? "bg-amber-400"
      : role === "seller"
        ? "bg-teal-400"
        : "bg-emerald-400";

  const roleBadgeColor =
    role === "admin"
      ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
      : role === "seller"
        ? "text-teal-400 bg-teal-500/10 border-teal-500/20"
        : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";

  return (
    <aside className="w-64 h-screen border-r border-slate-800 shrink-0">
      <div className="h-full flex flex-col bg-slate-950">
        {/* Brand / Title */}
        <div className="px-6 py-5 border-b border-slate-900 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-black">
            N
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            NaiSell <span className="text-emerald-500">Hub</span>
          </span>
        </div>

        {/* User Profile */}
        <div className="px-5 py-4 border-b border-slate-900">
          <div className="flex items-center gap-3 bg-slate-900/40 p-2 rounded-xl border border-slate-900">
            
            <div className="overflow-hidden">
              <p className="text-slate-200 text-sm font-bold truncate leading-tight">
                {session?.user?.name || "Loading..."}
              </p>
              <span
                className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mt-1 ${roleBadgeColor}`}
              >
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow overflow-y-auto px-3 py-4 space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-3 pb-2">
            {role} Menu
          </p>
          {menuItems?.map(({ key, label, icon: Icon, href }) => {
            // 💡 নিখুঁত রাউটিং ম্যাচিং: ওভারভিউ-এর জন্য হুবহু ম্যাচ, বাকি সাব-রাউটের জন্য startWith চেক করবে
            const isActive =
              href === `/dashboard/${role}`
                ? pathname === href
                : pathname.startsWith(href);

            return (
              <Link
                key={key}
                href={href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? activeTheme
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/5 border border-transparent"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? activeIconTheme : "bg-slate-900 text-slate-400"
                  }`}
                >
                  <Icon size={14} />
                </span>
                <span className="flex-grow">{label}</span>

                {isActive && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${activeDotTheme} animate-pulse`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Links */}
        <div className="px-3 py-4 border-t border-slate-900 space-y-1">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-900/5 border border-transparent transition-all duration-150"
          >
            <span className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 text-slate-400">
              <FaHome size={13} />
            </span>
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/5 border border-transparent transition-all duration-150 cursor-pointer"
          >
            <span className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 text-slate-400">
              <FaSignOutAlt size={13} />
            </span>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSideBar;
