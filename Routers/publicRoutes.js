import express from "express";
import { authRoutes } from "./public/Auth/auth.js";
import { productRoutes } from "./public/product.js";
import { telegramRoutes } from "./public/telegram.js";
const router = express.Router();

// Mount auth routes với prefix /auth
router.use("/auth", authRoutes);
router.use("/product-public", productRoutes);
router.use("/telegram", telegramRoutes);
export default router;
