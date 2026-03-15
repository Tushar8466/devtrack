"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
   Radar as RadarIcon,
   Target,
   ShieldAlert,
   Radio,
   Navigation,
   Signal,
   Satellite as SatelliteIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import RedBackground from "@/components/red-bg";

// Mock data for interceptions
const INTERCEPTIONS = [
   { id: "INT_0x1", target: "react-core", sector: "NA_NORTH", status: "SYNCED", signal: 94 },
   { id: "INT_0x2", target: "vercel-edge", sector: "EU_WEST", status: "DECODING", signal: 82 },
   { id: "INT_0x3", target: "tailwind-labs", sector: "AS_EAST", status: "STABLE", signal: 98 },
   { id: "INT_0x4", target: "gaearon-dna", sector: "ALPHA_7", status: "BUSY", signal: 45 },
];

export default function SatellitePage() {
   const [altitude, setAltitude] = useState(420);

   useEffect(() => {
      const interval = setInterval(() => {
         setAltitude(a => a + (Math.random() * 2 - 1));
      }, 100);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="min-h-screen bg-black text-white selection:bg-red-500/30 overflow-hidden relative font-mono">
         {/* Cinematic 3D Background */}
         <RedBackground />

         {/* Decorative scanline Layer */}
         <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-40 bg-[length:100%_2px,3px_100%]" />

         {/* Interface Layer */}
         <div className="absolute inset-x-8 bottom-8 top-32 pointer-events-none z-50 flex flex-col justify-between">
            {/* Top Header */}
            <div className="flex justify-between items-start pointer-events-auto">
               <div className="space-y-4">
                  <div className="flex items-center gap-2">
                     <div className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md">
                        <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Orbital_Recon_0x9A</span>
                     </div>
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none select-none">
                     Deep <span className="text-red-500">Scan</span>
                  </h1>
                  <p className="text-neutral-500 text-xs max-w-sm font-medium uppercase tracking-[0.4em] italic">
                     Geospatial Interception of Global Intelligence Nodes
                  </p>
               </div>

               <div className="flex flex-col items-end gap-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 min-w-[140px]">
                        <span className="text-[10px] font-black text-neutral-500 uppercase block mb-1 underline decoration-red-500/30">ALTITUDE</span>
                        <div className="flex items-baseline gap-2">
                           <span className="text-2xl font-black text-white italic">{altitude.toFixed(2)}</span>
                           <span className="text-[8px] font-black text-neutral-600 uppercase">KM</span>
                        </div>
                     </div>
                     <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 min-w-[140px]">
                        <span className="text-[10px] font-black text-neutral-500 uppercase block mb-1 underline decoration-red-500/30">VELOCITY</span>
                        <div className="flex items-baseline gap-2">
                           <span className="text-2xl font-black text-white italic">7.64</span>
                           <span className="text-[8px] font-black text-neutral-600 uppercase">KM/S</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Bottom Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pointer-events-auto">
               {/* Section 1: Radar Feed */}
               <div className="lg:col-span-1 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                     <RadarIcon size={16} className="text-red-500" />
                     <h2 className="text-lg font-black uppercase tracking-tighter italic">Tactical_Scan</h2>
                  </div>

                  <div className="flex-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-4xl p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)]" />

                     {/* Conic Gradient Sweep */}
                     <div className="relative w-48 h-48 rounded-full border border-red-500/20 flex items-center justify-center">
                        <motion.div
                           animate={{ rotate: 360 }}
                           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                           className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0%,rgba(239,68,68,0.2)_100%)]"
                        />
                        <div className="absolute inset-[20%] rounded-full border border-red-500/10" />
                        <div className="absolute inset-[50%] rounded-full border border-red-500/10" />

                        {/* Blips */}
                        <motion.div
                           animate={{ opacity: [0, 1, 0] }}
                           transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                           className="absolute top-10 right-12 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)]"
                        />

                        <Target size={24} className="text-red-500 relative z-10 animate-pulse" />
                     </div>
                  </div>
               </div>

               {/* Section 2: Interception Feed */}
               <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                     <Radio size={16} className="text-red-500" />
                     <h2 className="text-lg font-black uppercase tracking-tighter italic">Neural_Interceptions</h2>
                  </div>

                  <div className="flex-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-4xl p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                     {INTERCEPTIONS.map((item, i) => (
                        <motion.div
                           key={item.id}
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.1 }}
                           className="p-5 rounded-3xl bg-black/40 border border-white/5 hover:border-red-500/30 transition-all relative group cursor-pointer"
                        >
                           <div className="flex justify-between items-start mb-4">
                              <div className="space-y-1">
                                 <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">{item.id}</span>
                                 <h4 className="text-sm font-black text-white uppercase italic">{item.target}</h4>
                              </div>
                              <Signal size={14} className={cn(item.signal > 80 ? "text-red-500" : "text-amber-500")} />
                           </div>

                           <div className="flex justify-between items-end border-t border-white/5 pt-4">
                              <div className="flex flex-col">
                                 <span className="text-[8px] font-black text-neutral-600 uppercase">Sector</span>
                                 <span className="text-[11px] font-black text-neutral-300">{item.sector}</span>
                              </div>
                              <span className={cn(
                                 "text-[9px] font-black px-2 py-0.5 rounded",
                                 item.status === "STABLE" ? "bg-red-500/20 text-red-400" : "bg-red-500/10 text-red-600"
                              )}>
                                 {item.status}
                              </span>
                           </div>
                        </motion.div>
                     ))}

                     <div className="md:col-span-2 p-6 bg-red-500/5 border border-red-500/20 rounded-3xl flex items-center justify-between group cursor-help">
                        <div className="flex items-center gap-4">
                           <ShieldAlert className="text-red-500 w-8 h-8" />
                           <div className="space-y-0.5">
                              <h4 className="text-xs font-black text-white uppercase italic tracking-widest">Protocol Delta Active</h4>
                              <p className="text-[10px] text-neutral-500 uppercase font-mono">ENCRYPTING_ORBITAL_UPLINK...</p>
                           </div>
                        </div>
                        <button className="px-6 py-3 bg-red-500 text-black rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-colors">
                           Override
                        </button>
                     </div>
                  </div>
               </div>

               {/* Section 3: Satellite Health */}
               <div className="lg:col-span-1 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                     <SatelliteIcon size={16} className="text-red-500" />
                     <h2 className="text-lg font-black uppercase tracking-tighter italic">System_Integrity</h2>
                  </div>

                  <div className="flex-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-4xl p-8 space-y-8 flex flex-col overflow-hidden">
                     <div className="space-y-6">
                        <div className="space-y-3">
                           <div className="flex justify-between text-[10px] font-black text-neutral-500 uppercase italic">
                              <span>Battery_Level</span>
                              <span className="text-red-500">84%</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div animate={{ width: "84%" }} className="h-full bg-red-500" />
                           </div>
                        </div>

                        <div className="space-y-3">
                           <div className="flex justify-between text-[10px] font-black text-neutral-500 uppercase italic">
                              <span>Thermal_Load</span>
                              <span className="text-red-500">32°C</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div animate={{ width: "32%" }} className="h-full bg-red-500" />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center gap-3 text-red-400">
                           <Navigation size={14} className="animate-bounce" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">GeoSync_Station_04</span>
                        </div>
                        <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.4em] leading-relaxed">
                           Neural uplink established. Latency: 12ms.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* GRADIENT BLOOM OVERLAY */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.02)_0%,transparent_60%)] pointer-events-none z-10" />
      </div>
   );
}
