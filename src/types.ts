export interface ReviewItem {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD
  sentiment: "positive" | "neutral" | "negative";
  score: number; // 0 - 100
  highlights: string[];
}

export interface WordTag {
  text: string;
  value: number; // 5 to 50
}

export interface ActionableItem {
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  category: string;
}

export interface SentimentReport {
  reviews: ReviewItem[];
  wordCloud: {
    praises: WordTag[];
    complaints: WordTag[];
  };
  actionableItems: ActionableItem[];
  executiveSummary: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
