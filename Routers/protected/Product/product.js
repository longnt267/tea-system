import express from "express";
import { createProduct } from "../../../Controllers/product.js";
const productRoutes = express.Router();
productRoutes.post("/create", createProduct);
export { productRoutes };
