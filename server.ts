import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

dotenv.config();

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // API Route: Analyze Sentiment of raw text reviews
  app.post("/api/analyze-sentiment", async (req, res) => {
    try {
      const { reviewsText, highThinking } = req.body;

      if (!reviewsText || typeof reviewsText !== "string" || reviewsText.trim() === "") {
        return res.status(400).json({ error: "Please provide non-empty reviews text for analysis." });
      }

      // Determine model based on high thinking setting
      const model = highThinking ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";

      const prompt = `
        You are an expert customer sentiment analyst. Analyze the following raw batch of customer reviews.
        
        1. Parse and extract individual reviews from the pasted text (even if they are clumped together, bulleted, numbered, or separated by newlines).
        2. Classify each review's sentiment ('positive', 'neutral', or 'negative').
        3. Assign a numeric sentiment score (from 0 = extremely negative to 100 = extremely positive).
        4. If there are dates/timestamps in the reviews, extract them. If no dates are mentioned, assign realistic chronological dates (in YYYY-MM-DD format) spread out across the last 30 days to build a beautiful and logical timeline trend chart.
        5. Extract key praises (positive tags/phrases) and complaints (negative tags/phrases) along with their relative prominence/weight (from 5 to 50) for word-cloud display.
        6. Identify the TOP 3 critical actionable areas for improvement based on complaints. For each, give a clear title, detailed description, impact level (High/Medium/Low), and category.
        7. Write an executive summary detailing key strengths, critical weaknesses, and sentiment trends.

        Raw customer reviews text:
        """
        ${reviewsText}
        """
      `;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          reviews: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING, description: "A clean, extracted review text snippet." },
                date: { type: Type.STRING, description: "ISO Date string (YYYY-MM-DD) representing when the review was written." },
                sentiment: { type: Type.STRING, description: "Must be exactly 'positive', 'neutral', or 'negative'." },
                score: { type: Type.INTEGER, description: "Numeric sentiment score from 0 (very negative) to 100 (very positive)." },
                highlights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Key phrases or words indicating complaints or praises (max 3)."
                }
              },
              required: ["id", "text", "date", "sentiment", "score", "highlights"]
            }
          },
          wordCloud: {
            type: Type.OBJECT,
            properties: {
              praises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "Praise word or phrase (e.g., 'Fast delivery')." },
                    value: { type: Type.INTEGER, description: "Relative weight from 5 to 50." }
                  },
                  required: ["text", "value"]
                }
              },
              complaints: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "Complaint word or phrase (e.g., 'Slow loading')." },
                    value: { type: Type.INTEGER, description: "Relative weight from 5 to 50." }
                  },
                  required: ["text", "value"]
                }
              }
            },
            required: ["praises", "complaints"]
          },
          actionableItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Actionable improvement title." },
                description: { type: Type.STRING, description: "Detailed description of the issue and resolution." },
                impact: { type: Type.STRING, description: "Must be exactly 'High', 'Medium', or 'Low'." },
                category: { type: Type.STRING, description: "Department/Area (e.g., Customer Support, Pricing, UX/UI, Performance)." }
              },
              required: ["title", "description", "impact", "category"]
            }
          },
          executiveSummary: {
            type: Type.STRING,
            description: "A formal, high-level executive summary of customer sentiment trends, key strengths, and critical weaknesses."
          }
        },
        required: ["reviews", "wordCloud", "actionableItems", "executiveSummary"]
      };

      const result = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          systemInstruction: "You are an analytical sentiment engine. Convert customer reviews into structured JSON output following the provided schema accurately.",
          ...(highThinking && model === "gemini-3.1-pro-preview"
            ? { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
            : {}),
        },
      });

      const reportText = result.text;
      if (!reportText) {
        throw new Error("No response received from sentiment analyzer.");
      }

      const reportData = JSON.parse(reportText.trim());
      res.json(reportData);
    } catch (error: any) {
      console.error("Sentiment analysis error:", error);
      res.status(500).json({ error: error.message || "An error occurred during sentiment analysis." });
    }
  });

  // API Route: Conversational CX Chat Copilot
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, datasetSummary, highThinking } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request payload. 'messages' array is required." });
      }

      // Determine model based on high thinking setting
      const model = highThinking ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";

      const systemInstruction = `
        You are a Senior Customer Experience (CX) Consultant and Sentiment Analyst named "Sentiment Copilot".
        Your purpose is to help the user brainstorm improvements, answer deep questions about their customer feedback, and draft action steps.

        You have access to the currently analyzed dataset summary:
        ---
        ${datasetSummary || "No dataset has been analyzed yet. Remind the user to paste and analyze reviews first to unlock your full contextual power!"}
        ---

        Instructions:
        - Maintain a highly professional, consultative, clear, and action-oriented tone.
        - Provide structured lists, bullet points, and practical takeaways when answering queries.
        - Be direct, insightful, and draw upon modern CX best practices (e.g., SLAs, customer journey mapping, root-cause analysis).
        - If the user asks you to draft emails, Slack messages, or feedback replies, do so elegantly.
      `;

      // Map chat history to Gemini's format: { role: 'user' | 'model', parts: [{ text: string }] }
      const contents = messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const result = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          ...(highThinking && model === "gemini-3.1-pro-preview"
            ? { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
            : {}),
        },
      });

      res.json({ reply: result.text || "" });
    } catch (error: any) {
      console.error("Chat copilot error:", error);
      res.status(500).json({ error: error.message || "An error occurred in the chat copilot." });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
