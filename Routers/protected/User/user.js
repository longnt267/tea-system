import express from "express";
import { getUserLogin, getUsers } from "../../../Controllers/user.js";
const userRoutes = express.Router();
userRoutes.get("/", getUsers);
userRoutes.get("/get-login", getUserLogin);
export { userRoutes };
