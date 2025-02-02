import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    full_name: { type: String, required: true },
    owner: { type: String, required: true },
    private: { type: Boolean, required: true },
    html_url: { type: String, required: true },
    description: { type: String, default: null },
    fork: { type: Boolean, required: true },
    url: { type: String, required: true },
    created_at: { type: String, required: true },
    updated_at: { type: String, required: true },
    pushed_at: { type: String, required: true },
    language: { type: String, default: null },
    forks_count: { type: Number, required: true },
    stargazers_count: { type: Number, required: true },
    watchers_count: { type: Number, required: true },
    open_issues_count: { type: Number, required: true },
    visibility: { type: String, required: true }
});

const Repository = mongoose.model("Repository", repositorySchema);

export default Repository;
