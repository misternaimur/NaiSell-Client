/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardHeading from "@/components/DashboardHeading";
import { getBuyerProfile, updateBuyerProfile } from "@/lib/api/buyerActions";
import { uploadImage } from "@/utils/uploadImage";
import { toast } from "react-toastify";
import { FaCamera, FaUserCircle } from "react-icons/fa";

const BuyerProfilePage = () => {
  const { data: session } = useSession();
  const buyerEmail = session?.user?.email || "";

  const [profile, setProfile] = useState({
    name: "",
    email: buyerEmail,
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!buyerEmail) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getBuyerProfile(buyerEmail);
        const profileData = data?.profile || data?.user || data || {};

        setProfile({
          name: profileData.name || "",
          email: profileData.email || buyerEmail,
          image: profileData.image || profileData.avatar || "",
        });
      } catch (error) {
        console.error("Error loading buyer profile:", error);
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [buyerEmail]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);

      if (!imageUrl) {
        toast.error("Image upload failed.");
        return;
      }

      setProfile((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Profile image uploaded.");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!buyerEmail) {
      toast.error("Please sign in to update your profile.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        email: buyerEmail,
        name: profile.name,
        image: profile.image,
      };

      const data = await updateBuyerProfile(payload);

      if (data?.success === false) {
        toast.error(data.message || "Profile update failed.");
        return;
      }

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  const previewImage = useMemo(() => profile.image || "", [profile.image]);

  return (
    <div className="space-y-8 mt-6 pb-12 text-white max-w-5xl mx-auto px-4">
      <DashboardHeading
        title="My Profile"
        description="Keep your personal information current and update your profile photo."
      />

      <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-2xl p-6 sm:p-8">
        {loading ? (
          <div className="text-center py-12 text-slate-400">
            Loading profile...
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[220px_1fr] items-start">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-slate-700 shadow-lg"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-slate-700 bg-slate-950/70 text-slate-500">
                    <FaUserCircle size={72} />
                  </div>
                )}

                <label className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-cyan-400 shadow-lg transition hover:bg-slate-800">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-slate-200">
                  {profile.name || "Buyer"}
                </p>
                <p className="text-xs text-slate-500">
                  {profile.email || buyerEmail}
                </p>
              </div>

              <p className="text-center text-xs text-slate-500">
                {uploading
                  ? "Uploading image..."
                  : "Click the camera icon to change your photo."}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-400"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerProfilePage;
