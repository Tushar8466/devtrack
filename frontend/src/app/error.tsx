"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw, Home } from 'lucide-react';
import NotFoundVisual from '@/components/ui/404';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden p-6 text-center">
            <div className="max-w-md w-full z-10 space-y-8 p-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl">
                <div className="h-64 mb-4">
                    <NotFoundVisual />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-white tracking-tight">SYSTEM COLLISION</h1>
                    <p className="text-neutral-500 leading-relaxed">
                        An unexpected error occurred in the neural network. We're attempting to re-sync the nodes.
                    </p>
                    {error.digest && (
                        <code className="block text-[10px] text-neutral-600 bg-white/5 py-1 rounded-md font-mono">
                            ERR_STAMP: {error.digest}
                        </code>
                    )}
                </div>

                <div className="flex flex-col gap-4 mt-8">
                    <button
                        onClick={() => reset()}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20"
                    >
                        <RefreshCcw size={18} />
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                    >
                        <Home size={18} />
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/10 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
