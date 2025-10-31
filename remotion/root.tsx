import React from "react";
import { Composition } from "remotion";
import { RemotionVideo } from "@/components/remotion-video";

// Define the shape of input props
export interface VideoInputProps {
  name: string;
  // duration: number; // in seconds
  // aspectRatio: "16:9" | "9:16" | "1:1" | "4:3";
  // backgroundColor: string;
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RemotionVIdeo"
        component={RemotionVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ name: 'Any Default Name' }}
      />
    </>
  )
}
