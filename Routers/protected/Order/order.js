import express from "express";
import { createOrder, getOrders } from "../../../Controllers/order.js";
const orderRoutes = express.Router();
orderRoutes.get("/", getOrders);
orderRoutes.post("/", createOrder);
export { orderRoutes };
