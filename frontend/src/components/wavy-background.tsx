"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false to prevent crashes during pre-rendering
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

interface WavyProps {
    children?: React.ReactNode;
    backgroundColor?: string;
    rangeY?: number;
    particleCount?: number;
    baseHue?: number;
    containerClassName?: string;
    className?: string;
}

export default function Wavy({ 
    children, 
    containerClassName, 
    className 
}: WavyProps) {
    return (
        <div className={`relative ${containerClassName}`}>
            <div className="absolute inset-0 z-0">
                <Suspense fallback={
                    <div className="w-full h-full bg-black flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                    </div>
                }>
                    <Spline
                        scene="https://prod.spline.design/qwO73wVeqEFkNWY2/scene.splinecode"
                        className="w-full h-full"
                    />
                </Suspense>
            </div>
            <div className={`relative z-10 ${className}`}>
                {children}
            </div>
        </div>
    );
}
