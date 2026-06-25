/** @format */

"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#080c18] px-4 py-16 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md sm:p-12">
        <h1 className="text-4xl font-black sm:text-5xl">Terms of Service</h1>
        <p className="mt-5 text-lg leading-8 text-slate-400">
          By using NaiSell, you agree to use the platform responsibly and
          respect the rights of other buyers and sellers.
        </p>
        <div className="mt-8 space-y-4 text-sm leading-7 text-slate-400">
          <p>1. Users must provide accurate account and product information.</p>
          <p>
            2. Transactions and communications should remain respectful and
            lawful.
          </p>
          <p>
            3. NaiSell reserves the right to review or remove listings that
            violate platform policy.
          </p>
        </div>
      </div>
    </div>
  );
}
