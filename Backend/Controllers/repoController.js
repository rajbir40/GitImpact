import { Octokit } from "octokit";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;


export async function getUserRepositories(req, res) {
  const access_token = process.env.GITHUB_ACCESS_TOKEN;
  const username = req.params.username;

  if (!access_token) {
    return res.status(400).json({ message: "Access token is required" });
  }

  const octokit = new Octokit({ auth: access_token });

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
    return res.status(200).json(repositories);
  } catch (err) {
    console.error("Error fetching repositories:", err);
    return res.status(500).json({ message: "Failed to fetch repositories" });
  }
}


async function fetchAllCommits(owner, repo , username) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    console.error("Error fetching commits:", response.statusText);
    return [];
  }

  const commits = await response.json();

    const userCommits = commits.filter(
      (commit) => commit.author && commit.author.login === username
    );
  return userCommits.map((userCommit) => userCommit.sha);
  // return commits;
}

async function fetchCommitDetails(owner, repo, sha) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    console.error(`Error fetching commit ${sha}:`, response.statusText);
    return 0;
  }

//   console.log(response);

  const data = await response.json();
  let userLOC = 0;
  let deleteLOC = 0;
  let date = data.commit.author.date;

  if (data.files) {
    data.files.forEach((file) => {
      // Ignore generated files
      const ignoredFiles = [
        "package-lock.json",
        "yarn.lock",
        "dist/",
        "node_modules/",
      ];
      if (!ignoredFiles.some((ignore) => file.filename.includes(ignore))) {
        userLOC += file.additions; 
        deleteLOC += file.deletions;
      }
    });
  }

  return { userLOC, deleteLOC ,date};
}

export async function calculateTotalUserLOC(owner, repo, username) {
  console.log("Fetching commits...");
  const commitShas = await fetchAllCommits(owner, repo, username);

  let totalLOC = 0;
  let totalDeletedLOC = 0;
  let commitCount = commitShas.length;

  const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const monthlyCommitsMap = new Map();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`; // e.g., "2025-5"
    monthlyCommitsMap.set(key, {
      month: MONTH_NAMES[date.getMonth()],
      commits: 0
    });
  }

  // Process each commit
  for (const sha of commitShas) {
    console.log(`Processing commit: ${sha}`);
    let { userLOC, deleteLOC, date } = await fetchCommitDetails(owner, repo, sha);

    totalLOC += userLOC ?? 0;
    totalDeletedLOC += deleteLOC ?? 0;

    const commitDate = new Date(date);
    const key = `${commitDate.getFullYear()}-${commitDate.getMonth()}`;
    if (monthlyCommitsMap.has(key)) {
      monthlyCommitsMap.get(key).commits += 1;
    }
  }

  const monthlyCommitActivity = Array.from(monthlyCommitsMap.values());

  console.log(`\nTotal LOC written by the user: ${totalLOC}`);
  console.log(`Total LOC deleted by the user: ${totalDeletedLOC}`);
  console.log("Monthly Commit Activity:", monthlyCommitActivity);

  return {
    loc: totalLOC,
    deleteLoc: totalDeletedLOC,
    commitCount: commitCount,
    monthlyCommitActivity 
  };
}



export async function getPullRequestsInRepo(req, res) {
  try {
    const octokit = new Octokit({
      auth: GITHUB_ACCESS_TOKEN,
    });
    const response = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner: OWNER,
      repo: REPO,
      state: "all",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.data) {
      return res.status(500).json({ message: "Failed to get pull requests." });
    }
    const PRs = response.data;
    return PRs.map((pr) => ({
      title: pr.title,
      url: pr.html_url,
      created_at: pr.created_at,
      state: pr.state, // open/closed
      merged: pr.merged_at ? true : false,
    }));
    // return res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get pull requests." });
  }
}

export async function getPullrequestsByUser(req, res) {
  try {
    const username = req.params.username;
    const octokit = new Octokit({
      auth: GITHUB_ACCESS_TOKEN,
    });
    const response = await octokit.rest.pulls.list({
      owner: OWNER,
      repo: REPO,
      state: "all",
      per_page: 100,
    });
    const userPRs = response.data.filter((pr) => pr.user.login === username);
    const formattedPrs =  userPRs.map(pr => ({
        title: pr.title,
        url: pr.html_url,
        created_at: pr.created_at,
        state: pr.state, // open/closed
        merged: pr.merged_at ? true : false,
        sha_id: pr.head.sha
    }));
    return res.json(formattedPrs);
    // return res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get pull requests." });
  }
}

const username = "rajbir40";

export async function fetchReposWithParentInfo() {
  const repos = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      Authorization: process.env.GITHUB_ACCESS_TOKEN,
      Accept: "application/vnd.github+json",
    },
  }).then((res) => res.json());

  const result = await Promise.all(
    repos.map(async (repo) => {
      if (repo.fork) {
        const fullDetails = await fetch(repo.url, {
          headers: {
            Authorization: process.env.GITHUB_ACCESS_TOKEN,
            Accept: "application/vnd.github+json",
          },
        }).then((res) => res.json());
        return {
          name: repo.name,
          fork: true,
          parent: fullDetails.parent?.full_name || null,
        };
      } else {
        return {
          name: repo.name,
          fork: false,
          parent: null,
        };
      }
    })
  );

  console.log(result);
}

export async function fetchCommitInfo(req, res) {
    const sha = req.params.sha;
    const OWNER = "opencodeiiita";
    const REPO = "SponsoHive-Backend";
  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/commits/${sha}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      console.error(`Error fetching commit ${sha}:`, response.statusText);
      return 0;
    }

    const data = await response.json();

    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get pull requests." });
  }
}
