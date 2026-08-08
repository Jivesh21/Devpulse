import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import {
  createPost,
  getAllPosts,
  updatePost,
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
// Update Post
// ================================
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
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

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => getAllPosts({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.data?.hasNextPage
        ? lastPage.data.currentPage + 1
        : undefined,
  });
}
