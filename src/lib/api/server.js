import { baseURL } from "./baseUrl";

// Cache the JWT token after exchange
let cachedJwt = null;
let jwtFetchPromise = null;

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
 * Get the Better-Auth session token from cookies.
 */
const getSessionToken = () => {
  if (typeof window === "undefined") return null;
  try {
    // Better-Auth stores session token in a cookie
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split("=");
      // Check various possible cookie names
      if (key === "better-auth.session_token" || key === "session_token") {
        return decodeURIComponent(value);
      }
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Exchange a Better-Auth session token for a JWT by calling the server.
 */
const exchangeToken = async (sessionToken) => {
  try {
    const res = await fetch(buildApiUrl("api/auth/token"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken }),
    });

    if (!res.ok) {
      cachedJwt = null;
      return null;
    }

    const data = await res.json();
    if (data.success && data.token) {
      cachedJwt = data.token;
      return data.token;
    }
    return null;
  } catch (error) {
    console.warn("Token exchange failed:", error);
    cachedJwt = null;
    return null;
  }
};

/**
 * Get a valid JWT token, exchanging from session if needed.
 * Uses a promise cache to avoid concurrent duplicate exchanges.
 */
const getJwtToken = async () => {
  if (cachedJwt) return cachedJwt;

  const sessionToken = getSessionToken();
  if (!sessionToken) return null;

  // Deduplicate concurrent exchange requests
  if (!jwtFetchPromise) {
    jwtFetchPromise = exchangeToken(sessionToken).finally(() => {
      jwtFetchPromise = null;
    });
  }

  return jwtFetchPromise;
};

/**
 * Clear the cached JWT (useful on logout/signout).
 */
export const clearAuthToken = () => {
  cachedJwt = null;
};

export const serverMutation = async (path, method, data) => {
  try {
    const token = await getJwtToken();
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
      // If 401, clear cached JWT so it gets re-fetched next time
      if (res.status === 401) {
        cachedJwt = null;
      }
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
    const token = await getJwtToken();
    const res = await fetch(buildApiUrl(path), {
      cache: "no-store",
      credentials: "include",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      if (res.status === 401) {
        cachedJwt = null;
      }
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