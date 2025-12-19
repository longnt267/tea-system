import express from "express";
import { telegram, telegramSummary } from "../../Controllers/telegram.js";
const telegramRoutes = express.Router();
telegramRoutes.get("/", telegram);
telegramRoutes.post("/summary", telegramSummary);
telegramRoutes.post("/daily", telegramSummary);
export { telegramRoutes };
