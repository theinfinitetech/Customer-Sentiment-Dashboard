import React from "react";
import { FileText, Quote } from "lucide-react";
import { motion } from "motion/react";

interface ExecutiveSummaryProps {
  summary: string;
}

export default function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col relative overflow-hidden"
    >
      {/* Visual background details */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <div className="w-2 h-6 bg-indigo-500 rounded-full shrink-0"></div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          AI Executive Summary
        </h2>
      </div>

      {/* Narrative block */}
      <div className="relative z-10 flex-1">
        {summary ? (
          <p className="text-lg leading-relaxed text-slate-700 italic selection:bg-indigo-100 selection:text-indigo-900 whitespace-pre-wrap">
            "{summary}"
          </p>
        ) : (
          <p className="text-sm text-slate-400 italic">
            Analyze reviews to generate the executive summary briefing.
          </p>
        )}

        {/* Highlighted Driver Block */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Sentiment Resolution Track</div>
            <div className="text-base font-bold text-indigo-900">Cognitive Strategic Analysis</div>
          </div>
          <Quote className="w-8 h-8 text-indigo-500/10 rotate-180" />
        </div>
      </div>
    </motion.div>
  );
}
