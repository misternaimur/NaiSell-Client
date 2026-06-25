/** @format */

"use client";

export default function VerificationPage() {
  return (
    <div className="min-h-screen bg-[#080c18] px-4 py-16 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md sm:p-12">
        <h1 className="text-4xl font-black sm:text-5xl">Trust & Safety</h1>
        <p className="mt-5 text-lg leading-8 text-slate-400">
          NaiSell is built to make trading feel safe, transparent, and reliable
          for everyone.
        </p>
        <div className="mt-8 space-y-4 text-sm leading-7 text-slate-400">
          <p>• Verified account information helps build trust between users.</p>
          <p>
            • Clear product details and communication reduce misunderstandings.
          </p>
          <p>• Reporting tools and moderation help protect the community.</p>
        </div>
      </div>
    </div>
  );
}
