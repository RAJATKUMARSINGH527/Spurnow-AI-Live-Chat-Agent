# Spurnow-AI-Live-Chat-Agent

A simple web app that simulates a customer support chat where an AI agent answers user questions using OpenAI GPT-4. Built with **React + TypeScript + Tailwind CSS** on the frontend, and **Node.js + TypeScript + Express** on the backend. Messages are persisted in **PostgreSQL** and optionally cached in **Redis**.

---

## **Demo**
- Deployed Frontend URL: [[https://spurnow-ai-live-chat-agent.vercel.app/](https://spurnow-ai-live-chat-agent.vercel.app/)]
- Deployed Backend URL: [[https://spurnow-ai-live-chat-agent.onrender.com](https://spurnow-ai-live-chat-agent.onrender.com)]

---

## **Tech Stack**
| Layer        | Technology | Purpose |
|--------------|------------|---------|
| Frontend     | React + TypeScript + Tailwind CSS | Chat UI, responsive, modern look |
| Backend      | Node.js + TypeScript + Express | REST API, message handling, LLM integration |
| Database     | PostgreSQL | Persist conversations & messages |
| Cache        | Redis (optional) | Speed up repeated queries, reduce LLM calls |
| LLM          | OpenAI GPT-4 | Generate AI responses, context-aware |
| HTTP Client  | Axios | Communicate frontend → backend |
| Environment  | dotenv | API keys & DB connection (secrets) |

---

## **Features**
- Live chat interface with scrollable message list
- Clear distinction between user & AI messages
- Auto-scroll to latest message
- “Agent is typing…” indicator
- Press **Enter** to send message
- Session/conversation support with `conversationId`
- Persist messages & conversation in PostgreSQL
- Context-aware AI replies (conversation history + FAQs)
- Redis caching for repeated messages
- Error handling & input validation
- Modern UI with Tailwind CSS

---

## **Setup Instructions (Local)**

### **1. Clone Repo**
```bash
git clone https://github.com/RAJATKUMARSINGH527/Spurnow-AI-Live-Chat-Agent.git
cd Spurnow-AI-Live-Chat-Agent
```

2. Backend Setup

```bash
cd spur-ai-backend
npm install
```

**Create .env file with:**

```ini
OPENAI_API_KEY=sk-xxxx
DATABASE_URL=postgres://user:password@localhost:5432/llm_chat
REDIS_URL=redis://localhost:6379
PORT=5000
```

**Set up PostgreSQL tables:**

```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INT REFERENCES conversations(id),
  sender VARCHAR(10), -- "user" | "ai"
  text TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

**Start backend server:**

```bash
npm run dev
```

**3. Frontend Setup**

```bash
cd spur-ai-frontend
npm install
cd frontend
npm run dev
```

- Open `http://localhost:5173` in your browser

## Architecture Overview

**Backend**

- **Routes**: `/api/chat/message` → Handles incoming user messages

- **Services**: `llmService.ts` → Wraps OpenAI GPT API call

- **DB Layer**: `client.ts` → PostgreSQL queries

- **Cache Layer**: `redisClient.ts` → Optional Redis caching for repeated messages

**Frontend**

**React Components:**

- **App.tsx** → Chat interface, message list, input box

- **State Management**: `useState` for messages, input, sessionId

- **Features**: Auto-scroll, typing indicator, send on Enter


**LLM Integration Notes**

**Provider**: OpenAI GPT-4

**Prompt Design**:

```text
You are a helpful support agent for a small e-commerce store.
Answer clearly and concisely.
Store info:
- Shipping: We ship worldwide within 5-7 business days.
- Returns: 30-day return policy.
- Support hours: 9am - 6pm EST.
```

- **Context:**

   - Includes all past messages in the current conversation

   - Provides FAQ context for reliable answers

- **Error Handling**: API failures return friendly messages

- **Max Tokens**: 300 (configurable for cost control)


## Trade-offs / If I had more time

- Could add `multi-session user authentication`
- Could implement `better prompt engineering` with dynamic knowledge base
- Could enhance `UI animations & UX`
- Could add `cost optimization`, caching strategies, rate-limiting
- Could add `message search / export chat history`

## Non-Requirements

- No Shopify / Facebook / Instagram / WhatsApp integrations
- No auth/login required
- No fancy design system required
- No Kubernetes / Docker wizardry

## Running Notes

- Make sure `PostgreSQL` and `Redis` are running
- .env file must contain valid `OpenAI API key`
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`