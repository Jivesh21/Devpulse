import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  getUserPosts,
  updateProfile,
  updateAvatar,
  updateCoverImage,
} from "@/services/profile.service";

export const useProfile = (username) => {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username),
    enabled: !!username,
  });
};

export const useUserPosts = (username) => {
  return useQuery({
    queryKey: ["user-posts", username],
    queryFn: () => getUserPosts(username),
    enabled: !!username,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      if (data?.data?.username) {
        queryClient.invalidateQueries({ queryKey: ["profile", data.data.username] });
      }
    },
  });
};

export const useUpdateAvatar = (username) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      if (username) {
        queryClient.invalidateQueries({ queryKey: ["profile", username] });
      }
    },
  });
};

export const useUpdateCoverImage = (username) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCoverImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      if (username) {
        queryClient.invalidateQueries({ queryKey: ["profile", username] });
      }
    },
  });
};
