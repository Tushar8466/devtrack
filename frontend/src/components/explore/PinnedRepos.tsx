"use client";

interface PinnedReposProps {
    data: any[];
}

export default function PinnedRepos({ data }: PinnedReposProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2 text-white">
                <span className="text-neutral-300">📌</span> Pinned Repositories
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((repo, idx) => (
                    <a
                        key={idx}
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col justify-between p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/30 transition-all shadow-lg hover:shadow-black/30 h-full"
                    >
                        <div>
                            <div className="flex items-start justify-between mb-3">
                                <h4 className="font-bold text-lg text-white group-hover:text-neutral-300 transition-colors truncate pr-4">
                                    {repo.name}
                                </h4>
                            </div>
                            <p className="text-sm text-neutral-400 line-clamp-3 mb-6 leading-relaxed">
                                {repo.description || "No description provided."}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            {repo.primaryLanguage ? (
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className="w-3 h-3 rounded-full shadow-sm"
                                        style={{ backgroundColor: repo.primaryLanguage.color || '#ccc' }}
                                    />
                                    <span className="text-xs text-neutral-300 font-medium">{repo.primaryLanguage.name}</span>
                                </div>
                            ) : (
                                <span className="text-xs text-neutral-500">Unknown</span>
                            )}

                            <div className="flex items-center gap-4 text-xs text-neutral-400 font-medium">
                                <span className="flex items-center gap-1 group-hover:text-yellow-400 transition-colors">
                                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path></svg>
                                    {repo.stargazerCount}
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
                                    {repo.forkCount}
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
