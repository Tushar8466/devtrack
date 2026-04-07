"use client";
import React from "react";

import { AnimatePresence, motion } from "motion/react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { ChevronRight } from "lucide-react";

export function WhoIsItFor() {
  return (
    <section className="bg-black py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 text-white">
          <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 italic">
            Who is <span className="text-violet-500">DevTrack</span> for?
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Designed for teams that value transparency and code quality.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card 
            title="Engineering leaders" 
            icon={<ChevronIcon />}
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[[124, 58, 237]]} // Violet
              dotSize={2}
            />
          </Card>
          <Card 
            title="Open Source Maintainers" 
            icon={<ChevronIcon />}
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[
                [168, 85, 247],
                [192, 38, 211],
              ]}
              dotSize={2}
            />
            <div className="absolute inset-0 mask-[radial-gradient(400px_at_center,white,transparent)] bg-black/50" />
          </Card>
          <Card 
            title="Recruiters" 
            icon={<ChevronIcon />}
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[[124, 58, 237]]}
              dotSize={2}
            />
          </Card>
        </div>
      </div>
    </section>
  );
}

const Card = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-white/20 group/canvas-card max-w-sm w-full mx-auto relative h-120 transition-all duration-500 hover:bg-black/40"
    >
      {/* Plus signs must live OUTSIDE the overflow-hidden boundary to be visible properly */}
      <Icon className="absolute h-4 w-4 -top-2 -left-2 text-white pointer-events-none" />
      <Icon className="absolute h-4 w-4 -bottom-2 -left-2 text-white pointer-events-none" />
      <Icon className="absolute h-4 w-4 -top-2 -right-2 text-white pointer-events-none" />
      <Icon className="absolute h-4 w-4 -bottom-2 -right-2 text-white pointer-events-none" />

      {/* Overflow hidden boundary specifically for the canvas reveal effect */}
      <div className="absolute inset-0 overflow-hidden z-0">
         <AnimatePresence>
           {hovered && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="h-full w-full absolute inset-0"
             >
               {children}
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20 transition duration-500 pointer-events-none">
        <div className="text-center group-hover/canvas-card:opacity-0 transition duration-500 w-full mx-auto flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-white text-3xl font-black uppercase tracking-tighter opacity-0 group-hover/canvas-card:opacity-100 relative z-10 mt-4 group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-500 text-center px-4">
          {title}
        </h2>
      </div>
    </div>
  );
};

const ChevronIcon = () => {
  return (
    <ChevronRight className="h-16 w-16 text-white group-hover/canvas-card:text-violet-500 transition-colors duration-500" strokeWidth={1} />
  );
};

const Icon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20" />
      <path d="M2 12h20" />
    </svg>
  );
};
