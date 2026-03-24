"use client";

import React, { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Home, Zap, Activity, Cpu, ShieldAlert, Monitor, Terminal, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

const HUD_LABELS = [
  "SECTOR_SYNC_ERROR: 0x992",
  "UPLINK_ABORTED",
  "PROTOCOL_COLLISION",
  "NEURAL_DRIFT_DETECTED",
  "CORE_MATRIX_UNAVAILABLE"
];

export default function NotFound() {
  const [logs, setLogs] = useState<string[]>(["SYSTEM_INITIALIZING..."]);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate scrolling terminal logs
    const logInterval = setInterval(() => {
        const newLog = HUD_LABELS[Math.floor(Math.random() * HUD_LABELS.length)];
        setLogs(prev => [...prev.slice(-4), `> ${newLog}`]);
    }, 2000);

    // Dynamic coordinates
    const moveCoords = (e: MouseEvent) => {
        setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', moveCoords);
    return () => {
        clearInterval(logInterval);
        window.removeEventListener('mousemove', moveCoords);
    };
  }, []);

  return (
    <main className="fixed inset-0 w-full h-screen bg-black overflow-hidden select-none">
      
      {/* 3D Visual Container */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="w-12 h-12 border-2 border-white/5 border-t-violet-500 rounded-full animate-spin" />
          </div>
        }>
          <div className="w-full h-full opacity-60">
            <Spline
              className="w-full h-full object-cover"
              scene="https://prod.spline.design/yJ737lKq0PdNq82W/scene.splinecode" 
            />
          </div>
        </Suspense>
      </div>

      {/* Cinematic Overlays (HUD) */}
      <div className="absolute inset-0 z-10 pointer-events-none p-12">
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.01)_50%,transparent_100%)] bg-[length:100%_4px] opacity-20" />
        
        {/* HUD Corners */}
        <div className="absolute top-12 left-12 w-16 h-16 border-t-2 border-l-2 border-white/10" />
        <div className="absolute top-12 right-12 w-16 h-16 border-t-2 border-r-2 border-white/10" />
        <div className="absolute bottom-12 left-12 w-16 h-16 border-b-2 border-l-2 border-white/10" />
        <div className="absolute bottom-12 right-12 w-16 h-16 border-b-2 border-r-2 border-white/10" />

        {/* Top Header */}
        <div className="flex justify-between items-start opacity-40">
            <div className="space-y-1">
                <p className="text-[10px] font-mono text-white/50 uppercase tracking-[0.5em]">Sector::Unknown_Region</p>
                <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">404_COLLISION</h1>
                </div>
            </div>
            <div className="text-right font-mono text-[9px] text-white/40 space-y-1 uppercase tracking-widest">
                <p>SYNC_STATE: DISCONNECTED</p>
                <p>COORD_LAT: {coords.x}.002</p>
                <p>COORD_LNG: {coords.y}.991</p>
            </div>
        </div>

        {/* Bottom HUD: Live Terminal Terminal */}
        <div className="absolute bottom-24 left-12 space-y-2 opacity-50">
            <div className="flex items-center gap-2 text-violet-500 mb-4 animate-pulse">
                <Terminal className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Neural_Link_Fault_Log</span>
            </div>
            {logs.map((log, i) => (
                <p key={i} className="text-[10px] font-mono text-white/60 lowercase italic tracking-widest leading-none">
                    {log}
                </p>
            ))}
        </div>
      </div>

      {/* Active Navigation Panel (Clickable) */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20 space-y-8 pointer-events-auto">
        <div className="flex items-center gap-3 mb-4 opacity-40">
            <div className="w-1.5 h-6 bg-violet-500 rounded-full" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Active_Sectors</h4>
        </div>
        
        <div className="flex flex-col gap-3">
            {[
                { name: "Pulse", path: "/pulse", icon: Activity },
                { name: "Code DNA", path: "/dna", icon: Cpu },
                { name: "DevTrack AI", path: "/ai", icon: Zap },
            ].map((node, i) => (
                <Link 
                    key={node.name}
                    href={node.path}
                    className="group flex flex-col items-end gap-1 p-3 px-6 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-2xl transition-all duration-500"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-black italic uppercase tracking-tighter text-neutral-500 group-hover:text-white transition-colors">{node.name}</span>
                        <node.icon className="w-4 h-4 text-neutral-700 group-hover:text-violet-500 transition-colors" />
                    </div>
                </Link>
            ))}
        </div>
      </div>

      {/* Main Back Button */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
         <Link
          href="/"
          className="flex items-center gap-4 px-10 py-5 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 text-white font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-500 group shadow-2xl relative overflow-hidden"
        >
          {/* Animated Background Slide */}
          <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 flex items-center gap-4">
            <Home size={18} className="group-hover:rotate-12 transition-transform duration-500" />
            <span className="uppercase tracking-[0.2em] text-[10px] font-black italic">Abort Divergence / Return Home</span>
          </div>
        </Link>
      </div>

      {/* Background Ambience Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-violet-600/10 blur-[150px] rounded-full" />
         <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

    </main>
  );
}
