"use client";

import { AbsoluteFill, Img, interpolate, Series, spring, staticFile, useCurrentFrame } from "remotion";
import { CachedAudio } from "../../components/video-editor/cached-audio";
import { Doc } from "../../convex/_generated/dataModel";
import { CachedOffthreadVideo } from "../../components/video-editor/cached-off-thread-video";
import { loadFont } from '@remotion/fonts';
import { captionStyleSchema } from "@/convex/schema";
import { Infer } from "convex/values";
// import { Html5Audio } from "remotion"
// import { OffthreadVideo } from "remotion";

export type Props = {
  video: Doc<"videos"> | null;
  isSubscribed?: boolean;
};

loadFont({
  family: 'Pacifico',
  url: staticFile("/font/Pacifico.ttf"),
  weight: "400",
}).then(() => {
  console.log("Font Komika loaded successfully");
})

loadFont({
  family: 'Bangers',
  url: staticFile("/font/Bangers.ttf"),
  weight: "400",
}).then(() => {
  console.log("Font Komika loaded successfully");
})

loadFont({
  family: 'Komika',
  url: staticFile("/font/Komika.ttf"),
  weight: "400",
}).then(() => {
  console.log("Font Komika loaded successfully");
})

loadFont({
  family: 'Coiny',
  url: staticFile("/font/Coiny.ttf"),
  weight: "400",
}).then(() => {
  console.log("Font Komika loaded successfully");
})

export const RemotionVideo: React.FC<Props> = ({ video, isSubscribed }) => {
  return (
    <AbsoluteFill className="bg-black">
      <AbsoluteFill>
        <Series>
          {video?.scenes.map((scene, i) => {
            return (
              <Series.Sequence key={i} durationInFrames={(scene.videoDurationInSeconds ?? 5) * 30}>
                <SceneContent scene={scene} sceneIndex={i} captionStyle={video?.captionStyle} />
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
              fontFamily: 'Pacifico',
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

// New component to handle individual scene rendering
const SceneContent: React.FC<{
  scene: Doc<"videos">["scenes"][0];
  sceneIndex: number;
  captionStyle?: Infer<typeof captionStyleSchema>;
  muted?: boolean;
}> = ({ scene, sceneIndex, captionStyle }) => {
  const frame = useCurrentFrame(); // This now gets the LOCAL frame within this sequence

  // Calculate animations based on LOCAL frame
  const scale = spring({
    frame,
    fps: 30,
    from: 2, // Start zoomed in
    to: 1, // Zoom out to normal
    config: {
      damping: 25,
      stiffness: 30,
      mass: 2,
    },
  });

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });
  // Shake rotation effect - only at the start of each scene
  const shakeRotation = spring({
    frame,
    fps: 30,
    from: 5,
    to: 0,
    config: {
      damping: 8,
      stiffness: 200,
    },
  });

  // Alternating shake direction for more dynamic effect
  const rotation = Math.sin(frame * 2) * shakeRotation;
  return (
    <>
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
      ) : scene.imageUrl ? (
        <Img
          src={scene.imageUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "0.5rem",
            transform: `scale(${scale})`,
            opacity: opacity,
          }}
        />
      ) : (
        <AbsoluteFill className="flex items-center justify-center text-white text-2xl">
          No video URL for scene {sceneIndex + 1}
        </AbsoluteFill>
      )}
      {/* Add Caption */}
      {scene.words && scene.words.length > 0 && captionStyle?.showCaption && (
        <Caption
          captionStyle={captionStyle}
          words={scene.words}
        />
      )}
    </>
  );
};

const Caption: React.FC<{
  captionStyle?: Infer<typeof captionStyleSchema>;
  words: Doc<"videos">["scenes"][0]["words"];
}> = ({ captionStyle, words }) => {
  const frame = useCurrentFrame();

  if (!words) return null;

  // Get words per batch setting, default to 1
  const wordsPerBatch = captionStyle?.wordsPerBatch ?? 1;

  // Find active word index
  const activeWordIndex = words.findIndex(word => {
    const start = (word.startMs / 1000) * 30;
    const end = (word.endMs / 1000) * 30;
    return frame >= start && frame <= end;
  });

  if (activeWordIndex === -1) return null;

  // Calculate batch start index
  const batchStartIndex =
    Math.floor(activeWordIndex / wordsPerBatch) * wordsPerBatch;

  // Get batched words
  const currentBatch = words.slice(
    batchStartIndex,
    batchStartIndex + wordsPerBatch
  );

  // This is the animated word
  const currentWord = words[activeWordIndex];

  // Default values
  const textColor = captionStyle?.textColor ?? "#FFFC00";
  const backgroundColor = captionStyle?.backgroundColor ?? "#000000";
  const backgroundOpacity = captionStyle?.backgroundOpacity ?? 0.9;
  const fontSize = captionStyle?.textSize ?? "3.5rem";
  const position = captionStyle?.position ?? "bottom";
  const showBackground = captionStyle?.showBackground ?? true;
  const textAlign = captionStyle?.textAlign ?? "center";
  const fontFamily = captionStyle?.fontFamily ?? "Pacifico"
  const textTransform = captionStyle?.textTransform ?? "none"
  const bgCurrentWord = captionStyle?.bgCurrentWord ?? true
  const currentWordBounce = captionStyle?.currentWordBounce ?? true

  const wordStartFrame = (currentWord.startMs / 1000) * 30;
  const localFrame = Math.max(0, frame - wordStartFrame);
  // Bounce animation
  const bounce = spring({
    fps: 30,
    frame: localFrame,
    from: 0,
    to: 1,
    config: {
      damping: 8,
      stiffness: 300,
    },
  });

  // Scale animation
  const scale = 0.9 + bounce * 0.3;

  // Vertical movement
  const translateY = (1 - bounce) * 15;

  // Glow effect
  const glowIntensity = Math.sin(frame / 8) * 0.3 + 0.7;

  // Rotate slightly for dynamic feel
  const rotate = Math.sin(frame / 15) * 2;

  // Parse the advanced styles
  const advancedStyles = captionStyle?.advancedStyle
    ? JSON.parse(captionStyle.advancedStyle)
    : {};

  // Position mapping
  const positionStyles = {
    top: { justifyContent: "flex-start", paddingTop: 80 },
    middle: { justifyContent: "center" },
    bottom: { justifyContent: "flex-end", paddingBottom: 80 },
  };

  // Convert hex + opacity to rgba
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
        ...positionStyles[position as keyof typeof positionStyles],
      }}
    >
      <div
        style={{
          fontSize: fontSize,
          color: textColor,
          textAlign: textAlign as "left" | "center" | "right",
          background: showBackground && !bgCurrentWord ? hexToRgba(backgroundColor, backgroundOpacity) : "transparent",
          padding: showBackground && !bgCurrentWord ? "0.6rem 1.2rem" : "0",
          borderRadius: showBackground && !bgCurrentWord ? "0.5rem" : "0",
          maxWidth: "90%",
          lineHeight: 1.3,
          fontFamily: fontFamily,
          textTransform: textTransform,
          // transform: `scale(${scale}) translateY(${translateY}px) rotate(${rotate}deg)`,
          ...advancedStyles
        }}
      >
        {/* Display words with space between them */}
        {currentBatch.map((word, index) => {
          const isActive = word === currentWord;

          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                marginRight: "0.35rem",
                color: isActive ? textColor : "#ffffff",
                background: isActive && showBackground && bgCurrentWord ? hexToRgba(backgroundColor, backgroundOpacity) : "transparent",
                padding: isActive && showBackground && bgCurrentWord ? "0.6rem 1.2rem" : "0",
                borderRadius: isActive && showBackground && bgCurrentWord ? "0.5rem" : "0",
                transform: isActive && currentWordBounce
                  ? `scale(${scale}) translateY(${translateY}px) rotate(${rotate}deg)`
                  : "none",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill >
  );
};
