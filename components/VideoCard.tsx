type VideoCardProps = {
  title: string;
  duration: string;
};

export function VideoCard({ title, duration }: VideoCardProps) {
  return (
    <article className="glass-hover overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-lg">
      <div className="relative aspect-[9/16] w-full bg-gradient-to-br from-indigo-500/30 via-slate-800 to-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full border border-white/40 bg-black/40 p-4 backdrop-blur">
            <div className="h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
          </div>
        </div>
        <span className="absolute right-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs text-gray-100">
          {duration}
        </span>
      </div>
      <div className="px-4 py-3">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-100">{title}</h3>
      </div>
    </article>
  );
}
