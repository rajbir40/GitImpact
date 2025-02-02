import axios from "axios";
import dotenv from "dotenv";
import { Octokit } from "octokit";
import User from "../Models/user.js";

dotenv.config();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT_SECRET= process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;


// Redirect to github oauth
export async function githubOauth(req,res){
    
    if(!CLIENT_ID) {
        return res.status(500).json({message: "Github client id or secret not found."});
    }

    console.log(CLIENT_ID);
    console.log(CLIENT_SECRET);

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user:email`;
    res.redirect(githubAuthUrl);

}

export async function githubCallback(req,res){

    const code = req.query.code;
    if(!code) {
        return res.status(500).json({message: "Github code not found."});
    }

    try{

        const tokenResponse  = await axios.post("https://github.com/login/oauth/access_token",{
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code:code,
        },
        {headers:{"Accept": "application/json"}}
        );

        const access_token = tokenResponse.data.access_token;
        console.log("GitHub Access Token:", tokenResponse.data);

        getUserData(access_token);

        return res.status(200).json({access_token});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Failed to get access token."});
    }

}

// Octokit.js
// https://github.com/octokit/core.js#readme
export async function getUserData() {

    const access_token = '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';

    const octokit = new Octokit({
        auth: access_token  // Use env variables instead
    });

    try {
        console.log("Fetching user data...");

        const response = await octokit.request('GET /users/rajbir40', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        const userData = response.data;

        let user = await User.findOne({ id: userData.id });
        
        if (!user) {
            user = new User({
                login: userData.login,
                id: userData.id,
                node_id: userData.node_id,
                avatar_url: userData.avatar_url,
                url: userData.url,
                html_url: userData.html_url,
                followers_url: userData.followers_url,
                following_url: userData.following_url,
                gists_url: userData.gists_url,
                starred_url: userData.starred_url,
                subscriptions_url: userData.subscriptions_url,
                organizations_url: userData.organizations_url,
                repos_url: userData.repos_url,
                events_url: userData.events_url,
                received_events_url: userData.received_events_url,
                type: userData.type,
                site_admin: userData.site_admin,
                name: userData.name || null,
                company: userData.company || null,
                blog: userData.blog || null,
                location: userData.location || null,
                email: userData.email || null,
                hireable: userData.hireable || null,
                bio: userData.bio || null,
                twitter_username: userData.twitter_username || null,
                public_repos: userData.public_repos,
                public_gists: userData.public_gists,
                followers: userData.followers,
                following: userData.following,
                created_at: userData.created_at,
                updated_at: userData.updated_at,
                access_token: access_token
            });

            await user.save(); // Save to MongoDB
            console.log("User saved successfully");
        } else {
            console.log("User already exists in DB");
        }

    } catch (err) {
        console.error("Error fetching user:", err);
        }
}

