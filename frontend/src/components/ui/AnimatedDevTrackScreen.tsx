"use client";
import { useEffect, useState } from "react";

/** Animates a number from 0 up to `target` over `duration` ms */
function useCounter(target: number, duration = 1500) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = target / (duration / 16);
        const id = setInterval(() => {
            start += step;
            if (start >= target) { setValue(target); clearInterval(id); }
            else setValue(Math.floor(start));
        }, 16);
        return () => clearInterval(id);
    }, [target, duration]);
    return value;
}

/** Draws a smooth animated SVG sparkline */
function Spark({ points, color }: { points: number[]; color: string }) {
    const W = 120, H = 32;
    const min = Math.min(...points), max = Math.max(...points);
    const range = max - min || 1;
    const tx = (i: number) => (i / (points.length - 1)) * W;
    const ty = (v: number) => H - ((v - min) / range) * (H - 4) - 2;
    const d = points.reduce((acc, v, i) => {
        const x = tx(i), y = ty(v);
        if (i === 0) return `M${x},${y}`;
        const px = tx(i - 1), py = ty(points[i - 1]);
        const cpx = (px + x) / 2;
        return `${acc} C${cpx},${py} ${cpx},${y} ${x},${y}`;
    }, "");
    const areaD = `${d} L${W},${H} L0,${H} Z`;
    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <defs>
                <linearGradient id={`g-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#g-${color.replace("#", "")})`} />
            <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={tx(points.length - 1)} cy={ty(points[points.length - 1])} r="2.5" fill={color} />
        </svg>
    );
}

const GRID_COLS = 26;
const GRID_ROWS = 7;

function miniHeat(col: number, row: number) {
    const v = (col * 7 + row * 3 + col * row) % 5;
    return v === 0 ? "#161b22" : v === 1 ? "#0e4429" : v === 2 ? "#006d32" : v === 3 ? "#26a641" : "#39d353";
}

export default function AnimatedDevTrackScreen() {
    const aiScore = useCounter(34, 1400);
    const stabilityScore = useCounter(73, 1600);
    const ownershipScore = useCounter(9, 1200);

    // Sparkline data (static deterministic)
    const aiPoints = [30, 25, 38, 28, 45, 34, 40, 32, 38, 34];
    const stabPoints = [60, 65, 58, 72, 68, 75, 70, 73, 76, 73];
    const ownPoints = [15, 10, 18, 8, 14, 9, 12, 7, 11, 9];

    const [visibleCells, setVisibleCells] = useState(0);
    const totalCells = GRID_COLS * GRID_ROWS;
    useEffect(() => {
        let i = 0;
        const id = setInterval(() => {
            i += 4;
            setVisibleCells(Math.min(i, totalCells));
            if (i >= totalCells) clearInterval(id);
        }, 18);
        return () => clearInterval(id);
    }, [totalCells]);

    return (
        <div
            className="w-full h-full text-white overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)",
                fontFamily: "system-ui, sans-serif",
                fontSize: "10px",
            }}
        >
            {/* Top bar */}
            <div style={{ background: "#111120", borderBottom: "1px solid #ffffff15", padding: "6px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840" }} />
                <div style={{ flex: 1, textAlign: "center", color: "#666", fontSize: 8 }}>localhost:3000/explore</div>
            </div>

            {/* Nav bar */}
            <div style={{ background: "#0d0d1a", borderBottom: "1px solid #ffffff10", padding: "5px 12px", display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ color: "#818cf8", fontWeight: 700, fontSize: 9 }}>DevTrack</span>
                {["Home", "Dashboard", "Explore", "Profile"].map(n => (
                    <span key={n} style={{ color: n === "Explore" ? "#a5b4fc" : "#555", fontSize: 8 }}>{n}</span>
                ))}
            </div>

            <div style={{ display: "flex", height: "calc(100% - 54px)" }}>
                {/* Sidebar */}
                <div style={{ width: 70, background: "#0b0b16", borderRight: "1px solid #ffffff0d", padding: "10px 8px", display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", margin: "0 auto 6px" }} />
                    <div style={{ textAlign: "center", color: "#fff", fontWeight: 700, fontSize: 8 }}>Tushar</div>
                    <div style={{ textAlign: "center", color: "#555", fontSize: 7 }}>@Tushar8466</div>
                    <div style={{ background: "#7c3aed33", border: "1px solid #7c3aed55", borderRadius: 4, padding: "2px 4px", textAlign: "center", color: "#a78bfa", fontSize: 7, marginTop: 4 }}>Low AI</div>
                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: 8, color: "#888", fontSize: 7 }}>
                        <div style={{ textAlign: "center" }}><div style={{ color: "#fff", fontWeight: 700 }}>56</div><div>Repos</div></div>
                        <div style={{ textAlign: "center" }}><div style={{ color: "#fff", fontWeight: 700 }}>7</div><div>Follow</div></div>
                    </div>
                </div>

                {/* Main content */}
                <div style={{ flex: 1, padding: "8px 10px", overflowY: "hidden", display: "flex", flexDirection: "column", gap: 6 }}>
                    {/* Banner */}
                    <div style={{ background: "#0e2918", border: "1px solid #166534", borderRadius: 5, padding: "4px 8px", color: "#4ade80", fontSize: 8, display: "flex", alignItems: "center", gap: 4 }}>
                        <span>✅</span> Low AI Influence · Overall AI Risk Score: 29/100
                    </div>

                    {/* Metric cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                        {[
                            { label: "AI Influence Trend", risk: "Low Risk", score: aiScore, points: aiPoints, color: "#818cf8", bg: "#0d0d1e" },
                            { label: "Post-Merge Stability", risk: "Low Risk", score: stabilityScore, points: stabPoints, color: "#34d399", bg: "#081a12" },
                            { label: "Ownership Confidence", risk: "Low Risk", score: ownershipScore, points: ownPoints, color: "#f87171", bg: "#1a0808" },
                        ].map((m) => (
                            <div key={m.label} style={{ background: m.bg, border: "1px solid #ffffff10", borderRadius: 5, padding: "6px 8px", display: "flex", flexDirection: "column", gap: 3 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <div style={{ color: "#ccc", fontSize: 7, fontWeight: 600 }}>{m.label}</div>
                                        <div style={{ color: m.color, fontSize: 6 }}>{m.risk}</div>
                                    </div>
                                    <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>{m.score}</span>
                                </div>
                                <div style={{ background: "#ffffff10", borderRadius: 2, height: 2 }}>
                                    <div style={{ background: m.color, height: "100%", borderRadius: 2, width: `${m.score}%`, transition: "width 0.05s" }} />
                                </div>
                                <Spark points={m.points} color={m.color} />
                            </div>
                        ))}

                        {/* Placeholder 4th card */}
                        <div style={{ background: "#0d1218", border: "1px solid #ffffff10", borderRadius: 5, padding: "6px 8px" }}>
                            <div style={{ color: "#ccc", fontSize: 7, fontWeight: 600 }}>Repo AI Influence</div>
                            <div style={{ color: "#06b6d4", fontSize: 6 }}>Low Risk</div>
                            <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, marginTop: 2 }}>34</div>
                            <div style={{ background: "#ffffff10", borderRadius: 2, height: 2, marginTop: 3 }}>
                                <div style={{ background: "#06b6d4", height: "100%", width: "34%", borderRadius: 2 }} />
                            </div>
                        </div>
                    </div>

                    {/* Contribution heatmap */}
                    <div style={{ background: "#0b0b16", border: "1px solid #ffffff0d", borderRadius: 5, padding: "6px 8px" }}>
                        <div style={{ color: "#ccc", fontSize: 8, marginBottom: 4 }}>GitHub Contribution Activity</div>
                        <div style={{ display: "flex", gap: 1.5 }}>
                            {Array.from({ length: GRID_COLS }, (_, ci) => (
                                <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    {Array.from({ length: GRID_ROWS }, (_, ri) => {
                                        const idx = ci * GRID_ROWS + ri;
                                        return (
                                            <div
                                                key={ri}
                                                style={{
                                                    width: 5, height: 5, borderRadius: 1,
                                                    background: idx < visibleCells ? miniHeat(ci, ri) : "#161b22",
                                                    transition: "background 0.2s",
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
