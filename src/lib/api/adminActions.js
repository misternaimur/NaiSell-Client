/** @format */

import { serverFetch, serverMutation } from "./server";

// =========================================================================
// 👑 ADMIN DASHBOARD & PLATFORM MANAGEMENT OPERATIONS
// =========================================================================

// ১. অ্যাডমিন ড্যাশবোর্ড ওভারভিউ স্ট্যাটস (Total Users, Products, Orders)
export const getAdminOverviewStats = async () => {
  try {
    const res = await serverFetch("api/admin/stats");
    // Fallback if backend doesn't exist yet
    if (!res || !res.success) {
      return {
        success: true,
        stats: {
          totalUsers: res?.stats?.totalUsers || 0,
          totalProducts: res?.stats?.totalProducts || 0,
          totalOrders: res?.stats?.totalOrders || 0,
        },
      };
    }
    return res;
  } catch (error) {
    console.error("❌ Error fetching admin stats:", error);
    return {
      success: false,
      stats: { totalUsers: 0, totalProducts: 0, totalOrders: 0 },
    };
  }
};

// ===================== USER MANAGEMENT =====================

// ২. প্ল্যাটফর্মের সব ইউজার লিস্ট আনা
export const getPlatformUsers = async (queryParams = {}) => {
  try {
    const searchParams = new URLSearchParams(queryParams).toString();
    const res = await serverFetch(`api/admin/users?${searchParams}`);
    // If backend isn't ready, return empty to prevent crashes
    if (!res || !res.success) return { success: true, result: [] };
    return res;
  } catch (error) {
    console.error("❌ Error fetching platform users:", error);
    return { success: false, result: [] };
  }
};

// ৩. ইউজারের স্ট্যাটাস আপডেট করা (Block / Unblock)
export const updateUserStatus = async (userId, newStatus) => {
  if (!userId) return { success: false, message: "User ID is required" };
  return await serverMutation(`api/admin/users/${userId}/status`, "PATCH", {
    status: newStatus,
  });
};

// ৪. ইউজার একাউন্ট পার্মানেন্টলি ডিলিট করা
export const deleteUser = async (userId) => {
  if (!userId) return { success: false, message: "User ID is required" };
  return await serverMutation(`api/admin/users/${userId}`, "DELETE");
};

// ===================== PRODUCT MANAGEMENT =====================

// ৫. প্ল্যাটফর্মের সব প্রোডাক্ট লিস্ট আনা (মডারেশনের জন্য)
export const getPlatformProducts = async (queryParams = {}) => {
  try {
    const searchParams = new URLSearchParams(queryParams).toString();
    const res = await serverFetch(`api/admin/products?${searchParams}`);
    if (!res || (!res.success && !Array.isArray(res))) return { success: true, result: [] };
    return res;
  } catch (error) {
    console.error("❌ Error fetching platform products:", error);
    return { success: false, result: [] };
  }
};

// ৬. প্রোডাক্ট অ্যাপ্রুভ বা রিজেক্ট করা
export const moderateProduct = async (productId, status) => {
  if (!productId) return { success: false, message: "Product ID is required" };
  return await serverMutation(`api/admin/products/${productId}/moderate`, "PATCH", {
    status, // "Approved" or "Rejected"
  });
};

// ৭. অ্যাডমিন কর্তৃক প্রোডাক্ট ডিলিট করা
export const deletePlatformProduct = async (productId) => {
  if (!productId) return { success: false, message: "Product ID is required" };
  return await serverMutation(`api/admin/products/${productId}`, "DELETE");
};

// ===================== ORDER MANAGEMENT =====================

// ৮. প্ল্যাটফর্মের সব অর্ডার মনিটর করা
export const getPlatformOrders = async (queryParams = {}) => {
  try {
    const searchParams = new URLSearchParams(queryParams).toString();
    const res = await serverFetch(`api/admin/orders?${searchParams}`);
    if (!res || (!res.success && !Array.isArray(res))) return { success: true, result: [] };
    return res;
  } catch (error) {
    console.error("❌ Error fetching platform orders:", error);
    return { success: false, result: [] };
  }
};

// ৯. অ্যাডমিন কর্তৃক অর্ডারের স্ট্যাটাস ফোর্স আপডেট করা (Dispute Resolution)
export const updatePlatformOrderStatus = async (orderId, newStatus) => {
  if (!orderId) return { success: false, message: "Order ID is required" };
  return await serverMutation(`api/admin/orders/${orderId}/status`, "PATCH", {
    status: newStatus,
  });
};

// ===================== PLATFORM ANALYTICS =====================

// ১০. অ্যাডমিন প্ল্যাটফর্ম অ্যানালিটিক্স ডেটা আনা
export const getPlatformAnalytics = async () => {
  try {
    const res = await serverFetch("api/admin/analytics");
    if (!res || !res.success) {
      // Fake Data Fallback per PRD
      return {
        success: true,
        data: {
          userGrowth: [
            { month: "Jan", amount: 120 },
            { month: "Feb", amount: 250 },
            { month: "Mar", amount: 380 },
            { month: "Apr", amount: 500 },
            { month: "May", amount: 720 },
            { month: "Jun", amount: 950 },
          ],
          monthlyOrders: [
            { month: "Jan", amount: 45 },
            { month: "Feb", amount: 90 },
            { month: "Mar", amount: 150 },
            { month: "Apr", amount: 210 },
            { month: "May", amount: 340 },
            { month: "Jun", amount: 480 },
          ],
          categoryPerformance: [
            { category: "Electronics", percentage: 45, revenue: 1250000 },
            { category: "Fashion", percentage: 25, revenue: 680000 },
            { category: "Home Appliances", percentage: 20, revenue: 520000 },
            { category: "Automobiles", percentage: 10, revenue: 250000 },
          ],
        },
      };
    }
    return res;
  } catch (error) {
    console.error("❌ Error fetching platform analytics:", error);
    return null;
  }
};
