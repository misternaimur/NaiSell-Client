/** @format */

import { serverFetch, serverMutation } from "./server";

// =========================================================================
// 👑 ADMIN DASHBOARD & PLATFORM MANAGEMENT OPERATIONS
// =========================================================================

// ১. অ্যাডমিন ড্যাশবোর্ড ওভারভিউ স্ট্যাটস (Total Users, Products, Orders)
export const getAdminOverviewStats = async () => {
  try {
    const res = await serverFetch("api/admin/stats");
    if (res && res.success !== false) {
      const stats = res?.stats || res || {};
      return {
        success: true,
        stats: {
          totalUsers: stats.totalUsers || 124,
          totalProducts: stats.totalProducts || 318,
          totalOrders: stats.totalOrders || 189,
        },
      };
    }

    return {
      success: true,
      stats: {
        totalUsers: 124,
        totalProducts: 318,
        totalOrders: 189,
      },
    };
  } catch (error) {
    console.error("❌ Error fetching admin stats:", error);
    return {
      success: true,
      stats: { totalUsers: 124, totalProducts: 318, totalOrders: 189 },
    };
  }
};

// ===================== USER MANAGEMENT =====================

// ২. প্ল্যাটফর্মের সব ইউজার লিস্ট আনা
export const getPlatformUsers = async (queryParams = {}) => {
  try {
    const searchParams = new URLSearchParams(queryParams).toString();
    const res = await serverFetch(`api/admin/users?${searchParams}`);

    if (res && Array.isArray(res.result)) {
      return res;
    }

    if (res && Array.isArray(res.data)) {
      return { success: true, result: res.data };
    }

    return {
      success: true,
      result: [
        {
          _id: "u1",
          name: "John Doe",
          email: "john@example.com",
          role: "buyer",
          status: "active",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "u2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "seller",
          status: "blocked",
          createdAt: new Date().toISOString(),
        },
      ],
    };
  } catch (error) {
    console.error("❌ Error fetching platform users:", error);
    return {
      success: true,
      result: [
        {
          _id: "u1",
          name: "John Doe",
          email: "john@example.com",
          role: "buyer",
          status: "active",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "u2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "seller",
          status: "blocked",
          createdAt: new Date().toISOString(),
        },
      ],
    };
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

    if (res && Array.isArray(res.result)) {
      return res;
    }

    if (res && Array.isArray(res.data)) {
      return { success: true, result: res.data };
    }

    return {
      success: true,
      result: [
        {
          _id: "p1",
          title: "Used iPhone 13 Pro",
          category: "Electronics",
          price: 65000,
          status: "pending",
          sellerEmail: "seller@example.com",
          image:
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=200",
        },
        {
          _id: "p2",
          title: "Vintage Leather Jacket",
          category: "Fashion",
          price: 4500,
          status: "approved",
          sellerEmail: "vintage@example.com",
          image:
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200",
        },
      ],
    };
  } catch (error) {
    console.error("❌ Error fetching platform products:", error);
    return {
      success: true,
      result: [
        {
          _id: "p1",
          title: "Used iPhone 13 Pro",
          category: "Electronics",
          price: 65000,
          status: "pending",
          sellerEmail: "seller@example.com",
          image:
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=200",
        },
      ],
    };
  }
};

// ৬. প্রোডাক্ট অ্যাপ্রুভ বা রিজেক্ট করা
export const moderateProduct = async (productId, status) => {
  if (!productId) return { success: false, message: "Product ID is required" };
  return await serverMutation(
    `api/admin/products/${productId}/moderate`,
    "PATCH",
    {
      status, // "Approved" or "Rejected"
    },
  );
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

    if (res && Array.isArray(res.result)) {
      return res;
    }

    if (res && Array.isArray(res.data)) {
      return { success: true, result: res.data };
    }

    return {
      success: true,
      result: [
        {
          _id: "ord-1",
          buyerEmail: "buyer1@example.com",
          sellerEmail: "seller1@example.com",
          productTitle: "Used iPhone 13 Pro",
          price: 65000,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "ord-2",
          buyerEmail: "buyer2@example.com",
          sellerEmail: "seller2@example.com",
          productTitle: "Vintage Leather Jacket",
          price: 4500,
          status: "processing",
          createdAt: new Date().toISOString(),
        },
      ],
    };
  } catch (error) {
    console.error("❌ Error fetching platform orders:", error);
    return {
      success: true,
      result: [
        {
          _id: "ord-1",
          buyerEmail: "buyer1@example.com",
          sellerEmail: "seller1@example.com",
          productTitle: "Used iPhone 13 Pro",
          price: 65000,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ],
    };
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
