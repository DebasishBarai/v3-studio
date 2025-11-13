"use client";

import { AbsoluteFill, Series } from "remotion";
import { Doc } from "@/convex/_generated/dataModel";
import { CachedOffthreadVideo } from "@/components/video-editor/cached-off-thread-video";

type Props = {
  video: Doc<"videos"> | null;
};

export const RemotionVideo: React.FC<Props> = ({ video }) => {
  return (
    <AbsoluteFill className="bg-black">
      <Series>
        {video?.scenes.map((scene, i) => {
          return (
            <Series.Sequence key={i} durationInFrames={(scene.videoDurationInSeconds ?? 5) * 30}>
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
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
