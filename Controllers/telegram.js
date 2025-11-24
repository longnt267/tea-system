import { TELEGRAM_BOT_TOKEN, API_KEY } from "../constants/index.js";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";

export const telegram = async (req, res) => {
  try {
    res.status(200).json({
      message: "hehe",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const messageStore = {};
const ai = new GoogleGenAI({ apiKey: API_KEY });
export const telegramSummary = async (req, res) => {
  try {
    const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

    // Luôn trả về OK để Telegram không retry
    res.status(200).send("OK");
    const BOT_USERNAME = "longsummary_bot";
    const update = req.body;
    console.log("WEBHOOK UPDATE:", JSON.stringify(update));
    if (!update.message) return;
    const msg = update.message;

    // 2) Bỏ qua tin nhắn từ BOT
    if (msg.from?.is_bot) return;
    // -------------------------------
    // 1) Không có message ⇒ bỏ qua
    // -------------------------------
    if (!update.message || !update.message.text) return;

    const text = update.message.text;
    const chatId = update.message.chat.id;
    let name =
      (msg.from.first_name || "") +
      (msg.from.last_name ? " " + msg.from.last_name : "");
    const raw = text || "";
    if (typeof text === "string" && text.trim() !== "") {
      const isControlMessage =
        text.includes(`@${BOT_USERNAME}`) || text.includes("/summary");

      if (!isControlMessage) {
        // Nếu group chưa có list
        if (!messageStore[chatId]) {
          messageStore[chatId] = [];
        }

        // LƯU message
        messageStore[chatId].push({
          name,
          text,
        });

        // Giới hạn 10 tin
        if (messageStore[chatId].length > 50) {
          messageStore[chatId].shift();
        }
      }
    }
    if (!name.trim()) {
      name = msg.from.username || "Unknown";
    }
    // -------------------------------
    // 2) Kiểm tra bot được tag
    // -------------------------------
    const isTagged =
      text.includes(`@${BOT_USERNAME}`) ||
      text.includes(`/summary@${BOT_USERNAME}`);

    if (!isTagged) return;

    // -------------------------------
    // 3) Kiểm tra có /summary
    // -------------------------------
    const isSummary = text.includes("/summary");

    if (!isSummary) return;
    const history = messageStore[chatId] || [];

    let replyText = "";
    replyText += history.map((m) => `${m.name}: ${m.text}`).join("\n");
    // -------------------------------
    // 4) BOT REPLY "haha"
    // -------------------------------

    const prompt = `
      Hãy tóm tắt đoạn hội thoại sau THEO TỪNG NGƯỜI GỬI.
      Với mỗi người, hãy viết 1–2 câu mô tả ngắn gọn họ đã nói những gì.

      Format output:
      Đoạn hội thoại cần tóm tắt:

      ${replyText}
    `;
    console.log(prompt);
    const aiResp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const aiSummary = aiResp?.text || "Không thể tạo tóm tắt.";

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: aiSummary,
    });
  } catch (err) {
    console.error("Error in webhook:", err);
    // Telegram không retry vì mình đã response 200 trước đó
  }
};
