import { TELEGRAM_BOT_TOKEN, API_KEY } from "../constants/index.js";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import { Chat } from "../models/chat.js";

export const telegram = async (req, res) => {
  try {
    res.status(200).json({
      message: "hehe",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const telegramSummary = async (req, res) => {
  try {
    const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
    const BOT_USERNAME = "longsummary_bot";

    // Đảm bảo Telegram không retry webhook
    res.status(200).send("OK");

    const update = req.body;
    console.log("WEBHOOK UPDATE:", JSON.stringify(update));

    if (!update.message) return;

    const msg = update.message;

    // Bỏ qua tin từ bot
    if (msg.from?.is_bot) return;

    if (!msg.text) return;

    const text = msg.text;
    const chatId = msg.chat.id;

    // Lấy tên người gửi
    let name =
      (msg.from.first_name || "") +
      (msg.from.last_name ? " " + msg.from.last_name : "");

    if (!name.trim()) name = msg.from.username || "Unknown";

    const isControlMessage =
      text.includes(`@${BOT_USERNAME}`) || text.includes("/summary");

    // ============================
    // 1) LƯU TIN NHẮN VÀO DATABASE
    // ============================
    if (!isControlMessage) {
      await Chat.create({ chatId, name, text });

      // giữ tối đa 50 tin nhắn mỗi group
      const count = await Chat.countDocuments({ chatId });
      if (count > 50) {
        await Chat.findOneAndDelete(
          { chatId },
          { sort: { createdAt: 1 } } // xóa tin cũ nhất
        );
      }

      return;
    }

    // ============================
    // 2) Kiểm tra tag bot + có /summary
    // ============================
    const isTagged =
      text.includes(`@${BOT_USERNAME}`) ||
      text.includes(`/summary@${BOT_USERNAME}`);

    if (!isTagged) return;

    const isSummary = text.includes("/summary");
    if (!isSummary) return;

    // ============================
    // 3) LẤY LỊCH SỬ CHAT
    // ============================
    const historyDocs = await Chat.find({ chatId })
      .sort({ createdAt: -1 })
      .limit(50);

    const history = historyDocs.reverse(); // để đúng thứ tự từ cũ → mới

    const replyText = history
      .map((m) => `${m.name}: ${m.text}`)
      .join("\n");

    // ============================
    // 4) TẠO PROMPT CHO GEMINI
    // ============================
    const prompt =
      "Hãy tóm tắt đoạn hội thoại sau THEO TỪNG NGƯỜI GỬI.\n" +
      "Với mỗi người, hãy viết 1–2 câu mô tả ngắn gọn họ đã nói những gì.\n\n" +
      "Format output:\n" +
      "TênNgười1: nội dung chính họ nói\n" +
      "TênNgười2: nội dung chính họ nói\n\n" +
      "Đoạn hội thoại:\n\n" +
      replyText;

    console.log("PROMPT:", prompt);

    // ============================
    // 5) GỌI GEMINI API
    // ============================
    const aiResp = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "x-goog-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const aiSummary =
      aiResp?.text ||
      "Không thể tạo tóm tắt.";

    // ============================
    // 6) GỬI KẾT QUẢ VỀ TELEGRAM
    // ============================
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: aiSummary,
    });
  } catch (err) {
    console.error("Error in webhook:", err);
  }
};

// export const telegramSummary = async (req, res) => {
//   const messageStore = {};
//   try {
//     const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

//     // Luôn trả về OK để Telegram không retry
//     res.status(200).send("OK");
//     const BOT_USERNAME = "longsummary_bot";
//     const update = req.body;
//     console.log("WEBHOOK UPDATE:", JSON.stringify(update));
//     if (!update.message) return;
//     const msg = update.message;

//     // 2) Bỏ qua tin nhắn từ BOT
//     if (msg.from?.is_bot) return;
//     // -------------------------------
//     // 1) Không có message ⇒ bỏ qua
//     // -------------------------------
//     if (!update.message || !update.message.text) return;

//     const text = update.message.text;
//     const chatId = update.message.chat.id;
//     let name =
//       (msg.from.first_name || "") +
//       (msg.from.last_name ? " " + msg.from.last_name : "");
//     const raw = text || "";
//     if (typeof text === "string" && text.trim() !== "") {
//       const isControlMessage =
//         text.includes(`@${BOT_USERNAME}`) || text.includes("/summary");

//       if (!isControlMessage) {
//         // Nếu group chưa có list
//         if (!messageStore[chatId]) {
//           messageStore[chatId] = [];
//         }

//         // LƯU message
//         messageStore[chatId].push({
//           name,
//           text,
//         });

//         // Giới hạn 10 tin
//         if (messageStore[chatId].length > 50) {
//           messageStore[chatId].shift();
//         }
//       }
//     }
//     if (!name.trim()) {
//       name = msg.from.username || "Unknown";
//     }
//     // -------------------------------
//     // 2) Kiểm tra bot được tag
//     // -------------------------------
//     const isTagged =
//       text.includes(`@${BOT_USERNAME}`) ||
//       text.includes(`/summary@${BOT_USERNAME}`);

//     if (!isTagged) return;

//     // -------------------------------
//     // 3) Kiểm tra có /summary
//     // -------------------------------
//     const isSummary = text.includes("/summary");

//     if (!isSummary) return;
//     const history = messageStore[chatId] || [];

//     let replyText = "";
//     replyText += history.map((m) => `${m.name}: ${m.text}`).join("\n");
//     // -------------------------------
//     // 4) BOT REPLY "haha"
//     // -------------------------------

//     const prompt = `
//       Hãy tóm tắt đoạn hội thoại sau THEO TỪNG NGƯỜI GỬI.
//       Với mỗi người, hãy viết 1–2 câu mô tả ngắn gọn họ đã nói những gì.

//       Format output:
//       Đoạn hội thoại cần tóm tắt:

//       ${replyText}
//     `;
//     console.log(prompt);
//     // const aiResp = await ai.models.generateContent({
//     //   model: "gemini-2.5-flash",
//     //   contents: prompt,
//     // });
//     const aiResp = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
//       {
//         contents: prompt,
//       }
//     );
//     const aiSummary = aiResp?.text || "Không thể tạo tóm tắt.";

//     await axios.post(`${TELEGRAM_API}/sendMessage`, {
//       chat_id: chatId,
//       text: aiSummary,
//     });
//   } catch (err) {
//     console.error("Error in webhook:", err);
//     // Telegram không retry vì mình đã response 200 trước đó
//   }
// };
