import React, { useMemo } from "react";
import { ReviewItem } from "../types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import { motion } from "motion/react";

interface SentimentChartProps {
  reviews: ReviewItem[];
}

export default function SentimentChart({ reviews }: SentimentChartProps) {
  // Aggregate reviews by date and sort chronologically
  const chartData = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];

    const dateMap: { [date: string]: { sum: number; count: number } } = {};

    reviews.forEach((review) => {
      const dateStr = review.date;
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = { sum: 0, count: 0 };
      }
      dateMap[dateStr].sum += review.score;
      dateMap[dateStr].count += 1;
    });

    const formatted = Object.keys(dateMap).map((date) => {
      const { sum, count } = dateMap[date];
      return {
        date,
        displayDate: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
        score: Math.round(sum / count),
        volume: count,
      };
    });

    // Sort ascending by ISO date
    return formatted.sort((a, b) => a.date.localeCompare(b.date));
  }, [reviews]);

  // Determine trend summary text
  const trendInfo = useMemo(() => {
    if (chartData.length < 2) return { percentChange: 0, text: "Stable baseline" };
    const firstVal = chartData[0].score;
    const lastVal = chartData[chartData.length - 1].score;
    const diff = lastVal - firstVal;
    if (diff > 5) {
      return { percentChange: diff, text: "Improving customer sentiment trend detected!" };
    } else if (diff < -5) {
      return { percentChange: diff, text: "Declining customer sentiment trend. Investigation advised." };
    } else {
      return { percentChange: diff, text: "Customer sentiment remains steady and consistent." };
    }
  }, [chartData]);

  // Custom tool-tip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs font-sans">
          <div className="flex items-center gap-1.5 font-semibold border-b border-slate-800 pb-1.5 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{data.displayDate}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-6">
              <span className="text-gray-400">Avg Score:</span>
              <span className="font-bold text-indigo-400">{data.score} / 100</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-gray-400">Total Reviews:</span>
              <span className="font-bold text-gray-200">{data.volume}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-[380px] justify-between"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-emerald-500 rounded-full shrink-0"></div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Sentiment Trend Timeline</h2>
        </div>

        {chartData.length >= 2 && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-150 rounded-lg px-2.5 py-1">
            <span className={`text-xs font-bold ${trendInfo.percentChange >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
              {trendInfo.percentChange >= 0 ? "+" : ""}
              {trendInfo.percentChange} pts
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">{trendInfo.text}</span>
          </div>
        )}
      </div>

      <div className="flex-1 w-full min-h-0 mt-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="displayDate"
                tickLine={false}
                axisLine={false}
                stroke="#94a3b8"
                fontSize={10}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                stroke="#94a3b8"
                fontSize={10}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
            Analyze customer reviews to build your sentiment timeline.
          </div>
        )}
      </div>
    </motion.div>
  );
}
