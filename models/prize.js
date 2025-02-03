import mongoose from "mongoose";

const prizeSchema = new mongoose.Schema(
  {
    prize: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Prize = mongoose.model("Prize", prizeSchema);
