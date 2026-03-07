"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IconBrandGithub } from "@tabler/icons-react";

interface Contributor {
    login: string;
    avatar_url: string;
    contributions: number;
    html_url: string;
}

interface RepoCommitsProps {
    username: string; // The owner/target user
    repoName: string;
    onClose: () => void;
}

export default function RepoCommits({ username, repoName, onClose }: RepoCommitsProps) {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [totalCommits, setTotalCommits] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContributors = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch up to 100 contributors (GitHub REST API limits this endpoint, but it's enough for top stats)
                const res = await fetch(`https://api.github.com/repos/${username}/${repoName}/contributors?per_page=100`);

                if (!res.ok) {
                    if (res.status === 404) throw new Error("Repository not found or has no contributors.");
                    throw new Error(`Failed to fetch contributors (${res.status})`);
                }

                const data: Contributor[] = await res.json();

                // Calculate total commits from these top contributors
                const total = data.reduce((sum, curr) => sum + curr.contributions, 0);

                // Ensure the searched user is always included if they are a contributor
                let displayList = data;

                setContributors(displayList);
                setTotalCommits(total);
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching contributors.");
            } finally {
                setLoading(false);
            }
        };

        fetchContributors();
    }, [username, repoName]);

    // Show top 2 contributors to match the reference image design
    const displayContributors = contributors.slice(0, 2);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div
                className="absolute inset-0 z-0"
                onClick={onClose}
                aria-label="Close modal"
            />

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">

                {/* Header Title area */}
                <div className="text-center mb-10 w-full">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Repository Contributors
                    </h2>
                    <p className="text-neutral-400 text-lg max-w-xl mx-auto">
                        Lookup any GitHub repository to analyze contributors. Data is combined from GitHub REST API for deep dive metrics.
                    </p>
                </div>

                <div className="w-full space-y-6">
                    {/* Search / Target Bar Mockup */}
                    <div className="max-w-xl mx-auto bg-black border border-white/10 rounded-full flex items-center justify-between p-2 mb-8">
                        <div className="flex items-center gap-3 pl-4 text-neutral-300 font-mono text-sm">
                            <IconBrandGithub className="w-5 h-5 text-neutral-500" />
                            <span>{username}/{repoName}</span>
                        </div>
                        <a href={`https://github.com/${username}/${repoName}`} target="_blank" rel="noreferrer" className="bg-[#00e676] hover:bg-[#00c853] text-black font-semibold rounded-full px-6 py-2 flex items-center gap-2 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            Search
                        </a>
                    </div>

                    {/* Top Bar with Repo Name and Total Commits */}
                    <div className="w-full bg-black border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <IconBrandGithub className="w-7 h-7 text-neutral-400" />
                            <h3 className="text-2xl font-bold flex flex-wrap items-center">
                                <span className="text-white">{username}</span>
                                <span className="text-neutral-500 mx-3">/</span>
                                <span className="text-[#00e676]">{repoName}</span>
                            </h3>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="flex items-center border border-white/10 rounded-xl px-5 py-3 bg-black/50 min-w-[220px] justify-between">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                <div className="flex flex-col text-right">
                                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Total Commits (GitHub)</span>
                                    <span className="text-2xl font-bold text-white leading-none">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
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
                                        className="bg-black border border-white/10 rounded-2xl p-6 flex items-center gap-5 hover:bg-neutral-900 transition-colors group"
                                    >
                                        <Image
                                            src={contributor.avatar_url}
                                            alt={contributor.login}
                                            width={64}
                                            height={64}
                                            className="rounded-full border border-white/10 shadow-lg shrink-0"
                                        />
                                        <div className="flex-1 w-full min-w-0">
                                            <h4 className="text-white font-bold text-xl truncate group-hover:text-[#00e676] transition-colors mb-2">
                                                {contributor.login}
                                            </h4>
                                            <div className="flex items-center gap-3 text-sm text-neutral-400">
                                                <span>{contributor.contributions.toLocaleString()} commits</span>
                                                <span className="w-1 h-1 rounded-full bg-neutral-700" />
                                                <span className="text-[#00e676] font-semibold">{percentage}%</span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                                                <div
                                                    className="h-full bg-[#00e676] rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-500">
                            {error}
                        </div>
                    )}

                    {!loading && !error && contributors.length === 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-neutral-400">
                            No contributors found.
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="mt-12 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors font-medium border border-white/10 shadow-lg"
                >
                    Close Viewer
                </button>
            </div>
        </div>
    );
}
