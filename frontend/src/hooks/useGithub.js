import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  connectGithub,
  getConnectedGithub,
  getPublicGithubProfile,
  getGithubContributions,
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
    queryKey: [
      "github-connected",
    ],
    queryFn:
      getConnectedGithub,
    retry: false,
  });
};

// ====================================
// Public GitHub Profile
// ====================================

export const usePublicGithubProfile = (
  username
) => {
  return useQuery({
    queryKey: [
      "github-public-profile",
      username,
    ],
    queryFn: () =>
      getPublicGithubProfile(
        username
      ),
    enabled: !!username,
    retry: false,
  });
};

// ====================================
// GitHub Contributions
// ====================================

export const useGithubContributions = (
  username
) => {
  return useQuery({
    queryKey: [
      "github-contributions",
      username,
    ],
    queryFn: () =>
      getGithubContributions(
        username
      ),
    enabled: !!username,
    retry: false,
  });
};

// ====================================
// Disconnect GitHub
// ====================================

export const useDisconnectGithub =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        disconnectGithub,

      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: [
            "github-connected",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: ["profile"],
        });
      },
    });
  };