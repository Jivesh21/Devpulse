import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  connectGithub,
  getConnectedGithub,
  disconnectGithub,
} from "@/services/github.service";

// ====================================
// Connect GitHub
// ====================================

export const useConnectGithub = () => {
  return useMutation({
    mutationFn: connectGithub,
  });
};

// ====================================
// Connected GitHub
// ====================================

export const useConnectedGithub = () => {
  return useQuery({
    queryKey: ["github-connected"],
    queryFn: getConnectedGithub,
    retry: false,
  });
};

// ====================================
// Disconnect GitHub
// ====================================

export const useDisconnectGithub = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: disconnectGithub,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["github-connected"],
      });
    },
  });
};