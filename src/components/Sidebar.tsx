"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { SVGProps } from "react";

// Define a type for the icon components
type IconProps = SVGProps<SVGSVGElement>;

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  if (!session) return null;
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Recent Issues", href: "/issues", icon: DocumentIcon },
    { name: "Repositories", href: "/repositories", icon: FolderIcon },
    { name: "Templates", href: "/templates", icon: TemplateIcon },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  return (
    <div style={{
      width: "250px",
      backgroundColor: "white",
      borderRight: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }}>
      <div style={{ padding: "1.5rem 1rem" }}>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderRadius: "0.375rem",
                textDecoration: "none",
                color: pathname === item.href ? "#2563eb" : "#6b7280",
                backgroundColor: pathname === item.href ? "#eff6ff" : "transparent",
                fontWeight: pathname === item.href ? "500" : "normal",
              }}
            >
              <item.icon style={{ 
                width: "1.25rem", 
                height: "1.25rem", 
                marginRight: "0.75rem" 
              }} />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      <div style={{ 
        marginTop: "auto", 
        padding: "1rem", 
        borderTop: "1px solid #e5e7eb" 
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          padding: "0.5rem" 
        }}>
          <div style={{ 
            width: "2.5rem", 
            height: "2.5rem", 
            borderRadius: "9999px", 
            backgroundColor: "#e5e7eb", 
            overflow: "hidden",
            position: "relative"
          }}>
            {session.user?.image && (
              <Image 
                src={session.user.image} 
                alt={session.user?.name || "User"} 
                fill
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
          <div style={{ marginLeft: "0.75rem" }}>
            <div style={{ fontWeight: "500", color: "#111827" }}>
              {session.user?.name}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {session.user?.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon components
function HomeIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function DocumentIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function FolderIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function TemplateIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

function SettingsIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
