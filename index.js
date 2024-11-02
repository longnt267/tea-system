import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/index.js";
import { authRouter } from "./Routers/index.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();

//we need to change up how __dirname is used for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//now please load my static html and css files for my express app, from my /dist directory
app.use(express.static(path.join(__dirname, "dist")));
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

if (process.env.NODE_ENV === "development") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log("Server listening on port", port);
  });
}

export default app;
