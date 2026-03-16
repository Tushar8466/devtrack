"use client";

import { Shield, Zap, Search, Fingerprint, Brain, Lock } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function IntelligenceGrid() {
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-12 md:grid-rows-3 lg:gap-6 xl:max-h-136 xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/13] lg:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Fingerprint className="h-5 w-5 text-violet-500" />}
        title="Predictive Authorship"
        description="Our engine identifies patterns that distinguish human intuition from synthetic generation with 99.4% accuracy."
      />

      <GridItem
        area="md:[grid-area:2/1/3/13] lg:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Brain className="h-5 w-5 text-cyan-500" />}
        title="Neural Synapse Analysis"
        description="Deconstruct code into billion-token vector spaces to map the unique genetics of every contributor."
      />

      <GridItem
        area="md:[grid-area:3/1/4/13] lg:[grid-area:2/1/4/7] xl:[grid-area:1/5/3/8]"
        icon={<Shield className="h-5 w-5 text-rose-500" />}
        title="Zero-Trust Verification"
        description="Automated integrity checks across every pull request, ensuring codebases remain authenticated and secure."
      />

      <GridItem
        area="md:[grid-area:4/1/5/13] lg:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Zap className="h-5 w-5 text-amber-500" />}
        title="High-Velocity Extraction"
        description="Real-time data streaming from global open-source nodes for instantaneous reputation scoring."
      />

      <GridItem
        area="md:[grid-area:5/1/6/13] lg:[grid-area:3/7/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Lock className="h-5 w-5 text-emerald-500" />}
        title="Privacy-Centric Scans"
        description="Code is never stored. Analysis is ephemeral and happens entirely within secured neural buffers."
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-64 sm:min-h-56 list-none", area)}>
      <div className="relative h-full rounded-2xl border border-white/10 p-2 md:rounded-3xl md:p-3 bg-black/50 backdrop-blur-sm">
        <GlowingEffect
          blur={0}
          borderWidth={2}
          spread={60}
          glow={true}
          disabled={false}
          proximity={60}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-xl p-6 sm:p-8">
          <div className="relative flex flex-1 flex-col justify-between gap-4">
            <div className="w-fit rounded-lg border border-white/10 bg-white/5 p-2.5">
              {icon}
            </div>
            <div className="space-y-4">
              <h3 className="pt-0.5 font-sans text-xl sm:text-2xl font-bold text-white uppercase tracking-tight italic leading-tight">
                {title}
              </h3>
              <p className="font-sans text-sm sm:text-base text-neutral-500 leading-relaxed max-w-sm">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
