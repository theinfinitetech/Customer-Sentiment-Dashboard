import React, { useState, useEffect } from "react";
import { REVIEW_TEMPLATES, ReviewTemplate } from "../data/templates";
import { Brain, Sparkles, Clipboard, RefreshCw, AppWindow, Activity, Utensils, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReviewSelectorProps {
  onAnalyze: (text: string, highThinking: boolean) => Promise<void>;
  isLoading: boolean;
}

const LOADING_PHRASES = [
  "Parsing raw customer inputs...",
  "Running natural language tokenization...",
  "Evaluating sentiment valence & emotional weights...",
  "Clustering frequent complaints and praises...",
  "Compiling cron dates & timeline trajectories...",
  "Synthesizing top 3 actionable strategic pillars...",
  "Formulating the executive summary narrative...",
  "Polishing reports & grounding analytics..."
];

export default function ReviewSelector({ onAnalyze, isLoading }: ReviewSelectorProps) {
  const [inputText, setInputText] = useState("");
  const [highThinking, setHighThinking] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  // Rotate loading phrases every 2.5 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
      }, 2500);
    } else {
      setLoadingPhraseIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const selectTemplate = (template: ReviewTemplate) => {
    setInputText(template.text);
    setActiveTemplate(template.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAnalyze(inputText, highThinking);
  };

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case "AppWindow":
        return <AppWindow className="w-4 h-4 text-indigo-500" />;
      case "Activity":
        return <Activity className="w-4 h-4 text-emerald-500" />;
      case "Utensils":
        return <Utensils className="w-4 h-4 text-amber-500" />;
      default:
        return <Clipboard className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div id="review-selector" className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-indigo-600" />
            Input Reviews Dataset
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Paste a custom raw batch of user reviews, logs, or feed notes.
          </p>
        </div>

        {/* High Thinking Toggle */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={highThinking}
              onChange={() => setHighThinking(!highThinking)}
              disabled={isLoading}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-700">Deep Analysis</span>
              <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                highThinking 
                  ? "bg-purple-100 text-purple-700 animate-pulse border border-purple-200"
                  : "bg-gray-100 text-gray-500 border border-gray-200"
              }`}>
                <Brain className="w-2.5 h-2.5" />
                {highThinking ? "REASONING" : "FLASH"}
              </span>
            </div>
            <span className="text-[10px] text-gray-400">
              {highThinking ? "Uses gemini-3.1-pro-preview" : "Uses gemini-3.5-flash"}
            </span>
          </div>
        </div>
      </div>

      {/* Preset templates */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-gray-600 block mb-2.5 uppercase tracking-wider">
          Or try a quick industry preset:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {REVIEW_TEMPLATES.map((template) => (
            <button
              key={template.name}
              type="button"
              onClick={() => selectTemplate(template)}
              disabled={isLoading}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                activeTemplate === template.name
                  ? "bg-indigo-50/50 border-indigo-200 ring-2 ring-indigo-50"
                  : "bg-gray-50/50 border-gray-100 hover:bg-gray-50 hover:border-gray-200"
              }`}
            >
              <div className="p-2 rounded-lg bg-white shadow-xs border border-gray-100/50 flex-shrink-0">
                {getTemplateIcon(template.icon)}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-800 leading-tight">
                  {template.name}
                </h4>
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">
                  {template.industry}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="relative mt-4">
        <div className="relative rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-50 focus-within:border-indigo-500 transition-all">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setActiveTemplate(null);
            }}
            placeholder={`Paste raw feedback comments, tweets, or survey answers here...

Example format:
- Best app ever! Smooth and quick. (June 10, 2026)
- Customer service was horrible and it kept crashing on startup. (June 12, 2026)`}
            className="w-full h-56 p-4 text-sm text-gray-800 placeholder-gray-400 bg-white border-0 resize-y focus:outline-hidden leading-relaxed font-sans"
            disabled={isLoading}
          />
          <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 flex items-center justify-between text-xs text-gray-400">
            <span>Character count: {inputText.length}</span>
            <span>Batch analysis supported</span>
          </div>
        </div>

        {/* Submit & Loading overlay */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
            Paste at least 3 reviews for an accurate trend chart.
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className={`w-full sm:w-auto relative px-6 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${
              isLoading || !inputText.trim()
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : highThinking
                ? "bg-purple-600 hover:bg-purple-700 text-white hover:shadow-purple-100"
                : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-100"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Dataset...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Sentiment Report</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center p-6 text-center z-20"
            >
              <div className="relative mb-6">
                <div className={`w-16 h-16 rounded-full border-4 border-t-transparent animate-spin ${
                  highThinking ? "border-purple-600" : "border-indigo-600"
                }`} />
                <Brain className={`w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                  highThinking ? "text-purple-600 animate-pulse" : "text-indigo-600"
                }`} />
              </div>

              <motion.div
                key={loadingPhraseIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="max-w-md"
              >
                <h3 className="text-sm font-semibold text-gray-800 tracking-wide uppercase">
                  {highThinking ? "High-Thinking Cognitive Mode Active" : "Analyzing Customer Feedback"}
                </h3>
                <p className="text-xs text-gray-500 mt-2 font-mono italic">
                  &ldquo;{LOADING_PHRASES[loadingPhraseIndex]}&rdquo;
                </p>
              </motion.div>

              <div className="w-48 bg-gray-100 h-1 rounded-full mt-6 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 25, ease: "linear" }}
                  className={`h-full ${highThinking ? "bg-purple-600" : "bg-indigo-600"}`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
