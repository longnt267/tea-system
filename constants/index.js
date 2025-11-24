import dotenv from "dotenv";
dotenv.config();

export const ERoles = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const EOrderStatus = {
  PENDING: "Chờ giao hàng",
  CONFIRM: "Đã mukbang",
};

export const MONGODB_URI = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
