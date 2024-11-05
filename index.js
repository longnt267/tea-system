import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbMiddleware } from "./middleware/database.js";
import publicRoutes from "./Routers/publicRoutes.js";
import protectedRoutes from "./Routers/protectedRoutes.js";
import { verifyToken } from "./middleware/auth.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors("*"));

// Apply database middleware to all routes
app.use(dbMiddleware);
// Default route
app.use("/api", publicRoutes);
app.use("/api", verifyToken, protectedRoutes);
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
