import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  login,
  googleLogin,
  verifyTwoFactor,
  register,
  logout,
  getCurrentUser,
} from "@/services/auth.service";

// ====================================
// Login
// ====================================
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      const requiresTwoFactor =
        response?.data?.requiresTwoFactor;

      // Do not authenticate the user yet.
      // JWT cookies are only issued after OTP verification.
      if (requiresTwoFactor) {
        return;
      }

      const user =
        response?.data?.user;

      if (user) {
        queryClient.setQueryData(
          ["current-user"],
          {
            ...response,
            data: user,
          }
        );
      }
    },
  });
};

// ====================================
// Google Login
// ====================================
export const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: googleLogin,

    onSuccess: (response) => {
      const requiresTwoFactor =
        response?.data?.requiresTwoFactor;

      // Do not authenticate the user yet.
      // JWT cookies are only issued after OTP verification.
      if (requiresTwoFactor) {
        return;
      }

      const user =
        response?.data?.user;

      if (user) {
        queryClient.setQueryData(
          ["current-user"],
          {
            ...response,
            data: user,
          }
        );
      }
    },
  });
};

// ====================================
// Verify Two-Factor Code
// ====================================
export const useVerifyTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyTwoFactor,

    onSuccess: (response) => {
      const user =
        response?.data?.user;

      if (user) {
        queryClient.setQueryData(
          ["current-user"],
          {
            ...response,
            data: user,
          }
        );
      }
    },
  });
};

// ====================================
// Register
// ====================================
export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

// ====================================
// Logout
// ====================================
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSettled: () => {
      queryClient.removeQueries({
        queryKey: ["current-user"],
      });
    },
  });
};

// ====================================
// Current User
// ====================================
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });
};