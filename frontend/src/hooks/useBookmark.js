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

    onSuccess: (_response, postId) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["bookmark-status", postId],
      });
    },
  });
};

// ================================
// Bookmark Status
// ================================
export const useBookmarkStatus = (
  postId
) => {
  return useQuery({
    queryKey: [
      "bookmark-status",
      postId,
    ],
    queryFn: () =>
      getBookmarkStatus(postId),
    enabled: !!postId,
  });
};

// ================================
// Bookmarked Posts
// ================================
export const useBookmarkedPosts =
  () => {
    return useQuery({
      queryKey: ["bookmarks"],
      queryFn: getBookmarkedPosts,
    });
  };
