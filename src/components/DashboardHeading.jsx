/** @format */

const DashboardHeading = ({ title, description }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/40 via-slate-950/20 to-transparent border border-slate-800/50 p-6 sm:p-8 backdrop-blur-md shadow-xl">
      {/* গ্লো ইফেক্ট ব্যাকগ্রাউন্ডের জন্য */}
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-[50px] pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-[50px] pointer-events-none" />

      {/* টেক্সট কন্টেন্ট */}
      <div className="relative z-10 space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm font-medium text-slate-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardHeading;
