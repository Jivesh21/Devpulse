import api from "@/api/axios";

export const toggleLike = async (postId) => {
  const { data } = await api.post(`/likes/${postId}`);
  return data;
};

export const getLikeStatus = async (postId) => {
  const { data } = await api.get(`/likes/${postId}/status`);
  return data;
};

export const getLikeCount = async (postId) => {
  const { data } = await api.get(`/likes/${postId}/count`);
  return data;
};