import { TELEGRAM_BOT_TOKEN } from "../constants/index.js";
import axios from "axios";

export const telegram = async (req, res) => {
  try {
    res.status(200).json({
      message: "hehe",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const telegramSummary = async (req, res) => {
  try {
    const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
    console.log(JSON.stringify(req));
    if (req.method !== "POST") {
      return res.status(200).json({ message: "summary endpoint" });
    }

    const { chat_id } = req.body; // bạn gửi từ webhook

    if (!chat_id) {
      return res.status(400).json({ error: "Missing chat_id" });
    }

    // Gửi tin nhắn về Telegram
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chat_id,
      text: "hello từ bot 👋",
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("summary error:", error);
    return res.status(500).json({ error: "summary failed" });
  }
};
