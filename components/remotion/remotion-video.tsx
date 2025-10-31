import { VideoInputProps } from "@/remotion/root";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export const RemotionVideo: React.FC<VideoInputProps> = ({ name }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const text = `This is frame: ${frame} and duration is: ${durationInFrames}. Hi ${name}`;

  return (
    <AbsoluteFill style={{ backgroundColor: "black", fontSize: 50 }}>
      {text}
    </AbsoluteFill>
  )
}
