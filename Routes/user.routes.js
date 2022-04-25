import express from "express";
const router = express.Router();
import {
  loginController,
  getUserProfile,
  registerUser,
  updateUserProfile,
} from "../Controllers/user.controller.js";
import protect from "../Middleware/auth.middleware.js";

router.route("/").post(registerUser);
router.post("/login", loginController);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export { router };
