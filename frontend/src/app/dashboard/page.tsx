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
import { X, Fingerprint, Activity, Clock, Award, Terminal, Flame, AlertCircle, ShieldCheck, Dna } from "lucide-react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { motion } from "motion/react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import Link from "next/link";
import { BadgeShelf } from "@/components/ui/badge-shelf";
import { BadgeNotificationProvider } from "@/components/ui/badge-unlock";
import { DevScoreCard } from "@/components/ui/dev-score-card";
import { TopReposLeaderboard } from "@/components/ui/top-repos-leaderboard";
import { GoalTracker } from "@/components/ui/goal-tracker";
import { CommitActivityChart } from "@/components/ui/commit-activity-chart";
import { LanguageProficiency } from "@/components/ui/language-proficiency";
import { Badge } from "@/lib/badges/schema";

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
  forks_count: number;
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
  const [langData, setLangData] = useState<{ name: string; value: number }[]>([]);
  const [streakAtRisk, setStreakAtRisk] = useState(false);
  const [streakChecked, setStreakChecked] = useState(false);
  const [hasPushedToday, setHasPushedToday] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [threatLevel, setThreatLevel] = useState<{
    color: string;
    label: string;
    status: string;
    intensity: string;
  }>({ color: "red", label: "Critical_Status_Check", status: "Streak_At_Risk", intensity: "500" });

  useEffect(() => {
    if (streakAtRisk && !hasPushedToday) {
      const timer = setInterval(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setHours(24, 0, 0, 0);
        const diff = tomorrow.getTime() - now.getTime();

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        // Dynamic Threat Level Logic
        if (h >= 12) {
          setThreatLevel({ color: "amber", label: "Sequence_Pending", status: "Sync_Required", intensity: "500" });
        } else if (h >= 6) {
          setThreatLevel({ color: "orange", label: "Warning_Stability_Low", status: "Integrity_Degrading", intensity: "500" });
        } else if (h >= 2) {
          setThreatLevel({ color: "red", label: "Critical_Sequence_Risk", status: "Low_Integrity", intensity: "500" });
        } else {
          setThreatLevel({ color: "red", label: "Terminal_Expiry_Imminent", status: "Critical_Internal_Failure", intensity: "600" });
        }

        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [streakAtRisk, hasPushedToday]);

  useEffect(() => {
    if (repos.length > 0) {
      const languages: Record<string, number> = {};
      repos.forEach(repo => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });
      const topLangs = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([name, value]) => ({ name, value }));
      setLangData(topLangs);
    }
  }, [repos]);

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
      setProfileError(null);
    });

    fetch(`/api/github/profile?username=${effectiveUsername}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setGithubData(data.userData);
          if (Array.isArray(data.reposData)) setRepos(data.reposData);

          // Second-pass badge evaluation with GitHub profile data
          try {
            const repoList = Array.isArray(data.reposData) ? data.reposData : [];
            const totalStars = repoList.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
            const languages = [...new Set(repoList.map((r: any) => r.language).filter(Boolean))] as string[];

            await fetch(`/api/badges/${encodeURIComponent(effectiveUsername)}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                streak: 0,   // already evaluated in streak check
                commits: 0,  // already evaluated in streak check
                repos: data.userData?.public_repos || repoList.length,
                prs: 0,
                issues: 0,
                stars: totalStars,
                languages,
              })
            });
            // Note: we don't overwrite newBadges here to avoid double-notifying streak ones
          } catch (e) {
            console.error("Profile badge evaluation failed", e);
          }
        } else {
          setProfileError(data.message || data.error || "Failed to fetch profile");
          setGithubData(null);
          setRepos([]);
        }
        setLoading(false);
        setIsSearching(false);
      })
      .catch((err) => {
        setProfileError("Network error. Please try again.");
        setLoading(false);
        setIsSearching(false);
      });
  }, [effectiveUsername]);

  // Streak-at-risk check
  useEffect(() => {
    if (!effectiveUsername) return;

    let cancelled = false;
    const checkStreak = async () => {
      try {
        const localDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
        const offset = new Date().getTimezoneOffset();
        const res = await fetch(
          `/api/streak/check?username=${encodeURIComponent(effectiveUsername)}&localDate=${localDate}&offset=${offset}`
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          hasCommittedToday?: boolean;
          hasCommittedYesterday?: boolean;
          currentStreak?: number;
          totalActiveDays?: number;
        };
        if (!cancelled) {
          const pushed = data.hasCommittedToday === true;
          const pushedYesterday = data.hasCommittedYesterday === true;

          setHasPushedToday(pushed);
          // Alert visibility: Only at risk if they pushed yesterday but not today
          setStreakAtRisk(!pushed && pushedYesterday);
          setCurrentStreak(data.currentStreak || 0);
          setStreakChecked(true);

          // Trigger badge evaluation with rich real data
          try {
            const streakVal = data.currentStreak || 0;
            const totalCommits = data.totalActiveDays || 0; // best commit proxy from HTML scrape

            // Try to pull language list from the repos we already loaded in state
            // githubData isn't reliably loaded yet, so we use what we have
            const badgeRes = await fetch(`/api/badges/${encodeURIComponent(effectiveUsername)}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                streak: streakVal,
                commits: totalCommits,
                // These come from githubData loaded in parallel — may already be set
                repos: 0,   // will be a real value once githubData loads
                prs: 0,
                issues: 0,
                stars: 0,
                languages: [],
              })
            });
            if (badgeRes.ok) {
              const badgeData = await badgeRes.json();
              if (badgeData.newlyUnlocked?.length > 0) {
                setNewBadges(badgeData.newlyUnlocked.map((nr: any) => nr.details).filter(Boolean));
              }
            }
          } catch (e) {
            console.error("Badge evaluation failed", e);
          }
        }
      } catch {
        if (!cancelled) {
          setStreakChecked(true);
        }
      }
    };

    checkStreak();

    return () => {
      cancelled = true;
    };
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
      <BadgeNotificationProvider newlyUnlocked={newBadges} />

      <div className="max-w-[1400px] mx-auto space-y-12">

        {/* STREAK AT RISK BANNER */}
        {streakChecked && streakAtRisk && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative group "
          >
            {/* Ambient Base Glow */}
            <div className={cn(
              "absolute inset-0 blur-3xl opacity-30 group-hover:opacity-60 transition-all duration-2000",
              threatLevel.color === "red" ? "bg-red-600/50" :
                threatLevel.color === "orange" ? "bg-orange-500/50" : "bg-amber-500/50"
            )} />

            <div className={cn(
              "relative flex items-center justify-between px-6 md:px-12 py-8 rounded-4xl border backdrop-blur-3xl transition-all duration-2000 overflow-hidden shadow-2xl z-10",
              threatLevel.color === "red" ? "border-red-500/40 shadow-red-500/20" :
                threatLevel.color === "orange" ? "border-orange-500/40 shadow-orange-500/20" :
                  "border-amber-500/40 shadow-amber-500/20",
              "bg-[#050505]/95" // Deep dark background
            )}>
              {/* Tactical Warning Stripes */}
              <div className={cn(
                "absolute inset-0 opacity-[0.03] transition-colors duration-1000 pointer-events-none mix-blend-plus-lighter",
                "bg-[repeating-linear-gradient(-45deg,currentColor,currentColor_15px,transparent_15px,transparent_30px)]",
                threatLevel.color === "red" ? "text-red-500" :
                  threatLevel.color === "orange" ? "text-orange-500" : "text-amber-500"
              )} />

              {/* Moving Laser Sweep */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className={cn(
                  "absolute top-0 bottom-0 w-[50%] opacity-[0.05] pointer-events-none skew-x-[-20deg]",
                  "bg-linear-to-r from-transparent via-current to-transparent",
                  threatLevel.color === "red" ? "text-red-500" :
                    threatLevel.color === "orange" ? "text-orange-500" : "text-amber-500"
                )}
              />

              {/* Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none mask-[linear-gradient(to_bottom,black,transparent)] opacity-20" />

              <div className="relative flex flex-col md:flex-row items-center justify-between w-full gap-8 z-10">
                <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto text-center md:text-left">

                  {/* Central Icon Container */}
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-black rounded-3xl blur-[10px]" />
                    <div className={cn(
                      "w-20 h-20 rounded-3xl border-2 flex items-center justify-center transition-colors duration-1000 relative z-10 bg-black overflow-hidden shadow-inner group-hover:scale-110",
                      threatLevel.color === "red" ? "border-red-500/50 shadow-red-500/20" :
                        threatLevel.color === "orange" ? "border-orange-500/50 shadow-orange-500/20" :
                          "border-amber-500/50 shadow-amber-500/20"
                    )}>
                      <div className={cn(
                        "absolute inset-0 opacity-20",
                        threatLevel.color === "red" ? "bg-red-500" :
                          threatLevel.color === "orange" ? "bg-orange-500" : "bg-amber-500"
                      )} />
                      <Activity className={cn(
                        "w-10 h-10 transition-colors duration-1000 animate-pulse",
                        threatLevel.color === "red" ? "text-red-500" :
                          threatLevel.color === "orange" ? "text-orange-500" : "text-amber-500"
                      )} />
                    </div>
                    {/* Floating Orbs */}
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={cn(
                        "absolute -top-2 -right-2 w-4 h-4 rounded-full transition-colors duration-1000 z-20 blur-[2px]",
                        threatLevel.color === "red" ? "bg-red-500" : threatLevel.color === "orange" ? "bg-orange-500" : "bg-amber-500"
                      )}
                    />
                    <div className={cn(
                      "absolute -bottom-1 -left-1 w-2 h-2 rounded-full animate-ping transition-colors duration-1000 z-20",
                      threatLevel.color === "red" ? "bg-red-500" : threatLevel.color === "orange" ? "bg-orange-500" : "bg-amber-500"
                    )} />
                  </div>

                  {/* Typography Block */}
                  <div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                      <span className={cn(
                        "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.4em] transition-colors duration-1000",
                        threatLevel.color === "red" ? "text-red-500" :
                          threatLevel.color === "orange" ? "text-orange-500" : "text-amber-500"
                      )}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shadow-[0_0_10px_currentColor]" />
                        {threatLevel.label}
                      </span>
                      <span className={cn(
                        "px-3 py-1 border rounded-md bg-black text-[10px] font-black uppercase tracking-widest transition-all duration-1000",
                        threatLevel.color === "red" ? "border-red-500/80 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]" :
                          threatLevel.color === "orange" ? "border-orange-500/80 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]" :
                            "border-amber-500/80 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                      )}>{threatLevel.status}</span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic flex flex-wrap justify-center md:justify-start gap-2 items-baseline relative z-10 drop-shadow-2xl">
                      <span className={cn(
                        "transition-colors duration-1000 opacity-90",
                        threatLevel.color === "red" ? "text-red-50/90" :
                          threatLevel.color === "orange" ? "text-orange-50/90" : "text-amber-50/90"
                      )}>NEURAL LINK EXPIRING:</span>
                      <span className={cn(
                        "transition-all duration-1000 drop-shadow-xl animate-pulse",
                        threatLevel.color === "red" ? "text-red-500" :
                          threatLevel.color === "orange" ? "text-orange-500" : "text-amber-500"
                      )}>{currentStreak || 0} DAY STREAK</span>
                    </h3>

                    <p className="text-xs text-neutral-400 font-medium italic mt-4 flex items-center justify-center md:justify-start gap-2 max-w-lg">
                      <ShieldCheck size={16} className="opacity-50 shrink-0" />
                      Synchronize your work today to maintain sequence integrity and prevent neural degradation.
                    </p>
                  </div>
                </div>

                {/* Clock Display */}
                <div className="relative z-10 flex flex-col items-center md:items-end shrink-0 md:pl-10 md:border-l border-white/10 md:h-full justify-center mt-6 md:mt-0">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                    <Clock size={12} className="opacity-50" />
                    Time_Left_To_Sync
                  </span>
                  <span className={cn(
                    "text-3xl md:text-4xl font-mono font-black tabular-nums transition-colors duration-1000 tracking-tighter drop-shadow-[0_0_20px_currentColor]",
                    threatLevel.color === "red" ? "text-red-500" :
                      threatLevel.color === "orange" ? "text-orange-500" : "text-amber-500"
                  )}>
                    {timeLeft || "00:00:00"}
                  </span>
                </div>
              </div>

              {/* Base Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/50">
                <div className={cn(
                  "h-full transition-all duration-1000 w-full animate-pulse",
                  threatLevel.color === "red" ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" :
                    threatLevel.color === "orange" ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" :
                      "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                )} />
              </div>
            </div>
          </motion.div>
        )}

        {/* STREAK SUCCESS BANNER */}
        {streakChecked && hasPushedToday && currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group "
          >
            <div className="absolute inset-0 bg-emerald-500/10 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-5 rounded-4xl border border-emerald-500/40 bg-[#0a0a0a]/60 backdrop-blur-xl transition-all hover:border-emerald-500/60 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Node_Synchronized</span>
                    <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Uptime_Guaranteed</span>
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter italic mt-1">
                    Sequence Stable: <span className="text-emerald-400">{currentStreak || 0} Day Synchronicity</span>
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Integrity_Buffer</p>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase">Cycle Reserved For 24.0h</p>
                </div>
                <div className="w-1 h-8 bg-emerald-500/20 rounded-full" />
              </div>
            </div>
          </motion.div>
        )}

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
                  <div className="flex-1 flex flex-col gap-2">
                    <input
                      name="username"
                      type="text"
                      placeholder="Enter GitHub username (e.g. tushar8466)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-neutral-600"
                      required
                    />
                    {profileError && (
                      <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest px-1">
                        <AlertCircle className="w-3 h-3" />
                        {profileError}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-white text-black font-semibold h-[50px] px-6 rounded-xl hover:bg-neutral-200 transition-colors whitespace-nowrap"
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
                {currentStreak > 0 && (
                  <div className="absolute -top-2 -right-2 bg-linear-to-br from-orange-500 to-red-600 px-2 py-1 rounded-lg border border-white/20 shadow-lg flex items-center gap-1.5 animate-bounce">
                    <Flame className="w-3 h-3 text-white fill-white" />
                    <span className="text-[10px] font-black text-white">{currentStreak}</span>
                  </div>
                )}
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

                <div className="flex gap-4 pt-2">
                   <Link 
                     href={`/dna/${effectiveUsername}`}
                     className="px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-500/20 transition-all flex items-center gap-2"
                   >
                     <Fingerprint className="w-3 h-3" />
                     View_Code_DNA
                   </Link>
                </div>

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
                <Link
                  href={`/dna/${effectiveUsername}`}
                  className="px-8 py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <Dna className="w-4 h-4" />
                  GENERATE_DNA_SCAN
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-white uppercase tracking-[0.2em] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
                >
                  DISCONNECT_NODE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BADGES & ACHIEVEMENTS SHELF */}
        {effectiveUsername && (
          <div className="mt-12">
            <BadgeShelf username={effectiveUsername} />
          </div>
        )}

        {/* DEVELOPER SCORE CARD + STAR LEADERBOARD */}
        {githubData && repos.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DevScoreCard
              repos={githubData.public_repos}
              followers={githubData.followers}
              stars={repos.reduce((s, r) => s + (r.stargazers_count || 0), 0)}
              streak={currentStreak}
              languages={langData.length}
              commits={repos.length}
            />
            <TopReposLeaderboard repos={repos} />
          </div>
        )}

        {/* MONTHLY ACTIVITY CHART */}
        {effectiveUsername && (
          <CommitActivityChart username={effectiveUsername} />
        )}

        {/* LANGUAGE PROFICIENCY */}
        {repos.length > 0 && (
          <LanguageProficiency repos={repos} />
        )}

        {/* GOAL TRACKER */}
        {githubData && (
          <GoalTracker
            streak={currentStreak}
            commits={repos.length}
            stars={repos.reduce((s, r) => s + (r.stargazers_count || 0), 0)}
            repos={githubData.public_repos}
          />
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
                <div className="relative border border-white/10 bg-black/40 rounded-4xl p-8 transition-all hover:border-violet-500/30">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} border border-white/5`}>
                      {stat.icon}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-700 font-bold tracking-widest uppercase">REG_0{i + 1}</span>
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

        {/* NEURAL DNA SCANNER & ACHIEVEMENT REGISTRY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* LANGUAGE DNA RADAR */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3 px-1">
              <div className="w-1.5 h-6 bg-cyan-500 rounded-full" />
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Linguistic DNA</h2>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-4xl p-8 backdrop-blur-3xl h-[400px] relative overflow-hidden transition-all hover:border-cyan-500/20 group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity size={120} className="text-cyan-500/20" />
              </div>
              <div className="h-full w-full">
                {langData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={langData}>
                      <PolarGrid stroke="#ffffff10" />
                      <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
                      <Radar
                        name="Usage"
                        dataKey="value"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 scale-90">
                    <Terminal size={40} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting DNA samples...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACHIEVEMENT LOG */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 px-1">
              <div className="w-1.5 h-6 bg-violet-500 rounded-full" />
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Achievement Log</h2>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-4xl p-8 backdrop-blur-3xl h-[400px] flex flex-wrap gap-4 overflow-y-auto content-start transition-all hover:border-violet-500/20 scrollbar-hide">
              {[
                { id: 'ARCH_01', title: 'Grand Architect', condition: (githubData?.public_repos || 0) >= 50, icon: <Box size={20} />, label: '50+ Assets' },
                { id: 'COMM_01', title: 'Network Beacon', condition: (githubData?.followers || 0) >= 100, icon: <Users size={20} />, label: '100+ Followers' },
                { id: 'FLOW_01', title: 'Tactical Pivot', condition: (githubData?.following || 0) >= 50, icon: <GitFork size={20} />, label: 'High Connectivity' },
                { id: 'TIME_01', title: 'Legacy Node', condition: new Date(githubData?.created_at || '').getFullYear() < 2020, icon: <Clock size={20} />, label: 'Pre-2020 Sync' },
                { id: 'AUTH_01', title: 'Verified Ghost', condition: (githubData?.public_gists || 0) > 0, icon: <Fingerprint size={20} />, label: 'Gist Active' },
              ].map((badge) => (
                <div
                  key={badge.id}
                  className={cn(
                    "relative group rounded-3xl p-6 border transition-all duration-700 overflow-hidden flex flex-col items-center text-center gap-3 w-[calc(50%-8px)] md:w-[calc(33.33%-11px)]",
                    badge.condition
                      ? "bg-violet-500/5 border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                      : "bg-white/2 border-white/5 opacity-20 grayscale"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500",
                    badge.condition ? "bg-violet-500/20 border-violet-500/40 text-violet-400 group-hover:scale-110" : "bg-white/5 border-white/10 text-neutral-600"
                  )}>
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-tight mb-0.5">{badge.title}</h4>
                    <p className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">{badge.label}</p>
                  </div>
                  {badge.condition && (
                    <div className="absolute top-2 right-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
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

        {/* TACTICAL ACTIVITY PULSE */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-violet-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">// FREQUENCY_ANALYSIS</span>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Activity Pulse</h2>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live_Signal</span>
              </div>
            </div>
          </div>

          <div className="bg-white/2 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="flex flex-col md:flex-row items-end gap-12 relative z-10">
              <div className="flex-1 w-full h-40 flex items-end gap-1">
                {[...Array(40)].map((_, i) => {
                  const height1 = 10 + Math.random() * 80;
                  const height2 = 10 + Math.random() * 80;
                  const height3 = 10 + Math.random() * 80;
                  return (
                    <motion.div
                      key={i}
                      initial={{ height: 10, opacity: 0.2 }}
                      animate={{
                        height: [height1, height2, height3],
                        opacity: [0.2, 0.5, 0.2]
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.05
                      }}
                      className="flex-1 bg-linear-to-t from-violet-600/40 via-violet-400/20 to-transparent rounded-t-full"
                    />
                  );
                })}
              </div>

              <div className="w-full md:w-80 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    <span>Neural Bandwidth</span>
                    <span className="text-violet-400">88.4%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "88.4%" }}
                      className="h-full bg-violet-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-neutral-600 uppercase mb-1">Peak_Freq</p>
                    <p className="text-lg font-black text-white italic tracking-tighter">14.2Hz</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-neutral-600 uppercase mb-1">Integrity</p>
                    <p className="text-lg font-black text-white italic tracking-tighter">HIGH</p>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-500 leading-relaxed italic border-l border-violet-500/30 pl-4 py-1">
                  Temporal data indicates a high-intensity output cycle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* REPOSITORY REGISTRY GRID */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-6 bg-fuchsia-500 rounded-full" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Repository Registry</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, i) => (
              <a key={repo.id} href={repo.html_url} target="_blank" className="group">
                <div className="relative h-full border border-white/10 bg-black/40 rounded-4xl p-8 transition-all hover:border-fuchsia-500/30 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 group-hover:text-fuchsia-400 transition-colors">
                      <Box size={20} />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-700 font-bold tracking-widest uppercase">REG_A{i + 1}</span>
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

        {/* NEURAL EVENT LOG */}
        <section className="mt-20">
          <div className="flex items-center gap-3 mb-8 px-1">
            <span className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">// SYSTEM_LOG_FEED</span>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Neural Event Archive</h2>
          </div>
          <div className="bg-black/80 border border-white/5 rounded-4xl p-6 font-mono text-[10px] space-y-2 backdrop-blur-3xl relative overflow-hidden group hover:border-rose-500/20 transition-all max-h-[300px] overflow-y-auto scrollbar-hide">
            <div className="absolute inset-0 bg-linear-to-b from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {[
              { time: "08:42:11", event: "SYNCHRONIZING_NODE_ASSETS", status: "OK", color: "text-emerald-500" },
              { time: "09:15:44", event: "DECONSTRUCTING_REPOS_METADATA", status: "SUCCESS", color: "text-emerald-500" },
              { time: "10:02:19", event: "NEURAL_DNA_SEQUENCE_IDENTIFIED", status: "MATCH", color: "text-cyan-500" },
              { time: "11:33:01", event: "CALCULATING_TEMPORAL_DRIFT", status: "STABLE", color: "text-violet-500" },
              { time: "12:59:59", event: "UPDATING_AUTH_REGISTRY_v4.2", status: "DONE", color: "text-emerald-500" },
              { time: "14:20:03", event: "SCANNING_GLOBAL_PULSE_CHANNELS", status: "ACTIVE", color: "text-amber-500" },
              { time: "16:05:44", event: "LOCAL_REPOSITORY_CLUSTER_SYNC", status: "WAIT", color: "text-neutral-500" },
              { time: "17:30:12", event: "NEURAL_AUTH_SIGNATURE_VERIFIED", status: "GENUINE", color: "text-rose-500" },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 items-center border-b border-white/2 pb-2 last:border-0 opacity-60 hover:opacity-100 transition-opacity">
                <span className="text-neutral-600 shrink-0">[{log.time}]</span>
                <span className="text-neutral-400 flex-1 truncate">{log.event}...</span>
                <span className={cn("font-black tracking-widest px-2 py-0.5 rounded-sm bg-white/2", log.color)}>{log.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* SCAN LINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-5">
        <motion.div
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-full h-[50vh] bg-linear-to-b from-transparent via-violet-500/20 to-transparent"
        />
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