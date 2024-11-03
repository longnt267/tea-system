import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./Routers/index.js";
import { connectDB } from "./config/database.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
// Database connection middleware
const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ message: "Database connection error" });
  }
};

// Apply database middleware to all routes
app.use(dbMiddleware);
// Default route
app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
  res.send("Welcome to the Chat App API");
});

if (process.env.NODE_ENV === "development") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log("Server listening on port", port);
  });
}

export default app;
