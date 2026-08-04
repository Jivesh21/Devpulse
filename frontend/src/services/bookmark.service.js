import api from "@/api/axios";

// ================================
// Toggle Bookmark
// ================================
export const toggleBookmark = async (postId) => {
  const { data } = await api.post(
    `/bookmarks/${postId}`
  );

  return data;
};

// ================================
// Get Bookmark Status
// ================================
export const getBookmarkStatus = async (
  postId
) => {
  const { data } = await api.get(
    `/bookmarks/${postId}/status`
  );

  return data;
};

// ================================
// Get Bookmarked Posts
// ================================
export const getBookmarkedPosts =
  async () => {
    const { data } = await api.get(
      "/bookmarks"
    );

    return data;
  };