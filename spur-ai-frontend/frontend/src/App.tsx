import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";


// // ==============================
// // Types
// // ==============================
type Message = {
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
};

type ChatHistoryResponse = {
  sessionId: string;
  messages: { sender: "user" | "ai"; text: string; timestamp: string }[];
};

// // ==============================
// // React Component
// // ==============================

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  

  useEffect(() => {
    if (!sessionId) return;
    const fetchHistory = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await axios.get<ChatHistoryResponse>(
          `${API_URL}/api/chat/history/${sessionId}`,
        );

        console.log("✅ Chat history fetched successfully");
        setMessages(res.data.messages.map((m) => ({ ...m })));
      } catch (err) {
        console.error("❌ Failed to fetch chat history:", err);
      }
    };
    fetchHistory();
  }, [sessionId]);

   // ==============================
//   // Send user message and get AI reply
//   // ==============================

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    console.log(`📝 Sending user message: "${input}"`);
    setInput("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${API_URL}/api/chat/message`, {
        message: input,
        sessionId,
      });

      console.log("✅ Message sent successfully");
      

      const aiMessage: Message = {
        sender: "ai",
        text: res.data.reply,
        timestamp: new Date().toISOString(),
      };
      console.log("🤖 AI reply received:", res.data.reply);

      setMessages((prev) => [...prev, aiMessage]);
      setSessionId(res.data.sessionId);
    } catch (err) {
      console.error("❌ Error sending message or receiving AI reply:", err);
      const errorMsg: Message = {
        sender: "ai",
        text: "Error: Could not get a reply from AI.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // JSX UI
  // ==============================

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-2 sm:p-4 font-sans text-slate-200 selection:bg-cyan-500/30 relative overflow-x-hidden">
      <div className="absolute top-0 -left-4 w-48 h-48 md:w-72 md:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-48 h-48 md:w-72 md:h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-2xl h-[95dvh] md:h-[85vh] flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden relative">
        <header className="px-4 py-3 md:px-6 md:py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-tr from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base md:text-lg tracking-tight">
                Spur AI{" "}
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded ml-1 uppercase">
                  Pro
                </span>
              </h1>

              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>{" "}
                Online & Ready
              </p>
            </div>
          </div>
        </header>

        {/* Chat Area: Mobile responsive padding */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 md:space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Max-width mobile pe 90% desktop pe 80% */}
                <div
                  className={`flex items-end gap-2 max-w-[90%] md:max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`p-2 rounded-full ${msg.sender === "user" ? "bg-cyan-500" : "bg-slate-700"} hidden xs:block`}
                  >
                    {msg.sender === "user" ? (
                      <User size={14} />
                    ) : (
                      <Bot size={14} />
                    )}
                  </div>

                  <div
                    className={`relative px-4 py-2.5 md:py-3 rounded-2xl text-[13px] md:text-sm leading-relaxed shadow-xl ${
                      msg.sender === "user"
                        ? "bg-linear-to-br from-cyan-600 to-blue-700 text-white rounded-br-none"
                        : "bg-white/10 text-slate-200 backdrop-blur-md border border-white/5 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                    {msg.timestamp && (
                      <div
                        className={`text-[9px] mt-1 opacity-50 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start items-center gap-3"
            >
              <div className="p-2 bg-slate-700 rounded-full animate-spin">
                <Loader2 size={14} className="text-cyan-400" />
              </div>
              <span className="text-xs text-slate-400 italic">Thinking...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3 md:p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything..."
              className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 py-3.5 md:py-4 pr-12 md:pr-14 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-500 text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="absolute right-1.5 md:right-2 p-2 md:p-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 text-white rounded-lg md:rounded-xl transition-all shadow-lg"
            >
              <Send size={18} />
            </button>
          </div>
          {/* Tumhara Original Footer Text */}
          <p className="text-center text-[10px] text-slate-500 mt-3">
            Powered by Spur Advanced Intelligence Model 2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
