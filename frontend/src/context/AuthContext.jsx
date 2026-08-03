import { createContext, useContext } from "react";
import { useCurrentUser } from "@/hooks/useAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useCurrentUser();

  const value = {
    user: data?.data || null,
    isAuthenticated: !!data?.data,
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