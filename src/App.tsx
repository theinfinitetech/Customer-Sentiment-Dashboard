import { useState } from "react";
import { SentimentReport } from "./types";
import ReviewSelector from "./components/ReviewSelector";
import StatsCards from "./components/StatsCards";
import SentimentChart from "./components/SentimentChart";
import WordCloud from "./components/WordCloud";
import ActionableList from "./components/ActionableList";
import ExecutiveSummary from "./components/ExecutiveSummary";
import ReviewExplorer from "./components/ReviewExplorer";
import CopilotChat from "./components/CopilotChat";
import { Sparkles, RefreshCw, BarChart3, MessageSquare, PlusCircle, Brain, Sliders, AlertCircle, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [report, setReport] = useState<SentimentReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highThinking, setHighThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(true);

  const handleAnalyze = async (text: string, useHighThinking: boolean) => {
    setIsLoading(true);
    setHighThinking(useHighThinking);
    setError(null);

    try {
      const res = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewsText: text,
          highThinking: useHighThinking,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "The sentiment analysis server timed out. Please try again.");
      }

      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during report synthesis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-950 flex flex-col justify-between">
      <div>
        {/* Top Navbar */}
        <header className="sticky top-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 shrink-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-800">
              SentimentHub <span className="text-slate-400 font-normal ml-2 hidden sm:inline">| customer sentiment engine</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {report && (
              <div className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-full hidden md:block">
                Sample: {report.reviews.length} Reviews
              </div>
            )}

            {report && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-all cursor-pointer"
              >
                New Analysis
              </button>
            )}

            {/* Chat Trigger Badge */}
            {report && (
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isChatOpen
                    ? "bg-indigo-600 text-white border border-indigo-700 shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Copilot Chat</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Container */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
          <AnimatePresence mode="wait">
            {/* 1. Input Form Screen */}
            {!report ? (
              <motion.div
                key="input-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                {/* Hero header */}
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100/60 rounded-full text-[11px] font-bold text-indigo-700 mb-4"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    AI-Assisted Customer Experience Suite
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Analyze Customer Sentiment. <br />
                    <span className="text-indigo-600">Extract Actionable Insights.</span>
                  </h1>
                  <p className="text-sm md:text-base text-gray-500 mt-3 max-w-lg mx-auto leading-relaxed">
                    Convert a massive pile of raw customer feedback, logs, or reviews into structured, high-fidelity visual summaries and action points.
                  </p>
                </div>

                {/* Error Callout */}
                {error && (
                  <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-800 text-xs flex gap-3 items-start animate-shake">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Analysis Failed</span>
                      <p className="mt-1 leading-relaxed text-rose-600">{error}</p>
                    </div>
                  </div>
                )}

                {/* Selector form */}
                <ReviewSelector onAnalyze={handleAnalyze} isLoading={isLoading} />
              </motion.div>
            ) : (
              /* 2. Dashboard Screen */
              <motion.div
                key="dashboard-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Mini dashboard banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 shadow-sm rounded-xl p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-150 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Reporting Verified
                      </span>
                      {highThinking && (
                        <span className="text-[10px] bg-purple-50 text-purple-700 font-extrabold border border-purple-150 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                          <Brain className="w-2.5 h-2.5" /> High Thinking Mode
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 mt-1.5 tracking-tight">
                      Active Sentiment Executive Report
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Load Another Batch
                    </button>
                  </div>
                </div>

                {/* Stats Cards Section */}
                <StatsCards reviews={report.reviews} />

                {/* Layout Grid: Report Visualizers and Chat Copilot */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Area: Visual report sheets */}
                  <div className={`space-y-6 transition-all duration-300 ${isChatOpen ? "lg:col-span-8" : "lg:col-span-12"}`}>
                    {/* Executive summary block */}
                    <ExecutiveSummary summary={report.executiveSummary} />

                    {/* Strategic Improvement cards */}
                    <ActionableList items={report.actionableItems} />

                    {/* Trend chart */}
                    <SentimentChart reviews={report.reviews} />

                    {/* Praise / Complaint Word Clouds */}
                    <WordCloud praises={report.wordCloud.praises} complaints={report.wordCloud.complaints} />

                    {/* Data Grid table */}
                    <ReviewExplorer reviews={report.reviews} />
                  </div>

                  {/* Right Area: Collapsible Copilot Chat Panel */}
                  {isChatOpen && (
                    <div className="lg:col-span-4 sticky top-24">
                      <CopilotChat report={report} highThinking={highThinking} />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer Info */}
      <footer className="h-12 px-6 md:px-8 bg-white border-t border-slate-200 flex items-center justify-between shrink-0 mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <div>Last Updated: Today at 09:14 AM</div>
        <div className="flex gap-4">
          <div>Model: Gemini 1.5 Pro</div>
          <div>Confidence: 94.2%</div>
        </div>
      </footer>
    </div>
  );
}
