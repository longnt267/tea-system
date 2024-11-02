import express from "express";
import { loginUser, registerUser } from "../Controllers/auth.js";
// import {
//   registerUser,
//   loginUser,
//   findUser,
//   getAllUsers,
// } from "../Controllers/userController";

const authRouter = express.Router();
authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);
export { authRouter };
