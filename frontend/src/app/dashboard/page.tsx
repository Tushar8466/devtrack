"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GitHubCalendar } from "react-github-calendar";

interface GitHubUser {
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [githubData, setGithubData] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  const githubUsername = (session?.user as SessionUser)?.username || "";

  useEffect(() => {
    if (!githubUsername) {
      if (status !== "loading" && status === "authenticated") {
        setLoading(false);
      }
      return;
    }
    Promise.all([
      fetch(`https://api.github.com/users/${githubUsername}`).then((res) => res.json()),
      fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`).then((res) => res.json())
    ])
      .then(([userData, reposData]) => {
        setGithubData(userData);
        if (Array.isArray(reposData)) {
          setRepos(reposData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching GitHub data:", error);
        setLoading(false);
      });
  }, [githubUsername, status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
          <p className="text-neutral-500 text-sm animate-pulse">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const stats = [
    { label: "Repositories", value: githubData?.public_repos ?? "–", icon: "📦" },
    { label: "Followers", value: githubData?.followers ?? "–", icon: "👥" },
    { label: "Following", value: githubData?.following ?? "–", icon: "🔭" },
    { label: "Gists", value: githubData?.public_gists ?? "–", icon: "📝" },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-[#030303] pt-28 pb-20 px-4 relative overflow-hidden text-white">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[180px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/15 rounded-full blur-[160px] pointer-events-none translate-y-1/3" />

      <div className="max-w-[1400px] w-full mx-auto relative z-10 space-y-8">

        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-linear-to-br from-white/5 to-white/2 backdrop-blur-xl shadow-2xl p-8 md:p-10">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar with glowing ring */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-blue-500 rounded-full blur-xl opacity-40 scale-110" />
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="relative rounded-full border-4 border-white/10 shadow-2xl ring-2 ring-purple-500/30 object-cover"
                />
              ) : (
                <div className="relative w-[120px] h-[120px] rounded-full border-4 border-white/10 bg-neutral-800 flex items-center justify-center text-5xl">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
              )}
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-black shadow" title="Online" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-linear-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent mb-1">
                {session.user?.name}
              </h1>
              {githubData?.bio && (
                <p className="text-neutral-400 mt-2 max-w-md">{githubData.bio}</p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4 text-sm text-neutral-400">
                {githubUsername && (
                  <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors border-r border-white/10 pr-4">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    @{githubUsername}
                  </a>
                )}
                {session.user?.email && (
                  <span className="flex items-center gap-1.5 border-r border-white/10 pr-4">✉ {session.user.email}</span>
                )}
                {githubData?.location && (
                  <span className="flex items-center gap-1.5 border-r border-white/10 pr-4">📍 {githubData.location}</span>
                )}
                {githubData?.company && (
                  <span className="flex items-center gap-1.5 border-r border-white/10 pr-4">🏢 {githubData.company}</span>
                )}
                {githubData?.created_at && (
                  <span className="flex items-center gap-1.5">🗓 Joined {formatDate(githubData.created_at)}</span>
                )}
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="shrink-0 text-sm px-5 py-2.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-all font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label}
              className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-md p-6 text-center hover:bg-white/6 hover:border-white/20 transition-all duration-300 group shadow-lg">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="text-3xl font-bold text-white group-hover:text-purple-300 transition-colors">{s.value}</div>
              <div className="text-xs text-neutral-500 uppercase tracking-widest mt-2">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="space-y-8">

          {/* ── Contribution Graph ── */}
          <div className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-md shadow-xl p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">Contribution Activity</h2>
                <p className="text-neutral-500 text-sm mt-0.5">Your GitHub contributions over the past year</p>
              </div>
              {githubUsername && (
                <a href={`https://github.com/${githubUsername}?tab=overview`} target="_blank" rel="noreferrer"
                  className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1 shrink-0 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5">
                  View on GitHub ↗
                </a>
              )}
            </div>

            {githubUsername ? (
              <div className="w-full overflow-x-auto pb-4">
                <div className="min-w-[750px]">
                  <GitHubCalendar
                    username={githubUsername}
                    colorScheme="dark"
                    blockSize={14}
                    blockMargin={5}
                    fontSize={12}
                    theme={{
                      dark: ["#161b22", "#0d2f1e", "#0e4429", "#26a641", "#39d353"],
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
                <p className="text-neutral-500">Could not load contribution data.</p>
              </div>
            )}
          </div>

          {/* ── Extra info row ── */}
          {githubData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Blog */}
              {githubData.blog && (
                <div className="group rounded-2xl border border-white/10 bg-white/3 p-6 hover:border-white/20 transition-all shadow-lg hover:shadow-purple-500/10 hover:bg-white/5 cursor-pointer"
                  onClick={() => window.open(githubData.blog?.startsWith("http") ? githubData.blog : `https://${githubData.blog}`, "_blank")}>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    🔗 Website
                  </p>
                  <p className="text-purple-400 group-hover:text-purple-300 transition-colors font-medium truncate">
                    {githubData.blog}
                  </p>
                </div>
              )}
              {/* Twitter / X */}
              {githubData.twitter_username && (
                <div className="group rounded-2xl border border-white/10 bg-white/3 p-6 hover:border-white/20 transition-all shadow-lg hover:shadow-blue-500/10 hover:bg-white/5 cursor-pointer"
                  onClick={() => window.open(`https://twitter.com/${githubData.twitter_username}`, "_blank")}>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    🐦 Twitter
                  </p>
                  <p className="text-blue-400 group-hover:text-blue-300 transition-colors font-medium truncate">
                    @{githubData.twitter_username}
                  </p>
                </div>
              )}
              {/* GitHub profile link */}
              <div className="group rounded-2xl border border-white/10 bg-white/3 p-6 flex flex-col justify-center hover:border-white/20 transition-all shadow-lg hover:shadow-neutral-500/10 hover:bg-white/5 cursor-pointer"
                onClick={() => window.open(`https://github.com/${githubUsername}`, "_blank")}>
                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub Profile
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm truncate pr-2">github.com/{githubUsername}</p>
                  <span className="text-white/50 group-hover:text-white transition-colors">↗</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Recent Repos Row ── */}
          <div className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-md shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="text-xl">📂</span> Recent Activity
              </h2>
              {githubUsername && (
                <a href={`https://github.com/${githubUsername}?tab=repositories`} target="_blank" rel="noreferrer"
                  className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1 shrink-0 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5">
                  View all repositories ↗
                </a>
              )}
            </div>

            {repos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.map(repo => (
                  <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"
                    className="group p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white truncate pr-2 group-hover:text-purple-400 transition-colors">
                          {repo.name}
                        </h3>
                        <span className="text-xs text-neutral-500 shrink-0 flex items-center gap-1">
                          ⭐ {repo.stargazers_count}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-400 line-clamp-3 mb-6">
                        {repo.description || "No description provided."}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      {repo.language ? (
                        <span className="text-xs flex items-center gap-1.5 text-neutral-300 bg-white/10 px-2.5 py-1 rounded-full">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          {repo.language}
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-500">N/A</span>
                      )}
                      <span className="text-xs text-neutral-500">
                        {formatDate(repo.updated_at)}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-neutral-500">
                <p>No recent public repositories found.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
