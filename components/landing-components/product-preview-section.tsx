"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Features2 } from "@/components/landing-components/features-2-section";


export const ProductPreviewSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Change these values:

  const rotateX = useTransform(scrollYProgress, [0, 0.4], [36, 0]);
  const y = useTransform(scrollYProgress, [0, 0.6], [200, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.94, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.7, 1]);


  return (
    <section
      ref={ref}
      className="relative -top-60 w-full min-h-[80vh] overflow-hidden"
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-start justify-center">
        <motion.div
          style={{
            rotateX,
            y,
            scale,
            opacity,
            transformPerspective: 1400,
          }}
          className="relative w-[92%] max-w-6xl"
        >
          {/* White glow layers */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            {/* Core soft glow */}
            <div className="absolute inset-0 rounded-3xl blur-xl bg-white/20" />

            {/* Larger diffused halo */}
            <div className="absolute -inset-16 rounded-[40px] blur-[120px] bg-white/10" />
          </div>
          <Image
            src="/dashboardpage.png" // <-- your screenshot
            alt="V3 Studio Dashboard"
            width={1600}
            height={1000}
            priority
            className="rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.8)] border border-white/10"
          />
        </motion.div>
      </div>

      <Features2 />
    </section>
  );
};
