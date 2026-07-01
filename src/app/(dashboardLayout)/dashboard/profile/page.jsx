"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@heroui/react";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!session?.user?.email) {
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/profile?email=${session.user.email}`
        );
        const data = await res.json();
        if (data.success) {
          setName(data.user.name || "");
          setImage(data.user.image || "");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [session, router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            name,
            image,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessage("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface-container-high rounded w-48" />
        <div className="h-24 bg-surface-container-high rounded" />
        <div className="h-12 bg-surface-container-high rounded w-48" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 max-w-2xl"
    >
      <h1 className="text-2xl font-bold text-on-surface font-display mb-6">Profile Settings</h1>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-6">
        {/* Avatar Preview */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-outline-variant/30 bg-surface-container-high">
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary font-display">
                {name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface font-sans">{name || "User"}</p>
            <p className="text-xs text-outline font-sans">{session?.user?.email}</p>
            <p className="text-xs text-primary font-semibold capitalize font-sans">{session?.user?.role || "User"}</p>
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider font-sans">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
            placeholder="Enter your name"
          />
        </div>

        {/* Image URL Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider font-sans">Profile Image URL</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-on-primary font-semibold px-6 h-10 rounded-2xl shadow-sm hover:bg-primary/95 transition-all font-sans"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          {message && (
            <p className={`text-sm font-sans ${message.includes("success") ? "text-primary" : "text-error"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
