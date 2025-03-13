"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/toaster";

interface ProcessedResult {
  success: boolean;
  issue: {
    number: number;
    url: string;
    title: string;
    body: string;
  };
}

export default function IssueForm() {
  const { data: session } = useSession();
  const [commentText, setCommentText] = useState("");
  const [repoInput, setRepoInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState("");

  // Parse repository input to extract owner and name
  const parseRepoInput = (input: string): { owner: string; name: string } | null => {
    // Handle GitHub URL format (https://github.com/owner/repo)
    const urlMatch = input.match(/github\.com\/([^\/]+)\/([^\/\.]+)/i);
    if (urlMatch) {
      return { owner: urlMatch[1], name: urlMatch[2] };
    }
    
    // Handle owner/repo format
    const simpleMatch = input.match(/^([^\/]+)\/([^\/\.]+)$/);
    if (simpleMatch) {
      return { owner: simpleMatch[1], name: simpleMatch[2] };
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    // Parse the repository input
    const repoInfo = parseRepoInput(repoInput);
    if (!repoInfo) {
      setError("Invalid repository format. Please use 'owner/repo' or GitHub URL format.");
      setIsLoading(false);
      toast.error("Invalid repository format");
      return;
    }

    try {
      const response = await fetch("/api/process-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentText,
          repoOwner: repoInfo.owner,
          repoName: repoInfo.name,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to process issue");
      }
      
      setResult(data);
      toast.success("Issue created successfully!");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("An error occurred");
        toast.error("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: "white", 
      borderRadius: "0.5rem", 
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
      padding: "1.5rem",
      maxWidth: "800px",
      margin: "0 auto"
    }}>
      <h2 style={{ 
        fontSize: "1.5rem", 
        fontWeight: "600", 
        marginBottom: "1.5rem",
        color: "#111827"
      }}>
        Create GitHub Issue from Code Comment
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1.5rem" }}>
          <label 
            htmlFor="repoInput" 
            style={{ 
              display: "block", 
              marginBottom: "0.5rem", 
              fontWeight: "500",
              color: "#374151"
            }}
          >
            GitHub Repository
          </label>
          <input
            id="repoInput"
            type="text"
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid #d1d5db",
              fontSize: "1rem"
            }}
            placeholder="owner/repo or https://github.com/owner/repo"
          />
          <p style={{ 
            marginTop: "0.5rem", 
            fontSize: "0.875rem", 
            color: "#6b7280" 
          }}>
            Example: octocat/hello-world or https://github.com/octocat/hello-world
          </p>
        </div>
        
        <div style={{ marginBottom: "1.5rem" }}>
          <label 
            htmlFor="commentText" 
            style={{ 
              display: "block", 
              marginBottom: "0.5rem", 
              fontWeight: "500",
              color: "#374151"
            }}
          >
            Code Comment
          </label>
          <textarea
            id="commentText"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              minHeight: "200px",
              fontFamily: "monospace"
            }}
            placeholder="Paste your code comment here..."
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !session}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.75rem 1.5rem",
            backgroundColor: isLoading || !session ? "#9ca3af" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            fontWeight: "500",
            cursor: isLoading || !session ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? (
            <>
              <div style={{ 
                border: "2px solid #e5e7eb", 
                borderTopColor: "white", 
                borderRadius: "50%", 
                width: "1rem", 
                height: "1rem", 
                animation: "spin 1s linear infinite",
                marginRight: "0.5rem"
              }} />
              Processing...
            </>
          ) : (
            "Generate and Create Issue"
          )}
        </button>
        
        {!session && (
          <p style={{ 
            marginTop: "0.75rem", 
            color: "#ef4444", 
            fontSize: "0.875rem" 
          }}>
            You must be signed in to create issues
          </p>
        )}
      </form>
      
      {error && (
        <div style={{ 
          marginTop: "1.5rem", 
          padding: "1rem", 
          backgroundColor: "#fee2e2", 
          color: "#b91c1c", 
          borderRadius: "0.375rem" 
        }}>
          {error}
        </div>
      )}
      
      {result && (
        <div style={{ 
          marginTop: "1.5rem", 
          padding: "1.5rem", 
          backgroundColor: "#f0fdf4", 
          borderRadius: "0.375rem",
          border: "1px solid #dcfce7"
        }}>
          <h3 style={{ 
            fontSize: "1.25rem", 
            fontWeight: "600", 
            color: "#15803d",
            marginBottom: "1rem"
          }}>
            Issue Created Successfully!
          </h3>
          
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ 
              fontWeight: "500", 
              marginBottom: "0.25rem",
              color: "#374151"
            }}>
              Issue #{result.issue.number}: {result.issue.title}
            </p>
            <a 
              href={result.issue.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: "#2563eb",
                textDecoration: "underline"
              }}
            >
              View on GitHub
            </a>
          </div>
          
          <div>
            <p style={{ 
              fontWeight: "500", 
              marginBottom: "0.5rem",
              color: "#374151"
            }}>
              Issue Body:
            </p>
            <div style={{ 
              padding: "1rem", 
              backgroundColor: "white", 
              borderRadius: "0.375rem",
              border: "1px solid #e5e7eb",
              maxHeight: "200px",
              overflowY: "auto",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontSize: "0.875rem",
              whiteSpace: "pre-wrap"
            }}>
              {result.issue.body}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
