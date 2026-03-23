import { useRef, useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const LYRICS = [
  "What's the weather like today?",
  "Sunny, windy - come and play!",
  "Rainy, cloudy, cold or hot,",
  "Choose your clothes to match the spot.",
  "Wear your coat, wear your hat,",
  "Boots and gloves - just like that!",
  "Shirt and trousers, skirt and shoes,",
  "Pick the best ones you can use.",
  "Spring and summer, autumn, winter,",
  "Raindrops fall and snowflakes glitter.",
  "If it's cold and snowy - hey,",
  "Put on your scarf before you play.",
  "Wear your coat, wear your hat,",
  "Boots and gloves - just like that!",
  "Shirt and trousers, skirt and shoes,",
  "Pick the best ones you can use.",
  "What's the weather like today?",
  "Sunny and warm- come and play!",
  "Spring and summer, autumn, winter,",
  "Raindrops fall and snowflakes glitter.",
  "Wear your coat, wear your hat,",
  "Boots and gloves - just like that!",
  "Shorts and T-shirt, warm and light,",
  "Dress for weather, feel all right.",
];

// Line start times (seconds) for karaoke sync.
const LINE_TIMINGS: number[] | null = [
  8.371, 10.664, 12.523, 14.391, 16.51, 18.473, 20.061, 22.248, 27.147, 30.968,
  34.7, 38.706, 44.577, 46.432, 48.293, 50.161, 72.471, 75.833, 79.662, 83.377,
  91.775, 93.539, 95.227, 97.35,
];

const LINES_VISIBLE = 5;

function getCurrentLineIndex(currentTime: number, duration: number): number {
  const totalLines = LYRICS.length;
  const lineDuration = duration > 0 ? duration / totalLines : 10;
  return Math.min(totalLines - 1, Math.max(0, Math.floor(currentTime / lineDuration)));
}

function getCurrentLineIndexFromTimings(currentTime: number, timings: number[]): number {
  let idx = 0;
  for (let i = 0; i < timings.length; i++) {
    if (currentTime >= timings[i]) idx = i;
  }
  return idx;
}

export default function WhatsTheWeatherLikeTodaySong() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const mp3FileName = "Whats the Weather Like Today.mp3";
  const totalLines = LYRICS.length;

  const currentLineIndex =
    LINE_TIMINGS && duration > 0
      ? getCurrentLineIndexFromTimings(currentTime, LINE_TIMINGS)
      : getCurrentLineIndex(currentTime, duration);
  const windowStart = Math.max(0, Math.min(currentLineIndex - 1, totalLines - LINES_VISIBLE));
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
          src={`/songs/grade-4/unit-8/${encodeURIComponent(mp3FileName)}`}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        <div className="mb-6">
          <Link href="/primary-school/grade-4/unit-8/games">
            <a className="text-sm text-muted-foreground hover:underline">← Grade 4 Unit 8</a>
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-2">What's the Weather Like Today?</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-card border border-border mb-8">
          <Button
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
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
            Put <code className="bg-muted px-1 rounded">{mp3FileName}</code> in{" "}
            <code className="bg-muted px-1 rounded">client/public/songs/grade-4/unit-8/</code> to play the song.
          </p>
        )}
      </div>
    </Layout>
  );
}
