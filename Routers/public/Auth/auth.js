import express from "express";
import { loginUser, registerUser } from "../../../Controllers/auth.js";
const authRoutes = express.Router();
authRoutes.post("/login", loginUser);
authRoutes.post("/register", registerUser);
export { authRoutes };
