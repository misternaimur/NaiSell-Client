/** @format */
import { baseURL } from "./baseUrl";

// Cache the backend JWT for the current browser session.
let cachedJwt = null;
let jwtFetchPromise = null;

// Create full API URL
const buildApiUrl = (path) => {
  const normalizedPath = path?.replace(/^\/+/, "");
  return `${baseURL}/${normalizedPath}`;
};

// Standard fallback response for network/server errors
const buildFallbackResponse = (path, error) => ({
  success: false,
  message: "Unable to connect to the server right now. Please try again later.",
  path,
  error: error?.message || "Unknown error",
});

const isProtectedAuthPath = (path) =>
  /^api\/(admin|buyer|seller|orders|products|wishlist|users|payments|reviews)(\/|\?|$)/.test(
    path?.replace(/^\/+/, ""),
  );

/**
 * Exchange session token for JWT.
 */
const exchangeToken = async () => {
  try {
    const res = await fetch("/api/auth/token", {
      method: "POST",
      credentials: "include",
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
 * Return cached JWT if available.
 * Otherwise exchange the session token only once.
 */
const getJwtToken = async ({ forceRefresh = false } = {}) => {
  if (!forceRefresh && cachedJwt) {
    return cachedJwt;
  }

  if (forceRefresh) {
    cachedJwt = null;
  }

  // Prevent multiple simultaneous token exchange requests
  if (!jwtFetchPromise) {
    jwtFetchPromise = exchangeToken().finally(() => {
      jwtFetchPromise = null;
    });
  }

  return jwtFetchPromise;
};

/**
 * Clear cached JWT after logout or token expiration.
 */
export const clearAuthToken = () => {
  cachedJwt = null;
};

export const primeBackendToken = async () => {
  return getJwtToken({ forceRefresh: true });
};

export const getAuthHeaders = async () => {
  const token = await getJwtToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const executeRequest = async (path, options, allowRetry = true) => {
  const res = await fetch(buildApiUrl(path), options);

  if (res.status !== 401 || !allowRetry || !isProtectedAuthPath(path)) {
    return res;
  }

  clearAuthToken();
  const refreshedToken = await getJwtToken({ forceRefresh: true });
  if (!refreshedToken) return res;

  const retryOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${refreshedToken}`,
    },
  };

  return fetch(buildApiUrl(path), retryOptions);
};

export const serverMutation = async (path, method, data) => {
  try {
    const authHeaders = await getAuthHeaders();

    const options = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
    };

    // Attach request body for write operations
    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(data);
    }

    const res = await executeRequest(path, options);

    if (!res.ok) {
      const errorText = await res.text();

      // Clear cached token if authentication fails
      if (res.status === 401) {
        clearAuthToken();
      }

      return {
        success: false,
        message: errorText || "Request failed",
      };
    }

    return await res.json().catch(() => ({}));
  } catch (error) {
    console.warn("API request failed:", error);
    return buildFallbackResponse(path, error);
  }
};

export const serverFetch = async (path) => {
  try {
    const authHeaders = await getAuthHeaders();

    const res = await executeRequest(path, {
      cache: "no-store",
      credentials: "include",
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();

      // Clear cached token if authentication fails
      if (res.status === 401) {
        clearAuthToken();
      }

      return {
        success: false,
        message: errorText || "Request failed",
      };
    }

    return await res.json().catch(() => ({}));
  } catch (error) {
    console.warn("API request failed:", error);
    return buildFallbackResponse(path, error);
  }
};

export const getSellerStats = async (email) => {
  // Return default values when email is missing
  if (!email) {
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

  return await serverFetch(`api/seller/stats/${email}`);
};
