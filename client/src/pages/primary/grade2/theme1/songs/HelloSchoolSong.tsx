import { useRef, useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

// Lyrics as separate lines for karaoke (14 lines)
const LYRICS = [
  "Hello, hello, how are you?",
  "Hello, hello, I'm fine!",
  "Hello, hello, how are you?",
  "Hello, hello, I'm fine!",
  "Hello, Mrs Sunny, hello!",
  "Hello, my friend, hello!",
  "Girl and boy, student too,",
  "Hello, hello, me and you!",
  "Today is Monday, yes it's true,",
  "We are at school, me and you.",
  "Classroom, library, come and see,",
  "Playground, garden, happy we!",
  "Goodbye, goodbye, see you soon,",
  "Goodbye, goodbye, see you!",
];

/**
 * Optional: start time in seconds for each line.
 * If provided (same length as LYRICS), karaoke uses these for precise sync.
 * How to build: play the MP3, pause at each line start, and note the time (e.g. 0, 3.2, 6.5, 9.1 ...).
 * Leave null to use equal split of duration across lines.
 */
const LINE_TIMINGS: number[] | null = null;
// Example for a ~60s song (fill with your actual times):
// const LINE_TIMINGS = [0, 3, 6, 9, 13, 16, 19, 22, 26, 29, 32, 35, 39, 42];

const LINES_VISIBLE = 5;

function getCurrentLineIndex(currentTime: number, duration: number): number {
  const totalLines = LYRICS.length;
  const lineDuration = duration > 0 ? duration / totalLines : 10;
  return Math.min(totalLines - 1, Math.max(0, Math.floor(currentTime / lineDuration)));
}

export default function HelloSchoolSong() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const totalLines = LYRICS.length;
  const currentLineIndex = getCurrentLineIndex(currentTime, duration);
  const windowStart = Math.max(
    0,
    Math.min(currentLineIndex - 1, totalLines - LINES_VISIBLE)
  );
  const visibleLines = LYRICS.slice(windowStart, windowStart + LINES_VISIBLE);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    setMuted((m) => !m);
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (v > 0) setMuted(false);
  };

  return (
    <Layout>
      <div className="min-h-[60vh] py-6 px-4 max-w-2xl mx-auto">
        <audio
          ref={audioRef}
          src="/songs/grade-2/theme-1/hello-school.mp3"
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        <div className="mb-6">
          <Link href="/primary-school/grade-2/theme-1/songs">
            <a className="text-sm text-muted-foreground hover:underline">← Songs</a>
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-2">Hello School</h1>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-card border border-border mb-8">
          <Button
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={onVolumeChange}
              className="w-24 h-2 accent-primary"
              aria-label="Volume"
            />
          </div>
        </div>

        {/* Karaoke: 4 lines, current line bigger and highlighted */}
        <div className="rounded-xl bg-card/80 border border-border p-6 min-h-[200px] flex flex-col justify-center">
          <div className="space-y-2 text-center">
            {visibleLines.map((line, i) => {
              const globalIndex = windowStart + i;
              const isCurrent = globalIndex === currentLineIndex;
              return (
                <div
                  key={globalIndex}
                  className={`transition-all duration-300 ${
                    isCurrent
                      ? "text-lg sm:text-xl font-semibold text-primary drop-shadow-sm"
                      : "text-sm sm:text-base text-muted-foreground"
                  }`}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>

        {duration === 0 && (
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Put <code className="bg-muted px-1 rounded">hello-school.mp3</code> in{" "}
            <code className="bg-muted px-1 rounded">client/public/songs/grade-2/theme-1/</code> to play the song.
          </p>
        )}
      </div>
    </Layout>
  );
}
