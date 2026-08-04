import api from "@/api/axios";

export const getProfile = async (username) => {
  const { data } = await api.get(`/users/${username}`);
  return data;
};

export const getUserPosts = async (username) => {
  const { data } = await api.get(`/posts/user/${username}`);
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.patch("/users/profile", profileData);
  return data;
};

export const updateAvatar = async (formData) => {
  const { data } = await api.patch("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateCoverImage = async (formData) => {
  const { data } = await api.patch("/users/cover-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
