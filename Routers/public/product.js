import express from "express";
import { getProducts } from "../../Controllers/product.js";
const productRoutes = express.Router();
productRoutes.get("/", getProducts);
export { productRoutes };
