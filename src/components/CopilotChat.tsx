import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, SentimentReport } from "../types";
import { MessageSquare, Send, Brain, Bot, User, Trash2, ArrowDownCircle, CornerDownLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CopilotChatProps {
  report: SentimentReport | null;
  highThinking: boolean;
}

const CHAT_SHORTCUTS = [
  "Draft email reply to negative billing feedback",
  "How can we fix the customer support issues?",
  "Draft a Slack summary of critical complaints",
  "Write a polite review response template"
];

export default function CopilotChat({ report, highThinking }: CopilotChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I am your **AI Sentiment Copilot**, an expert Customer Experience (CX) Consultant.

${
  report
    ? "I have loaded your analyzed reviews dataset and am ready to consult!"
    : "Paste and analyze customer reviews above, and I'll automatically gain full context of your report. Otherwise, ask me general CX strategy questions!"
}

**Here is what you can ask me to do:**
- 📝 *Draft personalized emails, replies, or notifications* addressing complaints.
- 💡 *Brainstorm detailed tactical resolutions* for critical customer friction points.
- 📊 *Extract and summarize core trends* and department bottlenecks.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [report, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleClearHistory = () => {
    setMessages([]);
  };

  const executeShortcut = (shortcut: string) => {
    if (isSending) return;
    sendMessage(shortcut);
  };

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsSending(true);

    // Build condensed dataset context summary for the LLM
    let datasetSummary = "";
    if (report) {
      const topComplaints = report.wordCloud.complaints.map((c) => `${c.text} (wt:${c.value})`).join(", ");
      const topPraises = report.wordCloud.praises.map((p) => `${p.text} (wt:${p.value})`).join(", ");
      const actionablePillars = report.actionableItems
        .map((a, i) => `[${i + 1}] ${a.title} (${a.impact} Impact): ${a.description}`)
        .join("\n");
      const reviewSnippets = report.reviews
        .slice(0, 15)
        .map((r) => `- [${r.sentiment.toUpperCase()} - Score ${r.score}]: ${r.text}`)
        .join("\n");

      datasetSummary = `
TOTAL REVIEWS ANALYZED: ${report.reviews.length}
AVERAGE SENTIMENT SCORE: ${Math.round(report.reviews.reduce((s, r) => s + r.score, 0) / report.reviews.length)}/100
EXECUTIVE SUMMARY BRIEFING: ${report.executiveSummary}

TOP PRAISE PHRASES: ${topPraises}
TOP COMPLAINT PHRASES: ${topComplaints}

CRITICAL SUGGESTED IMPROVEMENTS:
${actionablePillars}

SAMPLE OF INDIVIDUAL REVIEWS (CONTEXTUAL REFERENCE):
${reviewSnippets}
      `;
    }

    try {
      const chatHistory = [...messages, userMsg].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          datasetSummary: datasetSummary,
          highThinking: highThinking,
        }),
      });

      if (!res.ok) {
        throw new Error("Chat service was temporarily unavailable. Please retry.");
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.reply || "I apologize, I encountered an issue processing that response.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: `❌ **Error**: ${err.message || "Failed to establish a connection with the server."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div id="copilot-chat" className="bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-md flex flex-col h-[540px] overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white border border-indigo-500/30">
            <Bot className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-gray-100 tracking-tight">AI Sentiment Copilot</h3>
              <span className={`inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                highThinking 
                  ? "bg-purple-900/50 text-purple-300 border border-purple-800 animate-pulse"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}>
                <Brain className="w-2.5 h-2.5" />
                {highThinking ? "REASONING" : "FLASH"}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              {report ? "Dataset context active" : "Strategist mode online"}
            </span>
          </div>
        </div>

        {messages.length > 1 && (
          <button
            onClick={handleClearHistory}
            className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all"
            title="Clear conversation history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 text-xs ${
                msg.role === "user"
                  ? "bg-indigo-950 text-indigo-300 border-indigo-800/50"
                  : "bg-slate-900 text-slate-300 border-slate-800"
              }`}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-400" />}
              </div>

              {/* Bubble */}
              <div className={`rounded-xl p-3.5 text-xs md:text-sm font-sans ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none border border-indigo-500/30"
                  : "bg-slate-900/60 text-slate-300 rounded-tl-none border border-slate-850"
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed prose prose-invert max-w-none">
                  {msg.content}
                </div>
                <div className="text-[9px] text-slate-500 mt-2 text-right">
                  {msg.timestamp}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Thinking loading indicator */}
        {isSending && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-indigo-400 border border-slate-800 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900/40 text-slate-400 rounded-xl rounded-tl-none border border-slate-850 p-3 flex items-center gap-2">
              <span className="text-xs font-medium font-sans">
                {highThinking ? "Synthesizing strategic reasoning paths..." : "Analyzing query vectors..."}
              </span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}

        <div ref={threadEndRef} />
      </div>

      {/* Shortcut prompt suggestions */}
      {messages.length <= 1 && (
        <div className="bg-slate-900/30 border-t border-slate-900 px-4 py-3 flex flex-wrap gap-2 justify-center shrink-0">
          {CHAT_SHORTCUTS.map((shortcut) => (
            <button
              key={shortcut}
              onClick={() => executeShortcut(shortcut)}
              disabled={isSending}
              className="text-[10px] text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-indigo-500/50 rounded-lg px-2.5 py-1.5 font-medium transition-all text-left max-w-xs truncate"
            >
              {shortcut}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleFormSubmit} className="bg-slate-900 border-t border-slate-850 p-3 flex gap-2.5 items-center shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={report ? "Ask a question about your customer feedback..." : "Ask general customer experience questions..."}
          className="flex-1 bg-slate-950 text-white border border-slate-800 focus:border-indigo-500 focus:outline-hidden text-xs md:text-sm py-2.5 px-3.5 rounded-xl transition-all"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !inputValue.trim()}
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
            isSending || !inputValue.trim()
              ? "bg-slate-800 text-slate-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
