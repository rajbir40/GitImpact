import { Octokit } from "octokit";
import dotenv from "dotenv";
import Repository from "../models/Repository.js";
import fetch from "node-fetch";
import { calculateTotalUserLOC } from "./repoController.js";

dotenv.config();
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const OWNER = "opencodeiiita";
const REPO = "SponsoHive-Backend";
const username = "rajbir40";

const octokit = new Octokit({
  auth: GITHUB_ACCESS_TOKEN,
});

export async function fetchTotalLoc(req, res) {
  const userid = req.params.userid;
  try {
    let totalLoc = 0;
    const repositories = await Repository.find({ owner: userid , fork:false})
      .sort({ pushed_at: -1 }) // Sort by most recently pushed
      .limit(5); // Limit to latest 5

       const forkedRepos = await Repository.find({ owner: userid , fork:true})
      .sort({ pushed_at: -1 }) // Sort by most recently pushed
      .limit(5); // Limit to latest 5

    const parent = await fetchReposWithParentInfo(forkedRepos);
    
    return res.json(parent);

    // for (const repo of repositories) {
    //   console.log(`Processing commit: ${repo.name}`);
    //   console.log(repo.owner);
    //   const loc = await calculateTotalUserLOC(repo.owner, repo.name,userid);
    //   totalLoc += loc;
    // }

    // for (const par of parent) {
    //   const [owner] = par.parentFullName.split("/"); // Get string before "/"
    //   console.log(`Processing commit: ${par.name}`);
    //   console.log(owner);
    //   const loc = await calculateTotalUserLOC(owner, par.name, userid);
    //   totalLoc += loc;
    // }

    // return res.json(totalLoc);
    // return res.json(repositories);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get repos." });
  }
}

export async function fetchReposWithParentInfo(repos) {
  const result = await Promise.all(
    repos.map(async (repo) => {
      if (repo.fork) {
        const fullDetails = await fetch(repo.url, {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
            Accept: "application/vnd.github+json",
          },
        }).then((res) => res.json());

        return {
          name: repo.name,
          parentFullName: fullDetails.parent?.full_name || null, // e.g., "user/repo"
        };
      } else {
        return {
          name: repo.name,
          parentFullName: `${repo.owner}/${repo.name}`, // treat as parentless repo
        };
      }
    })
  );

  return result;
}

// export async function calculateTotalUserLOC(req,res) {
//   try {
//     const targetUsername = "rajbir40";
//    const url = `https://api.github.com/repos/${OWNER}/${REPO}/stats/contributors`;

//   const response = await fetch(url, {
//     headers: {
//       Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
//       Accept: "application/vnd.github.v3+json",
//     },
//   });

//   if (response.status === 202) {
//     console.log(`Stats are being generated for ${REPO}, retry later.`);
//     return null; // stats not ready, try again later
//   }

//   if (!response.ok) {
//     console.error(`Error: ${response.status} ${response.statusText}`);
//     return 0;
//   }

//   const data = await response.json();
//     const userStats = data.find(
//       (contributor) => contributor.author?.login === targetUsername
//     );
//     // if (!userStats) return 0;

//     // const totalAdditions = userStats.weeks.reduce((sum, week) => sum + week.a, 0);
//     // return totalAdditions;
//     return res.json(userStats);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Failed to get repos." });
//   }
// }

export async function fetchAllCommits(req, res) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/commits`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      console.error("Error fetching commits:", response.statusText);
      return res.status(500).json({ error: "Failed to fetch commits" });
    }

    const commits = await response.json();

    const userCommits = commits.filter(
      (commit) => commit.author && commit.author.login === username
    );

    return res.json(userCommits);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
