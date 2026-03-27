export type OutputMode = "reels4" | "reels8" | "fullVideo" | "meme" | "imageExplanation";

export const modeOptions: { id: OutputMode; label: string; hint: string }[] = [
  { id: "reels4", label: "Reels (4)", hint: "4 short clips" },
  { id: "reels8", label: "Reels (8)", hint: "8 short clips" },
  { id: "fullVideo", label: "Full Video", hint: "One long format" },
  { id: "meme", label: "Meme", hint: "Concept as humor" },
  { id: "imageExplanation", label: "Image Explanation", hint: "Visual breakdown" },
];

type ModeSelectorProps = {
  selectedMode: OutputMode;
  onSelect: (mode: OutputMode) => void;
};

export function ModeSelector({ selectedMode, onSelect }: ModeSelectorProps) {
  return (
    <div className="w-full">
      <p className="mb-3 text-sm font-medium text-gray-200">Output Type</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {modeOptions.map((mode) => {
          const active = selectedMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSelect(mode.id)}
              className={`glass-hover rounded-2xl border px-3 py-3 text-left transition ${
                active
                  ? "border-indigo-400/70 bg-indigo-500/20 shadow-glow"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <span className="block text-sm font-semibold text-gray-100">{mode.label}</span>
              <span className="mt-0.5 block text-xs text-gray-400">{mode.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
