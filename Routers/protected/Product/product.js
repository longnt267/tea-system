import express from "express";
import { createProduct, getProducts } from "../../../Controllers/product.js";
const productRoutes = express.Router();
productRoutes.post("/create", createProduct);
productRoutes.get("/", getProducts);
export { productRoutes };
