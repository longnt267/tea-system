import express from "express";
import { authRoutes } from "./public/Auth/auth.js";
import { productRoutes } from "./public/product.js";
const router = express.Router();

// Mount auth routes với prefix /auth
router.use("/auth", authRoutes);
router.use("/product-public", productRoutes);
export default router;
