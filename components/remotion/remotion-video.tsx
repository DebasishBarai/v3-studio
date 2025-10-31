import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  text: string;
}

export const RemotionVideo: React.FC<Props> = ({ text }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const displayText = `This is frame: ${frame} and duration is: ${durationInFrames}. Hi ${text}`;

  return (
    <AbsoluteFill style={{ backgroundColor: "black", fontSize: 50 }}>
      {displayText}
    </AbsoluteFill>
  )
}
