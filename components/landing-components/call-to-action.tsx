'use client';

import { Headset } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useScrollDownAnimationHook } from "@/hooks/use-scroll-down-animation-hook";
import { motion } from "framer-motion";

const FeatureItem = ({ feature, index }: { feature: any; index: number }) => {
  const { ref: ref1, controls: controls1 } = useScrollDownAnimationHook()
  const { ref: ref2, controls: controls2 } = useScrollDownAnimationHook()

  return (
    <section className="py-16 sm:py-24">
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse ${feature.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
          } items-center gap-12`}
      >
        <motion.div
          ref={ref1}
          initial="hidden"
          animate={controls2}
          variants={{
            hidden: {
              opacity: 0,
              y: 100,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 2,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
          className="lg:w-1/2 text-center lg:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {feature.title}
          </h2>
          <p className="text-lg text-slate-300 mb-6">{feature.description}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-105"
          >
            <Headset className="mr-3 h-5 w-5" />
            Start for free
          </Link>
        </motion.div>
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
                delay: 0.5, // Delay the animation to avoid flickering
                ease: [0.22, 1, 0.36, 1]
              }
            },
          }}
          className="lg:w-1/2">
          <Image
            src={feature.image}
            alt={feature.title}
            width={500}
            height={500}
            className="w-full h-auto rounded-xl shadow-2xl shadow-indigo-500/10 border border-slate-700/50"
          />
        </motion.div>
      </div>
    </section>
  );
};

export const CallToAction = () => {
  const features = [
    {
      title: "🎥 Create AI-Powered Short Films",
      description:
        "Turn your ideas into stunning 2-minute HD short films using AI. Simply input your story and let our AI handle the magic—from script to final cut.",
      image: "/features/1.png",
      reverse: false,
    },
    {
      title: "🧑‍🤝‍🧑 Consistent Characters",
      description:
        "Generate and maintain consistent, lifelike characters throughout your entire film, ensuring a seamless cinematic experience.",
      image: "/features/2.png",
      reverse: true,
    },
    {
      title: "🎨 Multiple Video Styles",
      description:
        "Choose from various cinematic styles like Ghibli, 3D Pixar, Realistic, Anime, and more to bring your unique vision to life.",
      image: "/features/3.jpg",
      reverse: false,
    },
    {
      title: "📽️ HD Quality, 2-Minute Short Films",
      description:
        "Generate high-definition short films in under 2 minutes, ready to share on social media or pitch to studios.",
      image: "/features/4.png",
      reverse: true,
    },
  ];

  return (
    <div className="w-full">
      {features.map((f, idx) => (
        <FeatureItem key={idx} feature={f} index={idx} />
      ))}
    </div>
  );
};
