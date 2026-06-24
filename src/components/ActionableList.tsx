import React from "react";
import { ActionableItem } from "../types";
import { AlertTriangle, Lightbulb, ShieldAlert, ArrowRight, Layers } from "lucide-react";
import { motion } from "motion/react";

interface ActionableListProps {
  items: ActionableItem[];
}

export default function ActionableList({ items }: ActionableListProps) {
  const getImpactBadge = (impact: "High" | "Medium" | "Low") => {
    switch (impact) {
      case "High":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Low":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getImpactIcon = (impact: "High" | "Medium" | "Low") => {
    switch (impact) {
      case "High":
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />;
      case "Medium":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      case "Low":
        return <Lightbulb className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return <Lightbulb className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  return (
    <div id="actionable-improvements" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
      {/* Header with theme's amber vertical pill */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-amber-500 rounded-full shrink-0"></div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Actionable Improvements</h2>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Strategic Plan
        </span>
      </div>

      {/* Styled List Items */}
      <div className="space-y-3">
        {items && items.length > 0 ? (
          items.slice(0, 3).map((item, idx) => (
            <motion.div
              key={item.title + idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="p-3 bg-slate-50 rounded-lg flex gap-4 items-start border border-slate-150 transition-all hover:bg-slate-100/50"
            >
              <div className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0">
                0{idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-sm font-bold text-slate-800 tracking-tight">{item.title}</div>
                  <div className="flex gap-1.5">
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
                      {item.category || "General"}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border ${getImpactBadge(item.impact)}`}>
                      {item.impact}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 leading-relaxed mt-1">
                  {item.description}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-10 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400 italic">
            Analyze reviews to generate your top tactical action pillars.
          </div>
        )}
      </div>
    </div>
  );
}
