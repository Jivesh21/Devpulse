import api from "@/api/axios";

// ================================
// Get Profile
// ================================
export const getProfile = async (username) => {
  const { data } = await api.get(`/users/${username}`);
  return data;
};

// ================================
// Get User Posts
// ================================
export const getUserPosts = async (username) => {
  const { data } = await api.get(`/posts/user/${username}`);
  return data;
};

// ================================
// Update Profile
// ================================
export const updateProfile = async (profileData) => {
  const { data } = await api.patch(
    "/users/profile",
    profileData
  );

  return data;
};

// ================================
// Update Avatar
// ================================
export const updateAvatar = async (formData) => {
  const { data } = await api.patch(
    "/users/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// ================================
// Update Cover Image
// ================================
export const updateCoverImage = async (
  formData
) => {
  const { data } = await api.patch(
    "/users/cover-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};