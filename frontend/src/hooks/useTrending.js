import { useQuery } from "@tanstack/react-query";

import {
  getTrendingHashtags,
  getCommunityAnalytics,
} from "@/services/analytics.service";

// ================================
// Trending Hashtags
// ================================
export function useTrending() {
  return useQuery({
    queryKey: ["trending"],
    queryFn: getTrendingHashtags,
  });
}

// ================================
// Community Analytics
// ================================
export function useCommunityAnalytics() {
  return useQuery({
    queryKey: ["community-analytics"],
    queryFn: getCommunityAnalytics,
  });
}