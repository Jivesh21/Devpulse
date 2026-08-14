import api from "@/api/axios";

// ====================================
// Start GitHub OAuth
// ====================================

export const connectGithub =
  async () => {
    const { data } =
      await api.get(
        "/github/connect"
      );

    return data;
  };

// ====================================
// Get Connected GitHub Account
// ====================================

export const getConnectedGithub =
  async () => {
    const { data } =
      await api.get(
        "/github/me"
      );

    return data;
  };

// ====================================
// Get Public GitHub Profile
// ====================================

export const getPublicGithubProfile =
  async (username) => {
    const { data } =
      await api.get(
        `/github/${username}`
      );

    return data;
  };

// ====================================
// Get GitHub Contributions
// ====================================

export const getGithubContributions =
  async (username) => {
    const { data } =
      await api.get(
        `/github/${username}/contributions`
      );

    return data;
  };

// ====================================
// Disconnect GitHub
// ====================================

export const disconnectGithub =
  async () => {
    const { data } =
      await api.post(
        "/github/disconnect"
      );

    return data;
  };