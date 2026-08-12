import api from "@/api/axios";

// ====================================
// Suggested Developers
// ====================================

export const getSuggestedDevelopers = async () => {
  const { data } =
    await api.get("/users/suggested");

  return data;
};

// ====================================
// Search Developers
// ====================================

export const searchDevelopers = async (
  query
) => {
  const { data } = await api.get(
    "/users/search",
    {
      params: {
        q: query,
      },
    }
  );

  return data;
};