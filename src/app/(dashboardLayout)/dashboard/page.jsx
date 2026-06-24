/** @format */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function DashboardRedirect() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.replace("/auth/login");
        return;
      }
      const role = session?.user?.role?.toLowerCase() || "buyer";
      router.replace(`/dashboard/${role}`);
    }
  }, [session, isPending, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <span className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></span>
    </div>
  );
}
