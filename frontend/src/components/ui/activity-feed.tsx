"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, GitCommit, GitPullRequest, Star, UserPlus, GitFork, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface GithubEvent {
  id: string;
  type: string;
  repo: string;
  createdAt: string;
  payload: {
    action?: string;
    commits?: number;
    ref?: string;
    refType?: string;
  };
}

interface ActivityFeedProps {
  username: string;
}

const EVENT_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  PushEvent: { icon: GitCommit, color: "text-emerald-500", label: "Pushed to" },
  PullRequestEvent: { icon: GitPullRequest, color: "text-violet-500", label: "PR in" },
  WatchEvent: { icon: Star, color: "text-amber-500", label: "Starred" },
  CreateEvent: { icon: GitFork, color: "text-blue-500", label: "Created" },
  IssueCommentEvent: { icon: MessageSquare, color: "text-rose-500", label: "Commented on" },
  MemberEvent: { icon: UserPlus, color: "text-cyan-500", label: "Added to" },
};

export function ActivityFeed({ username }: ActivityFeedProps) {
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const fetchEvents = async () => {
      try {
        const res = await fetch(`/api/activity/events?username=${encodeURIComponent(username)}`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error("Failed to fetch activity feed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [username]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-white/5" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-white/5 rounded" />
              <div className="h-3 w-1/2 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-white/5 rounded-3xl">
        <Activity className="w-8 h-8 text-neutral-600 mx-auto mb-3 opacity-20" />
        <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">No recent tactical activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Live Activity Feed</h2>
        <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Real-time</span>
        </div>
      </div>

      <div className="relative space-y-4">
        {/* Timeline line */}
        <div className="absolute left-6 top-8 bottom-8 w-px bg-white/5" />

        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {events.map((event, i) => {
              const config = EVENT_CONFIG[event.type] || { icon: Activity, color: "text-neutral-400", label: "Activity in" };
              const Icon = config.icon;
              const date = new Date(event.createdAt);
              const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex gap-6 group"
                >
                  {/* Icon Node */}
                  <div className={cn(
                    "w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shrink-0 relative z-10 transition-all group-hover:border-white/20",
                    config.color.replace("text-", "shadow-[0_0_15px_rgba(") + ",0.2)]"
                  )}>
                    <Icon className={cn("w-5 h-5", config.color)} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 py-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{timeStr}</span>
                      <span className="text-[8px] font-black text-neutral-700 uppercase tracking-[0.2em] group-hover:text-neutral-500 transition-colors">
                        Event_ID: {event.id.slice(0, 8)}
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/2 border border-white/5 group-hover:border-white/10 group-hover:bg-white/3 transition-all">
                      <p className="text-sm font-medium text-neutral-400">
                        <span className={cn("font-black italic uppercase", config.color)}>{config.label}</span>
                        {" "}
                        <span className="text-white font-bold">{event.repo}</span>
                      </p>
                      {event.type === "PushEvent" && event.payload.commits && (
                        <p className="mt-2 text-[10px] font-mono text-emerald-500/60 font-bold uppercase tracking-tight">
                          ++ {event.payload.commits} Delta Commits Synchronized
                        </p>
                      )}
                      {event.type === "CreateEvent" && event.payload.refType && (
                        <p className="mt-2 text-[10px] font-mono text-blue-500/60 font-bold uppercase tracking-tight">
                          >> New {event.payload.refType} {event.payload.ref} Initialized
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
