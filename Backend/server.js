import express from "express"
import dotenv from "dotenv";
import mongoose from "mongoose";
import {connectDB} from "./config/db.js";
import cookieParser from "cookie-parser";
import http from "http";
// import initializeSocket from "./Services/socketService.js";
import authRoutes from "./Routes/authRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express App
const app = express();

// Initialize Socket.io
const server = http.createServer(app);
// initializeSocket(server);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Basic Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Health Check Route
app.get("/api/health", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ message: "MongoDB is alive and connected!" });
  } catch (error) {
    res.status(500).json({ message: "Error connecting to MongoDB.", error });
  }
});

// Use routes
app.use("/api/auth", authRoutes);

// Catch-all for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});


// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});