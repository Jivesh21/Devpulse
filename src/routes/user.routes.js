import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { updateProfile } from "../controllers/user.controller.js";

const router = Router();

router.patch("/profile", verifyJWT, updateProfile);

export default router;