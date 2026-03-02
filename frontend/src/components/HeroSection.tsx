"use client";

import { BoxesCore } from "./ui/background-boxes";

export default function HeroSection() {
  return (
    <div>
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-white dark:bg-black z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none transition-colors duration-300" />

        <div className="absolute inset-0 w-full h-full z-0">
          <BoxesCore />
        </div>
      </div>
    </div>
  );
}
