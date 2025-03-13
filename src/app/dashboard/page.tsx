"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/toaster";

import { SVGProps } from "react";

// Define a type for the icon components
type IconProps = SVGProps<SVGSVGElement>;
type IconComponent = (props: IconProps) => React.JSX.Element;

// Define a type for activity items
type ActivityItem = {
  id: number;
  type: string;
  title: string;
  repo?: string;
  date: string;
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalIssues: 0,
    repositories: 0,
    templates: 0,
  });
  const [recentActivity] = useState<ActivityItem[]>([
    { id: 1, type: 'issue', title: 'Fix navigation bug in header', repo: 'main-app', date: '2 hours ago' },
    { id: 2, type: 'issue', title: 'Update documentation for API endpoints', repo: 'api-service', date: '5 hours ago' },
    { id: 3, type: 'template', title: 'Bug report template updated', date: 'Yesterday' },
    { id: 4, type: 'issue', title: 'Implement dark mode toggle', repo: 'ui-components', date: '2 days ago' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        totalIssues: 24,
        repositories: 5,
        templates: 3,
      });
      setIsLoading(false);
      toast.success("Dashboard data loaded successfully");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "1.5rem" 
      }}>
        <h1 style={{ 
          fontSize: "1.875rem", 
          fontWeight: "bold",
          color: "#111827",
          margin: 0
        }}>
          Dashboard
        </h1>
        <button
          onClick={() => toast.info("Create new issue clicked")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.5rem 1rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          <svg 
            style={{ marginRight: "0.5rem", height: "1rem", width: "1rem" }} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Issue
        </button>
      </div>
      
      {isLoading ? (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          padding: "3rem 0" 
        }}>
          <div style={{ 
            border: "4px solid #e5e7eb", 
            borderTopColor: "#3b82f6", 
            borderRadius: "50%", 
            width: "2rem", 
            height: "2rem", 
            animation: "spin 1s linear infinite" 
          }} />
        </div>
      ) : (
        <>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
            gap: "1.5rem", 
            marginBottom: "2.5rem" 
          }}>
            <StatCard title="Total Issues" value={stats.totalIssues} icon={DocumentIcon} />
            <StatCard title="Repositories" value={stats.repositories} icon={RepoIcon} />
            <StatCard title="Templates" value={stats.templates} icon={TemplateIcon} />
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "2fr 1fr", 
            gap: "1.5rem" 
          }}>
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "0.5rem", 
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
              padding: "1.5rem" 
            }}>
              <h2 style={{ 
                fontSize: "1.25rem", 
                fontWeight: "500", 
                marginBottom: "1rem",
                color: "#111827"
              }}>
                Recent Activity
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {recentActivity.map((item) => (
                  <div 
                    key={item.id}
                    style={{
                      display: "flex",
                      padding: "0.75rem",
                      backgroundColor: "#f9fafb",
                      borderRadius: "0.375rem",
                      alignItems: "center"
                    }}
                  >
                    <div style={{ 
                      width: "2.5rem", 
                      height: "2.5rem", 
                      backgroundColor: "#eff6ff", 
                      borderRadius: "0.375rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      flexShrink: 0
                    }}>
                      {item.type === 'issue' ? (
                        <DocumentIcon style={{ width: "1.25rem", height: "1.25rem", color: "#3b82f6" }} />
                      ) : (
                        <TemplateIcon style={{ width: "1.25rem", height: "1.25rem", color: "#3b82f6" }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontWeight: "500", 
                        color: "#111827", 
                        marginBottom: "0.25rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {item.title}
                      </div>
                      <div style={{ 
                        display: "flex", 
                        fontSize: "0.875rem", 
                        color: "#6b7280" 
                      }}>
                        {item.repo && (
                          <span style={{ marginRight: "0.5rem" }}>
                            {item.repo}
                          </span>
                        )}
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {session && (
                <div style={{ 
                  marginTop: "1.5rem", 
                  textAlign: "center" 
                }}>
                  <p style={{ 
                    color: "#6b7280", 
                    marginBottom: "0.75rem" 
                  }}>
                    Welcome, {session.user?.name}! You can start creating issues from your code comments.
                  </p>
                  <button
                    onClick={() => toast.info("View all activity clicked")}
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
                    View All Activity
                  </button>
                </div>
              )}
            </div>
            
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "0.5rem", 
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
              padding: "1.5rem" 
            }}>
              <h2 style={{ 
                fontSize: "1.25rem", 
                fontWeight: "500", 
                marginBottom: "1rem",
                color: "#111827"
              }}>
                Quick Actions
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <ActionButton 
                  icon={PlusIcon} 
                  text="New Issue" 
                  onClick={() => toast.info("New Issue clicked")} 
                />
                <ActionButton 
                  icon={RepoIcon} 
                  text="Connect Repository" 
                  onClick={() => toast.info("Connect Repository clicked")} 
                />
                <ActionButton 
                  icon={TemplateIcon} 
                  text="Create Template" 
                  onClick={() => toast.info("Create Template clicked")} 
                />
                <ActionButton 
                  icon={SettingsIcon} 
                  text="Settings" 
                  onClick={() => toast.info("Settings clicked")} 
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string; value: number; icon: IconComponent }) {
  return (
    <div style={{ 
      backgroundColor: "white", 
      borderRadius: "0.5rem", 
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
      padding: "1.5rem",
      display: "flex",
      alignItems: "center"
    }}>
      <div style={{ 
        width: "3rem", 
        height: "3rem", 
        backgroundColor: "#eff6ff", 
        borderRadius: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "1rem"
      }}>
        <Icon style={{ width: "1.5rem", height: "1.5rem", color: "#3b82f6" }} />
      </div>
      <div>
        <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.25rem" }}>
          {title}
        </div>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, text, onClick }: { icon: IconComponent; text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.75rem",
        backgroundColor: "#f9fafb",
        border: "none",
        borderRadius: "0.375rem",
        cursor: "pointer",
        width: "100%",
        textAlign: "left"
      }}
    >
      <div style={{ 
        width: "2rem", 
        height: "2rem", 
        backgroundColor: "#eff6ff", 
        borderRadius: "0.375rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "0.75rem"
      }}>
        <Icon style={{ width: "1rem", height: "1rem", color: "#3b82f6" }} />
      </div>
      <span style={{ fontWeight: "500", color: "#111827" }}>{text}</span>
    </button>
  );
}

// Icon components
function DocumentIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function RepoIcon(props: IconProps) {
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

function PlusIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
