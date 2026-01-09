import { VideoEditorComponent } from "@/components/video-editor/video-editor-component"

interface VideoEditorPageProps {
  params: Promise<{
    videoId: string
  }>

  searchParams: Promise<{
    tour?: string
  }>
}

export default async function VideoEditorPage({ params, searchParams }: VideoEditorPageProps) {

  const { videoId } = await params
  const { tour } = await searchParams

  const isTourActive = tour === 'true'

  return (
    <VideoEditorComponent videoId={videoId} tour={isTourActive} />
  )
}
