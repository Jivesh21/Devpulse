import { useQuery } from "@tanstack/react-query";

import { searchDevelopers } from "@/services/user.service";

// ====================================
// Search Developers
// ====================================

export function useSearchDevelopers(query) {
  const trimmedQuery =
    query?.trim() || "";

  return useQuery({
    queryKey: [
      "search-developers",
      trimmedQuery,
    ],

    queryFn: () =>
      searchDevelopers(trimmedQuery),

    enabled:
      trimmedQuery.length >= 2,

    staleTime: 30 * 1000,
  });
}