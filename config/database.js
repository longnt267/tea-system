import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false, // Chỉ bật ở môi trường development
  logging: false,
  entities: ["./entities/*.js"],
});

// Kiểm tra kết nối
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to Neon PostgreSQL!");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

// Xử lý disconnect
process.on("SIGINT", () => {
  AppDataSource.destroy()
    .then(() => {
      console.log("Database connection closed.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error closing database connection:", error);
      process.exit(1);
    });
});
