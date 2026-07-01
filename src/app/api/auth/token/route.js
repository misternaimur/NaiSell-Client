/** @format */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const backendBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

export async function POST(request) {
  try {
    const sessionPayload = await auth.api.getSession({
      headers: request.headers,
    });

    const sessionToken = sessionPayload?.session?.token;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "No active Better Auth session" },
        { status: 401 },
      );
    }

    const res = await fetch(`${backendBaseUrl}/api/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionToken }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    return NextResponse.json(
      data ?? { success: false, message: "Invalid token exchange response" },
      {
        status: res.status,
      },
    );
  } catch (error) {
    console.error("Token bridge error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Token exchange failed" },
      { status: 500 },
    );
  }
}
