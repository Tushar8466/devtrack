"use client";

import { BoxesCore } from "./ui/background-boxes";
import SplineBackground from "./home";

export default function HeroSection() {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* BACKGROUND STACK */}
      <div className="absolute inset-0 w-full h-full">
        {/* Layer 1: Boxes (Technical Overlay) */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.1]">
          <BoxesCore />
        </div>

        {/* Layer 2: Grid Texture */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-size-[60px_60px]" />

        {/* Layer 3: Spline (The Main Attraction) */}
        <div className="absolute inset-0 z-30">
          <SplineBackground />
        </div>

        {/* Layer 4: Gradient Mask */}
        <div className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,black_100%)]" />
      </div>

      {/* ALL FOREGROUND CONTENT REMOVED AS REQUESTED */}
    </div>
  );
}
