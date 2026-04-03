import { NextResponse } from "next/server";

type Body = {
  message?: string;
  mode?: string;
  model?: string;
  apiKey?: string;
  learningStyle?: {
    subject?: string;
    quizDifficulty?: string;
    learningTone?: string;
  };
};

function systemPrompt(mode: string, learningStyle: Body["learningStyle"]) {
  const subj = learningStyle?.subject ?? "general topics";
  const diff = learningStyle?.quizDifficulty ?? "medium";
  const tone = learningStyle?.learningTone ?? "friendly";

  const modeHint =
    {
      reels4: "Reply with a short educational script split into 4 punchy reel beats (numbered). Keep each beat under ~40 words.",
      reels8: "Reply with 8 very short reel beats (numbered) for a learning reel. Keep language clear for students.",
      fullVideo: "Outline a longer lesson: hook, main explanation with 3 sections, recap, and one practice question.",
      notes: "Reply with concise study notes: bullets, key definitions, and a tiny recap.",
      quiz: "Reply with 5 multiple-choice questions (A–D) plus answers at the end.",
      meme: "Reply with a funny kid-safe meme concept + the educational idea it reinforces (keep it respectful).",
    }[mode] ?? "Help the learner understand their topic clearly and briefly.";

  return `You are Explainix, a learning assistant for kids and teens. Tone: ${tone}. Difficulty: ${diff}. Subject focus: ${subj}. ${modeHint} Do not ask for personal data. If the user is unsafe, refuse briefly.`;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const serverKey = process.env.OPENAI_API_KEY?.trim();
  const clientKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
  const apiKey = serverKey || clientKey;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing API key. Set OPENAI_API_KEY on the server or save a key in Settings." },
      { status: 400 },
    );
  }

  const model = body.model?.trim() || "gpt-4o-mini";
  const mode = body.mode?.trim() || "reels8";

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt(mode, body.learningStyle) },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 900,
    }),
  });

  const json = (await openaiRes.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };

  if (!openaiRes.ok) {
    const err = json.error?.message ?? "OpenAI request failed";
    return NextResponse.json({ error: err }, { status: 502 });
  }

  const reply = json.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    return NextResponse.json({ error: "Empty model response" }, { status: 502 });
  }

  return NextResponse.json({ reply });
}
