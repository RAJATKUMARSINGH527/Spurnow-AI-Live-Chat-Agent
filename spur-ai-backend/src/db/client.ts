import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log("🔄 Initializing PostgreSQL connection...");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Pool events (real pro stuff)
pool.on("connect", () => {
  console.log("✅ PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PG error", err);
  process.exit(1);
});

// Query wrapper with logs
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    console.log("📤 Executing Query:", text);
    if (params) console.log("📦 Params:", params);

    const res = await pool.query(text, params);

    const duration = Date.now() - start;
    console.log(`📥 Query Success (${duration}ms) - Rows: ${res.rowCount}`);

    return res;
  } catch (error) {
    console.error("❌ Query Failed:", text);
    console.error("❌ Error:", error);
    throw error;
  }
}
