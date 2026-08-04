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
  getFollowers,
  getFollowing,
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
// ================================
// Followers List
// ================================
export function useFollowers(
  userId,
  page = 1
) {
  return useQuery({
    queryKey: ["followers", userId, page],
    queryFn: () =>
      getFollowers(userId, page),
    enabled: !!userId,
  });
}

// ================================
// Following List
// ================================
export function useFollowing(
  userId,
  page = 1
) {
  return useQuery({
    queryKey: ["following", userId, page],
    queryFn: () =>
      getFollowing(userId, page),
    enabled: !!userId,
  });
}