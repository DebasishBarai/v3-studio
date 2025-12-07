'use client'

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import VideoCard from './video-card';

export const UsersVideosList = () => {
  const videos = useQuery(api.video.video.getVideos)
  return (
    <div>
      <div>
        {/* Page header */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-2xl mb-2 mt-5">My Videos</h2>
          <div className="hidden md:flex items-center gap-5">
            <Link href="/ai-tools/ai-video/create">
              <Button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-9 py-2 px-5 bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 transition-all text-white rounded-md"
                type="button"
              >
                <Plus />
                Create New Video
              </Button>
            </Link>
          </div>
        </div>

        {/* Empty state */}
        {videos?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-400 border rounded-2xl p-10">
            <Image
              alt="No projects illustration"
              draggable={false}
              loading="lazy"
              width={100}
              height={100}
              className="w-[100px] mb-6 select-none pointer-events-none"
              src="/short-video.webp"
            />
            <p className="text-lg mb-2">You have no projects yet.</p>
            <p className="max-w-sm">
              Start creating your first AI Powered Video to bring your ideas to life!
            </p>
            <Link href="/ai-tools/ai-video/create">
              <Button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-9 mt-6 px-5 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 transition-all text-white rounded-md"
                type="button"
              >
                Create New Video
              </Button>
            </Link>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5'>
          {videos && videos.map((video, index) => (
            <div key={index}
            >
              <VideoCard video={video} index={index} />
            </div>
          ))}
        </div>

      </div>
    </div >
  )
} 
