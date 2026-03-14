"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

export default function VoiceAssistantAgent() {
  return (
    <div className="w-full h-full relative cursor-pointer">
      <Suspense fallback={
        <div className="w-full h-full bg-black/20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        </div>
      }>
        <div className="w-full h-full">
          <Spline
            scene="https://prod.spline.design/N6V-P-eZEHBhbItC/scene.splinecode" 
            className="w-full h-full"
          />
        </div>
      </Suspense>
    </div>
  );
}
