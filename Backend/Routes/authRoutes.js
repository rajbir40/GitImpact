import expess from "express";
const router = expess.Router();
import { githubOauth, githubCallback, getUserData } from "../Controllers/authController.js";

router.get("/github", githubOauth);
router.get("/github/callback", githubCallback);
router.get("/user", getUserData);

export default router;