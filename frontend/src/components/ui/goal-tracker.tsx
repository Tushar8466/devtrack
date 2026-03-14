"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Target, Plus, Trash2, CheckCircle2, Circle, Trophy, Flame, Code, GitCommit, Star, BookOpen } from "lucide-react";

type GoalType = "streak" | "commits" | "stars" | "repos" | "custom";

interface Goal {
  id: string;
  type: GoalType;
  label: string;
  target: number;
  current: number;
  icon: string;
  color: string;
  createdAt: string;
}

const GOAL_PRESETS: { type: GoalType; label: string; icon: string; color: string; defaultTarget: number }[] = [
  { type: "streak",  label: "Day Streak",         icon: "flame",   color: "#f97316", defaultTarget: 30  },
  { type: "commits", label: "Total Active Days",   icon: "commit",  color: "#818cf8", defaultTarget: 100 },
  { type: "stars",   label: "Total Stars",         icon: "star",    color: "#facc15", defaultTarget: 50  },
  { type: "repos",   label: "Public Repositories", icon: "repo",    color: "#34d399", defaultTarget: 20  },
  { type: "custom",  label: "Custom Goal",         icon: "target",  color: "#e879f9", defaultTarget: 1   },
];

const STORAGE_KEY = "devtrack_goals";

function GoalIcon({ icon, color }: { icon: string; color: string }) {
  const cls = "w-4 h-4";
  const icons: Record<string, React.ReactNode> = {
    flame:  <Flame className={cls} />,
    commit: <GitCommit className={cls} />,
    star:   <Star className={cls} />,
    repo:   <BookOpen className={cls} />,
    target: <Target className={cls} />,
  };
  return (
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${color}20`, color }}
    >
      {icons[icon] || <Target className={cls} />}
    </div>
  );
}

interface GoalTrackerProps {
  streak: number;
  commits: number;
  stars: number;
  repos: number;
}

export function GoalTracker({ streak, commits, stars, repos }: GoalTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(GOAL_PRESETS[0]);
  const [targetInput, setTargetInput] = useState(String(GOAL_PRESETS[0].defaultTarget));
  const [customLabel, setCustomLabel] = useState("");

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setGoals(JSON.parse(stored));
    } catch {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  // Sync live values
  const getLiveValue = (type: GoalType) => {
    switch (type) {
      case "streak":  return streak;
      case "commits": return commits;
      case "stars":   return stars;
      case "repos":   return repos;
      default:        return 0;
    }
  };

  const syncedGoals = goals.map((g) => ({
    ...g,
    current: g.type !== "custom" ? getLiveValue(g.type) : g.current,
  }));

  const addGoal = () => {
    const target = parseInt(targetInput) || selectedPreset.defaultTarget;
    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      type: selectedPreset.type,
      label: selectedPreset.type === "custom" ? (customLabel || "Custom Goal") : selectedPreset.label,
      target,
      current: selectedPreset.type !== "custom" ? getLiveValue(selectedPreset.type) : 0,
      icon: selectedPreset.icon,
      color: selectedPreset.color,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
    setShowAdd(false);
    setTargetInput(String(selectedPreset.defaultTarget));
    setCustomLabel("");
  };

  const removeGoal = (id: string) => setGoals((prev) => prev.filter((g) => g.id !== id));

  const incrementCustom = (id: string) =>
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, current: Math.min(g.current + 1, g.target) } : g));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Goal Tracker</h2>
          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-[9px] font-black uppercase tracking-widest text-rose-400">
            {syncedGoals.filter((g) => g.current >= g.target).length}/{syncedGoals.length} Complete
          </span>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all"
        >
          <Plus className="w-3 h-3" />
          {showAdd ? "Cancel" : "Add Goal"}
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur space-y-4">
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Choose goal type</p>

              {/* Presets */}
              <div className="flex flex-wrap gap-2">
                {GOAL_PRESETS.map((preset) => (
                  <button
                    key={preset.type}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setTargetInput(String(preset.defaultTarget));
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      selectedPreset.type === preset.type
                        ? "bg-white/10 border-white/20 text-white"
                        : "bg-white/3 border-white/5 text-neutral-500 hover:text-neutral-300"
                    )}
                  >
                    <GoalIcon icon={preset.icon} color={preset.color} />
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Inputs */}
              <div className="flex gap-3 flex-wrap">
                {selectedPreset.type === "custom" && (
                  <input
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="Goal name..."
                    className="flex-1 min-w-[160px] bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 placeholder:text-neutral-600"
                  />
                )}
                <input
                  type="number"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  placeholder="Target..."
                  className="w-28 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 placeholder:text-neutral-600"
                />
                <button
                  onClick={addGoal}
                  className="px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-black transition-all"
                  style={{ background: selectedPreset.color }}
                >
                  Add Goal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Cards */}
      {syncedGoals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 rounded-2xl border border-white/5 bg-black/30 gap-3 opacity-40">
          <Trophy className="w-8 h-8 text-neutral-500" />
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">No goals set yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {syncedGoals.map((goal, i) => {
              const pct = Math.min((goal.current / goal.target) * 100, 100);
              const done = pct >= 100;
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "relative p-5 rounded-2xl border transition-all group overflow-hidden",
                    done
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-white/8 bg-black/40 hover:border-white/15"
                  )}
                >
                  {done && (
                    <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <GoalIcon icon={goal.icon} color={done ? "#34d399" : goal.color} />
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-tight">{goal.label}</p>
                        <p className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">
                          {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {done
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        : <Circle className="w-4 h-4 text-neutral-700" />
                      }
                      {goal.type === "custom" && !done && (
                        <button
                          onClick={() => incrementCustom(goal.id)}
                          className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-all text-[10px]"
                          title="Increment"
                        >
                          +
                        </button>
                      )}
                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-400 text-neutral-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: done ? "#34d399" : goal.color,
                          boxShadow: `0 0 6px ${done ? "#34d399" : goal.color}`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[8px] font-mono text-neutral-700">
                        {Math.round(pct)}% complete
                      </span>
                      {!done && (
                        <span className="text-[8px] font-mono text-neutral-700">
                          {(goal.target - goal.current).toLocaleString()} remaining
                        </span>
                      )}
                    </div>
                  </div>

                  {done && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1"
                    >
                      <Trophy className="w-3 h-3" /> Goal Achieved!
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
