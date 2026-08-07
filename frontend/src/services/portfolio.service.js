import api from "@/api/axios";

// ====================================
// Get Logged In User Portfolio
// ====================================
export const getMyPortfolio = async () => {
  const { data } = await api.get("/portfolio");
  return data;
};

// ====================================
// Get Public Portfolio
// ====================================
export const getUserPortfolio = async (userId) => {
  const { data } = await api.get(`/portfolio/user/${userId}`);
  return data;
};

// ====================================
// Create Portfolio Project
// ====================================
export const createPortfolio = async (projectData) => {
  const { data } = await api.post(
    "/portfolio",
    projectData
  );

  return data;
};

// ====================================
// Update Portfolio Project
// ====================================
export const updatePortfolio = async ({
  portfolioId,
  projectData,
}) => {
  const { data } = await api.patch(
    `/portfolio/${portfolioId}`,
    projectData
  );

  return data;
};

// ====================================
// Delete Portfolio Project
// ====================================
export const deletePortfolio = async (
  portfolioId
) => {
  const { data } = await api.delete(
    `/portfolio/${portfolioId}`
  );

  return data;
};