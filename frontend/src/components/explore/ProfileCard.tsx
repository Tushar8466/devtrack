"use client";

import Image from "next/image";

interface ProfileCardProps {
    data: any;
}

export default function ProfileCard({ data }: ProfileCardProps) {
    const { rest, graphql } = data;

    // Use GraphQL for base data, fallback to REST where applicable
    const name = graphql?.name || rest?.name;
    const login = rest?.login;
    const avatarUrl = graphql?.avatarUrl || rest?.avatar_url;
    const bio = graphql?.bio || rest?.bio;
    const location = graphql?.location || rest?.location;
    const company = graphql?.company || rest?.company;
    const website = graphql?.websiteUrl || rest?.blog;
    const followers = graphql?.followers?.totalCount ?? rest?.followers;
    const following = graphql?.following?.totalCount ?? rest?.following;
    const createdAt = rest?.created_at;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    };

    return (
        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8 md:p-10 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-blue-500 rounded-full blur-xl opacity-30 scale-110" />
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt="Profile avatar"
                            width={160}
                            height={160}
                            className="relative rounded-full border-4 border-white/10 shadow-2xl ring-2 ring-purple-500/30 object-cover"
                        />
                    ) : (
                        <div className="relative w-[160px] h-[160px] rounded-full border-4 border-white/10 bg-neutral-800 flex items-center justify-center text-6xl text-white font-bold">
                            {login?.charAt(0)?.toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-1">
                        {name || login}
                    </h2>
                    <p className="text-xl text-purple-400 font-medium mb-4">
                        @{login}
                    </p>

                    {bio && (
                        <p className="text-neutral-300 text-lg max-w-2xl mb-6 leading-relaxed">
                            {bio}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-3 gap-x-6 text-sm text-neutral-400">
                        {location && (
                            <span className="flex items-center gap-2">📍 {location}</span>
                        )}
                        {company && (
                            <span className="flex items-center gap-2">🏢 {company}</span>
                        )}
                        {website && (
                            <a
                                href={website.startsWith('http') ? website : `https://${website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 hover:text-white transition-colors underline underline-offset-4"
                            >
                                🔗 {website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                        {createdAt && (
                            <span className="flex items-center gap-2">🗓 Joined {formatDate(createdAt)}</span>
                        )}
                    </div>

                    <div className="mt-8 flex items-center justify-center md:justify-start gap-6 pt-6 border-t border-white/10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">{followers?.toLocaleString() || 0}</span>
                            <span className="text-sm text-neutral-500 tracking-wide uppercase">Followers</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">{following?.toLocaleString() || 0}</span>
                            <span className="text-sm text-neutral-500 tracking-wide uppercase">Following</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
