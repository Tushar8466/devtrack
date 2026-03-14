"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Rocket, 
  Star, 
  GitFork, 
  ExternalLink,
  Search,
  Zap,
  Tag,
  Code2,
  Terminal,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "@/components/ui/background-beams";

interface Project {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  owner: {
    avatar_url: string;
    login: string;
  };
  topics: string[];
}

export default function ProjectsShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeLang, setActiveLang] = useState<string>("All");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://api.github.com/search/repositories?q=stars:>10000+topic:nextjs&sort=stars&order=desc&per_page=12", {
          headers: { "Accept": "application/vnd.github.v3+json" }
        });
        if (res.ok) {
          const data = await res.json();
          setProjects(data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = projects.filter(p => {
    const matchesSearch = p.full_name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesLang = activeLang === "All" || p.language === activeLang;
    return matchesSearch && matchesLang;
  });

  const languages = ["All", ...Array.from(new Set(projects.map(p => p.language).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 pb-24 overflow-x-hidden">
      <BackgroundBeams className="opacity-20" />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit"
            >
              <Rocket className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Discovery_Module_Engaged</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none"
            >
              Project <span className="bg-linear-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">Showcase</span>
            </motion.h1>
            <p className="text-neutral-500 max-w-xl font-mono text-xs uppercase tracking-[0.3em]">
              Architectural blueprints for high-impact open source infrastructure.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH_REGISTRY..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-neutral-800"
              />
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-12">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={cn(
                "px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all",
                activeLang === lang 
                  ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : "bg-white/5 border-white/5 text-neutral-500 hover:border-white/10 hover:text-white"
              )}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-white/5 rounded-4xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-[#040408] border border-white/5 rounded-4xl p-8 overflow-hidden hover:border-emerald-500/30 transition-all cursor-pointer"
                  onClick={() => window.open(project.html_url, '_blank')}
                >
                  {/* Background Accents */}
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-5xl">
                    <Terminal className="w-20 h-20" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex -space-x-3">
                        <img src={project.owner.avatar_url} className="w-12 h-12 rounded-2xl border border-white/10 relative z-10" alt="" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Stars</p>
                          <p className="text-sm font-black text-white tabular-nums">{(project.stargazers_count / 1000).toFixed(1)}k</p>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-right">
                          <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Score</p>
                          <p className="text-sm font-black text-emerald-500 tabular-nums">98.2</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div>
                        <span className="text-[8px] font-mono text-neutral-700 uppercase tracking-widest">NODE_TYPE: {project.language || "UNKNOWN"}</span>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic group-hover:text-emerald-400 transition-colors">
                          {project.name}
                        </h3>
                      </div>
                      <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest leading-relaxed line-clamp-3">
                        {project.description || "NO_DESCRIPTION_TRACE_FOUND"}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2 pt-6 border-t border-white/5">
                      {project.topics.slice(0, 3).map(topic => (
                        <span key={topic} className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[7px] font-black text-neutral-600 uppercase tracking-[0.2em]">
                          #{topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Intercept overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                     <div className="flex items-center gap-3 px-6 py-3 bg-black border border-white/20 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform">
                        <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Intercept_Link</span>
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="py-40 text-center">
            <ShieldAlert className="w-12 h-12 text-neutral-800 mx-auto mb-6" />
            <h3 className="text-xl font-black text-white uppercase tracking-widest">No Node Detected</h3>
            <p className="text-neutral-600 text-[10px] uppercase tracking-[0.5em] mt-2">Try_Adjusting_Frequency_Search</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ShieldAlert(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}
