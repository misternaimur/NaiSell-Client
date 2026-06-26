/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaSignOutAlt, FaThLarge } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import Image from "next/image";
import Logo from "../Logo";
import ThemeToggle from "../ThemeToggle";

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
            window.location.href = "/auth/login";
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
    <nav className="sticky top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Nav links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors font-sans ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!session && (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/auth/login">
                <button className="inline-flex items-center justify-center font-semibold text-xs text-on-surface-variant hover:text-on-surface h-9 px-4 rounded-[8px] hover:bg-on-surface/5 transition font-sans">
                  Login
                </button>
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center font-semibold text-xs bg-primary text-on-primary shadow-sm hover:bg-primary/90 transition h-9 px-4 rounded-[8px] font-sans"
              >
                Register
              </Link>
            </div>
          )}

          {session && session?.user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center transition-transform hover:scale-105 outline-none focus:outline-none cursor-pointer"
              >
                <Image
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover border border-primary shadow-sm"
                  src={session?.user?.image || "/avatar-placeholder.png"}
                  alt="avatar"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-xl py-2 z-55 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2.5 border-b border-outline-variant/20 mb-1.5 cursor-default">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider font-sans">
                      {session?.user?.role || "User"} Account
                    </p>
                    <p className="font-bold text-on-surface text-sm mt-0.5 truncate font-sans">
                      {session?.user?.name}
                    </p>
                    <p className="text-[11px] text-on-surface-variant truncate mt-0.5 font-sans">
                      {session?.user?.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 transition cursor-pointer font-sans"
                  >
                    <FaThLarge className="text-on-surface-variant text-sm shrink-0" />
                    <span>My Dashboard</span>
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 transition cursor-pointer font-sans"
                  >
                    <FaUser className="text-on-surface-variant text-sm shrink-0" />
                    <span>Profile Settings</span>
                  </Link>

                  <div className="border-t border-outline-variant/20 my-1.5" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-error hover:text-error/95 hover:bg-error/5 transition cursor-pointer font-sans"
                  >
                    <FaSignOutAlt className="text-sm shrink-0 text-error" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-on-surface-variant hover:text-on-surface lg:hidden transition outline-none cursor-pointer"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mt-3 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 lg:hidden shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm py-1 transition font-sans ${
                  pathname === link.href
                    ? "text-primary font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {!session && (
              <>
                <div className="h-px bg-outline-variant/20 my-1" />
                <div className="flex flex-col gap-3">
                  <Link
                    href="/auth/login"
                    className="font-medium text-on-surface-variant text-center text-sm transition py-2 rounded-[8px] hover:bg-on-surface/5 font-sans"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded-[8px] bg-primary py-2.5 text-center text-sm text-on-primary font-medium transition hover:bg-primary/90 font-sans"
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
