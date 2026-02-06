// import OpenAI from "openai";
// import dotenv from "dotenv";
// import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// dotenv.config();

// console.log("🧠 Initializing OpenAI client...");

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// type ChatMessage = {
//   sender: "user" | "ai";
//   text: string;
// };

// export async function generateReply(
//   history: ChatMessage[],
//   userMessage: string
// ) {
//   const startTime = Date.now();

//   console.log("🤖 generateReply called");
//   console.log("🧾 User message:", userMessage);
//   console.log("📜 History length:", history.length);

//   const systemPrompt = `
// You are a helpful support agent for a small e-commerce store.
// Answer clearly and concisely.

// Store info:
// - Shipping: We ship worldwide within 5–7 business days.
// - Returns: 30-day return policy.
// - Support hours: 9am – 6pm EST.
// `;

//   const messages: ChatCompletionMessageParam[] = [
//     {
//       role: "system",
//       content: systemPrompt,
//     },
//     ...history.map((m): ChatCompletionMessageParam => ({
//       role: m.sender === "user" ? "user" : "assistant",
//       content: m.text,
//     })),
//     {
//       role: "user",
//       content: userMessage,
//     },
//   ];

//   try {
//     console.log("📡 Sending request to OpenAI...");
//     console.log("🧮 Total messages:", messages.length);

//     const response = await client.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages,
//       max_tokens: 300,
//     });

//     const reply =
//       response.choices[0].message.content ??
//       "Sorry, I couldn't generate a response.";

//     const totalTime = Date.now() - startTime;

//     console.log("✅ OpenAI response received");
//     console.log("⏱️ LLM latency:", totalTime + "ms");

//     // Optional: token visibility (if present)
//     if (response.usage) {
//       console.log("🔢 Token usage:", {
//         prompt: response.usage.prompt_tokens,
//         completion: response.usage.completion_tokens,
//         total: response.usage.total_tokens,
//       });
//     }

//     console.log("🗣️ AI Reply (first 100 chars):", reply.slice(0, 100));

//     return reply;
//   } catch (error: any) {
//     console.error("🔥 LLM Error:");

//     if (error?.response) {
//       console.error("Status:", error.response.status);
//       console.error("Data:", error.response.data);
//     } else {
//       console.error(error.message || error);
//     }

//     return "Sorry, something went wrong while generating the response.";
//   }
// }


type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

const replyTemplates = [
  "Sure! Here's something about: ",
  "I understand, regarding that: ",
  "Let me explain: ",
  "Of course! Here's what I can tell you: ",
  "Thanks for asking! About that: ",
];

export async function generateReply(
  history: ChatMessage[],
  userMessage: string
) {
  console.log("🤖 Dynamic Mock generateReply called");

  // Combine last 3 messages for context
  const lastMessages = history.slice(-3).map(
    (m) => `${m.sender === "user" ? "User" : "AI"}: ${m.text}`
  );

  const context = lastMessages.join("\n");

  // Randomly pick a template
  const template = replyTemplates[Math.floor(Math.random() * replyTemplates.length)];

  // Construct a reply
  const reply = `${template}"${userMessage}"`;

  console.log("🧾 User message:", userMessage);
  console.log("📜 History length:", history.length);
  console.log("📜 Context:\n", context);
  console.log("🗣️ AI Reply:", reply);

  return reply;
}
