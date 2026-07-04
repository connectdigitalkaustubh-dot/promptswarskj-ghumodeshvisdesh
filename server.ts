import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parser with safety limits
app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// API routes first
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!apiKey,
    time: new Date().toISOString(),
  });
});

// General Gemini Generate Content Endpoint
app.post("/api/gemini/generate", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is missing. Please configure GEMINI_API_KEY in the Secrets panel.",
      });
    }

    const { prompt, systemInstruction, responseMimeType, schema } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // Prepare configuration
    const config: any = {
      temperature: 0.7,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    if (responseMimeType === "application/json") {
      config.responseMimeType = "application/json";
      if (schema) {
        config.responseSchema = schema;
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config,
    });

    const text = response.text || "";
    res.json({ text });
  } catch (error: any) {
    console.error("Gemini Generate Error:", error);
    res.status(500).json({
      error: "Failed to generate AI content.",
      details: error.message || String(error),
    });
  }
});

// SafarSaathi Travel Chatbot Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is missing. Please configure GEMINI_API_KEY in the Secrets panel.",
      });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const systemInstruction = `You are SafarSaathi AI, an experienced, warm, and highly expert Indian travel guide, budget planner, safety expert, cultural storyteller, solo travel mentor, and trip optimizer.
Your goal is to help travelers explore India and international destinations like a local. Reduce their travel anxiety and increase their trust.

STRICT RULES:
1. Never hallucinate or make up details. Never fake live information (like real-time train delay or direct current crowd unless you clearly state it's based on average patterns or community alerts). If live data is unavailable, clearly state: "Live data currently unavailable; standard schedules/patterns apply."
2. Respect all religious places and local culture. Remind travelers about proper dress code (e.g., covered shoulders/knees, taking off footwear, head covering) and temple etiquette (e.g., no photography inside temples, respecting darshan timings).
3. Offer concrete, street-smart advice for real-world problems: Temple crowd times, parking availability, avoiding fake guides and transport scams, women's safety guidelines, rain backup plans, offline navigation tips, local language barriers, UPI vs cash availability, rickshaw negotiation tips.
4. Keep answers highly structured with clear bullet points, bullet categories, and actionable tips. Make them visual and easy to read.
5. Use light Hinglish/local greeting phrases occasionally and warmly (e.g., 'Namaste!', 'Chalo let's plan!', 'Aapka Safar Saathi', 'Aapka swagat hai') but always keep it highly professional, clear, and globally readable.
6. Address user types with specialized lenses (Student, Solo, Female Traveler, Senior Citizen, Family, Road tripper, Digital Nomad).`;

    // Map conversation history to the format required by Gemini Chat API or generate content with history
    // Since we want to use the standard generateContent with a system instruction and history, let's build it
    // Wait, the SDK has:
    // const chat = ai.chats.create({ model: "gemini-2.5-flash", config: { systemInstruction } });
    // Or we can feed standard contents structure where contents is an array of content roles
    // Let's do that because it's stateless on the server and works perfectly with Express!
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I apologize, but I could not formulate a response. How else can I assist you on your travels?";
    res.json({ text: reply });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({
      error: "Failed to connect with SafarSaathi AI.",
      details: error.message || String(error),
    });
  }
});

// Vite Integration Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support wildcard routing for React Router SPA
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting full-stack server:", err);
});
