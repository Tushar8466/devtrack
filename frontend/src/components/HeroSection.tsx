"use client";

import SplineBackground from "./home";

export default function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* BACKGROUND STACK */}
      <div className="absolute inset-0 w-full h-full">
        {/* Layer: Spline (The Main Attraction) */}
        <div className="absolute inset-0 z-30">
          <SplineBackground />
        </div>
      </div>

      {/* FOREGROUND CONTENT - ALL TEXT REMOVED AS REQUESTED */}
    </div>
  );
}
