"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the user is authenticated and on the home page, redirect to dashboard
    if (status === "authenticated" && window.location.pathname === "/") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthRedirect>{children}</AuthRedirect>
    </SessionProvider>
  );
}
