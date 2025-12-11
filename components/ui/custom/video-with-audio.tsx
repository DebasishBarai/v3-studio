import { useEffect, useRef } from "react";

interface VideoWithAudioProps {
  videoUrl: string;
  audioUrl: string;
}

export default function VideoWithAudio({ videoUrl, audioUrl }: VideoWithAudioProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio) return;

    // Sync handlers — fully typed
    const handlePlay = () => {
      audio.play().catch(() => { });
    };

    const handlePause = () => {
      audio.pause();
    };

    const handleSeeking = () => {
      audio.currentTime = video.currentTime;
    };

    const handleTimeUpdate = () => {
      const diff = Math.abs(video.currentTime - audio.currentTime);
      if (diff > 0.2) {
        audio.currentTime = video.currentTime;
      }
    };

    // Add listeners
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Cleanup
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full rounded-lg object-cover hide-volume"
      />

      <audio ref={audioRef} src={audioUrl} preload="auto" />
    </div>
  );
}
