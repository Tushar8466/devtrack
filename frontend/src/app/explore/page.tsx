"use client";

import { useState } from "react";
import SearchSection from "@/components/explore/SearchSection";
import ProfileCard from "@/components/explore/ProfileCard";
import StatsBar from "@/components/explore/StatsBar";
import PinnedRepos from "@/components/explore/PinnedRepos";
import AllRepos from "@/components/explore/AllRepos";
import LanguageBreakdown from "@/components/explore/LanguageBreakdown";

export default function ExplorePage() {
    const [username, setUsername] = useState("");
    const [pat, setPat] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<any>(null);

    const fetchProfileData = async (searchUsername: string, token: string) => {
        if (!searchUsername) return;

        setLoading(true);
        setError(null);
        setProfileData(null);
        setUsername(searchUsername);
        setPat(token);

        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        try {
            // Fetch REST API Data for User
            const userRes = await fetch(`https://api.github.com/users/${searchUsername}`);
            if (!userRes.ok) {
                if (userRes.status === 404) throw new Error("User not found");
                if (userRes.status === 403) throw new Error("API Rate limit exceeded. Please try again later.");
                throw new Error(`REST Error: ${userRes.statusText}`);
            }
            const restData = await userRes.json();

            // Fetch REST API Data for Repos
            const reposRes = await fetch(`https://api.github.com/users/${searchUsername}/repos?sort=updated&per_page=100`);
            const reposData = reposRes.ok ? await reposRes.json() : [];

            // Map REST data to match expected "GraphQL" structure for the UI components
            const mappedNodes = reposData.map((repo: any) => ({
                name: repo.name,
                description: repo.description,
                stargazerCount: repo.stargazers_count,
                forkCount: repo.forks_count,
                primaryLanguage: repo.language ? { name: repo.language, color: "#8a2be2" } : null,
                updatedAt: repo.updated_at,
                url: repo.html_url
            }));

            // Simulate Pinned Items with top starred
            const sortedByStars = [...mappedNodes].sort((a, b) => b.stargazerCount - a.stargazerCount);
            const pinnedNodes = sortedByStars.slice(0, 6);

            const graphqlData = {
                name: restData.name,
                bio: restData.bio,
                avatarUrl: restData.avatar_url,
                location: restData.location,
                company: restData.company,
                websiteUrl: restData.blog,
                followers: { totalCount: restData.followers },
                following: { totalCount: restData.following },
                contributionsCollection: {
                    contributionCalendar: {
                        totalContributions: undefined // Unavailable via REST without scraping
                    }
                },
                pinnedItems: {
                    nodes: pinnedNodes
                },
                repositories: {
                    nodes: mappedNodes
                }
            };

            setProfileData({
                rest: restData,
                graphql: graphqlData
            });

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white pt-28 pb-20 px-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[180px] pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-10">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-linear-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                        GitHub Profile Explorer
                    </h1>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Deep dive into any GitHub profile. View comprehensive statistics, top repositories, language distribution, and more.
                    </p>
                </div>

                <SearchSection onSearch={fetchProfileData} isLoading={loading} hideButton={!!profileData && !loading && !error} />

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl text-center max-w-2xl mx-auto shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">Error Fetching Profile</h3>
                        <p>{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="space-y-8 animate-pulse">
                        {/* Skeleton states */}
                        <div className="h-64 bg-white/5 rounded-3xl border border-white/5"></div>
                        <div className="h-32 bg-white/5 rounded-3xl border border-white/5"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-48 bg-white/5 rounded-2xl border border-white/5"></div>
                            ))}
                        </div>
                    </div>
                )}

                {!loading && !error && profileData && (
                    <div className="space-y-12 animate-in fade-in duration-700 slide-in-from-bottom-8">
                        <ProfileCard data={profileData} />
                        <StatsBar data={profileData} />
                        <LanguageBreakdown data={profileData} />
                        {profileData.graphql?.pinnedItems?.nodes?.length > 0 && (
                            <PinnedRepos data={profileData.graphql.pinnedItems.nodes} />
                        )}
                        <AllRepos data={profileData} />
                    </div>
                )}
            </div>
        </div>
    );
}
