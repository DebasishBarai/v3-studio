'use client';

import { useScrollDownAnimationHook } from "@/hooks/use-scroll-down-animation-hook";
import { motion } from "framer-motion";

export const Showcase = () => {
  const { ref: ref1, controls: controls1 } = useScrollDownAnimationHook()
  const { ref: ref2, controls: controls2 } = useScrollDownAnimationHook()
  const { ref: ref3, controls: controls3 } = useScrollDownAnimationHook()
  const videos = [
    {
      poster: "/showcase/vid1.webp",
      src: "/showcase/vid1.webm",
      badge: "a video on a world where every person has a unique superpower",
      link: "/tools/talking-avatar",
      cols: 1
    },
    {
      poster: "/showcase/vid2.webp",
      src: "/showcase/vid2.webm",
      badge: "a motivational story of a guy who is left by his wife because he is poor but later he becomes one of the welthiest in the town",
      link: "/tools/prompt-to-video",
      cols: 1
    },
    {
      poster: "/showcase/vid3.webp",
      src: "/showcase/vid3.webm",
      badge: "a video on an inspiring story of someone who achieved success without formal training",
      link: "/tools/ai-cinematic-video",
      cols: 2
    },
    {
      poster: "/showcase/vid4.webp",
      src: "/showcase/vid4.webm",
      badge: "a video on a gas giant with floating jellyfish cities",
      link: "/tools/talking-avatar",
      cols: 1
    },
    {
      poster: "/showcase/vid5.webp",
      src: "/showcase/vid5.webm",
      badge: "create a video of a person who is doing his 9 to 5 corporate job but bored by this monotonous job which he does not like and...",
      link: "/tools/ai-music-video-generator",
      cols: 2
    },
    {
      poster: "/showcase/vid6.webp",
      src: "/showcase/vid6.webm",
      badge: "a video on a desert planet with sand-swimming nomads",
      link: "/tools/ai-music-video-generator",
      cols: 1
    }
  ];

  return (
    <article
      id="showcase-videos"
      className="m-4 relative text-[#BEC0C7] rounded-3xl p-4 sm:p-6 md:p-8 max-w-7xl bg-transparent"
    >
      <div className="w-full relative">
        {/* Header Section */}
        <div className="relative z-20 mx-auto m-8">
          <motion.div
            ref={ref1}
            initial="hidden"
            animate={controls1}
            variants={{
              hidden: {
                opacity: 0,
                y: 100
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 2,
                  ease: [0.22, 1, 0.36, 1]
                }
              },
            }}
          >
            {/* Title */}
            <h1 className="py-6 font-bold text-white !leading-tight max-w-2xl mx-auto text-center text-3xl lg:text-4xl xl:text-5xl capitalize">
              Explore Videos Created By<br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Other Users
              </span>
            </h1>
          </motion.div>

          {/* Video Grid */}
          <motion.div
            ref={ref2}
            initial="hidden"
            animate={controls2}
            variants={{
              hidden: {
                opacity: 0,
                y: 100
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 2,
                  delay: 0.2, // Delay the animation to avoid flickering
                  ease: [0.22, 1, 0.36, 1]
                }
              },
            }}
            className="pt-14 grid grid-cols-2 lg:grid-cols-4 gap-5">
            {videos.map((video, index) => (
              <div
                key={index}
                className={`group items-center justify-center relative ${video.cols === 2 ? 'lg:col-span-2' : ''
                  }`}
              >
                {/* Badge on hover */}
                <div className="absolute z-10 w-full bottom-2 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="inline-flex items-center rounded-sm border text-xs font-semibold bg-slate-900 text-slate-50 hover:bg-slate-900/80 px-2.5 py-0.5 border-white">
                    {video.badge}
                  </div>
                </div>

                {/* Video */}
                <div className="w-full h-72 md:h-[30rem] relative">
                  <video
                    className="bg-white shadow-2xl rounded-[10px] object-cover w-full h-full rounded-2xl"
                    poster={video.poster}
                    preload="none"
                    muted
                    loop
                    playsInline
                    autoPlay
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Video Showcase Section */}
          <div className="space-y-12 py-12 lg:py-12">
            <motion.div
              ref={ref3}
              animate={controls3}
              initial="hidden"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 100
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 2,
                    delay: 0.2, // Delay the animation to avoid flickering
                    ease: [0.22, 1, 0.36, 1]
                  }
                },
              }}
              className="flex justify-center items-center relative w-5/6 mx-auto">
              {/* Left video */}
              <div
                className="bg-white outline w-1/2 md:max-w-[500px] absolute hidden sm:block sm:-left-1/4 md:right-1/4 mx-auto outline-[6px] outline-[#636363]/25 rounded-xl object-cover">
                <video
                  className="bg-white shadow-2xl rounded-[10px] object-cover w-full"
                  poster="/showcase/vid7.webp"
                  preload="none"
                  loop
                  playsInline
                  autoPlay
                  muted
                >
                  <source src="/showcase/vid7.webm" type="video/mp4" />
                </video>
              </div>

              {/* Center video */}
              <div className="bg-white outline w-11/12 md:w-3/4 md:max-w-[380px] relative z-10 mx-auto outline-[6px] outline-[#636363]/25 rounded-xl object-cover">
                <video
                  className="bg-white shadow-2xl rounded-[10px] object-cover w-full"
                  poster="/showcase/vid8.webp"
                  preload="none"
                  muted
                  loop
                  playsInline
                  autoPlay
                >
                  <source src="/showcase/vid8.webm" type="video/mp4" />
                </video>
              </div>

              {/* Right video */}
              <div className="bg-white outline w-1/2 md:max-w-[500px] absolute hidden sm:block sm:-right-1/4 md:left-1/4 -z-0 mx-auto outline-[6px] outline-[#636363]/25 rounded-xl object-cover">
                <video
                  className="bg-white shadow-2xl rounded-[10px] object-cover w-full"
                  poster="/showcase/vid9.webp"
                  preload="none"
                  loop
                  playsInline
                  autoPlay
                  muted
                >
                  <source src="/showcase/vid9.webm" type="video/mp4" />
                </video>
              </div>

              {/* Glow effect */}
              <div className="absolute bg-gradient-to-b from-[#BEFFD6] to-[#92DAFF] blur-[125px] w-[35%] h-[45%] mb-6 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </article>
  );
};
