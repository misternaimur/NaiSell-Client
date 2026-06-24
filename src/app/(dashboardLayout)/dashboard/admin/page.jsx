/** @format */

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 mt-6 pb-12 text-white">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/40 via-slate-950/20 to-transparent border border-slate-800/50 p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Admin Dashboard
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1.5">
          Platform overview, user management, and moderation tools.
        </p>
      </div>

      <div className="text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
        Admin panel coming soon.
      </div>
    </div>
  );
}
