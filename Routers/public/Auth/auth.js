import express from "express";
import { loginUser, registerUser, savePrize } from "../../../Controllers/auth.js";
const authRoutes = express.Router();
authRoutes.post("/login", loginUser);
authRoutes.post("/register", registerUser);
authRoutes.post("/save-prize", savePrize);
export { authRoutes };
