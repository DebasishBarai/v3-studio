import { VideoEditorComponent } from "@/components/video-editor/video-editor-component"

interface VideoEditorPageProps {
  params: Promise<{
    videoId: string
  }>
}

export default async function VideoEditorPage({ params }: VideoEditorPageProps) {

  const { videoId } = await params

  return (
    <VideoEditorComponent videoId={videoId} />
  )
}
