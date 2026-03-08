import HeroSection from "@/components/HeroSection";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

const features = [
  {
    icon: "🔍",
    title: "Profile Analysis",
    description:
      "Instantly analyze any public GitHub profile. Get deep insights into coding patterns, commit history, and repository quality.",
  },
  {
    icon: "🤖",
    title: "AI Influence Detection",
    description:
      "Our proprietary algorithm detects patterns consistent with AI-assisted code generation, giving you transparency on authorship.",
  },
  {
    icon: "📊",
    title: "Contribution Heatmap",
    description:
      "Visualize a developer's year-long activity with a beautiful GitHub-style contribution graph, powered by real data.",
  },
  {
    icon: "⚡",
    title: "Post-Merge Stability",
    description:
      "Analyze hotfix frequency and revert patterns within 72 hours of a PR merge — a key signal of low-confidence code.",
  },
  {
    icon: "🛡️",
    title: "Authorship Confidence Score",
    description:
      "A single, easy-to-read score that summarizes a developer's true software authorship confidence based on multiple signals.",
  },
  {
    icon: "🔎",
    title: "Repository Deep-Dive",
    description:
      "Browse all pinned and public repositories, inspect commit logs, and filter by language — all without leaving DevTrack.",
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
          src="/screenshot.png"
          showGradient={false}
        />
      </div>

      {/* Features section */}
      <section className="bg-black py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">
              Features
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold text-white">
              Everything you need to <br />
              <span className="text-violet-400">decode a developer</span>
            </h2>
            <p className="mt-4 text-neutral-400 text-lg max-w-2xl mx-auto">
              DevTrack gives you a complete picture of any GitHub developer, powered by real data and intelligent analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-500/40 transition-all duration-300 group"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-violet-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{f.description}</p>
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
          <a
            href="/explore"
            className="inline-block px-10 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition-all duration-300 shadow-[0_0_40px_-5px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_-5px_rgba(124,58,237,0.7)] hover:-translate-y-0.5"
          >
            Start Scanning Now →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">© 2026 DevTrack. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/explore" className="text-neutral-500 hover:text-white text-sm transition-colors">Explore</a>
            <a href="/dashboard" className="text-neutral-500 hover:text-white text-sm transition-colors">Dashboard</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white text-sm transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}