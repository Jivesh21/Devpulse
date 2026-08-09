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
  toggleLike,
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

    onSuccess: (response) => {
      const updatedPost = response?.data;

      // --------------------------------
      // Safety check
      // --------------------------------
      if (!updatedPost?._id) {
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });

        return;
      }

      // --------------------------------
      // Update normal feed cache
      // --------------------------------
      queryClient.setQueryData(
        ["posts"],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          // API response:
          // {
          //   data: {
          //     posts: [...]
          //   }
          // }

          if (
            Array.isArray(
              oldData?.data?.posts
            )
          ) {
            return {
              ...oldData,

              data: {
                ...oldData.data,

                posts: oldData.data.posts.map(
                  (post) =>
                    post._id === updatedPost._id
                      ? updatedPost
                      : post
                ),
              },
            };
          }

          // --------------------------------
          // If API directly returns an array
          // --------------------------------
          if (
            Array.isArray(oldData?.data)
          ) {
            return {
              ...oldData,

              data: oldData.data.map(
                (post) =>
                  post._id === updatedPost._id
                    ? updatedPost
                    : post
              ),
            };
          }

          return oldData;
        }
      );

      // --------------------------------
      // Also invalidate so server remains
      // the source of truth
      // --------------------------------
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

// ================================
// Infinite Posts
// ================================
export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ["posts", "infinite"],

    queryFn: ({ pageParam = 1 }) =>
      getAllPosts({
        page: pageParam,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage?.data?.hasNextPage
        ? lastPage.data.currentPage + 1
        : undefined,
  });
}

// ================================
// Like / Unlike Post
// ================================
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleLike,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
}