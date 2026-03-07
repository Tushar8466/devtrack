"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { IconBrandGithub, IconArrowLeft, IconGitCommit } from "@tabler/icons-react";

interface Contributor {
    login: string;
    avatar_url: string;
    contributions: number;
    html_url: string;
}

export default function RepositoryCommitsPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;
    const repoName = params.repo as string;

    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [totalCommits, setTotalCommits] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username || !repoName) return;

        const fetchContributors = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch up to 100 contributors via GitHub REST
                const res = await fetch(`https://api.github.com/repos/${username}/${repoName}/contributors?per_page=100`);

                if (!res.ok) {
                    if (res.status === 404) throw new Error("Repository not found or has no contributors.");
                    throw new Error(`Failed to fetch contributors (${res.status})`);
                }

                const data: Contributor[] = await res.json();

                // Sum up contributions from the top returned contributors
                const total = data.reduce((sum, curr) => sum + curr.contributions, 0);

                setContributors(data);
                setTotalCommits(total);
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching contributors.");
            } finally {
                setLoading(false);
            }
        };

        fetchContributors();
    }, [username, repoName]);

    const handleBack = () => {
        router.push("/explore");
    };

    // Show top 2 contributors to match the reference design perfectly
    const displayContributors = contributors.slice(0, 2);

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pt-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00e676]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="w-full flex justify-start mb-12">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full w-fit backdrop-blur-md border border-white/5"
                    >
                        <IconArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Explore</span>
                    </button>
                </div>

                {/* Header Title area */}
                <div className="text-center mb-10 w-full">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4 tracking-tight">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Repository Contributors
                    </h2>
                    <p className="text-neutral-400 text-lg max-w-xl mx-auto">
                        Lookup any GitHub repository to analyze contributors. Data is combined from GitHub REST API for deep dive metrics.
                    </p>
                </div>

                <div className="w-full space-y-6">
                    {/* Search / Target Bar Mockup */}
                    <div className="max-w-xl mx-auto bg-black border border-white/10 rounded-full flex items-center justify-between p-2 mb-8 shadow-2xl">
                        <div className="flex items-center gap-3 pl-4 text-neutral-300 font-mono text-sm">
                            <IconBrandGithub className="w-5 h-5 text-neutral-500" />
                            <span>{username}/{repoName}</span>
                        </div>
                        <a href={`https://github.com/${username}/${repoName}`} target="_blank" rel="noreferrer" className="bg-[#00e676] hover:bg-[#00c853] text-black font-bold rounded-full px-6 py-2.5 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#00e676]/20">
                            <IconBrandGithub className="w-4 h-4" />
                            Repository
                        </a>
                    </div>

                    {/* Top Bar with Repo Name and Total Commits */}
                    <div className="w-full bg-black border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl ring-1 ring-white/5">
                        <div className="flex items-center gap-4">
                            <IconBrandGithub className="w-7 h-7 text-neutral-400 shrink-0" />
                            <h3 className="text-2xl font-bold flex flex-wrap items-center tracking-tight">
                                <span className="text-white">{username}</span>
                                <span className="text-neutral-500 mx-3">/</span>
                                <span className="text-[#00e676]">{repoName}</span>
                            </h3>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                            <div className="flex items-center border border-white/10 rounded-xl px-5 py-3 bg-black/50 min-w-[220px] justify-between shadow-inner">
                                <IconGitCommit className="w-6 h-6 text-[#00e676]" />
                                <div className="flex flex-col text-right">
                                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Total Commits (REST)</span>
                                    <span className="text-2xl font-black text-white leading-none tracking-tighter">
                                        {loading ? "..." : totalCommits.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-neutral-500 text-sm pl-2">
                        {loading ? "Fetching contributors..." : `Fetched ${displayContributors.length} top contributors via REST API`}
                    </p>

                    {/* Contributor Cards Row */}
                    {!loading && !error && contributors.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                            {displayContributors.map((contributor) => {
                                const percentage = totalCommits > 0
                                    ? ((contributor.contributions / totalCommits) * 100).toFixed(2)
                                    : "0.00";

                                return (
                                    <a
                                        key={contributor.login}
                                        href={contributor.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-black border border-white/10 rounded-2xl p-6 flex items-center gap-5 hover:bg-neutral-900 transition-all group shadow-lg hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-[#00e676]/0 via-[#00e676]/0 to-[#00e676]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <Image
                                            src={contributor.avatar_url}
                                            alt={contributor.login}
                                            width={64}
                                            height={64}
                                            className="rounded-full border border-white/10 shadow-lg shrink-0 relative z-10"
                                        />
                                        <div className="flex-1 w-full min-w-0 relative z-10">
                                            <h4 className="text-white font-bold text-xl truncate group-hover:text-[#00e676] transition-colors mb-2">
                                                {contributor.login}
                                            </h4>
                                            <div className="flex items-center gap-3 text-sm text-neutral-400 font-medium">
                                                <span>{contributor.contributions.toLocaleString()} commits</span>
                                                <span className="w-1 h-1 rounded-full bg-neutral-700" />
                                                <span className="text-[#00e676]">{percentage}%</span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full h-1.5 bg-black/40 rounded-full mt-4 overflow-hidden border border-white/5">
                                                <div
                                                    className="h-full bg-[#00e676] rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                                    style={{ width: `${percentage}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-500 shadow-lg flex flex-col items-center justify-center gap-3">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            <span className="font-semibold">{error}</span>
                        </div>
                    )}

                    {!loading && !error && contributors.length === 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-neutral-400 shadow-lg">
                            <p className="text-lg font-medium">No contributors found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
