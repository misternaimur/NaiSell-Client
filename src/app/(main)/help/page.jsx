/** @format */

"use client";

import Link from "next/link";

const faqs = [
  {
    question: "How do I start selling on NaiSell?",
    answer:
      "Create an account, complete your profile, and head to the dashboard to add your first product.",
  },
  {
    question: "Can I save products for later?",
    answer:
      "Yes. Any signed-in buyer can add products to their wishlist and revisit them anytime.",
  },
  {
    question: "How do I track my orders?",
    answer:
      "Visit the dashboard orders section to view status updates and manage your purchases.",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#080c18] px-4 py-16 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Help Center
        </p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-400">
          Everything you need to know about shopping, selling, and managing your
          account.
        </p>

        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
            >
              <summary className="cursor-pointer text-lg font-semibold text-white">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/contact"
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
