"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "fixed top-8 inset-x-0 z-[5000] mx-auto flex max-w-fit items-center justify-center",
        className
      )}
    >
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/80 px-4 py-2 shadow-xl backdrop-blur-md dark:bg-black/50">

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 hover:text-black dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {item.icon && (
                <span className="block sm:hidden">{item.icon}</span>
              )}
              <span className="hidden sm:block">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-neutral-300 dark:bg-white/10" />

        {/* Auth Buttons */}
        {session ? (
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 hover:text-black dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Avatar"
                  width={24}
                  height={24}
                  className="rounded-full shadow-md"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-xs">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
              )}
              <span>Profile</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-full bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500/20"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
          >
            Sign In
          </Link>
        )}
      </div>
    </motion.div>
  );
};