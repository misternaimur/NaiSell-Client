/** @format */
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@heroui/react";
import {
  ShieldCheck,
  CircleArrowRightFill,
  ThunderboltFill,
  TagDollar,
} from "@gravity-ui/icons";

export default function Hero() {
  return (
    <section className="relative max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-24 pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden bg-[#fafbfa]">
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8 lg:gap-12 xl:gap-16">
        {/* LEFT: CONTENT AREA */}
        <div className="md:col-span-6 lg:col-span-7 space-y-6 lg:space-y-8 z-10">
          <div className="space-y-4 lg:space-y-5">
            {/* Tag/Badge */}
            <span className="inline-block px-3 py-1 bg-[#00543c]/10 text-[#00543c] rounded-full text-xs font-semibold font-sans uppercase tracking-wider">
              The Future of Resale
            </span>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[58px] lg:leading-[60px] xl:leading-[68px] font-bold tracking-tight text-[#002b1e] font-sans">
              Your Unused Items,
              <br />
              <span className="text-[#00543c]">
                Someone&lsquo;s Next Favorite Find
              </span>
            </h1>

            {/* Description */}
            <p className="text-base lg:text-lg text-[#55635a] max-w-xl leading-relaxed font-sans">
              Experience an editorial-grade marketplace where quality meets
              trust. Buy, sell, and trade verified items with confidence on the
              continent&apos;s most sophisticated platform.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href="/products" passHref>
              <Button className="bg-[#F2A93B] text-white text-sm lg:text-base font-semibold font-sans px-8 h-12 lg:h-14 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm">
                Explore Products
              </Button>
            </Link>

            <Link href="/sell" passHref>
              <Button
                variant="bordered"
                className="border-[#bec9c2] bg-white text-[#181d1a] hover:bg-[#f0f3f1] text-sm lg:text-base font-medium font-sans px-8 h-12 lg:h-14 rounded-xl transition-all duration-200 shadow-sm"
              >
                Start Selling
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t border-[#bec9c2]/30">
            {/* Badge 1 */}
            <div className="flex items-center gap-2 font-sans">
              <ShieldCheck className="w-5 h-5 text-[#00543c]" />
              <div>
                <p className="text-sm font-bold text-[#181d1a] leading-none">
                  100% Verified
                </p>
                <p className="text-xs text-[#6f7a73] mt-0.5">Trusted Sellers</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center gap-2 font-sans">
              <CircleArrowRightFill className="w-5 h-5 text-[#00543c]" />
              <div>
                <p className="text-sm font-bold text-[#181d1a] leading-none">
                  Eco-Friendly
                </p>
                <p className="text-xs text-[#6f7a73] mt-0.5">
                  Sustainable Loop
                </p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-2 font-sans">
              <ThunderboltFill className="w-5 h-5 text-[#00543c]" />
              <div>
                <p className="text-sm font-bold text-[#181d1a] leading-none">
                  Fast Payouts
                </p>
                <p className="text-xs text-[#6f7a73] mt-0.5">
                  Secure Transfers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: ANIMATED PRODUCT COLLAGE (Haxagonal/Square mix layout matching image_3466ba.png) */}
        <div className="md:col-span-6 lg:col-span-5 relative w-full h-[450px] sm:h-[520px] md:h-[500px] lg:h-[580px] xl:h-[620px] mt-8 md:mt-0 flex items-center justify-center">
          {/* Back Card: Camera Image (Right-aligned, straight/slight rotation) */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-4 right-0 w-[70%] h-[75%] rounded-[24px] overflow-hidden shadow-xl z-10"
          >
            <img
              className="w-full h-full object-cover"
              alt="Premium Vintage Leica Camera"
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800"
              loading="lazy"
            />
          </motion.div>

          {/* Front Card: Chair Image (Tilted forward matching image_3466ba.png) */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: 40, rotate: -8 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: -5 }}
            whileHover={{ rotate: -2, scale: 1.01 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-2 left-4 md:-left-4 w-[72%] h-[68%] rounded-[24px] overflow-hidden shadow-2xl z-20 border-[6px] border-white cursor-pointer"
          >
            <img
              className="w-full h-full object-cover"
              alt="Minimalist Wooden Chair"
              src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800"
              loading="lazy"
            />
          </motion.div>

          {/* Floating Tag Icon overlapping the chair border */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="absolute top-[38%] left-[16%] md:left-[8%] w-14 h-14 lg:w-16 lg:h-16 bg-[#F2A93B] rounded-full z-30 flex items-center justify-center shadow-lg border-4 border-white"
          >
            <TagDollar className="text-white w-6 h-6 lg:w-7 lg:h-7" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
