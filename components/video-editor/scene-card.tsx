'use client'

import Image from 'next/image'
import {
  Layers, PictureInPicture2,
  Clapperboard,
  Sparkles,
  Trash,
  SquarePen,
  X,
  Plus,
  Timer,
  Pencil,
  Speech
} from 'lucide-react'

export const SceneCard = ({
  scene,
  index,
  isSelected,
}: {
  scene: any
  index: number
  isSelected: boolean
}) => {
  const caption = scene.voiceOver || scene.imagePrompt?.substring(0, 100) || 'No caption'
  const duration = scene.durationInSecs || 4.75
  const imageUrl = scene.angles?.[0]?.imageUrl || scene.imageUrl || 'https://via.placeholder.com/80x112'

  return (
    <div className="flex items-center space-x-4">
      <div
        className={`rounded-lg dark:border-neutral-800 border bg-card text-card-foreground shadow-sm max-w-[90%] w-full m-auto mb-2 mt-2 transition-all duration-200 ease-in-out ${isSelected
          ? 'ring ring-black dark:ring-amber-300 ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-900'
          : 'hover:shadow-md'
          }`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-muted-foreground">#{index}</span>
            <div className="flex space-x-2">
              <ActionButton icon={<PictureInPicture2 className="h-3 w-3" />} />
              <ActionButton
                icon={<Clapperboard className="w-3 h-3" />}
                label="Animate"
              />
              <ActionButton icon={<Sparkles className="h-3 w-3" />} size="lg" />
              <ActionButton icon={<Layers className="h-4 w-4" />} size="lg" />
              <ActionButton
                icon={<Trash className="h-3 w-3" />}
                size="lg"
                variant="danger"
              />
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-4 flex items-start space-x-4">
            {/* Caption Section */}
            <div className="flex-1 col-span-3 h-full group">
              <div className="p-2 flex flex-col h-full">
                <div className="flex-1">
                  <div className="dark:bg-zinc-900 bg-neutral-100 p-4 pt-8 rounded-md relative">
                    {/* Voice Caption Badge */}
                    <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground absolute top-0 left-0">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-tl-md rounded-br-md text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20">
                        <Speech className="h-3.5 w-3.5" />
                        <span className="font-medium tracking-wide">Voice caption</span>
                      </div>
                    </div>

                    {/* Caption Text */}
                    <p className="text-sm font-mono leading-relaxed text-xs text-gray-500 mt-2">
                      {caption}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2">
                  <button className="justify-center whitespace-nowrap font-medium ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md h-6 px-2 text-xs text-neutral-500 group flex items-center gap-1.5">
                    <Timer className="transition-colors" size={13} />
                    <span>{duration}s</span>
                    <Pencil className="opacity-0 group-hover:opacity-100 ml-0.5 text-blue-500 transition-opacity" size={10} />
                  </button>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex flex-col gap-2">
              <div className="relative group m-auto">
                <Image
                  src={imageUrl}
                  alt={`Media ${index}`}
                  width={80}
                  height={112}
                  className="w-20 h-28 object-cover rounded-md shadow-sm"
                  unoptimized={imageUrl.includes('placeholder')}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 rounded-md">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 w-10 p-1">
                    <SquarePen className="h-4 w-4" />
                  </button>
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 w-10 p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground w-8 h-8 mx-auto rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ActionButton = ({
  icon,
  label,
  size = 'sm',
  variant = 'default'
}: {
  icon: React.ReactNode
  label?: string
  size?: 'sm' | 'lg'
  variant?: 'default' | 'danger'
}) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md ${size === 'sm' ? 'h-7 px-2 text-xs' : 'h-8 w-8'
      } ${label ? 'gap-2' : ''
      } ${variant === 'danger' ? 'hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30' : ''
      }`}
  >
    {icon}
    {label && <span>{label}</span>}
  </button>
)
