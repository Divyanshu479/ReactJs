import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import likeRouter from "./routes/like.route.js";
import commentRouter from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import path from "path";

// Load environment variables from .env file
dotenv.config();

// Log MongoDB URI for debugging
console.log("MongoDB URI:", process.env.MONGODB_URI); // Ensure this is not undefined

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI) // Ensure you use the correct variable name
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err); // Log connection errors
    });

const __dirname = path.resolve();

const app = express();

// Allow the JSON data to be parsed by express
app.use(express.json());

// Allow the cookie to be parsed by express
app.use(cookieParser());

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/like", likeRouter);
app.use("/api/comment", commentRouter);

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, "/client/dist")));

// Redirect any other route to the index.html file in client/dist
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

// Middleware for error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

// Run server
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
