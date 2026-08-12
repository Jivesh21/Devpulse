import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import {
  createPost,
  getAllPosts,
  getPostById,
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
// Get Single Post
// ================================
export function usePost(postId) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
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

      if (!updatedPost?._id) {
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });

        queryClient.invalidateQueries({
          queryKey: ["user-posts"],
        });

        return;
      }

      // ====================================
      // Update Feed Cache
      // ====================================

      queryClient.setQueryData(
        ["posts"],
        (oldData) => {
          if (!oldData) return oldData;

          if (
            Array.isArray(oldData?.data?.posts)
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

          if (Array.isArray(oldData?.data)) {
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

      // ====================================
      // Update Profile Post Caches
      // ====================================

      queryClient.setQueriesData(
        {
          queryKey: ["user-posts"],
        },
        (oldData) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData?.data)) {
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

          if (
            Array.isArray(oldData?.data?.posts)
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

          return oldData;
        }
      );

      // Background synchronization
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-posts"],
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

    onSuccess: (_response, deletedPostId) => {
      // ====================================
      // Remove From Feed
      // ====================================

      queryClient.setQueryData(
        ["posts"],
        (oldData) => {
          if (!oldData) return oldData;

          if (
            Array.isArray(oldData?.data?.posts)
          ) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                posts: oldData.data.posts.filter(
                  (post) =>
                    post._id !== deletedPostId
                ),
              },
            };
          }

          if (Array.isArray(oldData?.data)) {
            return {
              ...oldData,
              data: oldData.data.filter(
                (post) =>
                  post._id !== deletedPostId
              ),
            };
          }

          return oldData;
        }
      );

      // ====================================
      // Remove From Profile Caches
      // ====================================

      queryClient.setQueriesData(
        {
          queryKey: ["user-posts"],
        },
        (oldData) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData?.data)) {
            return {
              ...oldData,
              data: oldData.data.filter(
                (post) =>
                  post._id !== deletedPostId
              ),
            };
          }

          if (
            Array.isArray(oldData?.data?.posts)
          ) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                posts: oldData.data.posts.filter(
                  (post) =>
                    post._id !== deletedPostId
                ),
              },
            };
          }

          return oldData;
        }
      );

      // Background synchronization
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-posts"],
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

      queryClient.invalidateQueries({
        queryKey: ["user-posts"],
      });
    },
  });
}