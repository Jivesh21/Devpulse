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

    onSuccess: (response) => {
      const newComment = response?.data;

      // --------------------------------
      // Immediately add new comment
      // --------------------------------

      if (newComment?._id) {
        queryClient.setQueryData(
          ["comments", postId],
          (oldData) => {
            if (!oldData) {
              return oldData;
            }

            if (
              Array.isArray(
                oldData?.data?.comments
              )
            ) {
              return {
                ...oldData,

                data: {
                  ...oldData.data,

                  comments: [
                    newComment,
                    ...oldData.data.comments,
                  ],

                  totalComments:
                    (oldData.data.totalComments ||
                      0) + 1,
                },
              };
            }

            return oldData;
          }
        );
      }

      // --------------------------------
      // Update comment count immediately
      // --------------------------------

      queryClient.setQueryData(
        ["comment-count", postId],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          const currentCount =
            oldData?.data?.commentCount || 0;

          return {
            ...oldData,

            data: {
              ...oldData.data,

              commentCount:
                currentCount + 1,
            },
          };
        }
      );

      // --------------------------------
      // Background sync
      // --------------------------------

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

    onSuccess: (_response, deletedCommentId) => {
      // --------------------------------
      // Immediately remove comment
      // --------------------------------

      queryClient.setQueryData(
        ["comments", postId],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          if (
            Array.isArray(
              oldData?.data?.comments
            )
          ) {
            const oldComments =
              oldData.data.comments;

            const updatedComments =
              oldComments.filter(
                (comment) =>
                  comment._id !==
                  deletedCommentId
              );

            return {
              ...oldData,

              data: {
                ...oldData.data,

                comments: updatedComments,

                totalComments: Math.max(
                  0,
                  (oldData.data.totalComments ||
                    oldComments.length) - 1
                ),
              },
            };
          }

          return oldData;
        }
      );

      // --------------------------------
      // Immediately update count
      // --------------------------------

      queryClient.setQueryData(
        ["comment-count", postId],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          const currentCount =
            oldData?.data?.commentCount || 0;

          return {
            ...oldData,

            data: {
              ...oldData.data,

              commentCount: Math.max(
                0,
                currentCount - 1
              ),
            },
          };
        }
      );

      // --------------------------------
      // Background sync
      // --------------------------------

      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["comment-count", postId],
      });
    },
  });
}