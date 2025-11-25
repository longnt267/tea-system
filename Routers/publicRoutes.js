import express from "express";
import { telegramRoutes } from "./public/telegram.js";
const router = express.Router();

router.use("/telegram", telegramRoutes);
export default router;
