import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import App from "./App.jsx";
import queryClient from "./lib/queryClient.js";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./components/providers/theme-provider.jsx";
import { ThemeContextProvider } from "./context/ThemeContext.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ThemeContextProvider>
          <AuthProvider>
            <App />

            <Toaster
              position="top-right"
              richColors
              expand
              closeButton
              duration={3500}
              visibleToasts={4}
            />
          </AuthProvider>
        </ThemeContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);