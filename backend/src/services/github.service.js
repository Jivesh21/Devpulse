import axios from "axios";

const githubApi = axios.create({
  baseURL: "https://api.github.com/users",
  timeout: 10000,
  headers: {
    Accept: "application/vnd.github+json",
  },
});

export const getGithubProfile = async (username) => {
  try {
    const { data } = await githubApi.get(`/${username}`);

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
export const getGithubRepositories = async (username) => {
  try {
    const { data } = await githubApi.get(`/${username}/repos`, {
      params: {
        sort: "updated",
        per_page: 100,
      },
    });

    const repositories = data
      .filter((repo) => !repo.fork)
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count
      )
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

    return repositories;
  } catch (error) {
    throw new Error(
      "Unable to fetch GitHub repositories"
    );
  }
};