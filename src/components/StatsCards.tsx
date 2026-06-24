import React from "react";
import { ReviewItem } from "../types";
import { Smile, Meh, Frown, Award, Users, BarChart2 } from "lucide-react";
import { motion } from "motion/react";

interface StatsCardsProps {
  reviews: ReviewItem[];
}

export default function StatsCards({ reviews }: StatsCardsProps) {
  const total = reviews.length;
  const positive = reviews.filter((r) => r.sentiment === "positive").length;
  const neutral = reviews.filter((r) => r.sentiment === "neutral").length;
  const negative = reviews.filter((r) => r.sentiment === "negative").length;

  const averageScore = total
    ? Math.round(reviews.reduce((sum, r) => sum + r.score, 0) / total)
    : 0;

  // Sentiment Color & Badge Helper
  const getRatingStatus = (score: number) => {
    if (score >= 70) return { label: "Excellent", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (score >= 45) return { label: "Neutral / Mixed", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { label: "Critical Needs", color: "text-rose-700 bg-rose-50 border-rose-200" };
  };

  const ratingStatus = getRatingStatus(averageScore);

  return (
    <div id="stats-cards" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Overall Net Sentiment
          </span>
          <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-end gap-3 my-2">
          <span className="text-5xl font-black text-slate-950 tracking-tight">
            {averageScore}
          </span>
          <span className="text-sm font-bold text-slate-400 mb-1.5">/ 100</span>
        </div>

        <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${ratingStatus.color}`}>
            {ratingStatus.label}
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">Score Rating</span>
        </div>
      </motion.div>

      {/* Dataset Volume */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Extracted Nodes
          </span>
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-end gap-2 my-2">
          <span className="text-5xl font-black text-slate-950 tracking-tight">
            {total}
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-1.5 border border-emerald-200/50">
            parsed
          </span>
        </div>

        <div className="mt-2 pt-4 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-400 leading-tight">
          <div className="flex justify-between font-semibold">
            <span>Sentiment granularity</span>
            <span className="font-bold text-slate-700">Individual Records</span>
          </div>
        </div>
      </motion.div>

      {/* Sentiment Breakdown Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Review Distribution
          </span>
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-100 text-amber-600">
            <BarChart2 className="w-4 h-4" />
          </div>
        </div>

        {/* Distribution Bars */}
        <div className="space-y-2 my-1">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Smile className="w-3.5 h-3.5" />
              <span>Positive</span>
            </div>
            <span>
              {positive} ({total ? Math.round((positive / total) * 100) : 0}%)
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <div className="flex items-center gap-1.5 text-amber-600">
              <Meh className="w-3.5 h-3.5" />
              <span>Neutral</span>
            </div>
            <span>
              {neutral} ({total ? Math.round((neutral / total) * 100) : 0}%)
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <div className="flex items-center gap-1.5 text-rose-500">
              <Frown className="w-3.5 h-3.5" />
              <span>Negative</span>
            </div>
            <span>
              {negative} ({total ? Math.round((negative / total) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Aggregate Progress Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100">
            {total > 0 ? (
              <>
                <div
                  style={{ width: `${(positive / total) * 100}%` }}
                  className="h-full bg-emerald-500 transition-all duration-500"
                  title={`Positive: ${positive}`}
                />
                <div
                  style={{ width: `${(neutral / total) * 100}%` }}
                  className="h-full bg-amber-400 transition-all duration-500"
                  title={`Neutral: ${neutral}`}
                />
                <div
                  style={{ width: `${(negative / total) * 100}%` }}
                  className="h-full bg-rose-500 transition-all duration-500"
                  title={`Negative: ${negative}`}
                />
              </>
            ) : (
              <div className="w-full h-full bg-slate-200" />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
