"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  
  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100%", 
        padding: "2rem" 
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            border: "4px solid #e5e7eb", 
            borderTopColor: "#3b82f6", 
            borderRadius: "50%", 
            width: "2rem", 
            height: "2rem", 
            animation: "spin 1s linear infinite", 
            margin: "0 auto 1rem auto" 
          }} />
          <p style={{ color: "#6b7280" }}>Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to home if not authenticated
  if (!session) {
    redirect("/");
  }
  
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      height: "100vh",
      width: "100%"
    }}>
      <Header />
      <div style={{ 
        display: "flex", 
        flex: 1,
        height: "calc(100vh - 4rem)",
        overflow: "hidden"
      }}>
        <Sidebar />
        <div style={{ 
          flex: 1, 
          padding: "1.5rem", 
          overflowY: "auto" 
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
