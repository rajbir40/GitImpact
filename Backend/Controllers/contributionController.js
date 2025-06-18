import { Octokit } from "octokit";
import dotenv from "dotenv";
import Repository from "../models/Repository.js";
import fetch from "node-fetch";
import { calculateTotalUserLOC } from "./repoController.js";

dotenv.config();
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

const octokit = new Octokit({
  auth: GITHUB_ACCESS_TOKEN,
});

export async function fetchTotalLoc(req, res) {
  const access_token = process.env.GITHUB_ACCESS_TOKEN;
  const username = req.params.username;

  if (!access_token) {
    return res.status(400).json({ message: "Access token is required" });
  }

  try {
    console.log("Fetching repositories for:", username);

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repositories = await response.json();

    // return res.json(repositories);
    const cumulativeMonthlyCommits = new Map();
    let totalLoc = 0;
    let deleteLOC = 0;
    let totalCommits = 0;
    let activity = [];
    let repoStats = [];

    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const personalRepos = repositories
    .filter((repo) => 
      !repo.fork && new Date(repo.pushed_at) >= sixMonthsAgo
    )
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    // .slice(0, 50);

  const forkedRepos = repositories
    .filter((repo) => 
      repo.fork && new Date(repo.pushed_at) >= sixMonthsAgo
    )
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    // .slice(0, 50);

    const parent = await fetchReposWithParentInfo(forkedRepos);

    // return res.json(parent);

    for (const repo of personalRepos) {
      console.log(`Processing commit: ${repo.name}`);
      console.log(repo.owner.login);
      let { loc, deleteLoc, commitCount, monthlyCommitActivity } =
        await calculateTotalUserLOC(repo.owner.login, repo.name, username);
      totalLoc += loc;
      deleteLOC += deleteLoc;
      totalCommits += commitCount;
      activity = monthlyCommitActivity;
      repoStats.push({
        name: repo.name,
        loc,
        deleteLoc,
        commitCount,
        fork: false,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        pushedAt: repo.pushed_at,
        url: repo.html_url,
      });

      for (const entry of monthlyCommitActivity) {
        if (!cumulativeMonthlyCommits.has(entry.month)) {
          cumulativeMonthlyCommits.set(entry.month, {
            month: entry.month,
            commits: 0,
          });
        }
        cumulativeMonthlyCommits.get(entry.month).commits += entry.commits;
      }
      const finalActivity = Array.from(cumulativeMonthlyCommits.values());
      const monthOrder = [
        "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
      ];
      finalActivity.sort(
        (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
      );

      activity = finalActivity;

      console.log("LOCs for", repo.name, "=>", loc, deleteLoc);
    }

    for (const par of parent) {
      const [owner] = par.parentFullName.split("/");
      console.log(`Processing commit: ${par.name}`);
      console.log(owner);
      let { loc, deleteLoc, commitCount , monthlyCommitActivity} = await calculateTotalUserLOC(
        owner,
        par.name,
        username
      );
      totalLoc += loc;
      deleteLOC += deleteLoc;
      totalCommits += commitCount;
      repoStats.push({
        name: par.name,
        loc,
        deleteLoc,
        commitCount,
        fork: true,
        description: par.description,
        language: par.language,
        stars: par.stars,
        forks: par.forks,
        watchers: par.watchers,
        pushedAt: par.pushedAt,
        url: par.url,
        originalOwner: owner,
      });

      for (const entry of monthlyCommitActivity) {
        if (!cumulativeMonthlyCommits.has(entry.month)) {
          cumulativeMonthlyCommits.set(entry.month, {
            month: entry.month,
            commits: 0,
          });
        }
        cumulativeMonthlyCommits.get(entry.month).commits += entry.commits;
      }
      const finalActivity = Array.from(cumulativeMonthlyCommits.values());
      const monthOrder = [
        "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
      ];
      finalActivity.sort(
        (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
      );

      activity = finalActivity;
      // console.log("LOCs for", par.name, "=>", loc, deleteLoc);
    }

    return res.json({ totalLoc, deleteLOC, totalCommits, activity, repoStats });
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
          description: fullDetails.description,
          language: fullDetails.language,
          stars: fullDetails.stargazers_count,
          forks: fullDetails.forks_count,
          watchers: fullDetails.watchers_count,
          pushedAt: fullDetails.pushed_at,
          url: fullDetails.html_url,
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
