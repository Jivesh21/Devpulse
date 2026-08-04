import { useQuery } from "@tanstack/react-query";

import { getSuggestedDevelopers } from "@/services/user.service";

// ================================
// Suggested Developers
// ================================
export function useSuggestedDevelopers() {
  return useQuery({
    queryKey: ["suggested-developers"],
    queryFn: getSuggestedDevelopers,
  });
}