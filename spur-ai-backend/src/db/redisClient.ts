import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

console.log("🔄 Initializing Redis client...");

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

// Core events
redisClient.on("connect", () => {
  console.log("🟡 Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("✅ Redis connected and ready");
});

redisClient.on("reconnecting", () => {
  console.log("🔁 Redis reconnecting...");
});

redisClient.on("end", () => {
  console.log("🔴 Redis connection closed");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

// Safe connect function
export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("🚀 Redis connection established");
  } catch (error) {
    console.error("❌ Failed to connect Redis:", error);
  }
};
