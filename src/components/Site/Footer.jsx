
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
    <footer className="border-t border-outline-variant bg-surface text-on-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-16">
        {/* TOP SECTION: GRID MATRIX */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND COLUMN */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                <span className="text-base font-bold tracking-tight font-display">
                  N
                </span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-on-surface font-display">
                NaiSell
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-on-surface-variant font-sans">
              The premium second-hand marketplace. Built for sustainable
              circular living with verified trust.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <HeroLink
                as={Link}
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-outline-variant bg-white text-on-surface-variant transition-all duration-200 hover:border-primary hover:text-primary hover:scale-[1.02]"
              >
                <LogoFacebook className="h-4 w-4" />
              </HeroLink>

              <Link
                href="#"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-outline-variant bg-white text-on-surface-variant transition-all duration-200 hover:border-primary hover:text-primary hover:scale-[1.02]"
              >
                <LogoGithub className="h-4 w-4" />
              </Link>

              <Link
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-outline-variant bg-white text-on-surface-variant transition-all duration-200 hover:border-primary hover:text-primary hover:scale-[1.02]"
              >
                <LogoLinkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* MARKETPLACE LINKS */}
          <div>
            <h3 className="mb-6 text-xs font-semibold tracking-wider uppercase text-on-surface font-sans">
              Marketplace
            </h3>
            <ul className="space-y-3 text-sm text-on-surface-variant font-sans">
              <li>
                <Link
                  href="/products"
                  className="transition-colors duration-200 hover:text-on-surface"
                >
                  Browse Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="transition-colors duration-200 hover:text-on-surface"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/verification"
                  className="transition-colors duration-200 hover:text-on-surface"
                >
                  Trust & Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* NAVIGATION LINKS */}
          <div>
            <h3 className="mb-6 text-xs font-semibold tracking-wider uppercase text-on-surface font-sans">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm text-on-surface-variant font-sans">
              <li>
                <Link
                  href="/help"
                  className="transition-colors duration-200 hover:text-on-surface"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition-colors duration-200 hover:text-on-surface"
                >
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors duration-200 hover:text-on-surface"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT STRUCTURAL INFO */}
          <div>
            <h3 className="mb-6 text-xs font-semibold tracking-wider uppercase text-on-surface font-sans">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-on-surface-variant font-sans">
              <li className="flex items-center gap-2">
                <Envelope className="h-4 w-4 text-primary" /> hello@naisell.com
              </li>
              <li className="flex items-center gap-2">
                <Handset className="h-4 w-4 text-primary" /> +880 1700 000 000
              </li>
              <li className="flex items-center gap-2">
                <Pin className="h-4 w-4 text-primary" /> Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM LEGAL METADATA BAR */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-outline-variant pt-8 text-xs text-on-surface-variant md:flex-row">
          <p className="font-sans">
            Copyright {currentYear} — NaiSell. All rights reserved.
          </p>
          <div className="flex items-center gap-6 font-sans">
            <Link
              href="/terms"
              className="transition-colors duration-200 hover:text-on-surface"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="transition-colors duration-200 hover:text-on-surface"
            >
              Privacy Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
