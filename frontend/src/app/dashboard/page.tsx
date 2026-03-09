"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GitHubCalendar } from "react-github-calendar";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Box, Users, GitFork, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

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

/* ---------------- GLOWING CARD ---------------- */

function GlowingCard({
  icon,
  title,
  value,
  description,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  value?: string | number;
  description?: string | React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative rounded-2xl border border-white/10 p-2", className)}>
      <GlowingEffect
        blur={0}
        borderWidth={3}
        spread={80}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />

      <div className="relative rounded-xl bg-[#050505] p-6 flex flex-col gap-4 h-full">
        <div className="w-fit border border-white/10 rounded-lg p-2">{icon}</div>

        <div className="flex-1 flex flex-col justify-between gap-1">
          {value !== undefined && (
            <h3 className="text-3xl font-bold text-white">{value}</h3>
          )}
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          {description && (
            <div className="text-xs text-neutral-400 mt-1 line-clamp-2">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

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
    if (!githubUsername) return;

    Promise.all([
      fetch(`https://api.github.com/users/${githubUsername}`).then((res) =>
        res.json()
      ),
      fetch(
        `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`
      ).then((res) => res.json()),
    ])
      .then(([userData, reposData]) => {
        setGithubData(userData);
        if (Array.isArray(reposData)) setRepos(reposData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [githubUsername]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading profile...
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

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 flex items-center gap-6">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="Profile"
              width={90}
              height={90}
              className="rounded-full ring-2 ring-white/10"
            />
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{session.user?.name}</h1>
            <p className="text-neutral-400 mt-1">{githubData?.bio}</p>

            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm text-neutral-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                @{githubUsername}
              </span>
              {githubData?.location && (
                <span className="text-sm text-neutral-500">
                  {githubData.location}
                </span>
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
                  {githubUsername && (
                    <GitHubCalendar
                      username={githubUsername}
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
    </div>
  );
}