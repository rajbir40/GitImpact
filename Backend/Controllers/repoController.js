import { Octokit } from "octokit";
import dotenv from "dotenv";
import Repository from "../models/Repository.js"; 

dotenv.config();


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
