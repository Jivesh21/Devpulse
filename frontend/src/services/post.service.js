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
export const getAllPosts = async () => {
  const { data } = await api.get("/posts");

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