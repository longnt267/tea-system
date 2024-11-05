import { Product } from "../models/product.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
    });

    res.status(201).json({
      message: "Create successful",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const totalProducts = await Product.countDocuments();
    const totalPage = Math.ceil(totalProducts / limit);
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.status(200).json({
      message: "Products fetched successfully",
      products,
      page,
      currentPage: page,
      totalPage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
