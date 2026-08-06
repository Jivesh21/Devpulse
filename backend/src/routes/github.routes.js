import { Router } from "express";
import { fetchGithubProfile } from "../controllers/github.controller.js";

const router = Router();

console.log("✅ GitHub Router Loaded");

router.get("/:username", fetchGithubProfile);

export default router;