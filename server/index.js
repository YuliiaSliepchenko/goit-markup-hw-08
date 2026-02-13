import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// CORS (можна лишити так для локального тесту)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

const PORT = process.env.PORT || 5050;

const LIVEAVATAR_API_KEY = process.env.LIVEAVATAR_API_KEY;
const AVATAR_ID = process.env.AVATAR_ID;
const CONTEXT_ID = process.env.CONTEXT_ID;

// 👉 один раз на старті показуємо що env реально підхопився
console.log("ENV CHECK:", {
  hasKey: !!LIVEAVATAR_API_KEY,
  keyPrefix: (LIVEAVATAR_API_KEY || "").slice(0, 13),
  keyLen: (LIVEAVATAR_API_KEY || "").length,
  avatar: AVATAR_ID,
  context: CONTEXT_ID,
});

const TOKEN_URL = "https://api.liveavatar.com/v1/sessions/token";
const START_URL = "https://api.liveavatar.com/v1/sessions/start";

// -------- utils --------
async function readResponse(r) {
  const text = await r.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_) {
    // не JSON — ок, лишаємо text
  }
  return { text, json };
}

function ensureEnv(res) {
  if (!LIVEAVATAR_API_KEY) {
    res.status(500).json({ error: "Missing LIVEAVATAR_API_KEY in .env" });
    return false;
  }
  if (!AVATAR_ID) {
    res.status(500).json({ error: "Missing AVATAR_ID in .env" });
    return false;
  }
  if (!CONTEXT_ID) {
    res.status(500).json({ error: "Missing CONTEXT_ID in .env" });
    return false;
  }
  return true;
}

// -------- routes --------
app.get("/", (req, res) => {
  res.send("Backend OK ✅ Go to /health or /api/liveavatar/token-test");
});

app.get("/health", (req, res) => res.send("OK ✅"));

/**
 * 1) Create session token (FULL mode)
 * POST /api/liveavatar/token
 */
app.post("/api/liveavatar/token", async (req, res) => {
  try {
    if (!ensureEnv(res)) return;

    const payload = {
      mode: "FULL",
      avatar_id: AVATAR_ID,
      avatar_persona: {
        context_id: CONTEXT_ID,
        language: "uk",
      },
    };

    const r = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",

        // ✅ найчастіший формат у їхніх API
        "X-API-KEY": LIVEAVATAR_API_KEY,
        // ✅ дубль (інколи сервер дивиться лише на нижній регістр)
        "x-api-key": LIVEAVATAR_API_KEY,

        // ✅ інколи приймають і так (не завадить)
        Authorization: `Bearer ${LIVEAVATAR_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const { text, json } = await readResponse(r);

    console.log("TOKEN STATUS:", r.status);
    console.log("TOKEN BODY:", text);

    return res.status(r.status).json(json ?? { raw: text });
  } catch (e) {
    console.error("TOKEN ERROR:", e?.message || e);
    return res.status(500).json({ error: "Token request failed", details: e?.message || String(e) });
  }
});

/**
 * 2) Start session (returns LiveKit join data)
 * POST /api/liveavatar/start
 * body: { session_token }
 */
app.post("/api/liveavatar/start", async (req, res) => {
  try {
    const { session_token } = req.body;
    if (!session_token) return res.status(400).json({ error: "session_token is required" });

    const r = await fetch(START_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session_token}`,
      },
    });

    const { text, json } = await readResponse(r);

    console.log("START STATUS:", r.status);
    console.log("START BODY:", text);

    return res.status(r.status).json(json ?? { raw: text });
  } catch (e) {
    console.error("START ERROR:", e?.message || e);
    return res.status(500).json({ error: "Start request failed", details: e?.message || String(e) });
  }
});

/**
 * 3) Token test (GET)
 * Відкрий у браузері: http://localhost:5050/api/liveavatar/token-test
 */
app.get("/api/liveavatar/token-test", async (req, res) => {
  try {
    if (!ensureEnv(res)) return;

    const payload = {
      mode: "FULL",
      avatar_id: AVATAR_ID,
      avatar_persona: {
        context_id: CONTEXT_ID,
        language: "uk",
      },
    };

    const r = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": LIVEAVATAR_API_KEY,
        "x-api-key": LIVEAVATAR_API_KEY,
        Authorization: `Bearer ${LIVEAVATAR_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const { text, json } = await readResponse(r);

    console.log("TOKEN-TEST STATUS:", r.status);
    console.log("TOKEN-TEST BODY:", text);

    res.status(r.status).json(json ?? { raw: text });
  } catch (e) {
    console.error("TOKEN-TEST ERROR:", e?.message || e);
    res.status(500).json({
      error: "token-test failed",
      details: e?.message || String(e),
    });
  }
});

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
