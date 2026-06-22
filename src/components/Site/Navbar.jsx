/** @format */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaSignOutAlt, FaThLarge } from "react-icons/fa"; // 👈 Font Awesome Icons
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/auth/signin";
          },
        },
      });
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#171717]/80 backdrop-blur-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO AREA */}
        <Link href="/" className="text-3xl font-bold tracking-tight">
          <span className="text-blue-500">Nai</span>
          <span className="text-orange-500">Sell</span>
        </Link>

        {/* DESKTOP NAVIGATION LINKS */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-500 font-semibold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* RIGHT ACTIONS BLOCK */}
        <div className="flex items-center gap-4">
          {/* 🔐 LOGGED OUT STATES */}
          {!session && (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/auth/login">
                <button className="inline-flex items-center justify-center font-semibold text-xs text-slate-300 hover:text-white h-9 px-4 rounded-xl hover:bg-white/5 transition">
                  Login
                </button>
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center font-semibold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition h-9 px-4 rounded-xl"
              >
                Register
              </Link>
            </div>
          )}

          {/* ✅ LOGGED IN USER DROPDOWN (FONT AWESOME ICONS) */}
          {session && session?.user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center transition-transform hover:scale-105 outline-none focus:outline-none cursor-pointer"
              >
                <Image
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover border border-blue-500 shadow-md shadow-blue-500/10"
                  src={session?.user?.image || "/avatar-placeholder.png"}
                  alt="avatar"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl py-2 z-55 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Account Details */}
                  <div className="px-4 py-2.5 border-b border-white/5 mb-1.5 cursor-default">
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                      {session?.user?.role || "User"} Account
                    </p>
                    <p className="font-bold text-white text-sm mt-0.5 truncate">
                      {session?.user?.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {session?.user?.email}
                    </p>
                  </div>

                  {/* Actions Area with Fa Icons */}
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <FaThLarge className="text-slate-400 text-sm shrink-0" />
                    <span>My Dashboard</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <FaUser className="text-slate-400 text-sm shrink-0" />
                    <span>Profile Settings</span>
                  </Link>

                  <div className="border-t border-white/5 my-1.5" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition cursor-pointer"
                  >
                    <FaSignOutAlt className="text-sm shrink-0 text-red-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MOBILE TOGGLE HAMBURGER BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-400 hover:text-white lg:hidden transition outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDABLE MENU */}
      {mobileMenuOpen && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/95 p-5 backdrop-blur-xl lg:hidden shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm py-1 transition ${
                  pathname === link.href
                    ? "text-blue-500 font-semibold"
                    : "text-slate-300 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {!session && (
              <>
                <div className="h-px bg-white/10 my-1" />
                <div className="flex flex-col gap-3">
                  <Link
                    href="/auth/signin"
                    className="font-medium text-slate-300 text-center text-sm transition py-2 rounded-xl hover:bg-white/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 py-2.5 text-center text-sm text-white font-medium transition hover:opacity-90"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
