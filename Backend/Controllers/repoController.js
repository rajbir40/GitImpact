import { Octokit } from "octokit";
import dotenv from "dotenv";
import Repository from "../models/Repository.js"; 
import fetch from "node-fetch";

dotenv.config();
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const OWNER = "opencodeiiita";
const REPO = "SponsoHive-Backend";

export async function getUserRepositories(req, res) {
    const access_token = process.env.GITHUB_ACCESS_TOKEN;

    if (!access_token) {
        return res.status(400).json({ message: "Access token is required" });
    }

    const octokit = new Octokit({
        auth: access_token // Use the token to authenticate
    });

    try {
        console.log("Fetching repositories...");

        // Fetch repositories from GitHub
        const response = await octokit.request('GET /user/repos', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        const repositories = response.data; // Extract repositories

        // Process each repository and save to DB
        for (const repo of repositories) {
            let existingRepo = await Repository.findOne({ id: repo.id });

            if (!existingRepo) {
                // If repo doesn't exist, save to DB
                const newRepo = new Repository({
                    id: repo.id,
                    name: repo.name,
                    full_name: repo.full_name,
                    owner: repo.owner.login,
                    private: repo.private,
                    html_url: repo.html_url,
                    description: repo.description || null,
                    fork: repo.fork,
                    url: repo.url,
                    created_at: repo.created_at,
                    updated_at: repo.updated_at,
                    pushed_at: repo.pushed_at,
                    language: repo.language || null,
                    forks_count: repo.forks_count,
                    stargazers_count: repo.stargazers_count,
                    watchers_count: repo.watchers_count,
                    open_issues_count: repo.open_issues_count,
                    visibility: repo.visibility
                });

                await newRepo.save(); // Save to MongoDB
            }
        }

        return res.status(200).json(repositories); // Return repository data

    } catch (err) {
        console.error("Error fetching repositories:", err);
        return res.status(500).json({ message: "Failed to fetch repositories" });
    }
}


async function fetchAllCommits(owner, repo) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits`;
    
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${GITHUB_ACCESS_TOKEN}`,
            "Accept": "application/vnd.github.v3+json"
        }
    });

    if (!response.ok) {
        console.error("Error fetching commits:", response.statusText);
        return [];
    }

    const commits = await response.json();
    return commits.map(commit => commit.sha);
}

async function fetchCommitDetails(owner, repo, sha) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${GITHUB_ACCESS_TOKEN}`,
            "Accept": "application/vnd.github.v3+json"
        }
    });

    if (!response.ok) {
        console.error(`Error fetching commit ${sha}:`, response.statusText);
        return 0;
    }

    const data = await response.json();
    let userLOC = 0;

    if (data.files) {
        data.files.forEach(file => {
            // Ignore generated files
            const ignoredFiles = ["package-lock.json", "yarn.lock", "dist/", "node_modules/"];
            if (!ignoredFiles.some(ignore => file.filename.includes(ignore))) {
                userLOC += file.additions; // Count only meaningful LOC
            }
        });
    }

    return userLOC;
}

export async function calculateTotalUserLOC() {
    console.log("Fetching commits...");
    const commitShas = await fetchAllCommits(OWNER, REPO);

    let totalLOC = 0;

    for (const sha of commitShas) {
        console.log(`Processing commit: ${sha}`);
        const loc = await fetchCommitDetails(OWNER, REPO, sha);
        totalLOC += loc;
    }

    console.log(`\nTotal LOC written by the user: ${totalLOC}`);
    return totalLOC;
}

export async function getPullRequestsInRepo(req,res){
   try {
        const username = req.params.username;
        const octokit = new Octokit({
            auth: GITHUB_ACCESS_TOKEN
        })
        const response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
            owner: OWNER,
            repo: REPO,
            state: "all",
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })

        if(!response.data){
            return res.status(500).json({message: "Failed to get pull requests."});
        }
        const userPRs = response.data.filter(pr => pr.user.login === username);
        return userPRs.map(pr => ({
            title: pr.title,
            url: pr.html_url,
            created_at: pr.created_at,
            state: pr.state, // open/closed
            merged: pr.merged_at ? true : false
        }));
   }
   catch(err){
        console.log(err);
        return res.status(500).json({message: "Failed to get pull requests."});
   }
}

export async function getPullrequestsByUser(req,res){
    try {
        const username = req.params.username;
        const octokit = new Octokit({
            auth: GITHUB_ACCESS_TOKEN
        })
        const response = await octokit.rest.pulls.list({
            owner: OWNER,
            repo: REPO,
            state: "all", 
            per_page: 100
        });
        const userPRs = response.data.filter(pr => pr.user.login === username);
        const formattedPrs =  userPRs.map(pr => ({
            title: pr.title,
            url: pr.html_url,
            created_at: pr.created_at,
            state: pr.state, // open/closed
            merged: pr.merged_at ? true : false
        }));
        return res.json(formattedPrs);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Failed to get pull requests."});
    }
}