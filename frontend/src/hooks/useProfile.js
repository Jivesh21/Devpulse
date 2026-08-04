import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProfile,
  searchUsers,
  getUserPosts,
  updateProfile,
  updateAvatar,
  updateCoverImage,
} from "@/services/profile.service";

// ====================================
// Get Profile
// ====================================
export const useProfile = (username) => {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username),
    enabled: !!username,
  });
};

// ====================================
// Search Users
// ====================================
export const useSearchUsers = (query) => {
  return useQuery({
    queryKey: ["search-users", query],
    queryFn: () => searchUsers(query),
    enabled: query.trim().length > 0,
  });
};

// ====================================
// Get User Posts
// ====================================
export const useUserPosts = (username) => {
  return useQuery({
    queryKey: ["user-posts", username],
    queryFn: () => getUserPosts(username),
    enabled: !!username,
  });
};

// ====================================
// Update Profile
// ====================================
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      if (data?.data?.username) {
        queryClient.invalidateQueries({
          queryKey: [
            "profile",
            data.data.username,
          ],
        });
      }
    },
  });
};

// ====================================
// Update Avatar
// ====================================
export const useUpdateAvatar = (
  username
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvatar,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      if (username) {
        queryClient.invalidateQueries({
          queryKey: [
            "profile",
            username,
          ],
        });
      }
    },
  });
};

// ====================================
// Update Cover Image
// ====================================
export const useUpdateCoverImage = (
  username
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCoverImage,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      if (username) {
        queryClient.invalidateQueries({
          queryKey: [
            "profile",
            username,
          ],
        });
      }
    },
  });
};