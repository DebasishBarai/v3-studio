"use client";

import { AbsoluteFill, Series } from "remotion";
import { Audio } from "@remotion/media";
import { Doc } from "../../convex/_generated/dataModel";
import { CachedOffthreadVideo } from "../../components/video-editor/cached-off-thread-video";
import Image from "next/image";
import { loadFont } from '@remotion/google-fonts/Pacifico';

export type Props = {
  video: Doc<"videos"> | null;
  isSubscribed?: boolean;
};

const { fontFamily } = loadFont();

export const RemotionVideo: React.FC<Props> = ({ video, isSubscribed }) => {
  return (
    <AbsoluteFill className="bg-black">
      <AbsoluteFill>
        <Series>
          {video?.scenes.map((scene, i) => {
            return (
              <Series.Sequence key={i} durationInFrames={(scene.videoDurationInSeconds ?? 5) * 30}>

                {/* Add Audio for each scene */}
                {scene.audioUrl && (
                  <Audio src={scene.audioUrl} volume={1} />
                )}

                {scene.videoUrl ? (
                  <CachedOffthreadVideo // change to OffthreadVideo for lambda
                    src={scene.videoUrl}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "0.5rem",
                    }}
                    muted={false}
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
      {!isSubscribed && (
        <AbsoluteFill>
          <div className="w-full h-full flex items-center justify-center">
            <Image alt="logo" src="/logo.png" width={80} height={80} />
            <h1 className={`text-2xl font-bold text-yellow-500`} style={{ fontFamily }}>V3 Studio</h1>
          </div>
        </AbsoluteFill>
      )}
      {/* {video && video.music && ( */}
      {/*   <Audio src={video.music.previewUrl} loop={true} volume={0.1} /> */}
      {/* )} */}
    </AbsoluteFill>
  );
};
