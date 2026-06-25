/** @format */

const configuredBaseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

export const baseURL = configuredBaseURL.replace(/\/$/, "");
