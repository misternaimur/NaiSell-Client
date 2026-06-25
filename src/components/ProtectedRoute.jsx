/** @format */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(redirectTo);
    }
  }, [isPending, router, redirectTo, session]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080c18] text-white">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return children;
}
