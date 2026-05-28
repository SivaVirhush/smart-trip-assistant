const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

require("dotenv").config({ override: true });

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AI_API_KEY,
});
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
const frontendOrigin = process.env.FRONTEND_ORIGIN;

app.use(
  cors({
    origin: frontendOrigin || /^http:\/\/localhost:30\d{2}$/,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "Incredible Heritage guest API" });
});

app.post("/api/guest/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Please provide a message" });
    }

    const safeHistory = history
      .filter((item) => ["user", "assistant"].includes(item.role))
      .slice(-8)
      .map((item) => ({ role: item.role, content: item.content }));

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are Incredible Heritage, a concise Tamil Nadu cultural heritage tourist guide. Help guests with temples, monuments, history, architecture, routes, trip planning, traffic-aware suggestions, and cultural context. Keep answers useful and simple.",
        },
        ...safeHistory,
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error("Guest chat error:", error.message);
    res.json({
      message:
        "I can still guide you in guest mode, but the AI API key is not active right now. For Tamil Nadu heritage trips, start with major sites like Brihadeeswarar Temple, Meenakshi Temple, Mahabalipuram, Srirangam, Chidambaram, and Gangaikonda Cholapuram, then use Maps and Live Traffic to plan your route.",
    });
  }
});

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

const guestCalendarFallback = (message) => {
  const lower = message.toLowerCase();

  if (lower.includes("delete") || lower.includes("clear")) {
    return {
      message:
        "I cleared the temporary calendar events for this browser session.",
      action: { type: "CLEAR_EVENTS" },
    };
  }

  if (
    lower.includes("add") ||
    lower.includes("create") ||
    lower.includes("visit") ||
    lower.includes("plan")
  ) {
    return {
      message:
        "I added that as a temporary visit. You can edit the exact time directly on the calendar.",
      action: {
        type: "CREATE_EVENT",
        payload: {
          title:
            message
              .replace(/add|create|plan/gi, "")
              .replace(/tomorrow|today|at\s+\d{1,2}\s*(am|pm)?/gi, "")
              .trim() || "Cultural site visit",
          description: "Created by the guest calendar assistant",
          location: "",
          dateHint: lower.includes("tomorrow") ? "tomorrow" : "today",
          hourHint: lower.match(/(\d{1,2})\s*(am|pm)?/i)?.[0] || "10 AM",
          durationHours: 2,
        },
      },
    };
  }

  return {
    message:
      "I can add, plan, or clear temporary cultural visit events. Try: Add Brihadeeswarar temple visit tomorrow at 10 AM.",
    action: { type: "NONE" },
  };
};

app.post("/api/guest/calendar-chat", async (req, res) => {
  try {
    const { message, events = [], history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Please provide a message" });
    }

    const safeHistory = history
      .filter((item) => ["user", "assistant"].includes(item.role))
      .slice(-6)
      .map((item) => ({ role: item.role, content: item.content }));

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            'You are the Incredible Heritage calendar assistant for Tamil Nadu cultural heritage trips. Return only compact JSON with keys "message" and "action". action must be one of: {"type":"CREATE_EVENT","payload":{"title":"","description":"","location":"","dateHint":"today|tomorrow|YYYY-MM-DD","hourHint":"10 AM","durationHours":2}}, {"type":"CLEAR_EVENTS"}, or {"type":"NONE"}. Events are temporary for the current browser session.',
        },
        {
          role: "user",
          content: `Existing temporary events: ${JSON.stringify(
            events.slice(-20)
          )}`,
        },
        ...safeHistory,
        { role: "user", content: message },
      ],
      temperature: 0.2,
    });

    const parsed = safeJsonParse(completion.choices[0].message.content);
    if (!parsed || !parsed.message || !parsed.action) {
      return res.json(guestCalendarFallback(message));
    }

    res.json(parsed);
  } catch (error) {
    console.error("Guest calendar error:", error.message);
    res.json(guestCalendarFallback(req.body.message || ""));
  }
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Guest API running on port ${PORT}`);
  });
}

module.exports = app;
