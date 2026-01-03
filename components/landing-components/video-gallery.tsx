import Image from "next/image";
import Marquee from "react-fast-marquee";

export const VideoGallery = () => {
  // Gallery images
  const images = [1, 2, 3, 4, 5, 6];

  return (
    <div className="mt-20 w-full">
      <h2 className="text-3xl md:text-5xl font-bold mb-10 text-center">
        Explore Videos Created By{" "}
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Other Users
        </span>
      </h2>

      {/* Marquee of gallery images */}
      <div className="w-full py-6 bg-slate-900/30 backdrop-blur-sm rounded-lg border border-slate-800/50">
        <Marquee gradient={false} speed={40} pauseOnHover>
          {images.map((i) => (
            <div key={i} className="overflow-hidden mx-6">
              <Image
                src={`/gallery/vid${i}.webp`}
                alt={`Video ${i}`}
                width={300}
                height={500}
                className="rounded-lg shadow-lg shadow-indigo-500/10 border border-slate-700/50 object-cover hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300"
                unoptimized
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};
