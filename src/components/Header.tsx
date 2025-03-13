"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header style={{ 
      width: "100%", 
      backgroundColor: "white", 
      borderBottom: "1px solid #e5e7eb", 
      padding: "1rem 0" 
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: "0 1rem", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ 
            fontSize: "1.5rem", 
            fontWeight: "bold", 
            color: "#111827" 
          }}>
            <span style={{ color: "#2563eb" }}>Issue</span>Builder<span style={{ color: "#2563eb" }}>AI</span>
          </div>
        </Link>
        
        <div>
          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link 
                href="/dashboard" 
                style={{ 
                  textDecoration: "none", 
                  color: "#4b5563",
                  fontWeight: "500"
                }}
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#f3f4f6",
                  color: "#4b5563",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                Sign out
              </button>
              <div style={{ 
                width: "2rem", 
                height: "2rem", 
                borderRadius: "9999px", 
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e5e7eb"
              }}>
                {session.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || "User"} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "0.875rem", fontWeight: "bold" }}>
                    {session.user?.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                backgroundColor: "#24292e",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              <svg 
                style={{ marginRight: "0.5rem", height: "1rem", width: "1rem" }} 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
