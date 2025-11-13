'use client'

import { Player } from '@remotion/player'
import { RemotionVideo } from '@/components/remotion/remotion-video'
import { Doc } from '@/convex/_generated/dataModel'

export const VideoPlayer = ({ video, durationInSeconds }: { video: Doc<'videos'>, durationInSeconds: number }) => {

  if (!video) {
    return null
  }

  return (
    <div className="w-full h-full">
      <Player
        component={RemotionVideo}
        fps={30}
        durationInFrames={durationInSeconds * 30}
        compositionHeight={1080}
        compositionWidth={1920}
        inputProps={{ video: video }}
        controls
        autoPlay
        loop
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
