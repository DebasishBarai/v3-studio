"use client";

import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Doc } from "@/convex/_generated/dataModel";
import { sceneSchema } from "@/convex/schema";
import { Infer } from "convex/values";
import { CachedOffthreadVideo } from "@/components/video-editor/cached-off-thread-video"; // 👈 new import
import { useEffect, useState, useMemo } from "react";

type Props = {
  video: Doc<"videos"> | null;
};

type SceneWithDuration = Infer<typeof sceneSchema> & {
  durationInFrames?: number;
};

// Utility to convert "16:9" → numeric ratio (1.77)
function parseAspectRatio(ratio: string): number {
  const [w, h] = ratio.split(":").map(Number);
  if (!w || !h) return 16 / 9;
  return w / h;
}

export const RemotionVideo: React.FC<Props> = ({ video }) => {
  const { fps } = useVideoConfig();
  const [scenesWithDurations, setScenesWithDurations] = useState<SceneWithDuration[]>([]);

  // Compute numeric aspect ratio (width / height)
  const aspectRatio = useMemo(() => {
    if (!video?.aspectRatio) return 16 / 9;
    return parseAspectRatio(video.aspectRatio);
  }, [video?.aspectRatio]);

  useEffect(() => {
    if (!video?.scenes) return;

    const scenes = video.scenes as Infer<typeof sceneSchema>[];

    const loadDurations = async () => {
      const updatedScenes = await Promise.all(
        scenes.map(async (scene) => {
          if (!scene.videoUrl) {
            // Default duration = 5 seconds
            return { ...scene, durationInFrames: 5 * fps };
          }

          try {
            const videoEl = document.createElement("video");
            videoEl.src = scene.videoUrl;

            await new Promise<void>((resolve, reject) => {
              videoEl.onloadedmetadata = () => resolve();
              videoEl.onerror = () => reject();
            });

            const durationInFrames = Math.floor(videoEl.duration * fps);
            return { ...scene, durationInFrames };
          } catch {
            return { ...scene, durationInFrames: 5 * fps };
          }
        })
      );

      setScenesWithDurations(updatedScenes);
    };

    loadDurations();
  }, [video, fps]);

  if (!video || !video?.scenes) {
    return (
      <AbsoluteFill className="flex items-center justify-center bg-black text-white">
        No video data available
      </AbsoluteFill>
    );
  }

  if (scenesWithDurations.length === 0) {
    return (
      <AbsoluteFill className="flex items-center justify-center bg-black text-white">
        Loading scenes...
      </AbsoluteFill>
    );
  }

  let currentFrame = 0;

  return (
    <div
      className="relative mx-auto bg-black rounded-lg overflow-hidden"
      style={{
        // Maintain aspect ratio using padding technique for responsiveness
        width: "100%",
        maxWidth: "900px", // Desktop cap
        aspectRatio: `${aspectRatio}`,
        // For older browsers not supporting `aspect-ratio`:
        paddingTop: `${100 / aspectRatio}%`,
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AbsoluteFill className="bg-black">
          {scenesWithDurations.map((scene, i) => {
            const startFrame = currentFrame;
            const durationInFrames = scene.durationInFrames ?? 5 * fps;
            currentFrame += durationInFrames;

            return (
              <Sequence from={startFrame} durationInFrames={durationInFrames} key={i}>
                {scene.videoUrl ? (
                  <CachedOffthreadVideo
                    src={scene.videoUrl}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "0.5rem",
                    }}
                    muted
                  />
                ) : (
                  <AbsoluteFill className="flex items-center justify-center text-white">
                    No video URL for scene {i + 1}
                  </AbsoluteFill>
                )}
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </div>
    </div>
  );
};
