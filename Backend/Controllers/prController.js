import { Octokit } from "octokit";
import dotenv from "dotenv";
import Repository from "../models/Repository.js";
import fetch from "node-fetch";

dotenv.config();
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

export async function fetchPullRequests(req, res) {
    const username = req.params.username;

  try {
    const searchResponse = await fetch(
      `https://api.github.com/search/issues?q=type:pr+author:${username}&sort=updated&per_page=50`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const searchData = await searchResponse.json();

    const formattedPrs = searchData.items.map((pr) => ({
      title: pr.title,
      url: pr.html_url,
      created_at: pr.created_at,
      state: pr.state,
      merged: pr.pull_request?.merged_at ? true : false,
      sha_id: pr.number, // Using PR number as identifier
    }));
    return res.json(formattedPrs);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get pull requests." });
  }
}
