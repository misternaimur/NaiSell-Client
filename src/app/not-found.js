/** @format */

import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center px-6 py-12 select-none">
      <div className="text-center max-w-lg w-full">
        {/* --- Attractive Illustration (CSS & SVG) --- */}
        <div className="relative w-full h-64 flex items-center justify-center mb-8 animate-pulse">
          {/* Background Soft Glow */}
          <div className="absolute w-48 h-48 bg-blue-100 rounded-full blur-2xl opacity-70"></div>

          {/* Big 404 & Vector Style Shapes */}
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-9xl font-black text-slate-200 tracking-widest relative">
              404
              <span className="absolute inset-0 flex items-center justify-center text-blue-600 text-7xl animate-bounce">
                <i className="fas fa-exclamation-triangle"></i>
              </span>
            </h1>

            {/* Small Floating Elements */}
            <div className="absolute top-0 left-4 text-amber-400 text-xl animate-spin [animation-duration:10s]">
              <i className="fas fa-star"></i>
            </div>
            <div className="absolute bottom-4 right-4 text-secondary text-2xl animate-bounce [animation-duration:3s]">
              <i className="fas fa-ghost"></i>
            </div>
          </div>
        </div>
        {/* ------------------------------------------- */}

        {/* Error Message Text */}
        <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">
          Oops! Page Not Found
        </h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
          Apni je page-ti khujchen sheti hoyto delete hoye geche athoba URL-ti
          likhte kono bhul hoyeche. Niche thaka button-ti chepe abar home page-e
          fire jan.
        </p>

        {/* --- Back To Home Button --- */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <i className="fas fa-home text-sm"></i>
          Back To Home
        </Link>
      </div>
    </div>
  );
}
