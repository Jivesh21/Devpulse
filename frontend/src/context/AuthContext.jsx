import {
  createContext,
  useContext,
  useEffect,
} from "react";

import { useCurrentUser } from "@/hooks/useAuth";

import {
  connectSocket,
  disconnectSocket,
} from "@/socket/socket";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useCurrentUser();

  const user = data?.data || null;

  const isAuthenticated = !!user;

  // ====================================
  // Socket Connection
  // ====================================
useEffect(() => {
  console.log("🔐 Auth state:", {
    isLoading,
    isAuthenticated,
    user,
  });

  if (isLoading) {
    return;
  }

  if (isAuthenticated) {
    console.log("🔌 Authenticated → connecting Socket.IO");
    connectSocket();
  } else {
    console.log("🚫 Not authenticated → disconnecting Socket.IO");
    disconnectSocket();
  }

  return () => {
    disconnectSocket();
  };
}, [isAuthenticated, isLoading]);

  // ====================================
  // Auth Context
  // ====================================

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isError,
    refetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}