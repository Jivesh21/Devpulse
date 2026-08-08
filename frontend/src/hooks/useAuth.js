import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  login,
  googleLogin,
  register,
  logout,
  getCurrentUser,
} from "@/services/auth.service";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      const user = response?.data?.user;

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

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: googleLogin,

    onSuccess: (response) => {
      const user = response?.data?.user;

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

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

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

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });
};