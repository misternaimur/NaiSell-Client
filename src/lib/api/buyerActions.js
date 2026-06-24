/** @format */

import { serverFetch, serverMutation } from "./server";

// 📊 ১. বায়ার ওভারভিউ স্ট্যাটস (Total Orders, Wishlist Count)
export const getBuyerStats = async (email) => {
  if (!email) return { success: false, message: "Email is required" };
  return await serverFetch(
    `api/buyer/stats?email=${encodeURIComponent(email)}`,
  );
};

// 📦 ২. বায়ারের নিজের সব অর্ডারের লিস্ট দেখা
export const getBuyerOrders = async (email) => {
  if (!email) return { success: false, message: "Email is required" };
  return await serverFetch(
    `api/buyer/orders?email=${encodeURIComponent(email)}`,
  );
};

// ❌ ৩. বায়ার কর্তৃক অর্ডার বাতিল করা
// (আপনার নতুন server.js এখন বডি ছাড়া PATCH রিকোয়েস্ট সেফলি হ্যান্ডেল করতে পারে)
export const cancelBuyerOrder = async (orderId) => {
  if (!orderId) return { success: false, message: "Order ID is required" };
  return await serverMutation(`api/orders/${orderId}/cancel`, "PATCH");
};

// ❤️ ৪. বায়ারের উইশলিস্টের সব প্রোডাক্ট লোড করা
export const getBuyerWishlist = async (email) => {
  if (!email) return { success: false, message: "Email is required" };
  return await serverFetch(`api/wishlist?email=${encodeURIComponent(email)}`);
};

// ➕ ৫. উইশলিস্টে নতুন প্রোডাক্ট সেভ বা অ্যাড করা
export const addToWishlist = async (wishItemData) => {
  if (!wishItemData)
    return { success: false, message: "Payload data is required" };
  return await serverMutation("api/wishlist", "POST", wishItemData);
};

// 🗑️ ৬. উইশলিস্ট থেকে প্রোডাক্ট রিমুভ করা
export const removeFromWishlist = async (id) => {
  if (!id) return { success: false, message: "Wishlist Item ID is required" };
  return await serverMutation(`api/wishlist/${id}`, "DELETE");
};

// 💳 ৭. বায়ারের সফল পেমেন্ট হিস্ট্রি দেখা
export const getBuyerPaymentHistory = async (email) => {
  if (!email) return { success: false, message: "Email is required" };
  return await serverFetch(
    `api/buyer/payments?email=${encodeURIComponent(email)}`,
  );
};

// 👤 ৮. বায়ার প্রোফাইল ডাটা লোড করা (GET Method)
export const getBuyerProfile = async (email) => {
  if (!email) return { success: false, message: "Email is required" };
  return await serverFetch(
    `api/users/profile?email=${encodeURIComponent(email)}`
  );
};

// 🔄 ৯. বায়ার প্রোফাইল ডাটা আপডেট করা (PUT Method)
export const updateBuyerProfile = async (profileData) => {
  if (!profileData || !profileData.email) {
    return { success: false, message: "Profile data with email is required" };
  }
  return await serverMutation("api/users/profile", "PUT", profileData);
};