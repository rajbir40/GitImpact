import express from "express";
import {
  fetchTotalLoc,
  fetchAllCommits
} from "../Controllers/contributionController.js";

const router = express.Router();

router.get("/fetchloc/:userid", fetchTotalLoc);
router.get("/fetch/commit", fetchAllCommits);

export default router;
