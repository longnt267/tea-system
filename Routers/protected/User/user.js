import express from "express";
import { getUsers } from "../../../Controllers/user.js";
const userRoutes = express.Router();
userRoutes.get("/", getUsers);
export { userRoutes };
