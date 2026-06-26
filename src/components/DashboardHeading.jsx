/** @format */

const DashboardHeading = ({ title, description }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-container border border-outline-variant/60 p-6 sm:p-8 shadow-sm">
      {/* গ্লো ইফেক্ট ব্যাকগ্রাউন্ডের জন্য */}
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-[50px] pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-secondary/5 blur-[50px] pointer-events-none" />

      {/* টেক্সট কন্টেন্ট */}
      <div className="relative z-10 space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-on-surface">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm font-medium text-on-surface-variant max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardHeading;
