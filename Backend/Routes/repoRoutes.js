import express from "express";
import {
  getUserRepositories,
  calculateTotalUserLOC,
  getPullRequestsInRepo,
  getPullrequestsByUser,
  fetchReposWithParentInfo,
  fetchCommitInfo
} from "../Controllers/repoController.js";

const router = express.Router();

router.get("/fetch/:username", getUserRepositories);
router.get("/commit", calculateTotalUserLOC);
router.get("/pull-requests", getPullRequestsInRepo);
router.get("/pull-requests/:username", getPullrequestsByUser);
router.get("/fetch/parent", fetchReposWithParentInfo);

router.get("/fetch/sha/:sha", fetchCommitInfo);

export default router;
