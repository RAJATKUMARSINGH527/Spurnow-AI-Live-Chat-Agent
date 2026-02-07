// This file contains the main logic for generating AI replies using replyTemplates.
// type ChatMessage = {
//   sender: "user" | "ai";
//   text: string;
// };

// const replyTemplates = [
//   "Sure! Here's something about: ",
//   "I understand, regarding that: ",
//   "Let me explain: ",
//   "Of course! Here's what I can tell you: ",
//   "Thanks for asking! About that: ",
// ];

// export async function generateReply(
//   history: ChatMessage[],
//   userMessage: string
// ) {
//   console.log("🤖 Dynamic Mock generateReply called");

//   // Combine last 3 messages for context
//   const lastMessages = history.slice(-3).map(
//     (m) => `${m.sender === "user" ? "User" : "AI"}: ${m.text}`
//   );

//   const context = lastMessages.join("\n");

//   // Randomly pick a template
//   const template = replyTemplates[Math.floor(Math.random() * replyTemplates.length)];

//   // Construct a reply
//   const reply = `${template}"${userMessage}"`;

//   console.log("🧾 User message:", userMessage);
//   console.log("📜 History length:", history.length);
//   console.log("📜 Context:\n", context);
//   console.log("🗣️ AI Reply:", reply);

//   return reply;
// }


// This file contains the main logic for generating AI replies using Groq's API.

import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// -------------------- Types --------------------

type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// -------------------- Main Function --------------------

export async function generateReply(
  history: ChatMessage[],
  userMessage: string
) {
  console.log("🤖 generateReply called");
  console.log("🧾 User message:", userMessage);
  console.log("📜 History length:", history.length);

  const systemPrompt = `
You are a helpful support agent for a small e-commerce store.
Answer clearly and concisely.
`;

  // 🔥 CRITICAL FIX: force return type
  const messages: GroqMessage[] = [
    { role: "system", content: systemPrompt },

    ...history.map((m): GroqMessage => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    })),

    { role: "user", content: userMessage },
  ];

  try {
    console.log("📡 Sending request to Groq...");
    console.log("🧮 Total messages:", messages.length);

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      max_tokens: 300,
    });

    const reply =
      response.choices[0]?.message?.content ??
      "Sorry, I couldn't generate a response.";

    console.log("✅ Groq response received");
    console.log("🗣️ AI Reply (first 100 chars):", reply.slice(0, 100));

    return reply;
  } catch (error: any) {
    console.error("🔥 Groq Error:");

    if (error?.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message || error);
    }

    return "Sorry, something went wrong while generating the response.";
  }
}
