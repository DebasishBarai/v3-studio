"use client";

import { AbsoluteFill, Img, Series, staticFile, useCurrentFrame } from "remotion";
import { CachedAudio } from "../../components/video-editor/cached-audio";
import { Doc } from "../../convex/_generated/dataModel";
import { CachedOffthreadVideo } from "../../components/video-editor/cached-off-thread-video";
import { loadFont } from '@remotion/fonts';
// import { Audio } from "@remotion/media"
// import { OffthreadVideo } from "remotion";

export type Props = {
  video: Doc<"videos"> | null;
  isSubscribed?: boolean;
};

const fontFamily = "Pacifico"

loadFont({
  family: fontFamily,
  url: staticFile("/font/Pacifico-Regular.ttf"),
  weight: "400",
}).then(() => {
  console.log("Font loaded successfully");
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
                  <CachedAudio src={scene.audioUrl} volume={1} /> // change to Audio for lambda
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
                {/* Add Caption */}
                {scene.words && scene.words.length > 0 && (
                  <Caption
                    words={scene.words}
                  />
                )}
              </Series.Sequence>
            );
          })}
        </Series>
      </AbsoluteFill>
      {!isSubscribed && (
        <AbsoluteFill>
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Img alt="logo" src={staticFile("/logo.png")} width={80} height={80} />
            <h1 style={{
              fontSize: '1.5rem',      // text-2xl
              fontWeight: 'bold',      // font-bold
              color: '#eab308',        // text-yellow-500
              fontFamily: fontFamily,
              marginLeft: '10px'
            }}>V3 Studio</h1>
          </div>
        </AbsoluteFill>
      )}
      {video && video.music && (
        <CachedAudio src={video.music.previewUrl} loop={true} volume={0.1} /> // change to Audio for lambda
      )}
    </AbsoluteFill>
  );
};

const Caption: React.FC<{
  words: Doc<"videos">["scenes"][0]["words"];
}> = ({ words }) => {
  const frame = useCurrentFrame();

  if (!words) return null;

  const currentWord = words.find(word => {
    const wordStartFrame = (word.startMs / 1000) * 30;
    const wordEndFrame = (word.endMs / 1000) * 30;
    return frame >= wordStartFrame && frame <= wordEndFrame;
  });

  if (!currentWord) return null;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "flex-end",   // push to bottom
        alignItems: "center",
        paddingBottom: 80,            // adjust height from bottom
        pointerEvents: "none",        // prevent blocking clicks
      }}>
      <div style={{
        fontSize: "2.5rem",
        color: "white",
        textAlign: "center",
        background: "rgba(0,0,0,0.35)", // subtle subtitle background
        padding: "0.6rem 1.2rem",
        borderRadius: "0.5rem",
        maxWidth: "90%",
        lineHeight: 1.3,
      }}>
        {currentWord.text}
      </div>
    </AbsoluteFill>
  );
};
