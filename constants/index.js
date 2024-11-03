import dotenv from "dotenv";
dotenv.config();

export const ERoles = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const MONGODB_URI = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
