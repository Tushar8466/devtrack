"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GitHubCalendar } from "react-github-calendar";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Box, Users, GitFork, FileText, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowingCard } from "@/components/ui/glowing-card";
import { FileUpload } from "@/components/ui/file-upload";
import { X, Fingerprint, Activity, Clock, Award, Terminal } from "lucide-react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import Link from "next/link";

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string | null;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
  location: string | null;
  blog: string | null;
  public_gists: number;
  created_at: string;
  company: string | null;
  twitter_username: string | null;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string;
}


/* ---------------- DASHBOARD ---------------- */

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [githubData, setGithubData] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualUsername, setManualUsername] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("devtrack_custom_avatar");
    if (savedAvatar) {
      setCustomAvatar(savedAvatar);
    }
  }, []);

  const handleAvatarChange = (files: File[]) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCustomAvatar(base64String);
        localStorage.setItem("devtrack_custom_avatar", base64String);
        window.dispatchEvent(new Event("devtrack_avatar_updated"));
        setShowUploadModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const sessionUsername = (session?.user as SessionUser)?.username || "";
  const effectiveUsername = manualUsername || sessionUsername;

  useEffect(() => {
    if (!effectiveUsername) return;

    Promise.resolve().then(() => {
      setLoading(true);
      setIsSearching(true);
    });

    Promise.all([
      fetch(`https://api.github.com/users/${effectiveUsername}`).then((res) =>
        res.ok ? res.json() : null
      ),
      fetch(
        `https://api.github.com/users/${effectiveUsername}/repos?sort=updated&per_page=6`
      ).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([userData, reposData]) => {
        if (userData) {
          setGithubData(userData);
          if (Array.isArray(reposData)) setRepos(reposData);
        } else {
          setGithubData(null);
          setRepos([]);
        }
        setLoading(false);
        setIsSearching(false);
      })
      .catch(() => {
        setLoading(false);
        setIsSearching(false);
      });
  }, [effectiveUsername]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading session...
      </div>
    );
  }

  if (!session) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#030303] pt-28 pb-20 px-4 text-white font-sans selection:bg-violet-500/30">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* TACTICAL STATUS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-6 px-8 py-4 bg-white/2 border border-white/5 rounded-2xl backdrop-blur-3xl">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Neural_Latency</span>
              <span className="text-xs font-black text-violet-400 italic">24.8ms</span>
            </div>
            <div className="w-px h-6 bg-white/5 hidden md:block" />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Active_Uptime</span>
              <span className="text-xs font-black text-emerald-500 italic">99.98%</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={cn("w-1 h-3 rounded-full", i < 8 ? "bg-violet-500/40" : "bg-white/5")} />
              ))}
            </div>
            <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest ml-2">System_Integrity</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-violet-400 uppercase tracking-widest">Node_Encrypted</span>
            </div>
            <div className="text-[9px] font-mono text-neutral-700 uppercase tracking-widest group cursor-help">
              <span className="group-hover:text-neutral-400 transition-colors">Trace_ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* HERO PROFILE */}

        {!githubData && !loading && !isSearching ? (
          <div className="relative group max-w-2xl mx-auto">
            <div className="relative rounded-3xl border border-white/10 bg-[#050505] p-2 overflow-hidden shadow-2xl">
              <GlowingEffect
                blur={0}
                borderWidth={3}
                spread={80}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative rounded-2xl bg-[#050505] p-10 flex flex-col gap-6 items-center text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-2">
                  <GitFork className="w-8 h-8 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-b from-white to-neutral-400">
                    Link Your GitHub Profile
                  </h2>
                  <p className="text-neutral-500 mt-2 max-w-sm">
                    Connect your GitHub account to see your real-time developer metrics and project gallery.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const username = formData.get("username") as string;
                    if (username) setManualUsername(username);
                  }}
                  className="w-full max-w-md flex flex-col sm:flex-row gap-3"
                >
                  <input
                    name="username"
                    type="text"
                    placeholder="Enter GitHub username (e.g. tushar8466)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-neutral-600"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    Fetch Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : loading || isSearching ? (
          <MultiStepLoader
            loadingStates={[
              { text: "Locating GitHub profile" },
              { text: "Fetching user info" },
              { text: "Loading linked repositories" },
              { text: "Drawing contribution graph" },
            ]}
            loading={loading || isSearching}
            duration={400}
          />
        ) : (
          <div className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-violet-500/10 via-transparent to-fuchsia-500/10 opacity-30 blur-3xl" />
            <div className="relative rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-2xl p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
              <div className="relative cursor-pointer" onClick={() => setShowUploadModal(true)}>
                <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl scale-110 opacity-50 animate-pulse" />
                {customAvatar || githubData?.avatar_url || session.user?.image ? (
                  <div className="relative w-32 h-32 md:w-40 md:h-40">
                    <Image
                      src={customAvatar || githubData?.avatar_url || session.user?.image || ""}
                      alt="Profile"
                      fill
                      className="rounded-full ring-4 ring-white/5 object-cover transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
                    <Camera className="w-8 h-8 text-neutral-400" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-black flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em] mb-1">Authenticated_Node</p>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white flex flex-wrap items-center justify-center md:justify-start gap-3">
                    {githubData?.name || session.user?.name}
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[12px] font-mono text-neutral-500 not-italic tracking-normal align-middle">
                      v4.2.0
                    </span>
                  </h1>
                </div>
                
                <p className="text-neutral-500 text-lg font-medium italic max-w-xl">
                  {githubData?.bio || "DevTrack autonomous intelligence engine. Mapping neural authorship across global repositories."}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-violet-500" />
                    <span className="text-sm font-mono text-neutral-400 uppercase tracking-widest">@{effectiveUsername}</span>
                  </div>
                  {githubData?.location && (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-neutral-700 rounded-full" />
                      <span className="text-sm font-medium text-neutral-500 italic">{githubData.location}</span>
                    </div>
                  )}
                  {manualUsername && (
                    <button
                      onClick={() => {
                        setManualUsername("");
                        setGithubData(null);
                      }}
                      className="text-[10px] font-black text-violet-400 hover:text-white uppercase tracking-widest transition-colors border-b border-violet-500/30 pb-0.5"
                    >
                      Cycle_Identity
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-white uppercase tracking-[0.2em] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all shadow-xl"
                >
                  DISCONNECT_NODE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GLOWING STATS */}

        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-violet-500 rounded-full" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">GitHub Neural Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Box className="w-5 h-5" />, title: "Repositories", value: githubData?.public_repos, color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: <Users className="w-5 h-5" />, title: "Followers", value: githubData?.followers, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { icon: <GitFork className="w-5 h-5" />, title: "Following", value: githubData?.following, color: "text-amber-400", bg: "bg-amber-500/10" },
              { icon: <FileText className="w-5 h-5" />, title: "Gists", value: githubData?.public_gists, color: "text-rose-400", bg: "bg-rose-500/10" }
            ].map((stat, i) => (
              <div key={i} className="relative group overflow-hidden">
                <div className="absolute inset-0 bg-white/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative border border-white/10 bg-black/40 rounded-[2rem] p-8 transition-all hover:border-violet-500/30">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} border border-white/5`}>
                      {stat.icon}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-700 font-bold tracking-widest uppercase">REG_0{i+1}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">{stat.title}</p>
                    <div className="text-4xl font-black text-white italic tracking-tighter">
                      {stat.value ?? "–"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTRIBUTION GRAPH AND RECENT REPOS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* CONTRIBUTION CALENDAR */}
          <div className="xl:col-span-2 space-y-6">
            <div className="relative rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl p-8 h-full transition-all hover:border-violet-500/20">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Contribution Temporal Map</h2>
                </div>
                <div className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Live_Telemetry</div>
              </div>
              <div className="flex-1 flex items-center justify-center overflow-x-auto py-4">
                {effectiveUsername && (
                  <GitHubCalendar
                    username={effectiveUsername}
                    colorScheme="dark"
                    blockSize={14}
                    blockMargin={5}
                    fontSize={12}
                  />
                )}
              </div>
            </div>
          </div>

          {/* RECENT REPOS LIST */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-1">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Active Node Assets</h2>
            </div>
            <div className="flex flex-col gap-4">
              {repos.length > 0 ? (
                repos.slice(0, 3).map((repo) => (
                  <a key={repo.id} href={repo.html_url} target="_blank" className="group">
                    <div className="relative p-6 rounded-3xl border border-white/10 bg-black/40 hover:border-amber-500/30 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400 group-hover:text-amber-400 transition-colors">
                          <GitFork size={14} />
                        </div>
                        <span className="text-[8px] font-mono text-neutral-700 uppercase tracking-widest">Asset_Type: REPO</span>
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors mb-1">{repo.name}</h3>
                      <p className="text-[10px] text-neutral-500 line-clamp-1 italic font-medium">{repo.description || "No description provided"}</p>
                    </div>
                  </a>
                ))
              ) : (
                <p className="text-neutral-500 italic text-sm px-1">No recent activity detected.</p>
              )}
            </div>
          </div>
        </div>


        {/* REPOSITORY REGISTRY GRID */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-6 bg-fuchsia-500 rounded-full" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Repository Registry</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, i) => (
              <a key={repo.id} href={repo.html_url} target="_blank" className="group">
                <div className="relative h-full border border-white/10 bg-black/40 rounded-[2rem] p-8 transition-all hover:border-fuchsia-500/30 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 group-hover:text-fuchsia-400 transition-colors">
                      <Box size={20} />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-700 font-bold tracking-widest uppercase">REG_A{i+1}</span>
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-fuchsia-400 transition-colors">{repo.name}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed italic line-clamp-2">
                      {repo.description || "No specialized documentation found in repository root."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="px-2 py-0.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-md text-[9px] font-black text-fuchsia-400 uppercase tracking-widest">
                      {repo.language || "Unknown_Primitive"}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-700 uppercase tracking-widest">Update_{formatDate(repo.updated_at).toUpperCase()}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          />
          <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-bold">Change Profile Image</h2>
              <p className="text-neutral-500 mt-1">Upload a new avatar for your DevTrack profile.</p>
            </div>

            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5">
              <FileUpload onChange={handleAvatarChange} />
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-2 rounded-xl text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}