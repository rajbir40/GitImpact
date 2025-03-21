import express from "express";
import { getUserRepositories , calculateTotalUserLOC , getPullRequestsInRepo ,getPullrequestsByUser} from "../Controllers/repoController.js";

const router = express.Router();

router.get("/fetch", getUserRepositories);
router.get("/commit", calculateTotalUserLOC);
router.get("/pull-requests", getPullRequestsInRepo);
router.get("/pull-requests/:username", getPullrequestsByUser);

export default router;