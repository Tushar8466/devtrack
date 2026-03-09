"use client";

import React from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function GlowingCard({
    icon,
    title,
    value,
    description,
    className,
}: {
    icon: React.ReactNode;
    title: string;
    value?: string | number;
    description?: string | React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("relative rounded-2xl border border-white/10 p-2", className)}>
            <GlowingEffect
                blur={0}
                borderWidth={3}
                spread={80}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
            />

            <div className="relative rounded-xl bg-[#050505] p-6 flex flex-col gap-4 h-full">
                <div className="w-fit border border-white/10 rounded-lg p-2">{icon}</div>

                <div className="flex-1 flex flex-col justify-between gap-1">
                    {value !== undefined && (
                        <h3 className="text-3xl font-bold text-white">{value}</h3>
                    )}
                    <h4 className="text-sm font-semibold text-white">{title}</h4>
                    {description && (
                        <div className="text-xs text-neutral-400 mt-1 line-clamp-2">
                            {description}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
