"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Home } from 'lucide-react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

export default function NotFound() {
  return (
    <main className="fixed inset-0 w-full h-full bg-black overflow-hidden flex items-center justify-center">
      {/* 3D Visual Container - Forced to full viewport */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        }>
          <div className="w-full h-full scale-105 md:scale-100">
            <Spline
              className="w-full h-full object-cover"
              scene="https://prod.spline.design/J466gGMLjBbClWVx/scene.splinecode" 
            />
          </div>
        </Suspense>
      </div>

      {/* Navigation Layer */}
      <div className="absolute bottom-12 z-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Link
          href="/"
          className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 group shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)]"
        >
          <Home size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="uppercase tracking-widest text-[10px] font-black italic">Return to Reality</span>
        </Link>
      </div>
    </main>
  );
}
