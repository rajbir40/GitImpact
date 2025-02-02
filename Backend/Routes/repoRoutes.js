import express from "express";
import { getUserRepositories } from "../Controllers/repoController.js";

const router = express.Router();

router.get("/fetch", getUserRepositories);

export default router;