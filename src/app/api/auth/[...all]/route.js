/** @format */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const { POST: authPOST, GET: authGET } = toNextJsHandler(auth);

const sessionDataCookiePattern =
  /^(?:__Secure-)?better-auth\.session_data(?:\.\d+)?$/;
const base64UrlPattern = /^[A-Za-z0-9_-]+$/;

function sanitizeSessionDataCookie(request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return request;

  const cookies = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .map((cookie) => {
      const separatorIndex = cookie.indexOf("=");
      if (separatorIndex === -1) return { name: cookie, value: "" };
      return {
        name: cookie.slice(0, separatorIndex),
        value: cookie.slice(separatorIndex + 1),
      };
    });

  const hasMalformedSessionDataCookie = cookies.some(
    ({ name, value }) =>
      sessionDataCookiePattern.test(name) &&
      !base64UrlPattern.test(decodeURIComponent(value)),
  );

  if (!hasMalformedSessionDataCookie) return request;

  const sanitizedCookieHeader = cookies
    .filter(({ name }) => !sessionDataCookiePattern.test(name))
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const headers = new Headers(request.headers);
  if (sanitizedCookieHeader) headers.set("cookie", sanitizedCookieHeader);
  else headers.delete("cookie");

  return new Request(request, { headers });
}

export async function GET(request) {
  return authGET(sanitizeSessionDataCookie(request));
}

export async function POST(request) {
  return authPOST(sanitizeSessionDataCookie(request));
}
