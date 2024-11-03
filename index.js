import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./Routers/index.js";
import { connectDB } from "./config/database.js";
dotenv.config();

const app = express();
connectDB();
app.use(express.json());
app.use(cors());

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
