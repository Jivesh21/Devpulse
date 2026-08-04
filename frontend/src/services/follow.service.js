import api from "@/api/axios";

// Toggle Follow
export const toggleFollow = async (userId) => {
  const { data } = await api.post(`/follows/${userId}`);
  return data;
};

// Follow Status
export const getFollowStatus = async (userId) => {
  const { data } = await api.get(`/follows/${userId}/status`);
  return data;
};

// Followers Count
export const getFollowersCount = async (userId) => {
  const { data } = await api.get(
    `/follows/${userId}/followers/count`
  );

  return data;
};

// Following Count
export const getFollowingCount = async (userId) => {
  const { data } = await api.get(
    `/follows/${userId}/following/count`
  );

  return data;
};