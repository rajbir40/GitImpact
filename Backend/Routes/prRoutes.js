import express from "express";
import { fetchPullRequests } from "../Controllers/prController.js";

const router = express.Router();

router.get("/fetch/:username", fetchPullRequests);

export default router;
