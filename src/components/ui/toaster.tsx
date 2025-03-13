"use client";

import { useState, useEffect } from "react";

type ToastProps = {
  message: string;
  type: "success" | "error" | "info";
  id: string;
};

// Define a custom event type for TypeScript
interface ToastEvent extends CustomEvent {
  detail: ToastProps;
}

// Declare the custom event for TypeScript
declare global {
  interface WindowEventMap {
    'toast': ToastEvent;
  }
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const handleToast = (event: ToastEvent) => {
      const newToast = event.detail;
      setToasts((prev) => [...prev, newToast]);
      
      // Auto-remove toast after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
      }, 5000);
    };

    window.addEventListener("toast", handleToast);
    
    return () => {
      window.removeEventListener("toast", handleToast);
    };
  }, []);

  const getToastStyles = (type: ToastProps["type"]) => {
    switch (type) {
      case "success":
        return { backgroundColor: "#10B981", color: "white" };
      case "error":
        return { backgroundColor: "#EF4444", color: "white" };
      case "info":
      default:
        return { backgroundColor: "#3B82F6", color: "white" };
    }
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "1rem",
      right: "1rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      zIndex: 50,
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "0.375rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            display: "flex",
            alignItems: "center",
            maxWidth: "24rem",
            ...getToastStyles(toast.type),
          }}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            style={{
              marginLeft: "0.75rem",
              backgroundColor: "transparent",
              border: "none",
              color: "currentColor",
              cursor: "pointer",
              padding: "0.25rem",
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// Helper function to show toasts from anywhere in the app
export const toast = {
  success: (message: string) => {
    const event = new CustomEvent("toast", {
      detail: {
        message,
        type: "success",
        id: Date.now().toString(),
      },
    });
    window.dispatchEvent(event);
  },
  error: (message: string) => {
    const event = new CustomEvent("toast", {
      detail: {
        message,
        type: "error",
        id: Date.now().toString(),
      },
    });
    window.dispatchEvent(event);
  },
  info: (message: string) => {
    const event = new CustomEvent("toast", {
      detail: {
        message,
        type: "info",
        id: Date.now().toString(),
      },
    });
    window.dispatchEvent(event);
  },
};
