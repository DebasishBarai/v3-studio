"use client";

import { AbsoluteFill, Series, Html5Audio } from "remotion";
import { Doc } from "../../convex/_generated/dataModel";
import { CachedOffthreadVideo } from "../../components/video-editor/cached-off-thread-video";
import Image from "next/image";
import { Pacifico } from 'next/font/google';

type Props = {
  video: Doc<"videos"> | null;
  isSubscribed?: boolean;
};

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
})

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
                  <Html5Audio src={scene.audioUrl} />
                )}

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
      {!isSubscribed && (
        <AbsoluteFill>
          <div className="w-full h-full flex items-center justify-center">
            <Image alt="logo" src="/logo.png" width={80} height={80} />
            <h1 className={`text-2xl font-bold text-yellow-500 ${pacifico.className}`}>V3 Studio</h1>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
