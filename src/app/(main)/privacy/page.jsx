/** @format */

"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#080c18] px-4 py-16 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md sm:p-12">
        <h1 className="text-4xl font-black sm:text-5xl">Privacy Guidelines</h1>
        <p className="mt-5 text-lg leading-8 text-slate-400">
          NaiSell protects your personal information and only uses it to improve
          your experience on the platform.
        </p>
        <div className="mt-8 space-y-4 text-sm leading-7 text-slate-400">
          <p>1. Your profile and contact information are stored securely.</p>
          <p>
            2. We use your data only for account management, product visibility,
            and communication.
          </p>
          <p>
            3. You can request account updates or data changes through your
            profile settings.
          </p>
        </div>
      </div>
    </div>
  );
}
