"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IconBrandGithub, IconGitCommit } from "@tabler/icons-react";

interface Commit {
    sha: string;
    html_url: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
    author?: {
        avatar_url: string;
        login: string;
    };
}

interface RepoCommitsProps {
    username: string; // The owner of the repo
    repoName: string;
    onClose: () => void;
}

export default function RepoCommits({ username, repoName, onClose }: RepoCommitsProps) {
    const [commits, setCommits] = useState<Commit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCommits = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch recent commits from GitHub REST API
                const res = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=30`);

                if (!res.ok) {
                    if (res.status === 404) throw new Error("Repository or commits not found.");
                    if (res.status === 409) throw new Error("Repository is empty.");
                    throw new Error(`Failed to fetch commits (${res.status})`);
                }

                const data = await res.json();
                setCommits(data);
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching commits.");
            } finally {
                setLoading(false);
            }
        };

        fetchCommits();
    }, [username, repoName]);

    // Format date roughly relative (e.g., "Oct 12, 2023, 14:30")
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div
                className="absolute inset-0 z-0"
                onClick={onClose}
                aria-label="Close modal"
            />

            <div className="relative z-10 w-full max-w-3xl bg-black border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[85vh] max-h-[800px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-white/5">

                {/* Header Title area */}
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#00e676]/10 border border-[#00e676]/20 flex items-center justify-center text-[#00e676]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><line x1="3" y1="12" x2="9" y2="12" /><line x1="15" y1="12" x2="21" y2="12" /><line x1="12" y1="3" x2="12" y2="9" /><line x1="12" y1="15" x2="12" y2="21" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-1.5 flex-wrap">
                                <span className="text-neutral-400 font-normal">{username}</span>
                                <span className="text-neutral-600">/</span>
                                <span className="text-[#00e676]">{repoName}</span>
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <IconGitCommit className="w-4 h-4 text-neutral-500" />
                                <span className="text-sm font-medium text-neutral-400">Commit History</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Content area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-black">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-purple animate-spin" />
                            <p className="text-neutral-400 animate-pulse font-medium">Scanning commit history...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Failed to load</h3>
                            <p className="text-neutral-400 mb-1">{error}</p>
                            <p className="text-neutral-500 text-sm">Could not retrieve commit history.</p>
                        </div>
                    ) : commits.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-6 text-center text-neutral-400">
                            <IconBrandGithub className="w-16 h-16 text-neutral-800 mb-4" />
                            <p className="text-lg font-medium">No commits found in this repository.</p>
                        </div>
                    ) : (
                        <div className="relative border-l border-white/10 ml-9 space-y-8 pb-4">
                            {commits.map((commitData) => (
                                <a
                                    key={commitData.sha}
                                    href={commitData.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="relative flex flex-col sm:flex-row gap-5 group p-4 -ml-[2.3rem] rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute left-[30px] top-[30px] w-3 h-3 rounded-full bg-neutral-800 border-2 border-neutral-600 group-hover:bg-[#00e676] group-hover:border-[#00e676] transition-colors" />

                                    <div className="flex items-center sm:items-start shrink-0 pl-14 sm:pl-0 sm:w-16 pt-1">
                                        {commitData.author?.avatar_url ? (
                                            <Image
                                                src={commitData.author.avatar_url}
                                                alt={commitData.commit.author.name}
                                                width={48}
                                                height={48}
                                                className="rounded-full shadow-lg border border-white/10 bg-neutral-900"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-lg font-bold text-neutral-400 shadow-lg">
                                                {commitData.commit.author.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 pl-16 sm:pl-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-2">
                                            <p className="text-white font-bold text-base leading-snug group-hover:text-[#00e676] transition-colors">
                                                {commitData.commit.message.split('\n')[0]}
                                            </p>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="font-mono text-xs text-neutral-400 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                                                    {commitData.sha.substring(0, 7)}
                                                </span>
                                            </div>
                                        </div>

                                        {commitData.commit.message.includes('\n') && (
                                            <p className="text-neutral-400 text-sm line-clamp-3 mb-3 bg-white/5 p-3 rounded-xl border border-white/5 hidden sm:block">
                                                {commitData.commit.message.split('\n').slice(1).join('\n').trim()}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                                            <span className="text-neutral-300">{commitData.commit.author.name}</span>
                                            <span className="w-1 h-1 rounded-full bg-neutral-700" />
                                            <span>{formatDate(commitData.commit.author.date)}</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer area */}
                {commits.length > 0 && !loading && !error && (
                    <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-500">
                            Showing the {commits.length} most recent commits
                        </span>
                        <a
                            href={`https://github.com/${username}/${repoName}/commits`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#00e676] hover:bg-[#00c853] text-black font-semibold rounded-full px-5 py-2 text-sm flex items-center gap-2 transition-transform hover:scale-105"
                        >
                            View all
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                        </a>
                    </div>
                )}

            </div>
        </div>
    );
}
