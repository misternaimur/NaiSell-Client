/** @format */

"use client";

import Link from "next/link";
import { FaHandshake, FaLeaf, FaShieldAlt } from "react-icons/fa";

const features = [
  {
    title: "Trusted Marketplace",
    description:
      "Every listing is designed to give buyers confidence and sellers visibility.",
    icon: <FaShieldAlt className="text-cyan-500" size={20} />,
  },
  {
    title: "Sustainable Choices",
    description:
      "NaiSell helps extend the life of great products and reduce waste.",
    icon: <FaLeaf className="text-emerald-500" size={20} />,
  },
  {
    title: "Community First",
    description:
      "We support genuine connections between buyers, sellers, and local communities.",
    icon: <FaHandshake className="text-blue-500" size={20} />,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080c18] px-4 py-16 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md sm:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              About NaiSell
            </p>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">
              A smarter way to buy and sell pre-loved goods.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-400">
              NaiSell brings together trusted buyers and sellers in one modern
              marketplace for refurbished, used, and premium second-hand
              products. Our mission is to make sustainable shopping simple,
              secure, and rewarding.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                  {feature.icon}
                </div>
                <h2 className="text-lg font-semibold text-white">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Explore Products
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-500 hover:text-cyan-400"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
