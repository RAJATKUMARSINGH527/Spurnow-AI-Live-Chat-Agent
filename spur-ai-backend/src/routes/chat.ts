import express from "express";
import { query } from "../db/client";
import { redisClient } from "../db/redisClient";
import { generateReply } from "../services/llmService";

const router = express.Router();

// POST /api/chat/message - send a message to AI
router.post("/message", async (req, res) => {
  const startTime = Date.now();
  console.log("\n📩 New /api/chat/message request");

  const { message, sessionId } = req.body;
  console.log("🧾 Payload:", { message, sessionId });

  if (!message || message.trim() === "") {
    console.log("⚠️ Empty message received, returning error");
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  try {
    let conversationId = sessionId;

    // 1️⃣ Create new conversation if needed
    if (!conversationId) {
      console.log("🆕 Creating new conversation...");
      const conv = await query(
        "INSERT INTO conversations DEFAULT VALUES RETURNING id"
      );
      conversationId = conv.rows[0].id;
      console.log("✅ New conversationId:", conversationId);
    } else {
      console.log("🔁 Using existing conversationId:", conversationId);
    }

    // 2️⃣ Fetch conversation history
    console.log("📚 Fetching conversation history...");
    const historyRes = await query(
      "SELECT sender, text FROM messages WHERE conversation_id = $1 ORDER BY timestamp ASC",
      [conversationId]
    );

    const history = historyRes.rows.map((m: any) => ({
      sender: m.sender,
      text: m.text,
    }));

    console.log(`📜 History length: ${history.length}`);
    console.log("📜 History content:", history);

    // 3️⃣ Redis cache check
    const cacheKey = `conv:${conversationId}:msg:${message}`;
    console.log("🔍 Checking Redis cache:", cacheKey);

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("⚡ Cache HIT — returning cached reply");
      return res.json({
        reply: cached + " (from cache)",
        sessionId: conversationId,
      });
    }

    console.log("🐢 Cache MISS — calling LLM");

    // 4️⃣ Call LLM (mock/free reply)
    const reply = await generateReply(history, message);
    console.log("🤖 LLM reply generated:", reply);

    // 5️⃣ Save user message to DB
    console.log("💾 Saving user message to PostgreSQL...");
    await query(
      "INSERT INTO messages (conversation_id, sender, text) VALUES ($1, $2, $3)",
      [conversationId, "user", message]
    );

    // 6️⃣ Save AI reply to DB
    console.log("💾 Saving AI reply to PostgreSQL...");
    await query(
      "INSERT INTO messages (conversation_id, sender, text) VALUES ($1, $2, $3)",
      [conversationId, "ai", reply]
    );

    // 7️⃣ Save AI reply to Redis cache
    await redisClient.setEx(cacheKey, 600, reply); // 10 min cache
    console.log("📦 Reply cached for 10 minutes");

    const totalTime = Date.now() - startTime;
    console.log(`⏱️ Request completed in ${totalTime}ms\n`);

    // 8️⃣ Respond to client
    res.json({ reply, sessionId: conversationId });
  } catch (err) {
    console.error("🔥 Chat route error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /api/chat/history/:sessionId - fetch full conversation
router.get("/history/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  console.log(`\n📜 Fetching history for session: ${sessionId}`);

  try {
    const result = await query(
      "SELECT sender, text, timestamp FROM messages WHERE conversation_id = $1 ORDER BY timestamp ASC",
      [sessionId]
    );

    console.log(`✅ History fetched — ${result.rows.length} messages`);
    console.log("📜 Messages:", result.rows);

    res.json({
      sessionId,
      messages: result.rows,
    });
  } catch (err) {
    console.error("❌ History fetch error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
