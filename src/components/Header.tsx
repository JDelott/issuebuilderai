"use client";

import { useSession } from "next-auth/react";
import LoginButton from "@/components/LoginButton";
import Link from "next/link";

export default function Header() {
  // Remove unused session variable
  useSession();

  return (
    <header style={{
      width: "100%",
      backgroundColor: "white",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      position: "sticky",
      top: 0,
      zIndex: 10
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "4rem"
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <svg 
              style={{ height: "2rem", width: "2rem", color: "#2563eb" }}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
              <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
              <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span style={{ 
              marginLeft: "0.5rem", 
              fontSize: "1.25rem", 
              fontWeight: "bold", 
              color: "#111827" 
            }}>
              IssueBuilderAI
            </span>
          </Link>
        </div>
        <div>
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
