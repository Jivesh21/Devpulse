import api from "@/api/axios";

// ================================
// Suggested Developers
// ================================
export const getSuggestedDevelopers = async () => {
  const { data } = await api.get("/users/suggested");

  return data;
};