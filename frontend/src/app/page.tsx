"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import AnimatedDevTrackScreen from "@/components/ui/AnimatedDevTrackScreen";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { Search, Brain, BarChart, User, Settings, Lock } from "lucide-react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("@/components/globe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-neutral-500 bg-black/20">
      <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      <p className="text-xs font-medium uppercase tracking-widest animate-pulse">Initializing World Map...</p>
    </div>
  ),
});

// ... (Icon definition same as before)
const Icon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <line x1="10" y1="4" x2="10" y2="16" />
      <line x1="4" y1="10" x2="16" y2="10" />
    </svg>
  );
};

// ... (features and steps same as before)
const features = [
  {
    title: "AI Likelihood Score",
    description: "Scan any GitHub PR or commit URL in seconds.",
    icon: <Search className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" strokeWidth={1.5} />,
  },
  {
    title: "Style Drift Indicator",
    description: "Powered by CodeBERT — trained specifically on code, not text.",
    icon: <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-purple-500" strokeWidth={1.5} />,
  },
  {
    title: "Post-Merge Stability",
    description: "Get a 0–100% AI probability score with an explainability report.",
    icon: <BarChart className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" strokeWidth={1.5} />,
  },
  {
    title: "Ownership Confidence",
    description: "Detects deviations from a contributor's historical coding style.",
    icon: <User className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500" strokeWidth={1.5} />,
  },
  {
    title: "Repository AI Influence Trend",
    description: "Drop one config file into any repo. Scans run automatically.",
    icon: <Settings className="w-12 h-12 sm:w-16 sm:h-16 text-pink-500" strokeWidth={1.5} />,
  },
  {
    title: "Privacy First",
    description: "Code is never stored. Scans are ephemeral. Always.",
    icon: <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-500" strokeWidth={1.5} />,
  },
];

const steps = [
  {
    step: "01",
    title: "Search a GitHub Username",
    description: "Type any public GitHub username into the search bar on the Explore page.",
  },
  {
    step: "02",
    title: "We Fetch & Analyze",
    description:
      "DevTrack fetches repositories, commits, and contribution data from GitHub in real time and runs our AI analysis.",
  },
  {
    step: "03",
    title: "Review the Report",
    description:
      "Get a comprehensive report with risk scores, contribution history, pinned repos, and much more.",
  },
];

export default function Home() {
  const { data: session } = useSession();
  const nextRoute = session ? "/explore" : "/sign-in";

  return (
    <div className="bg-black">
      <HeroSection />

      {/* MacBook Scroll section */}
      <div className="overflow-hidden bg-black w-full">
        <MacbookScroll
          title={
            <span className="text-white">
              Analyze any GitHub profile. <br />
              <span className="text-violet-400">Instantly.</span>
            </span>
          }
          screenContent={<AnimatedDevTrackScreen />}
          showGradient={false}
        />
      </div>

      {/* Features section */}
      <section className="bg-black py-24 px-6 border-t border-white/5">
        <div className="relative z-20 w-full mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything you need to detect AI code
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              Powerful tools built for modern engineering teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="border border-black/20 dark:border-white/20 flex flex-col items-start p-4 relative h-[30rem] bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl group"
              >
                {/* Corner icons */}
                <Icon className="absolute h-6 w-6 -top-3 -left-3 text-slate-900 dark:text-white" />
                <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-slate-900 dark:text-white" />
                <Icon className="absolute h-6 w-6 -top-3 -right-3 text-slate-900 dark:text-white" />
                <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-slate-900 dark:text-white" />

                {/* Evervault interactive card */}
                <div className="w-full flex-1 flex items-center justify-center">
                  <EvervaultCard text={feature.icon} />
                </div>

                {/* Text */}
                <div className="w-full mt-2 flex flex-col gap-3 pb-10">
                  <h3 className="text-slate-900 dark:text-white text-xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-light border border-black/20 dark:border-white/20 rounded-full px-4 py-2 text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="bg-black py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">
              How it works
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold text-white">
              Three steps to insight
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mb-6">
                  <span className="text-violet-400 text-xl font-bold">{s.step}</span>
                </div>
                <h3 className="text-white font-semibold text-xl mb-3">{s.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-black py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to decode <span className="text-violet-400">developer DNA</span>?
          </h2>
          <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
            Start analyzing GitHub profiles instantly — no setup, no credit card required.
          </p>
          <Link
            href={nextRoute}
            className="inline-block px-10 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition-all duration-300 shadow-[0_0_40px_-5px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_-5px_rgba(124,58,237,0.7)] hover:-translate-y-0.5"
          >
            Start Scanning Now →
          </Link>
        </div>
      </section>

      {/* Global Interactive Section */}
      <section id="global-map" className="bg-black py-24 px-6 border-t border-white/5 overflow-hidden relative min-h-[600px] flex flex-col items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(124,58,237,0.05),transparent)] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            A Global Insight Into <span className="text-violet-400">Software Authorship</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Interactive visualization of real-time developer metrics across the global ecosystem.
          </p>
        </div>

        <div className="w-full max-w-6xl h-[600px] md:h-[800px] relative z-10 bg-white/2 border border-white/5 border-indigo-500/10 rounded-[3rem] p-1 backdrop-blur-sm group hover:border-violet-500/20 transition-all duration-700">
          <div className="w-full h-full rounded-[2.8rem] overflow-hidden">
            <Globe />
          </div>

          {/* Accent decoration */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-violet-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">© 2026 DevTrack. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href={nextRoute} className="text-neutral-500 hover:text-white text-sm transition-colors">Explore</Link>
            <Link href="/opensource" className="text-neutral-500 hover:text-white text-sm transition-colors">Open Source</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white text-sm transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}