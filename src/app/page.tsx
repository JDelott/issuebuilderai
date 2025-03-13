"use client";

import Header from "@/components/Header";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh", 
      width: "100%" 
    }}>
      <Header />
      <main style={{ 
        flex: "1 1 auto", 
        width: "100%", 
        padding: "2rem 1rem",
        backgroundColor: "#f9fafb" 
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          width: "100%" 
        }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h1 style={{ 
              fontSize: "3rem", 
              fontWeight: "800", 
              color: "#111827",
              lineHeight: "1.2"
            }}>
              <span style={{ color: "#2563eb" }}>Issue</span>Builder<span style={{ color: "#2563eb" }}>AI</span>
            </h1>
            <p style={{ 
              marginTop: "1rem", 
              fontSize: "1.25rem", 
              color: "#6b7280" 
            }}>
              Transform code comments into structured GitHub issues
            </p>
            
            {/* Sign in button */}
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              style={{
                marginTop: "1.5rem",
                display: "inline-flex",
                alignItems: "center",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#24292e",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              <svg 
                style={{ marginRight: "0.75rem", height: "1.25rem", width: "1.25rem" }} 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Sign in with GitHub
            </button>
          </div>
          
          {/* Features Section */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "2rem", 
            marginBottom: "3rem" 
          }}>
            {/* Feature cards */}
            <FeatureCard 
              title="AI-Powered Issue Creation" 
              description="Automatically convert code comments into well-structured GitHub issues with AI assistance."
              icon={<AiIcon />}
            />
            <FeatureCard 
              title="GitHub Integration" 
              description="Seamlessly connect with your GitHub repositories to create and manage issues."
              icon={<GitHubIcon />}
            />
            <FeatureCard 
              title="Custom Templates" 
              description="Create and save issue templates for consistent issue formatting across your projects."
              icon={<TemplateIcon />}
            />
          </div>
        </div>
      </main>
      <footer style={{ 
        width: "100%", 
        backgroundColor: "white", 
        padding: "1.5rem 0", 
        borderTop: "1px solid #e5e7eb" 
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          padding: "0 1rem", 
          textAlign: "center" 
        }}>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            Powered by Anthropic Claude AI • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div style={{ 
      backgroundColor: "white", 
      borderRadius: "0.5rem", 
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center"
    }}>
      <div style={{ 
        width: "3rem", 
        height: "3rem", 
        backgroundColor: "#eff6ff", 
        borderRadius: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1rem"
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111827", marginBottom: "0.5rem" }}>
        {title}
      </h3>
      <p style={{ color: "#6b7280" }}>
        {description}
      </p>
    </div>
  );
}

function AiIcon() {
  return (
    <svg width="24" height="24" fill="#3b82f6" viewBox="0 0 24 24">
      <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm-4 8a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm1-5a1 1 0 110 2 1 1 0 010-2zm6 0a1 1 0 110 2 1 1 0 010-2zm-3 8a1 1 0 110 2 1 1 0 010-2z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="24" height="24" fill="#3b82f6" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function TemplateIcon() {
  return (
    <svg width="24" height="24" fill="#3b82f6" viewBox="0 0 24 24">
      <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}
