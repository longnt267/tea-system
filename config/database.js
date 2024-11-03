import mongoose from "mongoose";
import { MONGODB_URI } from "../constants/index.js";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Changed to true
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB Connected Successfully!");

        // Setup connection event handlers
        mongoose.connection.on("error", (err) => {
          console.error("Mongoose connection error:", err);
          cached.conn = null;
          cached.promise = null;
        });

        mongoose.connection.on("disconnected", () => {
          console.log("Mongoose connection is disconnected");
          cached.conn = null;
          cached.promise = null;
        });

        return mongoose;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    throw err;
  }
}

// Optional: Graceful shutdown handler
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("Mongoose connection closed through app termination");
    process.exit(0);
  } catch (err) {
    console.error("Error closing Mongoose connection:", err);
    process.exit(1);
  }
});
