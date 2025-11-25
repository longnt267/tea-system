import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import publicRoutes from "./Routers/publicRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors("*"));

app.use("/api", publicRoutes);
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
