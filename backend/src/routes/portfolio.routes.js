import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
  createPortfolio,
  getMyPortfolio,
  getUserPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portfolio.controller.js";

import {
  createPortfolioSchema,
  updatePortfolioSchema,
} from "../validators/portfolio.validator.js";

const router = Router();

// ====================================
// Public Routes
// ====================================

router.get("/user/:userId", getUserPortfolio);

// ====================================
// Protected Routes
// ====================================

router.use(verifyJWT);

router
  .route("/")
  .get(getMyPortfolio)
  .post(
    upload.single("coverImage"),
    validate(createPortfolioSchema),
    createPortfolio
  );

router
  .route("/:portfolioId")
  .patch(
    upload.single("coverImage"),
    validate(updatePortfolioSchema),
    updatePortfolio
  )
  .delete(deletePortfolio);

export default router;