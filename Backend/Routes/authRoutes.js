import expess from "express";
const router = expess.Router();
import { githubOauth, githubCallback } from "../Controllers/authController.js";

router.get("/github", githubOauth);
router.get("/github/callback", githubCallback);

export default router;