/** @format */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import { ChartBarStacked, CircleXmark } from "@gravity-ui/icons";

// ১. নেভিগেশন লিংকগুলোর অ্যারে (আপনার প্রোজেক্ট অনুযায়ী চেঞ্জ করতে পারেন)
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar({ user = null, isPending = false, onSignOut }) {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[#bec9c2] bg-[#f7faf6]/85 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {/* Implements 48px padding boundaries on desktop layouts */}
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-12">
        {/* LOGO AREA - NAISELL BRAND */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00543c] shadow-md text-white">
            <span className="font-bold text-base tracking-tight">N</span>
          </div>
          <span
            className="text-lg font-semibold tracking-tight text-[#181d1a]"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            NaiSell
          </span>
        </Link>

        {/* DESKTOP NAVIGATION PILLS */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200"
                style={{ fontFamily: "Inter" }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[#ebefea]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span
                  className={`relative z-10 ${active ? "text-[#181d1a]" : "text-[#3f4943] hover:text-[#181d1a]"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT ACTION CONTROLS */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 md:flex">
            {!isPending &&
              (user ? (
                <div
                  className="flex items-center gap-4 text-sm font-medium text-[#181d1a]"
                  style={{ fontFamily: "Inter" }}
                >
                  <div className="flex items-center gap-1.5 text-[#3f4943]">
                    <span className="text-[#096c4f] text-xs">●</span>
                    <span>Hi, {user.name}!</span>
                  </div>
                  <Button
                    onClick={onSignOut}
                    variant="bordered"
                    className="h-9 border-[#6f7a73] text-[#181d1a] hover:bg-[#ebefea] px-4 font-medium rounded-[8px]"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/signin">
                    <Button
                      variant="light"
                      className="rounded-[8px] h-9 text-sm font-medium text-[#3f4943] hover:text-[#181d1a] hover:bg-[#ebefea]"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="h-9 bg-[#835400] px-5 text-sm font-semibold text-white hover:bg-[#6e4600] rounded-[8px] shadow-sm">
                      Register
                    </Button>
                  </Link>
                </div>
              ))}
          </div>

          {/* MOBILE TOGGLE BLOCK */}
          <Button
            isIconOnly
            variant="light"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="text-[#181d1a] hover:bg-[#ebefea] md:hidden rounded-[8px]"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <CircleXmark className="h-5 w-5" />
            ) : (
              <ChartBarStacked className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* MOBILE EXPANSION SURFACE */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-[#bec9c2] bg-[#f7faf6] md:hidden shadow-lg"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              <ul className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-[#3f4943] transition hover:bg-[#ebefea] hover:text-[#181d1a]"
                      style={{ fontFamily: "Inter" }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li> // <--- এখানে টাইপো ফিক্স করা হয়েছে (</td> থেকে </li> করা হয়েছে)
                ))}
              </ul>

              <div className="mt-2 border-t border-[#bec9c2] pt-4">
                {!isPending &&
                  (user ? (
                    <div className="flex flex-col gap-3 px-2">
                      <span className="text-base font-medium text-[#181d1a]">
                        Hi, {user.name}!
                      </span>
                      <Button
                        onClick={onSignOut}
                        variant="flat"
                        className="w-full bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb956]/20 rounded-[8px] font-medium"
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/auth/signin"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button
                          variant="bordered"
                          className="w-full rounded-[8px] border-[#6f7a73] text-[#181d1a] hover:bg-[#ebefea]"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button className="w-full rounded-[8px] bg-[#835400] font-semibold text-white hover:bg-[#6e4600]">
                          Register
                        </Button>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
