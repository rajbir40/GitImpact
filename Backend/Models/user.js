import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    login: { type: String, required: true, description: "GitHub username" },
    id: { type: Number, required: true, unique: true, description: "Unique GitHub user ID" },
    node_id: { type: String, description: "GitHub GraphQL node ID" },
    avatar_url: { type: String, required: true, description: "URL of user's avatar image" },
    url: { type: String, required: true, description: "GitHub API URL for the user" },
    html_url: { type: String, required: true, description: "User profile page URL" },
    followers_url: { type: String, description: "API URL to fetch followers" },
    following_url: { type: String, description: "API URL to fetch following users" },
    gists_url: { type: String, description: "API URL for user's gists" },
    starred_url: { type: String, description: "API URL for user's starred repositories" },
    subscriptions_url: { type: String, description: "API URL for subscriptions" },
    organizations_url: { type: String, description: "API URL for user's organizations" },
    repos_url: { type: String, required: true, description: "API URL for user's repositories" },
    events_url: { type: String, description: "API URL for user's events" },
    received_events_url: { type: String, description: "API URL for received events" },
    type: { type: String, enum: ["User", "Organization"], required: true, description: "GitHub account type" },
    site_admin: { type: Boolean, default: false, description: "Indicates if user is a GitHub site admin" },
    name: { type: String, default: null, description: "User's full name" },
    company: { type: String, default: null, description: "User's company name" },
    blog: { type: String, default: null, description: "User's blog or website URL" },
    location: { type: String, default: null, description: "User's location" },
    email: { type: String, default: null, description: "User's email (may be null)" },
    hireable: { type: Boolean, default: null, description: "Indicates if user is hireable" },
    bio: { type: String, default: null, description: "User bio" },
    twitter_username: { type: String, default: null, description: "Twitter username" },
    notification_email: { type: String, default: null, description: "Notification email" },
    public_repos: { type: Number, required: true, description: "Number of public repositories" },
    public_gists: { type: Number, default: 0, description: "Number of public gists" },
    followers: { type: Number, required: true, description: "Number of followers" },
    following: { type: Number, required: true, description: "Number of people the user follows" },
    created_at: { type: Date, required: true, description: "GitHub account creation date" },
    updated_at: { type: Date, required: true, description: "Last profile update timestamp" },
    access_token: { type: String, required: true, description: "GitHub access token" },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const User = mongoose.model("User", userSchema);

export default User;
