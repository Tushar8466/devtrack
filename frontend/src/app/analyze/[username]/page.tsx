"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfileResults from "@/components/explore/ProfileResults";

export default function AnalyzeUserPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<any>(null);

    const handleBack = () => {
        router.push("/explore");
    };

    useEffect(() => {
        if (!username) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch REST API Data for User
                const userRes = await fetch(`https://api.github.com/users/${username}`);
                if (!userRes.ok) {
                    if (userRes.status === 404) throw new Error("User not found");
                    if (userRes.status === 403) throw new Error("API Rate limit exceeded. Please try again later.");
                    throw new Error(`REST Error: ${userRes.statusText}`);
                }
                const restData = await userRes.json();

                // Fetch REST API Data for Repos
                const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
                const reposData = reposRes.ok ? await reposRes.json() : [];

                // Map REST data to match expected structure
                const mappedNodes = reposData.map((repo: any) => ({
                    name: repo.name,
                    description: repo.description,
                    stargazerCount: repo.stargazers_count,
                    forkCount: repo.forks_count,
                    primaryLanguage: repo.language ? { name: repo.language, color: "#8a2be2" } : null,
                    updatedAt: repo.updated_at,
                    url: repo.html_url,
                }));

                const sortedByStars = [...mappedNodes].sort((a: any, b: any) => b.stargazerCount - a.stargazerCount);
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
                            totalContributions: undefined,
                        },
                    },
                    pinnedItems: { nodes: pinnedNodes },
                    repositories: { nodes: mappedNodes },
                };

                setProfileData({ rest: restData, graphql: graphqlData });
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-3 border-white/10 border-t-violet-500 animate-spin" />
                    <p className="text-neutral-400 text-lg">Analyzing <span className="text-white font-mono font-semibold">@{username}</span>...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                        <span className="text-red-400 text-2xl">!</span>
                    </div>
                    <h2 className="text-white text-2xl font-bold mb-2">Analysis Failed</h2>
                    <p className="text-neutral-400 mb-6">{error}</p>
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-colors"
                    >
                        ← Back to Search
                    </button>
                </div>
            </div>
        );
    }

    // Profile results
    if (profileData) {
        return <ProfileResults data={profileData} onBack={handleBack} />;
    }

    return null;
}
