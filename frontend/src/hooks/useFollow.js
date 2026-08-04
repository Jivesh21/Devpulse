import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  toggleFollow,
  getFollowStatus,
  getFollowersCount,
  getFollowingCount,
} from "@/services/follow.service";

// ================================
// Follow Status
// ================================
export function useFollowStatus(userId) {
  return useQuery({
    queryKey: ["follow-status", userId],
    queryFn: () => getFollowStatus(userId),
    enabled: !!userId,
  });
}

// ================================
// Followers Count
// ================================
export function useFollowersCount(userId) {
  return useQuery({
    queryKey: ["followers-count", userId],
    queryFn: () => getFollowersCount(userId),
    enabled: !!userId,
  });
}

// ================================
// Following Count
// ================================
export function useFollowingCount(userId) {
  return useQuery({
    queryKey: ["following-count", userId],
    queryFn: () => getFollowingCount(userId),
    enabled: !!userId,
  });
}

// ================================
// Toggle Follow
// ================================
export function useToggleFollow(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleFollow(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["follow-status", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["followers-count", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["following-count", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });
    },
  });
}