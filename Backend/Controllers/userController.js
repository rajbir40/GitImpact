import { Octokit } from "octokit";
import dotenv from "dotenv";
import Repository from "../models/Repository.js";
import fetch from "node-fetch";

dotenv.config();
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;


export async function getUserDetails(req, res) {
  const username = req.params.username;
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    
    if (!response.ok) {
      console.error(`Error fetching user ${username}:`, response.statusText);
      return res.status(500).json({ error: "Failed to fetch user details" });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to fetch user details" });
  }
}
