import { Order } from "../models/order.js";
import { User } from "../models/user.js";

export const createOrder = async (req, res) => {
  const { user_id: userId, product_id: productId, quantity, tea } = req.body;
  try {
    const order = await Order.create({
      user: userId,
      product: productId,
      quantity,
      tea,
    });
    // Update user's tea count
    const user = await User.findById(userId);
    user.tea += order.totalTea;
    delete user.password;
    await user.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const totalOrders = await Order.countDocuments({ user: userId });
    const totalPage = Math.ceil(totalOrders / limit);
    const orders = await Order.find({ user: userId })
      .populate("product", "name") // Add product info
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
      page,
      currentPage: page,
      totalPage,
      count: totalOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
