import express from "express";
import { telegram, telegramSummary } from "../../Controllers/telegram.js";
const telegramRoutes = express.Router();
telegramRoutes.get("/", telegram);
telegramRoutes.get("/summary", telegramSummary);
export { telegramRoutes };
