import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat";
import { connectRedis } from "./db/redisClient";

console.log("🚀 Starting AI Live Chat Backend...");

dotenv.config();
console.log("✅ Environment variables loaded");

const app = express();

app.use(cors());
app.use(express.json());

console.log("✅ Middlewares registered (CORS, JSON)");

// Connect Redis
connectRedis();
console.log("⚠️ Redis connection skipped (commented)");

// Routes
app.use("/api/chat", (req, res, next) => {
  console.log(`📩 Incoming request: ${req.method} ${req.originalUrl}`);
  next();
}, chatRoutes);

app.get("/", (req, res) => {
  console.log("🏠 Root route hit");
  res.send("AI Live Chat Backend is running 🚀");
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("❌ Global Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
