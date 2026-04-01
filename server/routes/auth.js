import express from "express";
import {
  validateBody,
  signupSchema,
  loginSchema,
} from "../validators/authValidator.js";
import { allUser, login, signup, verifyOTP } from "../controllers/authController.js";
import { googleLogin } from "../controllers/googleLogin.js";
 

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post("/signup", validateBody(signupSchema), signup);

router.post("/verify",verifyOTP)
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", validateBody(loginSchema), login);
router.get("/alluser", allUser);

router.post("/google-login", googleLogin);

export default router;
