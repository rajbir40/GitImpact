import express from "express";
import {
  fetchTotalLoc,
  fetchAllCommits
} from "../Controllers/contributionController.js";

const router = express.Router();

router.get("/fetchloc/:username", fetchTotalLoc);
router.get("/fetch/commit", fetchAllCommits);

export default router;
