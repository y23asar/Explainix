type ImageCardProps = {
  title: string;
  variant: "meme" | "imageExplanation";
};

export function ImageCard({ title, variant }: ImageCardProps) {
  const accent = variant === "meme" ? "from-fuchsia-500/35" : "from-cyan-500/35";

  return (
    <article className="glass-hover overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-lg">
      <div className={`aspect-[4/3] w-full bg-gradient-to-br ${accent} via-slate-800 to-black`} />
      <div className="px-4 py-3">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-100">{title}</h3>
      </div>
    </article>
  );
}
