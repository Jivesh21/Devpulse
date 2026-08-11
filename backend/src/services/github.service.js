import axios from "axios";

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  timeout: 10000,
  headers: {
    Accept: "application/vnd.github+json",
  },
});

// ====================================
// GitHub OAuth Configuration
// ====================================

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

// ====================================
// Generate GitHub Authorization URL
// ====================================

export const getGithubAuthorizationUrl = (state) => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_CALLBACK_URL,
    scope: "read:user user:email",
    state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

// ====================================
// Exchange OAuth Code For Access Token
// ====================================

export const exchangeGithubCode = async (code) => {
  try {
    const { data } = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_CALLBACK_URL,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!data.access_token) {
      throw new Error(
        data.error_description || "Failed to obtain GitHub access token"
      );
    }

    return data.access_token;
  } catch (error) {
    console.error(
      "GitHub token exchange error:",
      error.response?.data || error.message
    );

    throw new Error("GitHub authentication failed");
  }
};

// ====================================
// Get Authenticated GitHub User
// ====================================

export const getAuthenticatedGithubUser = async (accessToken) => {
  try {
    const { data } = await githubApi.get("/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      id: data.id,
      login: data.login,
      name: data.name,
      email: data.email,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      bio: data.bio,
      company: data.company,
      blog: data.blog,
      location: data.location,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
    };
  } catch (error) {
    console.error(
      "GitHub authenticated user error:",
      error.response?.data || error.message
    );

    throw new Error("Unable to fetch GitHub account");
  }
};

// ====================================
// Get Authenticated GitHub Repositories
// ====================================

export const getAuthenticatedGithubRepositories = async (accessToken) => {
  try {
    const { data } = await githubApi.get("/user/repos", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        sort: "updated",
        per_page: 100,
        affiliation: "owner,collaborator,organization_member",
      },
    });

    return data
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        homepage: repo.homepage,
        private: repo.private,
        updatedAt: repo.updated_at,
      }));
  } catch (error) {
    console.error(
      "GitHub repositories error:",
      error.response?.data || error.message
    );

    throw new Error("Unable to fetch GitHub repositories");
  }
};

// ====================================
// Existing Public GitHub Profile
// ====================================

export const getGithubProfile = async (username) => {
  try {
    const { data } = await githubApi.get(`/users/${username}`);

    return {
      id: data.id,
      login: data.login,
      name: data.name,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      bio: data.bio,
      company: data.company,
      blog: data.blog,
      location: data.location,
      twitter_username: data.twitter_username,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      created_at: data.created_at,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("GitHub user not found");
    }

    throw new Error("Unable to fetch GitHub profile");
  }
};

// ====================================
// Existing Public Repositories
// ====================================

export const getGithubRepositories = async (username) => {
  try {
    const { data } = await githubApi.get(`/users/${username}/repos`, {
      params: {
        sort: "updated",
        per_page: 100,
      },
    });

    return data
      .filter((repo) => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        homepage: repo.homepage,
      }));
  } catch (error) {
    throw new Error("Unable to fetch GitHub repositories");
  }
};