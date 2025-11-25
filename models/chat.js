import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true },
    name: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);