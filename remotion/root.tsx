import React from "react";
import { Composition } from "remotion";
import { RemotionVideo } from "@/components/remotion/remotion-video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="my-video"
        width={1080}
        height={1080}
        fps={30}
        durationInFrames={30}
        component={RemotionVideo}
        defaultProps={{
          text: "Hello World"
        }}
      />
    </>
  );
}
