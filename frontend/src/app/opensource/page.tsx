"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ExternalLink, ArrowRight } from "lucide-react";

function OpenSourceLandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-20">
      <div className="flex flex-col overflow-hidden bg-black">
        <ContainerScroll
          titleComponent={
            <h1 className="text-4xl font-semibold text-white text-center">
              DevTrack <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Open Source Tracker
              </span>
            </h1>
          }
        >
          <img
            src="/opensource.png"
            alt="opensource"
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full space-y-24 relative z-10 -mt-20">
        <div className="flex flex-col items-center gap-8 text-center">
          <h2 className="text-3xl md:text-6xl font-black bg-clip-text text-transparent bg-linear-to-b from-white to-neutral-500 uppercase tracking-tighter leading-tight">
            Track Your Contribution <br className="hidden md:block" /> Legacy
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
            Every line of code you contribute to open source builds the future.
            Use our premium tracker to visualize your impact across the global ecosystem.
          </p>

          <button
            onClick={() => router.push("/opensource/track")}
            className="group relative px-10 py-5 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-lg"
          >
            <span className="relative z-10">Start Tracking Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-20 border-t border-white/10">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500 to-blue-500 rounded-3xl blur opacity-20 transition duration-1000 group-hover:opacity-40"></div>
            <div className="relative bg-[#050505] rounded-2xl border border-white/10 p-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">Contribution Strategy</h3>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Focus on high-quality pull requests. Address issues labeled with <span className="text-cyan-400 font-medium whitespace-nowrap">"good first issue"</span> or <span className="text-cyan-400 font-medium whitespace-nowrap">"help wanted"</span> to start your open source journey.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-20 transition duration-1000 group-hover:opacity-40"></div>
            <div className="relative bg-[#050505] rounded-2xl border border-white/10 p-8 flex flex-col gap-4 text-center items-center justify-center">
              <h3 className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-white to-neutral-400 italic">
                "The best way to predict the future is to create it."
              </h3>
              <p className="text-neutral-500 text-[10px] mt-2 uppercase tracking-[0.2em]">
                Join the movement of developers building the software that runs the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpenSourceLandingPage;