import IssueForm from "@/components/IssueForm";
import Header from "@/components/Header";

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
          </div>
          
          {/* Features Section */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "2rem", 
            marginBottom: "3rem" 
          }}>
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "0.5rem", 
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
              padding: "1.5rem" 
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "3rem", 
                width: "3rem", 
                borderRadius: "0.375rem", 
                backgroundColor: "#3b82f6", 
                color: "white", 
                marginBottom: "1rem" 
              }}>
                <svg style={{ height: "1.5rem", width: "1.5rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "500", color: "#111827", marginBottom: "0.5rem" }}>
                AI-Powered Analysis
              </h3>
              <p style={{ fontSize: "1rem", color: "#6b7280" }}>
                Leverages Anthropic&apos;s Claude AI to intelligently parse and structure your code comments.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "0.5rem", 
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
              padding: "1.5rem" 
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "3rem", 
                width: "3rem", 
                borderRadius: "0.375rem", 
                backgroundColor: "#3b82f6", 
                color: "white", 
                marginBottom: "1rem" 
              }}>
                <svg style={{ height: "1.5rem", width: "1.5rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "500", color: "#111827", marginBottom: "0.5rem" }}>
                Automatic Formatting
              </h3>
              <p style={{ fontSize: "1rem", color: "#6b7280" }}>
                Creates well-structured issues with proper titles, descriptions, and suggested labels.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "0.5rem", 
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
              padding: "1.5rem" 
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "3rem", 
                width: "3rem", 
                borderRadius: "0.375rem", 
                backgroundColor: "#3b82f6", 
                color: "white", 
                marginBottom: "1rem" 
              }}>
                <svg style={{ height: "1.5rem", width: "1.5rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "500", color: "#111827", marginBottom: "0.5rem" }}>
                GitHub Integration
              </h3>
              <p style={{ fontSize: "1rem", color: "#6b7280" }}>
                Seamlessly create issues directly in your GitHub repositories with a single click.
              </p>
            </div>
          </div>
          
          <IssueForm />
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
