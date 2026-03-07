"use client";

import { useState } from "react";

interface SearchSectionProps {
    onSearch: (username: string, token: string) => void;
    isLoading: boolean;
    hideButton?: boolean;
}

export default function SearchSection({ onSearch, isLoading, hideButton = false }: SearchSectionProps) {
    const [username, setUsername] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onSearch(username.trim(), "");
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* Username Input */}
                <div className="relative">
                    <label htmlFor="username" className="block text-sm font-medium text-neutral-400 mb-2">
                        GitHub Username <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M12 2C6.475 2 2 6.475 2 12A10 10 0 0012 22C17.525 22 22 17.525 22 12A10 10 0 0012 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. torvalds"
                            required
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-mono"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                {!hideButton && (
                    <button
                        type="submit"
                        disabled={isLoading || !username.trim()}
                        className="w-full bg-white text-black hover:bg-neutral-200 font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-white/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                <span>Exploring...</span>
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Explore Profile</span>
                            </>
                        )}
                    </button>
                )}

            </form>
        </div>
    );
}
