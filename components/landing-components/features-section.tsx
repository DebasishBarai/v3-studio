'use client';

import { useScrollDownAnimationHook } from "@/hooks/use-scroll-down-animation-hook";
import { motion } from "framer-motion";
import {
  Film,
  Layers,
  CirclePlay,
  Mic,
  Scissors,
  Rocket,
} from "lucide-react";

export const Features = () => {
  const { ref: ref1, controls: controls1 } = useScrollDownAnimationHook()
  const { ref: ref2, controls: controls2 } = useScrollDownAnimationHook()
  const features = [
    {
      title: "Generate Short Films",
      description: "Turn your ideas into cinematic AI-powered short movies in minutes.",
      icon: <Film className="w-8 h-8 text-pink-400" />,
    },
    {
      title: "Episode-Based Films",
      description: "Create multi-episode series with consistent storylines and visuals.",
      icon: <Layers className="w-8 h-8 text-purple-400" />,
    },
    {
      title: "Consistent Characters",
      description: "AI maintains your characters' look and style throughout scenes.",
      icon: <CirclePlay className="w-8 h-8 text-blue-400" />,
    },
    {
      title: "Voice Narration",
      description: "Choose from multiple voices and narrators for immersive storytelling.",
      icon: <Mic className="w-8 h-8 text-emerald-400" />,
    },
    {
      title: "Scene-by-Scene Editing",
      description: "Fine-tune every moment of your AI-generated video effortlessly.",
      icon: <Scissors className="w-8 h-8 text-amber-400" />,
    },
    {
      title: "3-Click Movie Export",
      description: "Produce and download your movie with one-click simplicity.",
      icon: <Rocket className="w-8 h-8 text-red-400" />,
    },
  ];

  return (
    <div
      id="features"
      className="z-20 py-20 text-white text-center px-6"
    >
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
        className="text-3xl md:text-5xl font-bold mb-10">
        Everything You Need to{" "}
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Create AI Movies
        </span>
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
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-slate-400">{feature.description}</p>
          </div>
        ))}
      </motion.div >
    </div>
  );
};
