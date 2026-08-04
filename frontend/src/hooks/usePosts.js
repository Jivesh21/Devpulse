import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPost,
  getAllPosts,
  deletePost,
} from "@/services/post.service";

// ================================
// Create Post
// ================================
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
}

// ================================
// Get Posts
// ================================
export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });
}

// ================================
// Delete Post
// ================================
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
}