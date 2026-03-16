"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Inbox, Star, Menu, X, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";

type NavItem = {
  name: string;
  link: string;
  icon?: React.ReactNode;
};

interface FloatingNavProps {
  navItems: NavItem[];
  className?: string;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  navItems,
  className,
}) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [customAvatar, setCustomAvatar] = React.useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const loadAvatar = () => {
      const savedAvatar = localStorage.getItem("devtrack_custom_avatar");
      setCustomAvatar(savedAvatar);
    };

    loadAvatar();
    window.addEventListener("devtrack_avatar_updated", loadAvatar);
    return () => window.removeEventListener("devtrack_avatar_updated", loadAvatar);
  }, []);

  const protectedRoutes = ["/dashboard", "/explore", "/analyze", "/opensource", "/contributors"];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "fixed top-6 inset-x-4 sm:inset-x-0 z-5000 mx-auto flex max-w-fit items-center justify-center",
          className
        )}
      >
        <div className="flex items-center gap-2 sm:gap-3 rounded-full border border-white/10 bg-white/80 px-3 sm:px-4 py-2 shadow-xl backdrop-blur-md dark:bg-black/50">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 pr-2 border-r border-white/10">
            <Image
              src="/logo/devtrack-logo.png"
              alt="DevTrack Logo"
              width={24}
              height={24}
              className="hover:scale-110 transition-transform sm:w-[28px] sm:h-[28px]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item, index) => {
              const isProtected = protectedRoutes.some(route => item.link.startsWith(route));
              const href = (!session && isProtected) ? "/sign-in" : item.link;

              const isActive = pathname === item.link || (item.link !== "/" && pathname?.startsWith(item.link));

              return (
                <Link
                  key={index}
                  href={href}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "text-violet-600 dark:text-white"
                      : "text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                  )}
                >
                  <span className="whitespace-nowrap">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-violet-600/5 dark:bg-white/10 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Divider (Desktop Only) */}
          <div className="hidden lg:block h-5 w-px bg-neutral-300 dark:bg-white/10" />

          <div className="flex items-center gap-2">
            {/* Auth Buttons / Profile - Simplified for Mobile View */}
            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 sm:px-4 py-2 text-sm font-medium transition-all duration-300",
                    pathname?.startsWith("/dashboard")
                      ? "bg-violet-600/10 text-violet-600 dark:bg-white/10 dark:text-white"
                      : "text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                  )}
                >
                  {customAvatar || session.user?.image ? (
                    <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                      <Image
                        src={customAvatar || session.user?.image || ""}
                        alt="Avatar"
                        fill
                        className="rounded-full shadow-md object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] text-white">
                      {session.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-white/5 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-24 inset-x-4 z-5000 lg:hidden"
          >
            <div className="bg-white/90 dark:bg-black/90 border border-white/10 rounded-3xl p-4 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-1">
                {navItems.map((item, index) => {
                  const isProtected = protectedRoutes.some(route => item.link.startsWith(route));
                  const href = (!session && isProtected) ? "/sign-in" : item.link;
                  const isActive = pathname === item.link || (item.link !== "/" && pathname?.startsWith(item.link));

                  return (
                    <Link
                      key={index}
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-4 py-4 rounded-2xl text-base font-bold transition-all",
                        isActive
                          ? "bg-violet-600/10 text-violet-600 dark:bg-white/10 dark:text-white"
                          : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white"
                      )}
                    >
                      <span className="uppercase tracking-tighter italic">{item.name}</span>
                      <ChevronRight size={16} className={isActive ? "opacity-100" : "opacity-30"} />
                    </Link>
                  );
                })}
                {session && (
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between px-4 py-4 rounded-2xl text-base font-bold text-red-500 hover:bg-red-500/5 transition-all mt-2 border-t border-white/5 pt-4"
                  >
                    <span className="uppercase tracking-tighter italic">Sign Out</span>
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};