/** @format */
"use client";

import { useState, useEffect } from "react";
import DashboardHeading from "@/components/DashboardHeading";
import {
  FaUser,
  FaCamera,
  FaSave,
  FaEnvelope,
  FaShieldAlt,
  FaShoppingBag,
  FaHeart,
  FaWallet,
  FaLink,
  FaUpload,
} from "react-icons/fa";

const ProfileManagementPage = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageMethod, setImageMethod] = useState("upload"); // 'upload' | 'url'

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "", // এটি ইমেজ ইউআরএল বা বেস৬৪ স্ট্রিং হোল্ড করবে
  });

  // ড্যাশবোর্ড স্ট্যাটাস কাউন্টার ডাটা
  const [stats, setStats] = useState({
    totalOrders: 12,
    wishlistCount: 5,
    totalSpent: "45,200",
  });

  const buyerEmail = "buyer@naisell.com";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const res = await fetch(
          `http://localhost:5000/api/users/profile?email=${buyerEmail}`,
        );
        const data = await res.json();

        if (data.success) {
          setFormData({
            name: data.user.name || "",
            email: data.user.email || buyerEmail,
            image:
              data.user.image ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📂 লোকাল ফাইল আপলোড হ্যান্ডলার (কনভার্ট টু Base64 প্রিভিউ)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ফাইল সাইজ ভ্যালিডেশন (ঐচ্ছিক - যেমন ম্যাক্স ২ এমবি)
    if (file.size > 2 * 1024 * 1024) {
      alert("❌ File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result })); // বেস৬৪ স্ট্রিং বাফারে সেভ হবে
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/profile/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            image: formData.image, // এটি ব্যাকএন্ডে গিয়ে সরাসরি স্ট্রিং হিসেবে ডেটাবেজে জমা হবে
          }),
        },
      );

      const data = await res.json();
      if (data.success) {
        alert("🎉 Profile updated successfully on NaiSell!");
      } else {
        alert(`❌ Failed to update: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 text-sm tracking-widest uppercase">
        <div className="animate-pulse">Loading Profile Workspace...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6 pb-16 text-white max-w-5xl mx-auto px-4">
      {/* 🎯 হেডিং সেকশন */}
      <DashboardHeading
        title="Profile Management"
        description="Configure your personal identity, upload avatar locally or link from web, and manage your account details."
      />

      {/* 🌟 প্রোফাইল হিরো ব্যানার কার্ড */}
      <div className="relative bg-slate-900/20 backdrop-blur-md border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
        <div className="h-36 w-full bg-gradient-to-r from-cyan-600/30 via-purple-600/20 to-emerald-600/30 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,242,254,0.15),transparent)] pointer-events-none" />
        </div>

        {/* অ্যাভাটার ও বেসিক প্রোফাইল টেক্সট লেআউট */}
        <div className="px-6 sm:px-8 pb-6 flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 relative z-10 border-b border-slate-900/80">
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-slate-950 bg-slate-900 shadow-2xl transition-all duration-300">
            <img
              src={
                formData.image ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop"
              }
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center sm:text-left mb-2 space-y-1">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-100">
                {formData.name || "NaiSell User"}
              </h2>
              <span className="flex items-center gap-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                <FaShieldAlt size={10} /> Verified Buyer
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{formData.email}</p>
          </div>
        </div>

        {/* 📊 স্ট্যাট কাউন্টার গ্রিড */}
        <div className="grid grid-cols-3 divide-x divide-slate-800/60 bg-slate-950/20 text-center py-4">
          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <FaShoppingBag className="text-cyan-500/70" size={12} />
              <span className="hidden sm:inline">Orders</span>
            </div>
            <span className="text-lg font-black text-slate-200 mt-1">
              {stats.totalOrders}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <FaHeart className="text-rose-500/70" size={12} />
              <span className="hidden sm:inline">Saved Items</span>
            </div>
            <span className="text-lg font-black text-slate-200 mt-1">
              {stats.wishlistCount}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <FaWallet className="text-emerald-500/70" size={12} />
              <span className="hidden sm:inline">Total Spent</span>
            </div>
            <span className="text-lg font-black text-emerald-400 mt-1">
              ৳{stats.totalSpent}
            </span>
          </div>
        </div>
      </div>

      {/* 📝 প্রোফাইল সেটিংস এডিট ফর্ম */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
      >
        <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400 border-b border-slate-800/60 pb-3">
          Account Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* নাম ইনপুট */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FaUser className="text-slate-500" size={12} /> Display Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              required
              className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-inner"
            />
          </div>

          {/* 🔘 ইমেজ মেথড সিলেক্টর টগল বোতাম (URL vs Upload) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Avatar Select Method
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setImageMethod("upload")}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  imageMethod === "upload"
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FaUpload size={11} />
                Local Upload
              </button>
              <button
                type="button"
                onClick={() => setImageMethod("url")}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  imageMethod === "url"
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FaLink size={11} />
                Web URL
              </button>
            </div>
          </div>
        </div>

        {/* 🔄 কন্ডিশনাল ইমেজ ইনপুট ফিল্ড (মেথড অনুযায়ী চেঞ্জ হবে) */}
        {imageMethod === "upload" ? (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FaUpload className="text-slate-500" size={12} /> Upload Profile
              Image
            </label>
            <div className="relative group w-full bg-slate-950/40 border border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl px-4 py-6 transition-all text-center flex flex-col items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <FaCamera
                className="text-slate-600 group-hover:text-cyan-400 mb-2 transition-colors"
                size={24}
              />
              <span className="text-xs text-slate-400 font-medium">
                Click to browse or drop your image here
              </span>
              <span className="text-[10px] text-slate-600 mt-1">
                Supports PNG, JPG, JPEG (Max 2MB)
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FaLink className="text-slate-500" size={12} /> Image Asset URL
            </label>
            <input
              type="url"
              name="image"
              value={
                formData.image.startsWith("data:image") ? "" : formData.image
              }
              onChange={handleChange}
              placeholder="https://images.unsplash.com/your-image-id.jpg"
              className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono shadow-inner"
            />
          </div>
        )}

        {/* ইমেইল এড্রেস (লকড) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FaEnvelope className="text-slate-600" size={12} /> Registered Email
          </label>
          <div className="relative flex items-center">
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full bg-slate-950/10 border border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed select-none border-dashed"
            />
            <span className="absolute right-4 text-[10px] font-mono text-slate-600 uppercase font-bold tracking-wider select-none">
              Locked
            </span>
          </div>
        </div>

        {/* সাবমিট বাটন */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black px-8 py-3.5 text-xs rounded-xl shadow-lg shadow-cyan-950/40 hover:opacity-95 active:scale-98 transition-all uppercase tracking-widest border border-cyan-400/20"
          >
            <FaSave
              className={`text-slate-100 ${loading ? "animate-spin" : ""}`}
              size={13}
            />
            <span>{loading ? "Updating Workspace..." : "Save Workspace"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileManagementPage;
