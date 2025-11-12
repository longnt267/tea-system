import express from "express";
import { telegram } from "../../Controllers/telegram.js";
const telegramRoutes = express.Router();
telegramRoutes.get("/", telegram);
export { telegramRoutes };
