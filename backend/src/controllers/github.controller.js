import {
  getGithubProfile,
  getGithubRepositories,
} from "../services/github.service.js";

export const fetchGithubProfile = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "GitHub username is required",
      });
    }

    const profile = await getGithubProfile(username);
    const repositories = await getGithubRepositories(username);

    return res.status(200).json({
      success: true,
      data: {
        profile,
        repositories,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};