'use client';

import { cdn } from "@/lib/functions";

export const HeroSection = () => {
  return (
    <article className="rounded-3xl px-4 sm:px-6 md:px-8 w-full flex flex-col items-center justify-center">
      <div className="w-full relative md:px-8 py-[7.5%] grid lg:grid-cols-2 gap-12 lg:gap-4 xl:gap-8 items-start md:max-w-7xl">

        {/* Left Content Section */}
        <section className="space-y-8 mt-12 lg:mt-0 flex-2 flex flex-col gap-0">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-[48px] lg:text-[42px] xl:text-5xl 2xl:text-6xl lg:text-left leading-[50px] text-center font-medium text-white text-balance">
              Create stunning videos {" "}
              <span className="font-medium from-[#45EC82] from-[0.16%] via-indigo-500 via-[47.81%] to-pink-500 to-100% bg-gradient-to-r bg-clip-text text-transparent">
                with AI
              </span>
            </h1>
            <p className="text-md text-neutral-400 2xl:text-base text-center lg:text-left mx-auto lg:mx-0 leading-normal">
              Bring your stories to life with AI: craft web series, generate unique character visuals, produce short narrated videos, and access a suite of creative tools — all in one place.
            </p>
          </div>

          <div className="flex justify-center lg:justify-start">
            <div className="flex flex-col gap-2 items-start justify-start">
              <div className="w-fit lg:mx-0">
                <a
                  className="inline-block px-6 py-3 bg-gradient-to-r from-[#45EC82] to-[#75CEFC] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  href="/dashboard"
                >
                  Try it Free
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Right Video Section */}
        <div className="h-[440px] max-w-[280px] sm:max-w-unset mx-auto flex items-center justify-center relative">
          {/* Left video */}
          <div className="bg-white/10 border-white/90 hidden border w-[120px] sm:w-[240px] aspect-[9/16] sm:-rotate-12 sm:absolute z-20 sm:block sm:-left-1/4 sm:right-1/4 mx-auto rounded-xl overflow-hidden transition-all duration-300 hover:z-40 hover:scale-110 group">
            <div className="w-full h-full">
              <video
                className="bg-white shadow-2xl rounded-[10px] object-cover h-full w-full"
                poster="/showcase/vid9.webp"
                preload="none"
                muted
                loop
                playsInline
                autoPlay
              >
                <source src={cdn("https://s3.ap-south-1.amazonaws.com/remotionlambda-apsouth1-o0ii9qrpg0/renders/k9axsstgbu/out.mp4")} type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Center video */}
          <div
            className="bg-white/10 border-white/90 border w-11/12 sm:w-[250px] aspect-[9/16] relative z-30 mx-auto rounded-xl overflow-hidden top-[-10px] transition-all duration-300 hover:z-40 hover:scale-110 group"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.65)) drop-shadow(0 8px 8px rgba(0, 0, 0, 0.10))' }}
          >
            <div className="w-full h-full">
              <video
                className="bg-white shadow-2xl rounded-[10px] object-cover h-full w-full"
                poster="/showcase/vid3.webp"
                preload="none"
                muted
                loop
                playsInline
                autoPlay
              >
                <source src={cdn("https://s3.ap-south-1.amazonaws.com/remotionlambda-apsouth1-o0ii9qrpg0/renders/8xirw1rdyi/out.mp4")} type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Right video */}
          <div className="bg-white/10 border-white/90 hidden border w-[120px] sm:w-[240px] aspect-[9/16] sm:rotate-12 sm:absolute sm:block sm:-right-1/4 sm:left-1/4 z-20 mx-auto rounded-xl overflow-hidden transition-all duration-300 hover:z-40 hover:scale-110 group">
            <div className="w-full h-full">
              <video
                className="bg-white shadow-2xl rounded-[10px] object-cover h-full w-full"
                poster="/showcase/vid5.webp"
                preload="none"
                muted
                loop
                playsInline
                autoPlay
              >
                <source src={cdn("https://s3.ap-south-1.amazonaws.com/remotionlambda-apsouth1-o0ii9qrpg0/renders/a7m9zpau1v/out.mp4")} type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute bg-gradient-to-b from-[#BEFFD6] to-[#92DAFF] blur-[55px] w-[40%] h-[85%] mb-6 z-0"></div>
        </div>
      </div>
    </article>
  );
};





