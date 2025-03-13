"use client";

import IssueForm from "@/components/IssueForm";

export default function CreateIssuePage() {
  return (
    <div>
      <h1 style={{ 
        fontSize: "1.875rem", 
        fontWeight: "bold",
        color: "#111827",
        marginBottom: "1.5rem"
      }}>
        Create Issue
      </h1>
      
      <p style={{ 
        color: "#6b7280", 
        marginBottom: "2rem" 
      }}>
        Transform code comments into structured GitHub issues with AI assistance.
      </p>
      
      <IssueForm />
    </div>
  );
}
