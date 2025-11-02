import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, Lightbulb, DollarSign, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_KEY;

const AiAdvisor = ({ appliances, totalKWh, estimatedBill }) => {
  const { darkMode } = useTheme();
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMsg = { sender: "user", text: userInput };
    setChatHistory((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // 🧩 Detect simple greetings
      const isGreeting = /^(hi|hello|hey|salam|assalamu|asalamu)/i.test(
        userInput.trim()
      );

      // 🧠 Choose system prompt dynamically
      const systemPrompt = isGreeting
        ? "You are EcoVolt 🌱, a friendly assistant from EcoVolt - Powering a Greener Pakistan. Reply briefly and warmly to greetings, without giving energy-saving tips."
        : `
          You are EcoVolt 🌱 — a friendly energy advisor from EcoVolt - Powering a Greener Pakistan, helping users in Pakistan (especially Karachi).
          Help users save electricity, understand K-Electric bills, and plan efficient appliance usage.
          Current user stats:
          - Total daily energy: ${totalKWh.toFixed(2)} kWh/day
          - Estimated monthly bill: Rs ${estimatedBill}
          - Appliances: ${
            appliances.map((a) => a.name).join(", ") || "No appliances yet"
          }.
          Keep your tone conversational and helpful, and use simple language.
        `;

      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userInput },
          ],
        }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const aiReply =
        data?.choices?.[0]?.message?.content?.trim() ||
        "⚠️ I couldn’t generate a response right now. Please try again.";

      setChatHistory((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ Couldn’t connect to AI service. Please check your API key or try later.",
        },
      ]);
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const quickActions = [
    { icon: <DollarSign className="w-4 h-4" />, text: "Reduce bills", prompt: "How can I reduce my electricity bills?" },
    { icon: <Lightbulb className="w-4 h-4" />, text: "Save energy", prompt: "Give me tips to save energy at home" },
    { icon: <Sun className="w-4 h-4" />, text: "Solar planning", prompt: "Should I install solar panels?" },
    { icon: <Sparkles className="w-4 h-4" />, text: "Optimize usage", prompt: "How can I optimize my appliance usage?" },
  ];

  const handleQuickAction = (prompt) => {
    setUserInput(prompt);
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-xl border transition-all duration-300 h-full flex flex-col ${
        darkMode
          ? "bg-gray-800/90 border-gray-700/50 backdrop-blur-xl"
          : "bg-white border-gray-200/80 backdrop-blur-xl"
      }`}
    >
      {/* Header - Minimal */}
      <div
        className={`p-1.5 sm:p-2 border-b flex-shrink-0 ${
          darkMode
            ? "bg-gradient-to-r from-green-900/30 to-emerald-900/20 border-gray-700/50"
            : "bg-gradient-to-r from-green-50 to-emerald-50 border-gray-200/50"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
              darkMode
                ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-md shadow-green-500/30"
                : "bg-gradient-to-br from-green-500 to-emerald-600 shadow-md"
            }`}
          >
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <h2
            className={`text-sm sm:text-base font-bold ${
              darkMode ? "text-green-400" : "text-green-600"
            }`}
          >
            Chat with EcoVolt AI
          </h2>
        </div>
      </div>

      {/* Quick Actions - Show only when chat is empty */}
      {chatHistory.length === 0 && (
        <div className="p-1.5 sm:p-2 flex-shrink-0">
          <p
            className={`text-[10px] sm:text-xs font-medium mb-1.5 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Quick actions:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAction(action.prompt)}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-md transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-green-400 border border-gray-600/50"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-green-600 border border-gray-200"
                }`}
              >
                <div
                  className={`p-1 rounded-md ${
                    darkMode
                      ? "bg-green-500/20 text-green-400"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {action.icon}
                </div>
                <span className="text-[9px] sm:text-[10px] font-medium text-center leading-tight">
                  {action.text}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div
        className={`overflow-y-auto transition-all duration-300 flex-1 min-h-0 ${
          darkMode
            ? "bg-gradient-to-b from-gray-800/50 to-gray-900/30"
            : "bg-gradient-to-b from-gray-50/50 to-white"
        }`}
      >
        <div className="p-1.5 sm:p-2 space-y-1.5 sm:space-y-2">
          <AnimatePresence>
            {chatHistory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[6rem]"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                    darkMode
                      ? "bg-green-500/20 text-green-400"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <p
                  className={`text-center text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <span className="font-semibold text-green-500">💬 Say hello</span>
                  <br />
                  <span className="text-[10px]">or choose a quick action</span>
                </p>
              </motion.div>
            ) : (
              chatHistory.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        darkMode
                          ? "bg-gradient-to-br from-green-500 to-emerald-600"
                          : "bg-gradient-to-br from-green-500 to-emerald-600"
                      }`}
                    >
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] sm:max-w-[75%] px-2.5 py-2 rounded-xl shadow-sm transition-all duration-200 ${
                      msg.sender === "user"
                        ? darkMode
                          ? "bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-br-md"
                          : "bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-br-md"
                        : darkMode
                        ? "bg-gray-700/80 text-gray-100 rounded-bl-md border border-gray-600/50"
                        : "bg-white text-gray-900 rounded-bl-md border border-gray-200 shadow-sm"
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-snug whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>
                  {msg.sender === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">U</span>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
            >
              <div className="flex gap-1">
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <motion.span
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
              </div>
              <span className="italic">EcoVolt AI is thinking...</span>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div
        className={`p-1.5 sm:p-2 border-t flex-shrink-0 ${
          darkMode ? "bg-gray-800/90 border-gray-700/50" : "bg-white border-gray-200/50"
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-1.5">
          <input
            type="text"
            placeholder="Ask about energy, bills, solar..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs sm:text-sm transition-all min-h-[36px] sm:min-h-[40px] ${
              darkMode
                ? "bg-gray-700/50 border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            } outline-none`}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={loading || !userInput.trim()}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all min-h-[36px] sm:min-h-[40px] min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm ${
              loading || !userInput.trim()
                ? "bg-gray-400 cursor-not-allowed text-white"
                : darkMode
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
                : "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <Send size={18} />
            <span>Send</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AiAdvisor;
