interface VideoEditorPageProps {
  params: Promise<{
    videoId: string
  }>
}

export default async function VideoEditorPage({ params }: VideoEditorPageProps) {

  const { videoId } = await params

  return (
    <div>{videoId}</div>
  )
}
