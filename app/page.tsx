"use client";

import { useState } from "react";
import { GenerateButton } from "@/components/GenerateButton";
import { InputBox } from "@/components/InputBox";
import { ModeSelector, OutputMode } from "@/components/ModeSelector";
import { Navbar } from "@/components/Navbar";
import { OutputData, OutputDisplay } from "@/components/OutputDisplay";

async function generateContent(topic: string, mode: OutputMode): Promise<OutputData> {
  // Placeholder backend call for future API integration.
  await new Promise((resolve) => setTimeout(resolve, 1400));

  if (mode === "fullVideo") {
    return {
      videos: [
        {
          id: "full-1",
          title: `${topic} - Complete Concept Walkthrough`,
          duration: "12:43",
        },
      ],
    };
  }

  if (mode === "meme" || mode === "imageExplanation") {
    return {
      images: Array.from({ length: mode === "meme" ? 4 : 3 }).map((_, idx) => ({
        id: `${mode}-${idx + 1}`,
        title:
          mode === "meme"
            ? `${topic} Meme #${idx + 1}`
            : `${topic} Visual Explanation #${idx + 1}`,
      })),
    };
  }

  const reelCount = mode === "reels4" ? 4 : 8;
  return {
    videos: Array.from({ length: reelCount }).map((_, idx) => ({
      id: `reel-${idx + 1}`,
      title: `${topic} Reel ${idx + 1}`,
      duration: `0:${(25 + idx).toString().padStart(2, "0")}`,
    })),
  };
}

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [selectedMode, setSelectedMode] = useState<OutputMode>("reels4");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<OutputData | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const generated = await generateContent(topic.trim(), selectedMode);
      setOutput(generated);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-black/35 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">What should Explainix generate?</h2>
              <p className="mt-1 text-sm text-gray-400">Create reels, full videos, memes, or visual explainers in one click.</p>
            </div>

            <InputBox value={topic} onChange={setTopic} />
            <ModeSelector selectedMode={selectedMode} onSelect={setSelectedMode} />

            <GenerateButton onClick={handleGenerate} loading={loading} disabled={!topic.trim()} />
          </div>
        </section>

        <OutputDisplay mode={selectedMode} loading={loading} output={output} />
      </div>
    </main>
  );
}
