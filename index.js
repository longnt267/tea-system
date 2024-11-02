import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/index.js";
import { authRouter, userRouter } from "./Routers/index.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
// Default route
app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
  res.send("Welcome to the Chat App API");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server listening on port", port);
});

export default app;
