import axios from "axios";
import dotenv from "dotenv";
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

        return res.status(200).json({access_token});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Failed to get access token."});
    }

}

