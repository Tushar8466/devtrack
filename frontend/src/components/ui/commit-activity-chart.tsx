"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { BarChart2, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MonthlyData {
  month: string;       // "Jan", "Feb", etc.
  year: number;
  count: number;
}

interface CommitActivityChartProps {
  username: string;
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function CommitActivityChart({ username }: CommitActivityChartProps) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const yearsToFetch = [currentYear, currentYear - 1];
        const allDates: string[] = [];

        await Promise.all(
          yearsToFetch.map(async (year) => {
            const from = `${year}-01-01`;
            const to = year === currentYear
              ? new Date().toISOString().split("T")[0]
              : `${year}-12-31`;
            const res = await fetch(
              `/api/streak/check?username=${encodeURIComponent(username)}&localDate=${from}&offset=0`,
            );
            // Re-use the same raw endpoint but we need raw dates.
            // We'll call the contributions page directly through our proxy instead.
          })
        );

        // Use the streak API's contribution data via a small proxy
        const res = await fetch(
          `/api/activity/monthly?username=${encodeURIComponent(username)}`
        );
        if (res.ok) {
          const json = await res.json();
          setData(json.monthly || []);
        }
      } catch {}
      setLoading(false);
    };

    fetchData();
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 rounded-4xl border border-white/5 bg-black/30">
        <div className="flex flex-col items-center gap-3 opacity-40">
          <BarChart2 className="w-8 h-8 text-cyan-400 animate-pulse" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Loading activity…</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) return null;

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((s, d) => s + d.count, 0);
  const avg = total / data.length;

  // Last two months trend
  const last = data[data.length - 1]?.count ?? 0;
  const prev = data[data.length - 2]?.count ?? 0;
  const trend = last > prev ? "up" : last < prev ? "down" : "flat";
  const trendPct = prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-cyan-500 rounded-full" />
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Monthly Activity</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">Avg / month</p>
            <p className="text-sm font-black text-white">{Math.round(avg)} days</p>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border",
              trend === "up"   ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
              trend === "down" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                 "bg-white/5 border-white/10 text-neutral-400"
            )}
          >
            {trend === "up"   ? <TrendingUp className="w-3 h-3" /> :
             trend === "down" ? <TrendingDown className="w-3 h-3" /> :
                                <Minus className="w-3 h-3" />}
            {trend !== "flat" ? `${Math.abs(trendPct)}% vs last month` : "No change"}
          </div>
        </div>
      </div>

      <div className="relative rounded-4xl border border-white/8 bg-black/40 backdrop-blur-xl p-6 overflow-hidden group hover:border-cyan-500/20 transition-all">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

        <div className="relative flex items-end gap-2 h-40">
          {data.map((d, i) => {
            const heightPct = (d.count / maxCount) * 100;
            const isHovered = hoveredIdx === i;
            const isAboveAvg = d.count > avg;

            return (
              <motion.div
                key={`${d.year}-${d.month}`}
                className="relative flex-1 flex flex-col items-center justify-end gap-1 cursor-pointer group/bar"
                onHoverStart={() => setHoveredIdx(i)}
                onHoverEnd={() => setHoveredIdx(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-full mb-2 z-20 px-3 py-2 rounded-xl bg-black border border-white/10 text-center whitespace-nowrap shadow-xl"
                  >
                    <p className="text-[9px] font-black text-white uppercase">{d.month} {d.year}</p>
                    <p className="text-[8px] font-mono text-neutral-400">{d.count} active days</p>
                  </motion.div>
                )}

                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.03 }}
                  className={cn(
                    "w-full rounded-t-lg relative overflow-hidden transition-all",
                    isHovered ? "opacity-100" : "opacity-70 hover:opacity-90"
                  )}
                  style={{
                    background: isHovered
                      ? "linear-gradient(to top, #06b6d4, #818cf8)"
                      : isAboveAvg
                      ? "linear-gradient(to top, #06b6d440, #818cf430)"
                      : "linear-gradient(to top, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                    boxShadow: isHovered ? "0 0 20px rgba(6,182,212,0.4)" : undefined,
                  }}
                >
                  {isHovered && (
                    <div className="absolute inset-0 bg-white/10" />
                  )}
                </motion.div>

                {/* Month label */}
                <span
                  className={cn(
                    "text-[7px] font-black uppercase tracking-widest shrink-0 transition-colors",
                    isHovered ? "text-cyan-400" : "text-neutral-700"
                  )}
                >
                  {d.month.slice(0, 1)}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Average line */}
        <div
          className="absolute left-6 right-6 h-px border-t border-dashed border-cyan-500/20 pointer-events-none"
          style={{ bottom: `calc(${(avg / maxCount) * 100}% + 28px)` }}
        >
          <span className="absolute -top-2.5 right-0 text-[7px] font-mono text-cyan-500/50 uppercase">avg</span>
        </div>
      </div>
    </div>
  );
}
