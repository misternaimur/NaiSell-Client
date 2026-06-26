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
  FaCheckCircle,
} from "react-icons/fa";

const DashboardSideBar = () => {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/auth/login";
          },
        },
      });
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  // ১. Buyer Menu Items
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

  // ২. Seller Menu Items
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
      href: "/dashboard/seller/addproducts",
    },
    {
      key: "my-products",
      label: "My Products",
      icon: FaBoxes,
      href: "/dashboard/seller/myproducts",
    },
    {
      key: "manage-orders",
      label: "Manage Orders",
      icon: FaClipboardList,
      href: "/dashboard/seller/manageorders",
    },
    {
      key: "analytics",
      label: "Sales Analytics",
      icon: FaChartBar,
      href: "/dashboard/seller/analytics",
    },
  ];

  // ৩. Admin Menu Items
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

  // Better-Auth এর অতিরিক্ত ফিল্ড 'role' থেকে ডাইনামিকালি রোল রিড করা হচ্ছে
  const role = isPending ? null : session?.user?.role?.toLowerCase() || "buyer";

  // রোল অনুযায়ী মেনু ফিল্টার
  const menuItems =
    role === "admin" ? adminMenu : role === "seller" ? sellerMenu : role === "buyer" ? buyerMenu : [];

  // ব্যাকগ্রাউন্ড থিম (থিম ভেরিয়েবল অনুযায়ী আপডেট করা হয়েছে)
  const activeTheme =
    role === "admin"
      ? "text-secondary bg-secondary/15 border-secondary/30"
      : role === "seller"
        ? "text-primary bg-primary/15 border-primary/30"
        : "text-primary bg-primary/15 border-primary/30";

  // আইকন ব্যাকগ্রাউন্ড থিম
  const activeIconTheme =
    role === "admin"
      ? "bg-secondary text-on-secondary"
      : role === "seller"
        ? "bg-primary text-on-primary"
        : "bg-primary text-on-primary";

  // ইন্ডিকেটর ডট কালার
  const activeDotTheme =
    role === "admin"
      ? "bg-secondary"
      : role === "seller"
        ? "bg-primary"
        : "bg-primary";

  // ব্যাজ কালার
  const roleBadgeColor =
    role === "admin"
      ? "text-secondary bg-secondary/10 border-secondary/20"
      : role === "seller"
        ? "text-primary bg-primary/10 border-primary/20"
        : "text-primary bg-primary/10 border-primary/20";

  return (
    <aside className="w-64 h-screen border-r border-outline-variant shrink-0 sticky top-0">
      <div className="h-full flex flex-col bg-surface-container-low">
        {/* Brand / Title */}
        <div className="px-6 py-5 border-b border-outline-variant/60 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-on-primary text-sm font-black">
            N
          </div>
          <span className="font-black text-lg tracking-tight text-on-surface">
            NaiSell <span className="text-primary">Hub</span>
          </span>
        </div>

        {/* User Profile Section */}
        <div className="px-5 py-4 border-b border-outline-variant/60">
          <div className="flex items-center gap-3 bg-surface-container-high/40 p-2 rounded-xl border border-outline-variant/40">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-lg object-cover border border-outline-variant"
              />
            ) : (
              <div className="h-9 w-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant text-sm font-bold border border-outline-variant">
                {session?.user?.name ? session.user.name[0].toUpperCase() : "U"}
              </div>
            )}
            <div className="overflow-hidden grow">
              <p className="text-on-surface text-sm font-bold truncate leading-tight">
                {isPending
                  ? "Loading..."
                  : session?.user?.name || "Anonymous User"}
              </p>
              <span
                className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mt-1 ${roleBadgeColor}`}
              >
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Menu */}
        <nav className="grow overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest px-3 pb-2">
            {role} Menu
          </p>
          {menuItems?.map(({ key, label, icon: Icon, href }) => {
            // নিখুঁত রাউটিং ম্যাচিং
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
                    : "text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 border border-transparent"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? activeIconTheme : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  <Icon size={14} />
                </span>
                <span className="grow">{label}</span>

                {isActive && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${activeDotTheme} animate-pulse`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Links (Home & Sign Out) */}
        <div className="px-3 py-4 border-t border-outline-variant/60 space-y-1">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 border border-transparent transition-all duration-150"
          >
            <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-on-surface-variant">
              <FaHome size={13} />
            </span>
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:text-error hover:bg-error/5 border border-transparent transition-all duration-150 cursor-pointer"
          >
            <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-on-surface-variant">
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
