import express from "express";
import { productRoutes } from "./protected/Product/product.js";
import { orderRoutes } from "./protected/Order/order.js";
import { userRoutes } from "./protected/User/user.js";
const router = express.Router();

// Mount auth routes với prefix /auth
router.use("/product", productRoutes);
router.use("/order", orderRoutes);
router.use("/user", userRoutes);

export default router;
