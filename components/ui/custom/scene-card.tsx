'use client'

import Image from 'next/image'
import { RotateCcw, Trash2, WandSparkles, Pencil, ImageOff, Video, ImageDown, AudioLines } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CustomButton } from '@/components/ui/custom/custom-button'
import { EditSceneDialog } from '@/components/ui/custom/edit-scene-dialog'
import { ModifySceneDialog } from './modify-scene-dialog'
import { useEffect, useState } from 'react'
import { getCachedVideoUrl } from "@/lib/video-cache"

export const SceneCard = ({
  index,
  scene,
  removeScene,
  generateSceneImage,
  generateSceneVideo,
  generateSceneAudio,
  updateNestedField,
  generatingScene,
  modifyingScene,
  aspectRatio,
}: any) => {
  const [open, setOpen] = useState(false)
  const [modifyOpen, setModifyOpen] = useState(false)

  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (scene.videoUrl) {
      setIsLoading(true);
      getCachedVideoUrl(scene.videoUrl).then((cachedUrl) => {
        if (mounted) {
          setLocalUrl(cachedUrl);
          setIsLoading(false);
        }
      }).catch(() => {
        if (mounted) setIsLoading(false);
      });
    } else {
      setLocalUrl(null);
      setIsLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [scene.videoUrl])

  return (
    <div className="bg-white/5 rounded-xl p-5 border border-white/10 mb-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white">Scene {index + 1}</h3>
        <div className="flex gap-2">
          <CustomButton
            icon={Pencil}
            tooltip="Edit Scene"
            className="text-blue-400 hover:text-blue-500"
            onClick={() => setOpen(true)}
          />
          <CustomButton
            icon={Trash2}
            tooltip="Remove Scene"
            className="text-red-400 hover:text-red-500"
            onClick={() => removeScene(index)}
          />
        </div>
      </div>


      {scene.imageUrl || scene.videoUrl ? (
        <div className="space-y-4">
          {/* Image (if available) */}
          <div className={cn("w-full overflow-hidden rounded-lg bg-gray-800", aspectRatio === '16:9' ? 'aspect-video' : 'aspect-9/16')}>
            {(scene.videoUrl || scene.imageUrl) && (
              <div className='relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-slate-100 dark:bg-slate-800/10'>
                {scene.videoUrl ? (
                  isLoading ? (
                    <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-white">Loading video...</span>
                    </div>
                  ) : localUrl ? (
                    <video
                      src={localUrl}
                      controls
                      className="w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">Failed to load video</span>
                    </div>
                  )) : (
                  <Image
                    src={scene.imageUrl}
                    alt={`Scene ${index + 1}`}
                    width={800}
                    height={450}
                    unoptimized
                    className="w-full h-[250px] lg:h-[370px] object-cover transition-all duration-700-full rounded-lg h-full object-cover" />
                )}
                <div className="absolute top-0 left-0 right-0 bg-transparent p-4">
                  <div className="flex justify-end items-center gap-4">
                    <CustomButton
                      icon={ImageDown}
                      tooltip="View Image"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={() => window.open(scene.imageUrl, '_blank')}
                    />
                    {localUrl && (
                      <CustomButton
                        icon={Video}
                        tooltip="View Video"
                        className="text-white hover:text-white hover:bg-white/20"
                        onClick={() => window.open(localUrl, '_blank')}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Action buttons (generate, modify, etc.) */}
          <div className="flex justify-start gap-2">
            {/* Re-generate Image */}
            <CustomButton
              disabled={generatingScene === index}
              onClick={() =>
                generateSceneImage({
                  index,
                  prompt: scene.imagePrompt,
                })
              }
              className={cn(
                'flex items-center gap-2 py-2 rounded-lg text-white transition-all',
                {
                  'bg-blue-600 hover:bg-blue-700 cursor-pointer': generatingScene !== index,
                  'bg-blue-600/60 opacity-60 cursor-not-allowed': generatingScene === index,
                }
              )}
              icon={RotateCcw}
              tooltip="Re-generate Image"
            />

            {/* Modify Scene */}
            <CustomButton
              disabled={
                generatingScene === index ||
                modifyingScene === index ||
                !scene.imageUrl
              }
              onClick={() => setModifyOpen(true)}
              className={cn(
                'flex items-center gap-2 py-2 rounded-lg text-white transition-all',
                {
                  'bg-purple-600 hover:bg-purple-700 cursor-pointer':
                    !(generatingScene === index || modifyingScene === index || !scene.imageUrl),
                  'bg-purple-600/60 opacity-60 cursor-not-allowed':
                    generatingScene === index || modifyingScene === index || !scene.imageUrl,
                }
              )}
              icon={WandSparkles}
              tooltip="Modify Scene"
            />

            {/* Generate Video */}
            <CustomButton
              disabled={!scene.imageUrl || generatingScene === index}
              onClick={() =>
                generateSceneVideo({
                  index,
                  prompt: scene.videoPrompt,
                  baseImageUrl: scene.imageUrl,
                })
              }
              className={cn(
                'flex items-center gap-2 py-2 rounded-lg text-white transition-all',
                {
                  'bg-green-600 hover:bg-green-700 cursor-pointer':
                    !(!scene.imageUrl || generatingScene === index),
                  'bg-green-600/60 opacity-60 cursor-not-allowed':
                    !scene.imageUrl || generatingScene === index,
                }
              )}
              icon={Video}
              tooltip="Generate Video"
            />

            {/* Generate Audio */}
            <CustomButton
              disabled={!scene.narration.trim() || generatingScene === index}
              onClick={() =>
                generateSceneAudio({
                  index,
                  text: scene.narration,
                })
              }
              className={cn(
                'flex items-center gap-2 py-2 rounded-lg text-white transition-all',
                {
                  'bg-green-600 hover:bg-green-700 cursor-pointer':
                    !(!scene.narration.trim() || generatingScene === index),
                  'bg-green-600/60 opacity-60 cursor-not-allowed':
                    !scene.narration.trim() || generatingScene === index,
                }
              )}
              icon={AudioLines}
              tooltip="Generate Audio"
            />
          </div>
        </div>
      ) : (
        <>
          <div className={cn("w-full flex flex-col items-center justify-center text-muted-foreground bg-gray-800 rounded-lg", aspectRatio === '16:9' ? 'aspect-video' : 'aspect-9/16')}>
            <ImageOff className="w-12 h-12 mb-1 opacity-70" />
            <span className="text-sm">No image or video yet</span>
          </div>
          <Button
            disabled={generatingScene === index || !scene.imagePrompt.trim()}
            onClick={() =>
              generateSceneImage({
                index,
                prompt: scene.imagePrompt,
                baseImageId: scene.imageId,
                characterNames: scene.charactersInTheScene,
              })
            }
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white transition-all mt-4',
              {
                'bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 hover:shadow-lg cursor-pointer':
                  !(generatingScene === index || !scene.imagePrompt.trim()),
                'bg-gradient-to-r from-pink-400 to-purple-400 opacity-60 cursor-not-allowed':
                  generatingScene === index || !scene.imagePrompt.trim(),
              }
            )}
          >
            {generatingScene === index ? 'Generating...' : 'Generate Scene Image'}
          </Button>
        </>
      )}

      <EditSceneDialog
        open={open}
        setOpen={setOpen}
        index={index}
        scene={scene}
        updateNestedField={updateNestedField}
      />

      <ModifySceneDialog
        open={modifyOpen}
        setOpen={setModifyOpen}
        index={index}
        scene={scene}
        generateSceneImage={generateSceneImage}
        modifyingScene={modifyingScene === index}
      />
    </div>
  )
}
