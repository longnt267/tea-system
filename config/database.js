import { mongoose } from "mongoose";
import { MONGODB_URI } from "../constants/index.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // Bỏ comment nếu bạn cần đánh index
  // useFindAndModify: false, // Bỏ comment nếu bạn muốn sử dụng findOneAndUpdate()
};

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Xử lý các sự kiện kết nối
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to db");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose connection is disconnected");
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
