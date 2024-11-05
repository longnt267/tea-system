import express from "express";
import { productRoutes } from "./protected/Product/product.js";
const router = express.Router();

// Mount auth routes với prefix /auth
router.use("/product", productRoutes);
export default router;
