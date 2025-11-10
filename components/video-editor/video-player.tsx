import { Player } from '@remotion/player'
import { RemotionVideo } from '@/components/remotion/remotion-video'
import { Doc } from '@/convex/_generated/dataModel'
import { useMemo, useEffect } from 'react'

// Function to preload videos in the background
const preloadVideos = (video: Doc<'videos'>) => {
  // Collect all video URLs from the video object
  const videoUrls: string[] = [];

  // Add final video URL if available
  if (video.videoUrl) {
    videoUrls.push(video.videoUrl);
  }

  // Add all scene video URLs
  if (video.scenes) {
    video.scenes.forEach((scene) => {
      if (scene.videoUrl) {
        videoUrls.push(scene.videoUrl);
      }
    });
  }

  // Preload all videos in the background
  videoUrls.forEach((url) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';
    video.src = url;

    // Start loading silently in background
    video.load();

    // Keep reference to prevent garbage collection during load
    // The browser will cache this for future use
    video.addEventListener('canplaythrough', () => {
      console.log('Video cached:', url);
    }, { once: true });

    video.addEventListener('error', (e) => {
      console.error('Video preload error:', url, e);
    }, { once: true });
  });
};

export const VideoPlayer = ({ video }: { video: Doc<'videos'> }) => {
  // Preload all videos when component mounts or video changes
  useEffect(() => {
    if (video) {
      preloadVideos(video);
    }
  }, [video]);

  // Calculate total duration in frames
  const totalDurationInFrames = useMemo(() => {
    const fps = 30;
    const defaultImageDuration = 5 * fps; // 5 seconds in frames

    // If final video is available, we don't know its duration yet
    // Use a default of 60 seconds (can be adjusted)
    if (video.videoUrl) {
      return 60 * fps;
    }

    // If no scenes, show placeholder for 5 seconds
    if (!video.scenes || video.scenes.length === 0) {
      return defaultImageDuration;
    }

    // Calculate total duration based on number of scenes
    // Each scene is 5 seconds (videos will be dynamically loaded)
    return video.scenes.length * defaultImageDuration;
  }, [video.videoUrl, video.scenes]);

  return (
    <div>
      <Player
        component={RemotionVideo}
        durationInFrames={totalDurationInFrames}
        fps={30}
        compositionWidth={video.aspectRatio === '16:9' ? 1920 : 1080}
        compositionHeight={video.aspectRatio === '16:9' ? 1080 : 1920}
        inputProps={{ video: video }}
        controls
        autoPlay
        loop
      />
    </div>
  )
}
