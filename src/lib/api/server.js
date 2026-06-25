/** @format */

import { baseURL } from "./baseUrl";

// =========================================================================
// 🌐 1. CORE API UTILITIES (Fetch & Mutation Handlers)
// =========================================================================

const buildApiUrl = (path) => {
  const normalizedPath = path?.replace(/^\/+/, "");
  return `${baseURL}/${normalizedPath}`;
};

const buildFallbackResponse = (path, error) => ({
  success: false,
  message: "Unable to connect to the server right now. Please try again later.",
  path,
  error: error?.message || "Unknown error",
});

/**
 * 🛠️ POST, PUT, PATCH রিকোয়েস্ট হ্যান্ডেল করার গ্লোবাল মিউটেশন ফাংশন
 */
export const serverMutation = async (path, method, data) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(data);
    }

    const res = await fetch(buildApiUrl(path), options);

    if (!res.ok) {
      const errorText = await res.text();
      return {
        success: false,
        message: errorText || "Request failed",
      };
    }

    return await res.json().catch(() => ({}));
  } catch (error) {
    console.warn("⚠️ API request failed:", error);
    return buildFallbackResponse(path, error);
  }
};

/**
 * 🔄 GET রিকোয়েস্টের মাধ্যমে রিয়েল-টাইম ডাটাবেজ থেকে ডাটা নিয়ে আসার ফাংশন
 */
export const serverFetch = async (path) => {
  try {
    const res = await fetch(buildApiUrl(path), {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      return {
        success: false,
        message: errorText || "Request failed",
      };
    }

    return await res.json().catch(() => ({}));
  } catch (error) {
    console.warn("⚠️ API request failed:", error);
    return buildFallbackResponse(path, error);
  }
};

// =========================================================================
// 👨‍💼 2. SELLER API ACTIONS (Dashboard & Analytics)
// =========================================================================

/**
 * 📊 নির্দিষ্ট সেলারের ইমেইল অনুযায়ী লাইভ ড্যাশবোর্ড স্ট্যাটস নিয়ে আসা
 * @param {string} email - লগইন থাকা সেলারের ইমেইল
 */
export const getSellerStats = async (email) => {
  try {
    if (!email) {
      console.warn("⚠️ getSellerStats: Email target missing.");
      return {
        success: false,
        stats: {
          totalProducts: 0,
          totalSales: 0,
          totalRevenue: 0,
          pendingOrders: 0,
        },
      };
    }

    // ব্যাকএন্ডের ডাইনামিক রুট (/api/seller/stats/:email) কল করা হচ্ছে
    return await serverFetch(`api/seller/stats/${email}`);
  } catch (error) {
    console.error("❌ Error fetching seller stats from server:", error);
    return {
      success: false,
      stats: {
        totalProducts: 0,
        totalSales: 0,
        totalRevenue: 0,
        pendingOrders: 0,
      },
    };
  }
};
