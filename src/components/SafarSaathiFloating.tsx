import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Compass, AlertCircle, ShieldCheck, CreditCard, Sparkles, AlertTriangle } from "lucide-react";
import { ChatMessage } from "../types";

export default function SafarSaathiFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message from SafarSaathi AI
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          text: "Namaste! 🙏 I am SafarSaathi AI, your personal Indian travel buddy. Chalo, let's plan your perfect adventure! Ask me anything about routes, budget planning, local temple rules, street food, UPI access, safety, or hidden spots! How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [messages]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Quick suggestions for easy interactive taps
  const quickPrompts = [
    { label: "Temple Etiquette 🛕", text: "What is the proper dress code and etiquette when visiting temples in India?" },
    { label: "Avoid Scams 🛡️", text: "What are some common travel scams in India and how do I avoid them?" },
    { label: "UPI & ATMs 💳", text: "Are digital payments like UPI widely accepted for street food and rickshaws?" },
    { label: "Women Safety 🚺", text: "What are your top safety recommendations for solo female travelers in India?" },
    { label: "Offline Travel 🗺️", text: "How should I plan for network issues and offline travel in remote valleys?" },
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("SafarSaathi AI is taking a rest right now. Please try again.");
      }

      const data = await response.json();
      
      const replyMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: data.text,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, replyMsg]);
    } catch (err: any) {
      setError(err.message || "Network error. Please make sure your server is active.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="safarsaathi-floating">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-4 w-92 md:w-104 h-144 bg-white/40 backdrop-blur-xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-white/50"
            role="dialog"
            aria-label="SafarSaathi AI Assistant"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Compass className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base flex items-center gap-1.5">
                    SafarSaathi AI <span className="text-[10px] bg-orange-400 text-slate-900 px-1.5 py-0.5 rounded-full font-mono font-bold">EXPERT</span>
                  </h3>
                  <p className="text-xs text-white/85">Your Local Indian Travel Guide</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors focus:ring-2 focus:ring-white focus:outline-none"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-white/20 backdrop-blur-md space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-sm ${
                      msg.role === "user"
                        ? "bg-sky-600 text-white rounded-tr-none font-medium shadow-md shadow-sky-500/10"
                        : "bg-white/60 backdrop-blur-md text-slate-800 rounded-tl-none border border-white/50"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <span
                      className={`text-[9px] block mt-1.5 ${
                        msg.role === "user" ? "text-sky-200 text-right" : "text-slate-400 text-left"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/60 backdrop-blur-md text-slate-850 rounded-2xl rounded-tl-none border border-white/50 p-4 shadow-sm max-w-[85%] flex items-center gap-2">
                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-xs text-slate-500 font-mono ml-1">SafarSaathi is typing...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="font-semibold">{error}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Drawer when chat is fresh or prompt input empty */}
            {input.trim() === "" && (
              <div className="px-4 py-2.5 bg-white/30 backdrop-blur-md border-t border-white/30">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2 font-mono">Suggested Questions</p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p.text)}
                      className="px-3 py-1.5 bg-white/60 hover:bg-white text-slate-700 hover:text-sky-600 border border-white/50 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap backdrop-blur-xs transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-white/40 backdrop-blur-md border-t border-white/30 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask SafarSaathi... (e.g. Kedarnath crowd?)"
                className="flex-1 px-4 py-2.5 bg-white/60 border border-white/60 rounded-full text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 shadow-inner transition-all font-sans"
                disabled={isLoading}
                aria-label="Message prompt"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-sky-600 hover:bg-sky-700 disabled:bg-white/40 disabled:text-slate-400 text-white rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="h-14 px-5 bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 text-white rounded-full shadow-lg flex items-center gap-2.5 font-display font-medium tracking-wide border border-white/20 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-sky-500/30"
        aria-label="Ask SafarSaathi Assistant"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-400 rounded-full border border-sky-500" />
        </div>
        <span>Ask SafarSaathi AI</span>
      </motion.button>
    </div>
  );
}
