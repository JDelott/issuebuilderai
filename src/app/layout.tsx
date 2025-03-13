import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IssueBuilderAI",
  description: "Convert code comments to GitHub issues with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ height: "100%", width: "100%" }}>
      <body style={{ 
        height: "100%", 
        width: "100%", 
        margin: 0, 
        padding: 0,
        display: "flex",
        flexDirection: "column"
      }} className={inter.className}>
        <AuthProvider>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            minHeight: "100vh", 
            width: "100%" 
          }}>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
