import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createComment,
  getComments,
  getCommentCount,
  deleteComment,
} from "@/services/comment.service";

// ================================
// Get Comments
// ================================
export function useComments(postId) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });
}

// ================================
// Get Comment Count
// ================================
export function useCommentCount(postId) {
  return useQuery({
    queryKey: ["comment-count", postId],
    queryFn: () => getCommentCount(postId),
    enabled: !!postId,
  });
}

// ================================
// Create Comment
// ================================
export function useCreateComment(postId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) =>
      createComment({
        postId,
        content,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["comment-count", postId],
      });
    },
  });
}

// ================================
// Delete Comment
// ================================
export function useDeleteComment(postId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["comment-count", postId],
      });
    },
  });
}