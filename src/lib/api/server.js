import { baseURL } from "./baseUrl";

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

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  try {
    // Better-Auth stores session token in a cookie named 'better-auth.session_token'
    // or in localStorage under various keys depending on version
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split("=");
      if (key === "better-auth.session_token") {
        return decodeURIComponent(value);
      }
    }
    // Fallback: try localStorage keys Better-Auth may use
    const keys = ["better-auth.session_token", "better-auth.session", "auth.session"];
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.token) return parsed.token;
          if (typeof parsed === "string") return parsed;
        } catch {
          return raw;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
};

export const serverMutation = async (path, method, data) => {
  try {
    const token = getAuthToken();
    const options = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(data);
    }

    const res = await fetch(buildApiUrl(path), options);

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, message: errorText || "Request failed" };
    }

    return await res.json().catch(() => ({}));
  } catch (error) {
    console.warn("API request failed:", error);
    return buildFallbackResponse(path, error);
  }
};

export const serverFetch = async (path) => {
  try {
    const token = getAuthToken();
    const res = await fetch(buildApiUrl(path), {
      cache: "no-store",
      credentials: "include",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, message: errorText || "Request failed" };
    }

    return await res.json().catch(() => ({}));
  } catch (error) {
    console.warn("API request failed:", error);
    return buildFallbackResponse(path, error);
  }
};

export const getSellerStats = async (email) => {
  if (!email) {
    return { success: false, stats: { totalProducts: 0, totalSales: 0, totalRevenue: 0, pendingOrders: 0 } };
  }
  return await serverFetch(`api/seller/stats/${email}`);
};
