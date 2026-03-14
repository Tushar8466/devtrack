"use client";

import { Shield, Zap, Search, Fingerprint, Brain, Lock } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function IntelligenceGrid() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-136 xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Fingerprint className="h-4 w-4 text-violet-500" />}
        title="Predictive Authorship"
        description="Our engine identifies patterns that distinguish human intuition from synthetic generation with 99.4% accuracy."
      />

      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Brain className="h-4 w-4 text-cyan-500" />}
        title="Neural Synapse Analysis"
        description="Deconstruct code into billion-token vector spaces to map the unique genetics of every contributor."
      />

      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Shield className="h-4 w-4 text-rose-500" />}
        title="Zero-Trust Verification"
        description="Automated integrity checks across every pull request, ensuring codebases remain authenticated and secure."
      />

      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Zap className="h-4 w-4 text-amber-500" />}
        title="High-Velocity Extraction"
        description="Real-time data streaming from global open-source nodes for instantaneous reputation scoring."
      />

      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Lock className="h-4 w-4 text-emerald-500" />}
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
    <li className={cn("min-h-56 list-none", area)}>
      <div className="relative h-full rounded-2xl border border-white/10 p-2 md:rounded-3xl md:p-3 bg-black/50 backdrop-blur-sm">
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 shadow-[0px_0px_27px_0px_rgba(0,0,0,1)]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-white/10 bg-white/5 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 font-sans text-xl font-bold text-white md:text-2xl uppercase tracking-tight italic">
                {title}
              </h3>
              <p className="font-sans text-sm text-neutral-500 md:text-base leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
