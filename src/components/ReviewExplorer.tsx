import React, { useState, useMemo } from "react";
import { ReviewItem } from "../types";
import { Search, Filter, Smile, Meh, Frown, ChevronLeft, ChevronRight, Calendar, Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReviewExplorerProps {
  reviews: ReviewItem[];
}

export default function ReviewExplorer({ reviews }: ReviewExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<"all" | "positive" | "neutral" | "negative">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset page when search or filter changes
  const handleFilterChange = (filter: typeof sentimentFilter) => {
    setSentimentFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  // Filter & Search Logic
  const filteredReviews = useMemo(() => {
    if (!reviews) return [];
    return reviews.filter((review) => {
      const matchesSentiment = sentimentFilter === "all" || review.sentiment === sentimentFilter;
      const matchesSearch =
        review.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.highlights.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSentiment && matchesSearch;
    });
  }, [reviews, searchQuery, sentimentFilter]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = useMemo(() => {
    return filteredReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReviews, startIndex]);

  // Sentiment Icon Helper
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Smile className="w-4 h-4 text-emerald-600" />;
      case "neutral":
        return <Meh className="w-4 h-4 text-amber-500" />;
      case "negative":
        return <Frown className="w-4 h-4 text-rose-500" />;
      default:
        return null;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-emerald-50 text-emerald-700 border-emerald-150";
      case "neutral":
        return "bg-amber-50 text-amber-700 border-amber-150";
      case "negative":
        return "bg-rose-50 text-rose-700 border-rose-150";
      default:
        return "bg-slate-50 text-slate-700 border-slate-150";
    }
  };

  return (
    <div id="review-explorer" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-violet-500 rounded-full shrink-0"></div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Parsed Feedback Explorer</h2>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          {filteredReviews.length} of {reviews.length} items
        </span>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute top-3.5 left-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search raw feedback texts or highlight tags..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-50/50 focus:border-indigo-500 bg-white placeholder-slate-400 transition-all text-slate-800 font-medium"
          />
        </div>

        {/* Sentiment Category Tabs */}
        <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-150 shrink-0">
          {(["all", "positive", "neutral", "negative"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleFilterChange(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                sentimentFilter === tab
                  ? "bg-white text-slate-800 shadow-sm border border-slate-250/20"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab === "all" ? "All Sentiments" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {paginatedReviews.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {paginatedReviews.map((review, idx) => (
              <motion.div
                key={review.id || idx}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-xl border border-slate-150 bg-slate-50/30 hover:bg-white hover:border-slate-250/80 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                {/* Sentiment Marker & Content */}
                <div className="flex gap-3">
                  <div className={`p-2.5 rounded-xl border shrink-0 flex items-center justify-center h-10 w-10 ${getSentimentBadge(review.sentiment)}`}>
                    {getSentimentIcon(review.sentiment)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed max-w-2xl">
                      {review.text}
                    </p>

                    {/* Meta-information & Tags */}
                    <div className="flex flex-wrap gap-2 items-center mt-3">
                      {/* Date */}
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-white border border-slate-150 px-2 py-0.5 rounded-md">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(review.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "UTC"
                        })}
                      </span>

                      {/* Highlights */}
                      {review.highlights.map((highlight, hidx) => (
                        <span
                          key={highlight + hidx}
                          className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md"
                        >
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Score badge */}
                <div className="flex flex-col items-end justify-center shrink-0">
                  <span className="text-xl font-black text-slate-900 tracking-tight leading-none">
                    {review.score}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold">
                    Score
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 italic">
            No matching feedback items found in the current dataset.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-xs text-slate-500 font-bold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
