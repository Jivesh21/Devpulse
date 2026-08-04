import api from "@/api/axios";

// ================================
// Trending Hashtags
// ================================
export const getTrendingHashtags = async () => {
  const { data } = await api.get(
    "/analytics/trending-hashtags"
  );

  return data;
};

// ================================
// Community Analytics
// ================================
export const getCommunityAnalytics =
  async () => {
    const { data } = await api.get(
      "/analytics/community"
    );

    return data;
  };