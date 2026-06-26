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
    const session = JSON.parse(localStorage.getItem("better-auth.session") || "{}");
    return session?.token || null;
  } catch {
    return null;
  }
};

export const serverMutation = async (path, method, data) => {
  try {
    const token = getAuthToken();
    const options = {
      method,
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
