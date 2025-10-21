interface VideoEditorPageProps {
  params: {
    videoId: string
  }
}

export default function VideoEditorPage({ params }: VideoEditorPageProps) {

  const videoId = params.videoId

  return (
    <div>{videoId}</div>
  )
}
