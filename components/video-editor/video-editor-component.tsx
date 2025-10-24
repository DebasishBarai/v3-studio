'use client'

import { api } from "@/convex/_generated/api"
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from "convex/react"
import {
  Plus
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { SceneCard } from "./scene-card"

export const VideoEditorComponent = ({ videoId }: { videoId: string }) => {
  const id = videoId as Id<'videos'>
  const video = useQuery(api.video.getVideo, { id: id })
  const [activeTab, setActiveTab] = useState<'frames' | 'captions' | 'audio'>('frames')
  const [selectedFrame, setSelectedFrame] = useState<number>(0)

  if (!video) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <div className="max-h-[calc(100vh-70px)] flex-col hidden md:flex">
      <div className="flex-1 flex flex-col md:flex-row bg-background text-foreground overflow-hidden">
        {/* Frames Panel */}
        <div className="w-full md:w-2/5 p-4 order-2 md:order-1 border-r border-border overflow-auto">
          <div className="pr-4">
            {/* Add Frame Button */}
            <AddFrameButton />

            {/* Frames List */}
            <div style={{ minHeight: '1000px' }}>
              {video.scenes?.map((scene, index) => (
                <div key={index}>
                  <SceneCard
                    scene={scene}
                    index={index}
                    isSelected={selectedFrame === index}
                  />
                  <AddFrameButton />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 order-1 md:order-2 bg-zinc-50 dark:bg-zinc-950">
          <div className="h-full flex flex-col">
            <div className="flex-1">
              <VideoPreview video={video} selectedFrame={selectedFrame} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AddFrameButton = () => (
  <div className="relative w-full max-w-[90%] mx-auto">
    <div className="flex items-center justify-center my-2 group">
      <div className="absolute w-full border-t border-dotted border-neutral-200 dark:border-zinc-800"></div>
      <button
        className="whitespace-nowrap text-sm font-medium ring-offset-black focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent relative h-6 w-6 group-hover:opacity-100 transition-all duration-200 bg-white dark:bg-zinc-950 border border-dashed border-neutral-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-full flex items-center justify-center gap-2 text-neutral-400 hover:text-blue-500 dark:text-zinc-500 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  </div>
)


const VideoPreview = ({ video, selectedFrame }: { video: any, selectedFrame: number }) => {
  const scene = video.scenes?.[selectedFrame]
  const imageUrl = scene?.angles?.[0]?.imageUrl || scene?.imageUrl || 'https://via.placeholder.com/444x791'

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-70px)]">
      <p className="text-sm text-gray-500 flex items-center mb-2">
        {video.title || 'Untitled Video'}
      </p>
      <div
        className="dark:bg-zinc-900 bg-neutral-200 relative overflow-hidden opacity-100 rounded-lg"
        style={{ width: '444.938px', height: '791px' }}
      >
        <Image
          src={imageUrl}
          alt={`Frame ${selectedFrame}`}
          fill
          className="object-cover"
          unoptimized={imageUrl.includes('placeholder')}
        />

        {/* Overlay Caption */}
        {scene?.voiceOver && (
          <div className="absolute bottom-24 left-0 right-0 text-center px-8 z-10">
            <div className="bg-black/80 backdrop-blur-sm w-fit mx-auto px-6 py-3 rounded-full">
              <span className="text-white font-medium text-lg">
                {scene.voiceOver.split(' ').slice(0, 3).join(' ')}
              </span>
            </div>
          </div>
        )}

        {/* Watermark */}
        <div className="absolute top-8 left-0 right-0 flex justify-center px-8 z-20">
          <div className="flex items-center gap-6 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <svg width="60" height="60" viewBox="0 0 281 332" fill="none">
              <path d="M153.33 18.8916L82.0487 170.444H140.63L80.3219 331.254V224.459L20.7793 220.448L35.468 139.721L153.33 18.8916Z" fill="rgba(255, 170, 35, 0.6)" />
              <path d="M37.9418 316.612L70.0225 298.188L78.5201 331.254L97.5797 201.226H32.9142L152.383 18.4526L114.23 47.2039L38.2826 3.35618C21.8061 -6.1557 1.20705 5.72246 1.18676 24.7488L0.894546 295.14C0.874254 314.164 21.4439 326.086 37.9418 316.612Z" fill="rgba(255, 222, 89, 0.6)" />
              <path d="M114.021 273.299L194.776 142.086H132.183L144.956 64.9431L265.519 134.55C285.153 145.886 285.169 174.22 265.547 185.579L114.021 273.299Z" fill="rgba(255, 222, 89, 0.6)" />
            </svg>
            <div className="flex flex-col">
              <span className="text-lg uppercase tracking-widest text-white/50">Created with</span>
              <span className="text-3xl font-semibold text-white/90">StoryShort.ai</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
