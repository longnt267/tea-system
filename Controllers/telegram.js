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

// export const telegramSummary = async (req, res) => {
//   try {

//     console.log("START TEST");
//     // ---- 2) Query test ----
//     console.log("RUNNING QUERY...");
//     const historyDocs = await Chat.find({})
//       .sort({ createdAt: -1 })
//       .limit(50)
//       .lean();

//     console.log("FOUND DOCS:", historyDocs.length);
//     console.log(14);
//      // để đúng thứ tự từ cũ → mới
//     console.log(15)

//     const replyText = historyDocs
//       .map((m) => `${m.name}: ${m.text}`)
//       .join("\n");

//     // ============================
//     // 4) TẠO PROMPT CHO GEMINI
//     // ============================
//     const prompt =
//       "Hãy tóm tắt đoạn hội thoại sau THEO TỪNG NGƯỜI GỬI.\n" +
//       "Với mỗi người, hãy viết 1–2 câu mô tả ngắn gọn họ đã nói những gì.\n\n" +
//       "Format output:\n" +
//       "TênNgười1: nội dung chính họ nói\n" +
//       "TênNgười2: nội dung chính họ nói\n\n" +
//       "Đoạn hội thoại:\n\n" +
//       replyText;

//     console.log("PROMPT:", prompt);

//     // ============================
//     // 5) GỌI GEMINI API
//     // ============================
//     const aiResp = await axios.post(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
//       {
//         contents: [
//           {
//             parts: [{ text: prompt }],
//           },
//         ],
//       },
//       {
//         headers: {
//           "x-goog-api-key": API_KEY,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("aiResp",aiResp);
//     console.log("-------------------");

//     const aiSummary =
//     aiResp.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Không tóm tắt được.";
//     // ============================
//     // 6) GỬI KẾT QUẢ VỀ TELEGRAM
//     // ============================
//     await axios.post(`${TELEGRAM_API}/sendMessage`, {
//       chat_id: '-1003398663266',
//       text: aiSummary,
//     });
//     res.status(200).send("OK TEST"); // để Telegram không retry

//   } catch (err) {
//     console.error("Error in test:", err);
//   }
// };

export const telegramSummary = async (req, res) => {
  res.status(200).send("OK");
  try {
    const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
    const BOT_USERNAME = "longsummary_bot";

    const update = req.body;
    console.log("WEBHOOK UPDATE:", JSON.stringify(update));
    console.log(1);
    if (!update.message) return;
    console.log(2);

    const msg = update.message;
    console.log(3);

    // Bỏ qua tin từ bot
    if (msg.from?.is_bot) return;
    console.log(4);

    if (!msg.text) return;
    console.log(5);

    const text = msg.text;
    const chatId = msg.chat.id;
    console.log(6);

    // Lấy tên người gửi
    let name =
      (msg.from.first_name || "") +
      (msg.from.last_name ? " " + msg.from.last_name : "");
    console.log(7);

    if (!name.trim()) name = msg.from.username || "Unknown";
    console.log(8);

    const isControlMessage =
      text.includes(`@${BOT_USERNAME}`) || text.includes("/summary");
    console.log(9);

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
          { sort: { _id: 1 } } // XÓA THEO _id CŨ NHẤT
        );
      }
    }
    console.log(10);

    // ============================
    // 2) Kiểm tra tag bot + có /summary
    // ============================
    const isTagged =
      text.includes(`@${BOT_USERNAME}`) ||
      text.includes(`/summary@${BOT_USERNAME}`);
    console.log(11);

    if (!isTagged) return;
    console.log(12);

    const isSummary = text.includes("/summary");
    if (!isSummary) return;
    console.log(13);
    console.log("chatId", chatId);

    // ============================
    // 3) LẤY LỊCH SỬ CHAT
    // ============================
    const historyDocs = await Chat.find({ chatId })
      .sort({ createdAt: -1 }) // newest → oldest
      .limit(50)
      .lean();
    console.log(15);

    const replyText = historyDocs.map((m) => `${m.name}: ${m.text}`).join("\n");

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
    console.log("aiResp", aiResp);
    console.log("-------------------");

    const aiSummary =
      aiResp.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Không tóm tắt được.";
    console.log("aiResp?.text", aiResp?.text);
    // ============================
    // 6) GỬI KẾT QUẢ VỀ TELEGRAM
    // ============================
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: aiSummary,
    });
    // Đảm bảo Telegram không retry webhook
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
