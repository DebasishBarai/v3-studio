'use client'

import Image from 'next/image'
import Link from 'next/link'
import { RotateCcw, Trash2, WandSparkles, Pencil, ImageOff, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CustomButton } from '@/components/ui/custom/custom-button'
import { EditSceneDialog } from '@/components/ui/custom/edit-scene-dialog'
import { ModifySceneDialog } from './modify-scene-dialog'
import { useState } from 'react'

export const SceneCard = ({
  index,
  scene,
  removeScene,
  generateSceneImage,
  generateSceneVideo,
  updateNestedField,
  generatingScene,
  modifyingScene,
}: any) => {
  const [open, setOpen] = useState(false)
  const [modifyOpen, setModifyOpen] = useState(false)

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
          {scene.imageUrl && (
            <div>
              <Image
                src={scene.imageUrl}
                alt={`Scene ${index + 1}`}
                width={800}
                height={450}
                unoptimized
                className="w-full h-[300px] rounded-lg object-cover"
              />
              <div className="flex justify-between items-center mt-2">
                <Link href={scene.imageUrl} target="_blank">
                  <Button variant="ghost">View Image</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Video (if available) */}
          {scene.videoUrl && (
            <div>
              <video
                src={scene.videoUrl}
                controls
                className="w-full h-[300px] rounded-lg object-cover"
              />
              <div className="flex justify-between items-center mt-2">
                <Link href={scene.videoUrl} target="_blank">
                  <Button variant="ghost">View Video</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Action buttons (generate, modify, etc.) */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              {/* Re-generate Image */}
              <Button
                disabled={generatingScene === index}
                onClick={() =>
                  generateSceneImage({
                    index,
                    prompt: scene.imagePrompt,
                  })
                }
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all',
                  {
                    'bg-blue-600 hover:bg-blue-700 cursor-pointer': generatingScene !== index,
                    'bg-blue-600/60 opacity-60 cursor-not-allowed': generatingScene === index,
                  }
                )}
              >
                <RotateCcw className="w-4 h-4" />
                {generatingScene === index ? 'Re-generating...' : 'Re-generate Image'}
              </Button>

              {/* Modify Scene */}
              <Button
                disabled={
                  generatingScene === index ||
                  modifyingScene === index ||
                  !scene.imageUrl
                }
                onClick={() => setModifyOpen(true)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all',
                  {
                    'bg-purple-600 hover:bg-purple-700 cursor-pointer':
                      !(generatingScene === index || modifyingScene === index || !scene.imageUrl),
                    'bg-purple-600/60 opacity-60 cursor-not-allowed':
                      generatingScene === index || modifyingScene === index || !scene.imageUrl,
                  }
                )}
              >
                <WandSparkles className="w-4 h-4" />
                {modifyingScene === index ? 'Modifying...' : 'Modify Scene'}
              </Button>

              {/* Generate Video */}
              <Button
                disabled={!scene.imageUrl || generatingScene === index}
                onClick={() =>
                  generateSceneVideo({
                    index,
                    prompt: scene.videoPrompt,
                    baseImageUrl: scene.imageUrl,
                  })
                }
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all',
                  {
                    'bg-green-600 hover:bg-green-700 cursor-pointer':
                      !(!scene.imageUrl || generatingScene === index),
                    'bg-green-600/60 opacity-60 cursor-not-allowed':
                      !scene.imageUrl || generatingScene === index,
                  }
                )}
              >
                <Video className="w-4 h-4" />
                {scene.videoUrl ? 'Re-Generate Video' : 'Generate Video'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
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
