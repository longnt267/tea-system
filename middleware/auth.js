import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/index.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Vui lòng cung cấp token xác thực",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Thêm thông tin user vào request để sử dụng ở các middleware tiếp theo
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token đã hết hạn",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi xác thực",
    });
  }
};
