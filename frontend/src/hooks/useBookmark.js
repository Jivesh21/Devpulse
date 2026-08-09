import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  toggleBookmark,
  getBookmarkStatus,
  getBookmarkedPosts,
} from "@/services/bookmark.service";

// ================================
// Toggle Bookmark
// ================================
export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleBookmark,

    onSuccess: (response, postId) => {
      // ====================================
      // Get new bookmark state from response
      // ====================================

      const isBookmarked =
        response?.data?.isBookmarked ??
        response?.data?.bookmarked;

      // ====================================
      // Immediately update bookmark status
      // ====================================

      if (typeof isBookmarked === "boolean") {
        queryClient.setQueryData(
          ["bookmark-status", postId],
          (oldData) => {
            if (!oldData) {
              return {
                statusCode: 200,
                success: true,
                data: {
                  isBookmarked,
                },
              };
            }

            return {
              ...oldData,
              data: {
                ...oldData.data,
                isBookmarked,
              },
            };
          }
        );
      }

      // ====================================
      // Refresh bookmarked posts
      // ====================================

      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });

      // ====================================
      // Refresh feed
      // ====================================

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      // ====================================
      // Confirm status from backend
      // ====================================

      queryClient.invalidateQueries({
        queryKey: ["bookmark-status", postId],
      });
    },
  });
};

// ================================
// Bookmark Status
// ================================
export const useBookmarkStatus = (postId) => {
  return useQuery({
    queryKey: ["bookmark-status", postId],
    queryFn: () => getBookmarkStatus(postId),
    enabled: !!postId,
  });
};

// ================================
// Bookmarked Posts
// ================================
export const useBookmarkedPosts = () => {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: getBookmarkedPosts,
  });
};