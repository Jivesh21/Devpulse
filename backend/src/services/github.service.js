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

const GITHUB_CLIENT_ID =
  process.env.GITHUB_CLIENT_ID;

const GITHUB_CLIENT_SECRET =
  process.env.GITHUB_CLIENT_SECRET;

const GITHUB_CALLBACK_URL =
  process.env.GITHUB_CALLBACK_URL;

// ====================================
// Generate GitHub Authorization URL
// ====================================

export const getGithubAuthorizationUrl = (
  state
) => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri:
      GITHUB_CALLBACK_URL,
    scope: "read:user user:email",
    state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

// ====================================
// Exchange OAuth Code For Access Token
// ====================================

export const exchangeGithubCode =
  async (code) => {
    try {
      const { data } =
        await axios.post(
          "https://github.com/login/oauth/access_token",
          {
            client_id:
              GITHUB_CLIENT_ID,
            client_secret:
              GITHUB_CLIENT_SECRET,
            code,
            redirect_uri:
              GITHUB_CALLBACK_URL,
          },
          {
            headers: {
              Accept:
                "application/json",
            },
          }
        );

      if (!data.access_token) {
        throw new Error(
          data.error_description ||
            "Failed to obtain GitHub access token"
        );
      }

      return data.access_token;
    } catch (error) {
      console.error(
        "GitHub token exchange error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        "GitHub authentication failed"
      );
    }
  };

// ====================================
// Get Authenticated GitHub User
// ====================================

export const getAuthenticatedGithubUser =
  async (accessToken) => {
    try {
      const { data } =
        await githubApi.get(
          "/user",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

      return {
        id: data.id,
        login: data.login,
        name: data.name,
        email: data.email,
        avatar_url:
          data.avatar_url,
        html_url:
          data.html_url,
        bio: data.bio,
        company: data.company,
        blog: data.blog,
        location:
          data.location,
        public_repos:
          data.public_repos,
        followers:
          data.followers,
        following:
          data.following,
      };
    } catch (error) {
      console.error(
        "GitHub authenticated user error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        "Unable to fetch GitHub account"
      );
    }
  };

// ====================================
// Get Authenticated GitHub Repositories
// ====================================

export const getAuthenticatedGithubRepositories =
  async (accessToken) => {
    try {
      const { data } =
        await githubApi.get(
          "/user/repos",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              sort: "updated",
              per_page: 100,
              affiliation:
                "owner,collaborator,organization_member",
            },
          }
        );

      return data
        .filter(
          (repo) => !repo.fork
        )
        .map((repo) => ({
          id: repo.id,
          name: repo.name,
          fullName:
            repo.full_name,
          description:
            repo.description,
          language:
            repo.language,
          stars:
            repo.stargazers_count,
          forks:
            repo.forks_count,
          url: repo.html_url,
          homepage:
            repo.homepage,
          private:
            repo.private,
          updatedAt:
            repo.updated_at,
        }));
    } catch (error) {
      console.error(
        "GitHub repositories error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        "Unable to fetch GitHub repositories"
      );
    }
  };

// ====================================
// Public GitHub Profile
// ====================================

export const getGithubProfile =
  async (username) => {
    try {
      const { data } =
        await githubApi.get(
          `/users/${username}`
        );

      return {
        id: data.id,
        login: data.login,
        name: data.name,
        avatar_url:
          data.avatar_url,
        html_url:
          data.html_url,
        bio: data.bio,
        company:
          data.company,
        blog: data.blog,
        location:
          data.location,
        twitter_username:
          data.twitter_username,
        public_repos:
          data.public_repos,
        followers:
          data.followers,
        following:
          data.following,
        created_at:
          data.created_at,
      };
    } catch (error) {
      if (
        error.response?.status ===
        404
      ) {
        throw new Error(
          "GitHub user not found"
        );
      }

      throw new Error(
        "Unable to fetch GitHub profile"
      );
    }
  };

// ====================================
// Public GitHub Repositories
// ====================================

export const getGithubRepositories =
  async (username) => {
    try {
      const { data } =
        await githubApi.get(
          `/users/${username}/repos`,
          {
            params: {
              sort: "updated",
              per_page: 100,
            },
          }
        );

      return data
        .filter(
          (repo) => !repo.fork
        )
        .sort(
          (a, b) =>
            b.stargazers_count -
            a.stargazers_count
        )
        .slice(0, 6)
        .map((repo) => ({
          id: repo.id,
          name: repo.name,
          description:
            repo.description,
          language:
            repo.language,
          stars:
            repo.stargazers_count,
          forks:
            repo.forks_count,
          url: repo.html_url,
          homepage:
            repo.homepage,
        }));
    } catch (error) {
      console.error(
        "GitHub public repositories error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        "Unable to fetch GitHub repositories"
      );
    }
  };

// ====================================
// Recent Public GitHub Commits
// ====================================

export const getGithubRecentCommits =
  async (username) => {
    try {
      const { data } =
        await githubApi.get(
          `/users/${username}/events/public`,
          {
            params: {
              per_page: 100,
            },
          }
        );

      const commits = [];

      for (const event of data) {
        if (
          event.type !==
          "PushEvent"
        ) {
          continue;
        }

        const repositoryName =
          event.repo?.name;

        const repositoryUrl =
          event.repo?.url
            ? event.repo.url.replace(
                "api.github.com/repos",
                "github.com"
              )
            : `https://github.com/${repositoryName}`;

        const pushCommits =
          event.payload?.commits ||
          [];

        for (const commit of pushCommits) {
          if (!commit?.sha) {
            continue;
          }

          commits.push({
            sha: commit.sha,
            message:
              commit.message ||
              "No commit message",
            repository:
              repositoryName,
            repositoryUrl,
            url: `https://github.com/${repositoryName}/commit/${commit.sha}`,
            createdAt:
              event.created_at,
          });
        }
      }

      // ====================================
      // Remove Duplicate Commits
      // ====================================

      const uniqueCommits =
        Array.from(
          new Map(
            commits.map(
              (commit) => [
                commit.sha,
                commit,
              ]
            )
          ).values()
        );

      // ====================================
      // Newest First
      // ====================================

      uniqueCommits.sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      );

      // ====================================
      // Keep Profile Lightweight
      // ====================================

      return uniqueCommits.slice(
        0,
        8
      );
    } catch (error) {
      console.error(
        "GitHub recent commits error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        "Unable to fetch GitHub recent commits"
      );
    }
  };

// ====================================
// GitHub Contribution Calendar
// ====================================

export const getGithubContributionCalendar =
  async (
    username,
    accessToken
  ) => {
    try {
      // ====================================
      // Validate Input
      // ====================================

      if (!username) {
        throw new Error(
          "GitHub username is required"
        );
      }

      if (!accessToken) {
        throw new Error(
          "GitHub access token is required"
        );
      }

      // ====================================
      // GraphQL Query
      // ====================================
const query = `
  query GetContributionCalendar(
    $login: String!
  ) {
    user(login: $login) {
      login

      contributionsCollection {
        contributionCalendar {
          totalContributions

          weeks {
            firstDay

            contributionDays {
              date
              contributionCount
              contributionLevel
              color
              weekday
            }
          }
        }
      }
    }
  }
`;

      // ====================================
      // GitHub GraphQL Request
      // ====================================

      const response =
        await axios.post(
          "https://api.github.com/graphql",
          {
            query,
            variables: {
              login: username,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept:
                "application/vnd.github+json",
              "X-GitHub-Api-Version":
                "2022-11-28",
            },
          }
        );

      // ====================================
      // GraphQL Errors
      // ====================================

      if (
        response.data?.errors
          ?.length
      ) {
        console.error(
          "GitHub GraphQL errors:",
          JSON.stringify(
            response.data.errors,
            null,
            2
          )
        );

        const message =
          response.data.errors
            .map(
              (error) =>
                error.message
            )
            .join("; ");

        throw new Error(
          message ||
            "GitHub GraphQL request failed"
        );
      }

      // ====================================
      // Extract User
      // ====================================

      const user =
        response.data?.data
          ?.user;

      if (!user) {
        throw new Error(
          "GitHub user not found"
        );
      }

      // ====================================
      // Extract Calendar
      // ====================================

      const calendar =
        user
          .contributionsCollection
          ?.contributionCalendar;

      if (!calendar) {
        throw new Error(
          "GitHub contribution calendar not found"
        );
      }

      // ====================================
      // Return Contribution Data
      // ====================================

      return {
        username:
          user.login,

        totalContributions:
          calendar.totalContributions ||
          0,

        weeks:
          calendar.weeks || [],
      };
    } catch (error) {
      console.error(
        "GitHub contribution calendar error:",
        error.response?.data ||
          error.message
      );

      // ====================================
      // Preserve Real Error
      // ====================================

      throw new Error(
        error.message ||
          "Unable to fetch GitHub contribution calendar"
      );
    }
  };