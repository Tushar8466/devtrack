"use client";

import { signIn } from "next-auth/react";
import { motion } from "motion/react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Fingerprint, Github } from "lucide-react";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
            <BackgroundBeams />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md group"
            >
                <div className="relative rounded-3xl p-px overflow-hidden">
                    <GlowingEffect
                        spread={40}
                        glow
                        disabled={false}
                        proximity={64}
                        inactiveZone={0.01}
                        borderWidth={2}
                    />

                    <div className="relative h-full rounded-3xl backdrop-blur-3xl bg-black/60 border border-white/10 p-8 shadow-2xl">
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-flex items-center justify-center p-4 bg-violet-600/10 rounded-2xl mb-6 shadow-inner ring-1 ring-violet-500/20"
                            >
                                <img src="/logo/devtrack-logo.png" alt="DevTrack Logo" className="w-12 h-12 hover:scale-110 transition-transform" />
                            </motion.div>
                            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                                Access <span className="text-violet-400">DevTrack</span>
                            </h1>
                            <p className="text-gray-400 text-sm font-medium">
                                Sign in to decode developer DNA
                            </p>
                        </div>

                        <div className="space-y-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                                className="w-full h-14 flex items-center justify-center gap-3 bg-white/5 text-white font-semibold rounded-2xl transition-all duration-300 border border-white/10 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                            >
                                <Github className="w-5 h-5" />
                                <span>Continue with GitHub</span>
                            </motion.button>

                            <div className="relative flex items-center py-4">
                                <div className="grow border-t border-white/5"></div>
                                <span className="shrink mx-4 text-gray-500 text-[10px] uppercase tracking-widest font-bold">Secure Gateway</span>
                                <div className="grow border-t border-white/5"></div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                                className="w-full h-14 flex items-center justify-center gap-3 bg-white text-black font-semibold rounded-2xl transition-all duration-300 hover:bg-white/90 shadow-lg shadow-white/5"
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                                </svg>
                                <span>Continue with Google</span>
                            </motion.button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Real-time Analysis Enabled</span>
                            </div>
                            <div className="text-[10px] text-gray-600 space-x-2">
                                <a href="#" className="hover:text-violet-400 transition-colors">Terms of Use</a>
                                <span>•</span>
                                <a href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
