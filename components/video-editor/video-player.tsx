import { Player } from '@remotion/player'
import { RemotionVideo } from '@/components/remotion/remotion-video'

export const VideoPlayer = ({ height, width, text }: { height: number, width: number, text: string }) => {
  return (
    <div>
      <Player
        component={RemotionVideo}
        durationInFrames={300}
        fps={30}
        compositionWidth={width}
        compositionHeight={height}
        inputProps={{ text }}
        controls
        autoPlay
        loop
      />
    </div>
  )
}
