import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyJWT, getCurrentUser);
router.post("/logout", verifyJWT, logout);
router.post("/refresh-token", refreshAccessToken);
export default router;