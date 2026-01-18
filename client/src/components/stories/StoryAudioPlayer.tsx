import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoryAudioPlayerProps {
  audioUrl?: string;
  className?: string;
  playbackRate?: number;
  onTimeUpdate?: (currentTime: number) => void;
}

export function StoryAudioPlayer({ audioUrl, className, playbackRate = 0.8, onTimeUpdate }: StoryAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(playbackRate);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingRef = useRef(false);

  // Initialize audio element (only when audioUrl changes)
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.playbackRate = speed;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        if (onTimeUpdate) {
          onTimeUpdate(audio.currentTime);
        }
      }
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    audio.volume = isMuted ? 0 : volume;

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl, onTimeUpdate]);

  // Update volume and mute (without recreating audio)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  // Update playback speed (preserve playing state)
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      const currentTime = audioRef.current.currentTime;
      audioRef.current.playbackRate = speed;
      // Restore playing state if it was playing
      if (wasPlaying) {
        audioRef.current.currentTime = currentTime;
        audioRef.current.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    }
  }, [speed]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newProgress = value[0];
    const newTime = (newProgress / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newProgress);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume;
    }
  };

  if (!audioUrl) {
    return null;
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = audioRef.current ? audioRef.current.currentTime : 0;

  return (
    <div className={cn('bg-card border rounded-lg p-4 space-y-3', className)}>
      {/* Play/Pause Button and Progress */}
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isPlaying ? 'Duraklat' : 'Oynat'}</p>
          </TooltipContent>
        </Tooltip>

        <div className="flex-1 space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Slider
                value={[progress]}
                onValueChange={handleProgressChange}
                max={100}
                step={0.1}
                className="w-full"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>İlerleme çubuğu - tıklayarak ilerleyebilirsiniz</p>
            </TooltipContent>
          </Tooltip>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Speed, Volume Controls */}
      <div className="flex items-center gap-4">
        {/* Speed Control */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground min-w-[60px]">Hız: {speed.toFixed(1)}x</span>
              <Slider
                value={[speed * 100]}
                onValueChange={(value) => setSpeed(value[0] / 100)}
                min={25}
                max={100}
                step={5}
                className="w-24"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ses hızını ayarlayın (0.25x - 1.0x)</p>
          </TooltipContent>
        </Tooltip>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isMuted ? 'Sesi Aç' : 'Sesi Kapat'}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-24"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Ses seviyesini ayarlayın</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

