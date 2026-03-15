"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import SplineBackground from "./home";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* BACKGROUND STACK */}
      <motion.div
        style={{ y, opacity, scale }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Layer: Spline (The Main Attraction) */}
        <div className="absolute inset-0 z-10">
          <SplineBackground />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black to-transparent z-20" />
      </motion.div>
    </div>
  );
}
