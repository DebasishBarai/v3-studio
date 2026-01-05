'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, ImageOff, SquarePen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cdn } from "@/lib/functions"

export default function VideoCard({ video, index }: { video: any; index: number }) {
  const sceneImages = video?.scenes
    ?.map((scene: any) => scene.imageUrl)
    .filter(Boolean)

  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate every 2 seconds
  useEffect(() => {
    if (!sceneImages?.length) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sceneImages.length)
    }, (Math.floor(Math.random() * 4000) + 2000))
    return () => clearInterval(interval)
  }, [sceneImages])

  return (
    <motion.div
      key={index}
      whileHover={{ scale: 1.03 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-slate-100 dark:bg-slate-800/10"
    >
      {/* Scene Image */}
      {sceneImages?.length ? (
        <Image
          src={sceneImages[currentIndex]}
          alt={`Scene ${currentIndex + 1}`}
          width={800}
          height={450}
          unoptimized
          className="w-full h-[250px] lg:h-[370px] object-cover transition-all duration-700"
        />
      ) : (
        <div className="w-full h-[250px] lg:h-[370px] flex flex-col items-center justify-center bg-muted/30 text-muted-foreground">
          <ImageOff className="w-10 h-10 mb-2" />
          <p className="text-sm font-medium">No image generated yet</p>
        </div>
      )}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Floating Title + Buttons */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg truncate max-w-[70%]">
          {video.title || "Untitled Video"}
        </h3>

        <div className="flex gap-2">
          <Link href={`/ai-tools/ai-video/editor/${video._id}`}>
            <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
              <SquarePen className="w-4 h-4" />
            </Button>
          </Link>

          {video?.videoUrl && (
            <Link href={cdn(video.videoUrl)} target="_blank">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
                <Play className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

