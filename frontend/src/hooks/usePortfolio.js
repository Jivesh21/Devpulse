import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getMyPortfolio,
  getUserPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "@/services/portfolio.service";

// ====================================
// Logged In User Portfolio
// ====================================
export const useMyPortfolio = () => {
  return useQuery({
    queryKey: ["my-portfolio"],
    queryFn: getMyPortfolio,
  });
};

// ====================================
// Public Portfolio
// ====================================
export const useUserPortfolio = (userId) => {
  return useQuery({
    queryKey: ["portfolio", userId],
    queryFn: () => getUserPortfolio(userId),
    enabled: !!userId,
  });
};

// ====================================
// Create Portfolio
// ====================================
export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPortfolio,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-portfolio"],
      });

      queryClient.invalidateQueries({
        queryKey: ["portfolio"],
      });
    },
  });
};

// ====================================
// Update Portfolio
// ====================================
export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePortfolio,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-portfolio"],
      });

      queryClient.invalidateQueries({
        queryKey: ["portfolio"],
      });
    },
  });
};

// ====================================
// Delete Portfolio
// ====================================
export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePortfolio,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-portfolio"],
      });

      queryClient.invalidateQueries({
        queryKey: ["portfolio"],
      });
    },
  });
};