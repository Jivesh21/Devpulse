import api from "@/api/axios";

// ====================================
// Login
// ====================================
export const login = async (credentials) => {
  const { data } = await api.post(
    "/auth/login",
    credentials
  );

  return data;
};

// ====================================
// Google Login
// ====================================
export const googleLogin = async (
  credential
) => {
  const { data } = await api.post(
    "/auth/google",
    {
      credential,
    }
  );

  return data;
};

// ====================================
// Verify Two-Factor Code
// ====================================
export const verifyTwoFactor = async ({
  challengeId,
  code,
}) => {
  const { data } = await api.post(
    "/auth/2fa/verify",
    {
      challengeId,
      code,
    }
  );

  return data;
};

// ====================================
// Register
// ====================================
export const register = async (
  userData
) => {
  const { data } = await api.post(
    "/auth/register",
    userData
  );

  return data;
};

// ====================================
// Logout
// ====================================
export const logout = async () => {
  const { data } = await api.post(
    "/auth/logout"
  );

  return data;
};

// ====================================
// Get Current User
// ====================================
export const getCurrentUser = async () => {
  const { data } = await api.get(
    "/auth/me"
  );

  return data;
};