import express from "express";
import { getUserDetails } from "../Controllers/userController.js";
import { App } from "octokit";

const router = express.Router();

router.get("/fetch/:username", getUserDetails);

export default router;
