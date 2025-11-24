import React from "react";
import { Composition } from "remotion";
import { RemotionVideo } from "../components/remotion/remotion-video";
import { Doc } from "../convex/_generated/dataModel";
import { parseMedia } from '@remotion/media-parser'

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
          video: null,
          isSubscribed: false,
        }}
      // required only for rendering in lambda
      /*
      calculateMetadata={async ({ props }) => {
        if (!props.video) {
          return {
            durationInFrames: 30,
            width: 1080,
            height: 1920,
          }
        }
        const totalDuration = await calculateTotalDurationInSecs(props.video);
        return {
          durationInFrames: totalDuration * 30,
          width: props.video.aspectRatio === '16:9' ? 1920 : 1080,
          height: props.video.aspectRatio === '16:9' ? 1080 : 1920,
        };
      }}
      */
      // required only for rendering in lambda
      />
    </>
  );
}

// required only for rendering in lambda
const calculateTotalDurationInSecs = async (video: Doc<"videos">) => {
  let totalDuration = 0;

  for (const [index, scene] of video.scenes.entries()) {

    if (scene.videoUrl) {
      if (scene.videoDurationInSeconds) {
        totalDuration += Math.floor(scene.videoDurationInSeconds);
      } else {
        const videoMetadata = await parseMedia({
          src: scene.videoUrl,
          fields: {
            slowDurationInSeconds: true,
          }
        });
        totalDuration += Math.floor(videoMetadata.slowDurationInSeconds);
        console.log('Scene duration:', videoMetadata.slowDurationInSeconds);
      }
    } else {
      totalDuration += 5;
    }
  }
  return totalDuration;
};
