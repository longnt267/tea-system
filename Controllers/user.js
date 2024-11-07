import { User } from "../models/user.js";


export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const totalUsers = await User.countDocuments();
    const totalPage = Math.ceil(totalUsers / limit);
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.status(200).json({
      message: "Users fetched successfully",
      users,
      page,
      currentPage: page,
      totalPage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
