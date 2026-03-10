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
import { X } from "lucide-react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

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
    <div className="min-h-screen bg-[#030303] pt-28 pb-20 px-4 text-white">
      <div className="max-w-[1400px] mx-auto space-y-12">

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
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => setShowUploadModal(true)}>
              {customAvatar || githubData?.avatar_url || session.user?.image ? (
                <div className="relative w-[90px] h-[90px]">
                  <Image
                    src={customAvatar || githubData?.avatar_url || session.user?.image || ""}
                    alt="Profile"
                    fill
                    className="rounded-full ring-2 ring-white/10 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-[90px] h-[90px] rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                  <Camera className="w-6 h-6 text-neutral-400 group-hover:text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">{githubData?.name || session.user?.name}</h1>
              <p className="text-neutral-400 mt-1">{githubData?.bio || "DevTrack authenticated user"}</p>

              <div className="flex items-center gap-4 mt-4">
                <span className="text-sm text-neutral-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  @{effectiveUsername}
                </span>
                {githubData?.location && (
                  <span className="text-sm text-neutral-500">
                    {githubData.location}
                  </span>
                )}
                {manualUsername && (
                  <button
                    onClick={() => {
                      setManualUsername("");
                      setGithubData(null);
                    }}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4"
                  >
                    Change Account
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="border border-red-500/40 text-red-400 px-6 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* GLOWING STATS */}

        <div className="space-y-6">
          <h2 className="text-2xl font-bold px-1">GitHub Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlowingCard
              icon={<Box className="w-5 h-5 text-white" />}
              title="Repositories"
              value={githubData?.public_repos ?? "–"}
            />

            <GlowingCard
              icon={<Users className="w-5 h-5 text-white" />}
              title="Followers"
              value={githubData?.followers ?? "–"}
            />

            <GlowingCard
              icon={<GitFork className="w-5 h-5 text-white" />}
              title="Following"
              value={githubData?.following ?? "–"}
            />

            <GlowingCard
              icon={<FileText className="w-5 h-5 text-white" />}
              title="Gists"
              value={githubData?.public_gists ?? "–"}
            />
          </div>
        </div>

        {/* CONTRIBUTION GRAPH AND RECENT REPOS */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* CONTRIBUTION CALENDAR */}
          <div className="xl:col-span-2 space-y-6">
            <div className="relative rounded-3xl border border-white/10 bg-[#050505] p-2 h-full">
              <GlowingEffect
                blur={0}
                borderWidth={3}
                spread={80}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative h-full rounded-2xl bg-[#050505] p-8 flex flex-col gap-6">
                <h2 className="text-xl font-bold">Contribution Activity</h2>
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
          </div>

          {/* RECENT REPOS LIST */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold px-1">Active Projects</h2>
            <div className="flex flex-col gap-4">
              {repos.length > 0 ? (
                repos.slice(0, 3).map((repo) => (
                  <a key={repo.id} href={repo.html_url} target="_blank">
                    <GlowingCard
                      className="min-h-0"
                      icon={<GitFork className="w-4 h-4 text-white" />}
                      title={repo.name}
                      description={repo.description || "No description provided"}
                    />
                  </a>
                ))
              ) : (
                <p className="text-neutral-500">No recent activity found.</p>
              )}
            </div>
          </div>
        </div>

        {/* ALL RECENT REPOS GRID */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold px-1">Repository Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <a key={repo.id} href={repo.html_url} target="_blank">
                <GlowingCard
                  icon={<Box className="w-5 h-5 text-white" />}
                  title={repo.name}
                  description={
                    <div className="flex flex-col gap-2">
                      <p>{repo.description || "No description"}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-neutral-500">
                        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{repo.language}</span>
                        <span>{formatDate(repo.updated_at)}</span>
                      </div>
                    </div>
                  }
                />
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