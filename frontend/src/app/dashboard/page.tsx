"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GitHubCalendar } from "react-github-calendar";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const githubUsername = (session.user as any)?.username || "";

  return (
    <div className="min-h-screen bg-[#050505] pt-32 p-8 relative overflow-hidden text-white">
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row gap-8">

        {/* Left Sidebar: Profile Details */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl flex flex-col items-center text-center">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={160}
                height={160}
                className="rounded-full border-4 border-white/10 shadow-lg mb-6"
              />
            ) : (
              <div className="w-40 h-40 rounded-full border-4 border-white/10 shadow-lg mb-6 bg-neutral-800 flex items-center justify-center">
                <span className="text-4xl text-neutral-500">{session.user?.name?.charAt(0) || "U"}</span>
              </div>
            )}

            <h1 className="text-3xl font-bold tracking-tight mb-1">{session.user?.name}</h1>

            {githubUsername && (
              <a
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors mb-6 flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                {githubUsername}
              </a>
            )}

            <div className="w-full h-px bg-white/10 mb-6" />

            <div className="w-full text-left">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</h3>
              <p className="text-gray-200">{session.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Right Content Area: Contributions & Graph */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            <h2 className="text-2xl font-bold tracking-tight mb-8">GitHub Contributions</h2>

            {githubUsername ? (
              <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 inline-block min-w-full">
                  <GitHubCalendar
                    username={githubUsername}
                    colorScheme="dark"
                    blockSize={14}
                    blockMargin={5}
                    fontSize={14}
                    theme={{
                      dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-2xl border border-white/10 text-center">
                <p className="text-gray-400 mb-2">GitHub username not found in session.</p>
                <p className="text-sm text-gray-500">Please try signing out and signing back in.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
