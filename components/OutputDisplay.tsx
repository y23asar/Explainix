import { OutputMode } from "@/components/ModeSelector";
import { ImageCard } from "@/components/ImageCard";
import { VideoCard } from "@/components/VideoCard";

type VideoItem = {
  id: string;
  title: string;
  duration: string;
};

type ImageItem = {
  id: string;
  title: string;
};

type OutputData = {
  videos?: VideoItem[];
  images?: ImageItem[];
};

type OutputDisplayProps = {
  mode: OutputMode;
  loading: boolean;
  output: OutputData | null;
};

function LoadingSkeleton({ mode }: { mode: OutputMode }) {
  if (mode === "fullVideo") {
    return <div className="h-72 w-full animate-pulseSoft rounded-2xl border border-white/10 bg-white/5 sm:h-96" />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-64 animate-pulseSoft rounded-2xl border border-white/10 bg-white/5" />
      ))}
    </div>
  );
}

export function OutputDisplay({ mode, loading, output }: OutputDisplayProps) {
  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Generated Output</h2>
      </div>

      {loading && <LoadingSkeleton mode={mode} />}

      {!loading && !output && (
        <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-8 text-center text-sm text-gray-400">
          Generate content to see results.
        </div>
      )}

      {!loading && output && (mode === "reels4" || mode === "reels8") && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {output.videos?.map((video) => (
            <VideoCard key={video.id} title={video.title} duration={video.duration} />
          ))}
        </div>
      )}

      {!loading && output && mode === "fullVideo" && output.videos?.[0] && (
        <div className="mx-auto max-w-3xl">
          <article className="glass-hover overflow-hidden rounded-3xl border border-white/10 bg-panel shadow-lg">
            <div className="relative aspect-video w-full bg-gradient-to-br from-indigo-500/30 via-slate-800 to-black">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full border border-white/40 bg-black/40 p-5 backdrop-blur">
                  <div className="h-0 w-0 border-y-[12px] border-l-[20px] border-y-transparent border-l-white" />
                </div>
              </div>
              <span className="absolute right-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs text-gray-100">
                {output.videos[0].duration}
              </span>
            </div>
            <div className="px-5 py-4">
              <h3 className="text-base font-semibold text-gray-100">{output.videos[0].title}</h3>
            </div>
          </article>
        </div>
      )}

      {!loading && output && (mode === "meme" || mode === "imageExplanation") && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {output.images?.map((image) => (
            <ImageCard key={image.id} title={image.title} variant={mode} />
          ))}
        </div>
      )}
    </section>
  );
}

export type { OutputData };
