"use client";

import { useState, useMemo } from "react";

interface AllReposProps {
    data: any;
}

export default function AllRepos({ data }: AllReposProps) {
    const { graphql } = data;
    const repos = graphql?.repositories?.nodes || [];

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("All");

    // Get unique languages for filter dropdown
    const languages = useMemo(() => {
        const langs = new Set<string>();
        repos.forEach((repo: any) => {
            if (repo.primaryLanguage?.name) {
                langs.add(repo.primaryLanguage.name);
            }
        });
        return ["All", ...Array.from(langs).sort()];
    }, [repos]);

    // Filter repos based on search query and selected language
    const filteredRepos = useMemo(() => {
        return repos.filter((repo: any) => {
            const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesLanguage = selectedLanguage === "All" || repo.primaryLanguage?.name === selectedLanguage;
            return matchesSearch && matchesLanguage;
        });
    }, [repos, searchQuery, selectedLanguage]);

    if (repos.length === 0) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h3 className="text-2xl font-bold flex items-center gap-2 text-white shrink-0">
                    <span className="text-blue-400">📦</span> All Repositories
                    <span className="text-sm font-normal text-neutral-500 bg-white/10 px-2 py-0.5 rounded-full ml-2">
                        {filteredRepos.length}
                    </span>
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Find a repository..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder-neutral-500"
                        />
                    </div>

                    {/* Language Filter Dropdown */}
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full sm:w-40 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium appearance-none cursor-pointer"
                    >
                        {languages.map((lang) => (
                            <option key={lang} value={lang} className="bg-neutral-900">{lang}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredRepos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRepos.map((repo: any, idx: number) => (
                        <a
                            key={idx}
                            href={repo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col justify-between p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer h-full"
                        >
                            <div>
                                <h4 className="font-bold text-lg text-blue-400 hover:text-blue-300 transition-colors truncate mb-2">
                                    {repo.name}
                                </h4>
                                <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
                                    {repo.description || "No description provided."}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 font-medium mt-auto">
                                {repo.primaryLanguage ? (
                                    <span className="flex items-center gap-1.5 min-w-0 flex-shrink-0">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0"
                                            style={{ backgroundColor: repo.primaryLanguage.color || '#ccc' }}
                                        />
                                        <span className="truncate">{repo.primaryLanguage.name}</span>
                                    </span>
                                ) : null}

                                <span className="flex items-center gap-1 flex-shrink-0">
                                    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path></svg>
                                    {repo.stargazerCount}
                                </span>

                                <span className="flex items-center gap-1 flex-shrink-0">
                                    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
                                    {repo.forkCount}
                                </span>

                                <span className="flex-shrink-0 ml-auto text-neutral-600">
                                    Updated {formatDate(repo.updatedAt)}
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center text-neutral-500 bg-white/5 rounded-3xl border border-white/5">
                    <p>No repositories match your search or filter criteria.</p>
                </div>
            )}
        </div>
    );
}
