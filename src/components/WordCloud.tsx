import React, { useMemo } from "react";
import { WordTag } from "../types";
import { Smile, Frown, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface WordCloudProps {
  praises: WordTag[];
  complaints: WordTag[];
}

export default function WordCloud({ praises, complaints }: WordCloudProps) {
  // Helper to scale tag styles dynamically based on value
  const praisesMinMax = useMemo(() => {
    if (!praises || praises.length === 0) return { min: 5, max: 50 };
    const values = praises.map((t) => t.value);
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [praises]);

  const complaintsMinMax = useMemo(() => {
    if (!complaints || complaints.length === 0) return { min: 5, max: 50 };
    const values = complaints.map((t) => t.value);
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [complaints]);

  const getFontSize = (value: number, min: number, max: number) => {
    if (max === min) return "text-sm";
    const percent = (value - min) / (max - min || 1);
    if (percent > 0.8) return "text-lg md:text-xl font-black";
    if (percent > 0.5) return "text-base md:text-lg font-bold";
    if (percent > 0.25) return "text-sm md:text-base font-semibold";
    return "text-xs font-medium";
  };

  const getPraiseColor = (value: number, min: number, max: number) => {
    if (max === min) return "bg-emerald-50/55 text-emerald-700 border-emerald-100";
    const percent = (value - min) / (max - min || 1);
    if (percent > 0.6) return "bg-indigo-600 text-white border-indigo-700 shadow-sm";
    if (percent > 0.3) return "bg-slate-100 text-slate-700 border-slate-200";
    return "bg-slate-50 text-slate-500 border-slate-100";
  };

  const getComplaintColor = (value: number, min: number, max: number) => {
    if (max === min) return "bg-rose-50/55 text-rose-700 border-rose-100";
    const percent = (value - min) / (max - min || 1);
    if (percent > 0.6) return "bg-rose-500 text-white border-rose-600 shadow-sm";
    if (percent > 0.3) return "bg-slate-100 text-slate-700 border-slate-200";
    return "bg-slate-50 text-slate-400 border-slate-100";
  };

  return (
    <div id="word-clouds" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Praise / Positive Word Cloud */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-sky-500 rounded-full shrink-0"></div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Keywords & Themes (Praise)</h2>
          </div>
          <Sparkles className="w-4 h-4 text-sky-400" />
        </div>

        <div className="min-h-48 flex flex-wrap gap-3 items-center justify-center p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          {praises && praises.length > 0 ? (
            praises.map((tag, idx) => {
              const fSize = getFontSize(tag.value, praisesMinMax.min, praisesMinMax.max);
              const colors = getPraiseColor(tag.value, praisesMinMax.min, praisesMinMax.max);
              return (
                <motion.span
                  key={tag.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  className={`inline-block px-3.5 py-1.5 rounded-lg border transition-all cursor-default text-center leading-none ${fSize} ${colors}`}
                  title={`Prominence Weight: ${tag.value}`}
                >
                  {tag.text}
                </motion.span>
              );
            })
          ) : (
            <span className="text-xs text-slate-400 italic">No praises identified yet.</span>
          )}
        </div>
      </motion.div>

      {/* Complaint / Negative Word Cloud */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-rose-500 rounded-full shrink-0"></div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Keywords & Themes (Frustration)</h2>
          </div>
          <Frown className="w-4 h-4 text-rose-300" />
        </div>

        <div className="min-h-48 flex flex-wrap gap-3 items-center justify-center p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          {complaints && complaints.length > 0 ? (
            complaints.map((tag, idx) => {
              const fSize = getFontSize(tag.value, complaintsMinMax.min, complaintsMinMax.max);
              const colors = getComplaintColor(tag.value, complaintsMinMax.min, complaintsMinMax.max);
              return (
                <motion.span
                  key={tag.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  className={`inline-block px-3.5 py-1.5 rounded-lg border transition-all cursor-default text-center leading-none ${fSize} ${colors}`}
                  title={`Prominence Weight: ${tag.value}`}
                >
                  {tag.text}
                </motion.span>
              );
            })
          ) : (
            <span className="text-xs text-slate-400 italic">No complaints identified yet.</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
