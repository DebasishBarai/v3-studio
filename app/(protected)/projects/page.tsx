import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <main className="w-full">
      <div className="p-10">
        <div>
          {/* Page header */}
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-3xl">Your Projects</h2>
            <div className="flex items-center gap-5">
              <Link href="/ai-tools/short-video/create">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-9 py-2 px-5 bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 transition-all text-white rounded-md"
                  type="button"
                >
                  <Plus />
                  Create New Project
                </button>
              </Link>
            </div>
          </div>

          {/* Empty state */}
          <div>
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
                Start creating your first Short Video to bring your ideas to life!
              </p>
              <Link href="/ai-tools/short-video/create">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-9 mt-6 px-5 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 transition-all text-white rounded-md"
                  type="button"
                >
                  Create New Project
                </button>
              </Link>
            </div>
          </div>

          {/* Projects grid (empty for now) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 mt-7">
            {/* Project items would go here */}
          </div>
        </div>
      </div>
    </main>
  );
}
