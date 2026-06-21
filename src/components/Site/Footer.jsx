/** @format */

"use client";

import Link from "next/link";
import { Link as HeroLink } from "@heroui/react";
import {
  LogoFacebook,
  LogoLinkedin,
  LogoGithub,
  Envelope,
  Handset,
  Pin,
} from "@gravity-ui/icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Base layout: Parchment off-white background (#f7faf6) with charcoal border (#bec9c2)
    <footer className="border-t border-[#bec9c2] bg-[#f7faf6] text-[#181d1a]">
      {/* Outer bounds follow the strictly defined 48px desktop margins (lg:px-12) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-16">
        {/* TOP SECTION: GRID MATRIX */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND COLUMN */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 no-underline">
              {/* Logo frame using the Deep Emerald branding token (#00543c) */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00543c] text-white shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                <span
                  className="text-base font-bold tracking-tight"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                >
                  N
                </span>
              </div>
              <span
                className="text-lg font-semibold tracking-tight text-[#181d1a]"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                NaiSell
              </span>
            </Link>

            <p
              className="max-w-xs text-sm leading-7 text-[#3f4943]"
              style={{ fontFamily: "Inter" }}
            >
              The premium second-hand marketplace. Built for sustainable
              circular living with verified trust.
            </p>

            {/* SOCIAL TARGET SIGNALS - Interactive 8px rounded frames */}
            <div className="flex items-center gap-3 pt-2">
              <HeroLink
                as={Link}
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#bec9c2] bg-white text-[#3f4943] transition-all duration-200 hover:border-[#00543c] hover:text-[#00543c] hover:scale-[1.02]"
              >
                <LogoFacebook className="h-4 w-4" />
              </HeroLink>

              <Link
                href="#"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#bec9c2] bg-white text-[#3f4943] transition-all duration-200 hover:border-[#00543c] hover:text-[#00543c] hover:scale-[1.02]"
              >
                <LogoGithub className="h-4 w-4" />
              </Link>

              <Link
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#bec9c2] bg-white text-[#3f4943] transition-all duration-200 hover:border-[#00543c] hover:text-[#00543c] hover:scale-[1.02]"
              >
                <LogoLinkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* MARKETPLACE LINKS */}
          <div>
            <h3
              className="mb-6 text-xs font-semibold tracking-wider uppercase text-[#181d1a]"
              style={{ fontFamily: "Inter" }}
            >
              Marketplace
            </h3>
            <ul
              className="space-y-3 text-sm text-[#3f4943]"
              style={{ fontFamily: "Inter" }}
            >
              <li>
                <Link
                  href="/products"
                  className="transition-colors duration-200 hover:text-[#181d1a]"
                >
                  Browse Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="transition-colors duration-200 hover:text-[#181d1a]"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/verification"
                  className="transition-colors duration-200 hover:text-[#181d1a]"
                >
                  Trust & Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* NAVIGATION LINKS */}
          <div>
            <h3
              className="mb-6 text-xs font-semibold tracking-wider uppercase text-[#181d1a]"
              style={{ fontFamily: "Inter" }}
            >
              Navigation
            </h3>
            <ul
              className="space-y-3 text-sm text-[#3f4943]"
              style={{ fontFamily: "Inter" }}
            >
              <li>
                <Link
                  href="/help"
                  className="transition-colors duration-200 hover:text-[#181d1a]"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition-colors duration-200 hover:text-[#181d1a]"
                >
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors duration-200 hover:text-[#181d1a]"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT STRUCTURAL INFO */}
          <div>
            <h3
              className="mb-6 text-xs font-semibold tracking-wider uppercase text-[#181d1a]"
              style={{ fontFamily: "Inter" }}
            >
              Contact
            </h3>
            <ul
              className="space-y-3 text-sm text-[#3f4943]"
              style={{ fontFamily: "Inter" }}
            >
              <li className="flex items-center gap-2">
                <Envelope className="h-4 w-4 text-[#096c4f]" />{" "}
                hello@naisell.com
              </li>
              <li className="flex items-center gap-2">
                <Handset className="h-4 w-4 text-[#096c4f]" /> +880 1700 000 000
              </li>
              <li className="flex items-center gap-2">
                <Pin className="h-4 w-4 text-[#096c4f]" /> Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM LEGAL METADATA BAR */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#bec9c2] pt-8 text-xs text-[#3f4943] md:flex-row">
          <p style={{ fontFamily: "Inter" }}>
            Copyright {currentYear} — NaiSell. All rights reserved.
          </p>
          <div
            className="flex items-center gap-6"
            style={{ fontFamily: "Inter" }}
          >
            <Link
              href="/terms"
              className="transition-colors duration-200 hover:text-[#181d1a]"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="transition-colors duration-200 hover:text-[#181d1a]"
            >
              Privacy Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
