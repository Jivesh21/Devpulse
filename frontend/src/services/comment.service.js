import api from "@/api/axios";

// Create Comment
export const createComment = async ({ postId, content }) => {
  const { data } = await api.post(`/comments/${postId}`, {
    content,
  });

  return data;
};

// Get Comments
export const getComments = async (postId) => {
  const { data } = await api.get(`/comments/${postId}`);

  return data;
};

// Get Comment Count
export const getCommentCount = async (postId) => {
  const { data } = await api.get(`/comments/${postId}/count`);

  return data;
};

// Delete Comment
export const deleteComment = async (commentId) => {
  const { data } = await api.delete(`/comments/${commentId}`);

  return data;
};