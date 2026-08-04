import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  toggleLike,
  getLikeCount,
  getLikeStatus,
} from "@/services/like.service";

export function useToggleLike(postId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleLike(postId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["like-count", postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["like-status", postId],
      });
    },
  });
}

export function useLikeCount(postId) {
  return useQuery({
    queryKey: ["like-count", postId],
    queryFn: () => getLikeCount(postId),
  });
}

export function useLikeStatus(postId) {
  return useQuery({
    queryKey: ["like-status", postId],
    queryFn: () => getLikeStatus(postId),
  });
}