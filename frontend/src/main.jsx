import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import App from "./App.jsx";
import queryClient from "./lib/queryClient.js";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />

        <Toaster
          position="top-right"
          theme="dark"
          richColors
          expand
          closeButton
          duration={3500}
          visibleToasts={4}
          toastOptions={{
            className: "devpulse-toast",
            style: {
              background: "#09090B",
              color: "#FFFFFF",
              border: "1px solid rgba(124, 58, 237, 0.45)",
              borderRadius: "18px",
              padding: "16px",
              boxShadow:
                "0 15px 40px rgba(124, 58, 237, 0.35)",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);