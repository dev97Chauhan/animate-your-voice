import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Scissors } from "lucide-react";
import { toast } from "sonner";

interface MediaTrimmerProps {
  file: File;
  type: 'video' | 'audio';
  onTrimmed: (startTime: number, endTime: number) => void;
}

export const MediaTrimmer = ({ file, type, onTrimmed }: MediaTrimmerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimRange, setTrimRange] = useState<[number, number]>([0, 0]);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

  useEffect(() => {
    if (mediaRef.current) {
      const media = mediaRef.current;
      
      const handleLoadedMetadata = () => {
        setDuration(media.duration);
        setTrimRange([0, media.duration]);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(media.currentTime);
      };

      media.addEventListener('loadedmetadata', handleLoadedMetadata);
      media.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        media.removeEventListener('loadedmetadata', handleLoadedMetadata);
        media.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [file]);

  const togglePlayPause = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (mediaRef.current) {
      const time = value[0];
      mediaRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTrimRangeChange = (value: number[]) => {
    setTrimRange([value[0], value[1]]);
  };

  const resetTrim = () => {
    setTrimRange([0, duration]);
    toast.info('Trim range reset');
  };

  const applyTrim = () => {
    onTrimmed(trimRange[0], trimRange[1]);
    toast.success(`${type === 'video' ? 'Video' : 'Audio'} trimmed: ${trimRange[0].toFixed(1)}s - ${trimRange[1].toFixed(1)}s`);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-card/80 backdrop-blur-glass border border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
          {type === 'video' ? 'Video' : 'Audio'} Trimmer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Media Element */}
        <div className="space-y-4">
          {type === 'video' ? (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={URL.createObjectURL(file)}
              className="w-full max-h-64 rounded-lg bg-black"
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            <div className="relative">
              <audio
                ref={mediaRef as React.RefObject<HTMLAudioElement>}
                src={URL.createObjectURL(file)}
                className="w-full"
                onEnded={() => setIsPlaying(false)}
              />
              {/* Audio Waveform Placeholder */}
              <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-lg flex items-center justify-center mt-4">
                <div className="flex items-end gap-1 h-16">
                  {Array.from({ length: 50 }, (_, i) => (
                    <div
                      key={i}
                      className="bg-primary/60 rounded-sm animate-pulse"
                      style={{
                        width: '2px',
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Media Controls */}
          <div className="flex items-center gap-4">
            <Button
              variant="glass"
              size="icon"
              onClick={togglePlayPause}
              className="hover:scale-110"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <div className="flex-1 space-y-2">
              <Slider
                value={[currentTime]}
                onValueChange={handleSeek}
                max={duration}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trim Controls */}
        <div className="space-y-4 p-4 rounded-lg bg-card/50 border border-white/5">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Trim Range</h4>
            <Button variant="ghost" size="sm" onClick={resetTrim}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
          
          <div className="space-y-2">
            <Slider
              value={trimRange}
              onValueChange={handleTrimRangeChange}
              max={duration}
              step={0.1}
              className="w-full"
              minStepsBetweenThumbs={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Start: {formatTime(trimRange[0])}</span>
              <span>End: {formatTime(trimRange[1])}</span>
            </div>
            <div className="text-center text-sm text-primary">
              Duration: {formatTime(trimRange[1] - trimRange[0])}
            </div>
          </div>
          
          <Button
            variant="gradient"
            onClick={applyTrim}
            className="w-full"
            disabled={trimRange[1] - trimRange[0] < 0.1}
          >
            <Scissors className="h-4 w-4 mr-2" />
            Apply Trim
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};