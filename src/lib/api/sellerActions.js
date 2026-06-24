/** @format */

import { serverFetch, serverMutation } from "./server";

// ১. সেলারের ওভারভিউ স্ট্যাটস (Total Products, Sales, Revenue, Pending Orders)
export const getSellerStats = async (email) => {
  if (!email) return { success: false, message: "Email is required" };
  return await serverFetch(
    `api/seller/stats?email=${encodeURIComponent(email)}`,
  );
};

// ২. নতুন প্রোডাক্ট অ্যাড বা লিস্টিং করা
export const addProduct = async (productData) => {
  return await serverMutation("api/products", "POST", productData);
};

// ৩. সেলারের নিজের সব প্রোডাক্ট লিস্ট দেখা (ফিল্টার ও সার্চ সহ)
export const getSellerProducts = async (queryParams = {}) => {
  const searchParams = new URLSearchParams(queryParams).toString();
  return await serverFetch(`api/products?${searchParams}`);
};

// ৪. প্রোডাক্টের তথ্য আপডেট বা এডিট করা
export const updateProduct = async (id, updatedData) => {
  if (!id) return { success: false, message: "Product ID is required" };
  return await serverMutation(`api/products/${id}`, "PUT", updatedData);
};

// ৫. প্রোডাক্ট ডিলিট করা
export const deleteProduct = async (id) => {
  if (!id) return { success: false, message: "Product ID is required" };
  return await serverMutation(`api/products/${id}`, "DELETE");
};

// ৬. সেলারের কাছে আসা কাস্টমারদের অর্ডার লিস্ট দেখা
export const getSellerIncomingOrders = async (email) => {
  if (!email) return { success: false, message: "Email is required" };
  return await serverFetch(
    `api/seller/orders?email=${encodeURIComponent(email)}`,
  );
};

// ৭. অর্ডারের স্ট্যাটাস পরিবর্তন করা (যেমন: Pending → Processing → Shipped)
export const updateOrderStatus = async (orderId, newStatus) => {
  if (!orderId) return { success: false, message: "Order ID is required" };
  return await serverMutation(`api/orders/${orderId}/status`, "PATCH", {
    status: newStatus,
  });
};

// ৮. সেলারের চার্ট বা গ্রাফ অ্যানালিটিক্স ডেটা আনা
export const getSellerAnalytics = async () => {
  return await serverFetch("api/seller/analytics");
};
