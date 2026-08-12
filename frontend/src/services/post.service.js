import api from "@/api/axios";

// ================================
// Create Post
// ================================
export const createPost = async (formData) => {
  const { data } = await api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// ================================
// Get All Posts
// ================================
export const getAllPosts = async ({ page = 1, limit = 10 } = {}) => {
  const { data } = await api.get(`/posts?page=${page}&limit=${limit}`);

  return data;
};
// ================================
// Get Single Post
// ================================
export const getPostById = async (postId) => {
  const { data } = await api.get(
    `/posts/${postId}`
  );

  return data;
};
// ================================
// Update Post
// ================================
export const updatePost = async ({
  postId,
  formData,
}) => {
  const { data } = await api.patch(
    `/posts/${postId}`,
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
// Delete Post
// ================================
export const deletePost = async (postId) => {
  const { data } = await api.delete(`/posts/${postId}`);

  return data;
};
// ================================
// Toggle Like
// ================================

export const toggleLike = async (postId) => {
  const { data } = await api.post(
    `/posts/${postId}/like`
  );

  return data;
};