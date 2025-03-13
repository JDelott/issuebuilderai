"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/toaster";
import { Octokit } from "octokit";
import { useRouter } from "next/navigation";

// Define proper types for SVG props
type SVGProps = React.SVGProps<SVGSVGElement>;

// Icons
const DocumentIcon = (props: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V7.875L14.25 1.5H5.625zM7 9.5h10v1H7v-1zm0 3h10v1H7v-1zm0 3h10v1H7v-1z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = (props: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

interface ActivityItem {
  id: string;
  type: 'issue';
  title: string;
  repo?: string;
  date: string;
  url?: string;
}

// Define GitHub API response types
interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  repository_url: string;
}

// Define local storage issue type
interface LocalIssue {
  id: string;
  number: number;
  title: string;
  url: string;
  repo: string;
  created_at: string;
}

// Define session with access token
interface SessionWithToken {
  accessToken?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchIssueData() {
      if (!session) return;
      
      try {
        // Get access token from session
        const token = (session as SessionWithToken).accessToken;
        
        if (!token) {
          toast.error("GitHub access token not found");
          setIsLoading(false);
          return;
        }
        
        const octokit = new Octokit({ auth: token });
        
        // Fetch issues from GitHub
        const issuesResponse = await octokit.request('GET /issues', {
          filter: 'all',
          state: 'all',
          per_page: 100,
          sort: 'updated',
        });
        
        const githubIssues = issuesResponse.data as GitHubIssue[];
        
        // Get locally created issues from localStorage
        const createdIssuesString = localStorage.getItem('createdIssues');
        const createdIssues: LocalIssue[] = createdIssuesString 
          ? JSON.parse(createdIssuesString) 
          : [];
        
        // Convert local issues to activity items
        const localActivityItems: ActivityItem[] = createdIssues.map(issue => ({
          id: `local-${issue.id || issue.number}`,
          type: 'issue',
          title: issue.title,
          repo: issue.repo,
          date: formatDate(new Date(issue.created_at)),
          url: issue.url
        }));
        
        // Convert GitHub issues to activity items
        const githubActivityItems: ActivityItem[] = githubIssues.map(issue => {
          // Extract repo name from repository_url
          const repoMatch = issue.repository_url.match(/repos\/([^\/]+)\/([^\/]+)/);
          const repoName = repoMatch ? `${repoMatch[1]}/${repoMatch[2]}` : 'Unknown';
          
          return {
            id: `github-${issue.id}`,
            type: 'issue',
            title: issue.title,
            repo: repoName,
            date: formatDate(new Date(issue.created_at)),
            url: issue.html_url
          };
        });
        
        // Combine and sort activity items by date, limit to 6 items
        const combinedActivity = [...localActivityItems, ...githubActivityItems]
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 6); // Limit to 6 items
        
        setRecentActivity(combinedActivity);
        setIsLoading(false);
      } catch (error: unknown) {
        console.error("Error fetching GitHub data:", error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Unknown error occurred';
        toast.error(`Failed to load dashboard data: ${errorMessage}`);
        setIsLoading(false);
      }
    }
    
    fetchIssueData();
  }, [session]);
  
  // Format date to relative time (e.g., "2 hours ago")
  function formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return "Just now";
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  const navigateToCreateIssue = () => {
    router.push('/dashboard/create-issue');
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2rem"
      }}>
        <div>
          <h1 style={{ 
            fontSize: "1.875rem", 
            fontWeight: "bold",
            color: "#111827",
            marginBottom: "0.5rem"
          }}>
            Dashboard
          </h1>
          
          <p style={{ color: "#6b7280" }}>
            Overview of your GitHub issues and activity
          </p>
        </div>
        
        <button
          onClick={navigateToCreateIssue}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          <PlusIcon style={{ width: "1.25rem", height: "1.25rem", marginRight: "0.5rem" }} />
          New Issue
        </button>
      </div>
      
      {isLoading ? (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "200px" 
        }}>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
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
              {recentActivity.length > 0 ? (
                recentActivity.map((item) => (
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
                      <DocumentIcon style={{ width: "1.25rem", height: "1.25rem", color: "#3b82f6" }} />
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "baseline",
                        marginBottom: "0.25rem"
                      }}>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            fontWeight: "500",
                            color: "#111827",
                            textDecoration: "none",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {item.title}
                        </a>
                        <span style={{ 
                          fontSize: "0.75rem", 
                          color: "#6b7280",
                          marginLeft: "1rem",
                          flexShrink: 0
                        }}>
                          {item.date}
                        </span>
                      </div>
                      
                      {item.repo && (
                        <p style={{ 
                          fontSize: "0.875rem", 
                          color: "#6b7280",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {item.repo}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ 
                  padding: "2rem", 
                  textAlign: "center", 
                  color: "#6b7280",
                  backgroundColor: "#f9fafb",
                  borderRadius: "0.375rem"
                }}>
                  No recent activity found. Create your first issue!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
