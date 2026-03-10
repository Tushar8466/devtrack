"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowLeft,
    ArrowRight,
    GitFork,
    GitPullRequest,
    GitMerge,
    Search,
    Star,
    Code2,
    Terminal,
    BookOpen,
    CheckCircle2,
    ExternalLink,
    ChevronRight,
    Lightbulb,
    Rocket,
    Globe,
    MessageSquare,
    Zap,
    Copy,
    Check,
    Circle,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
type Token = { type: "comment" | "cmd" | "flag" | "string" | "output" | "plain"; text: string };
type Line = Token[];

/* ─── Syntax-highlight a bash snippet ───────────────────── */
function tokenizeBash(raw: string): Line[] {
    return raw.split("\n").map((line) => {
        const trimmed = line.trimStart();
        // comment line
        if (trimmed.startsWith("#")) return [{ type: "comment", text: line }];
        // output lines (indented or starting with common output patterns)
        if (line.startsWith("  ") && !line.trimStart().startsWith("git") && !line.trimStart().startsWith("npm") && !line.trimStart().startsWith("node")) {
            return [{ type: "output", text: line }];
        }

        const tokens: Token[] = [];
        let rest = line;

        // leading spaces
        const leadingMatch = rest.match(/^(\s+)/);
        if (leadingMatch) { tokens.push({ type: "plain", text: leadingMatch[1] }); rest = rest.slice(leadingMatch[1].length); }

        // first word = command
        const cmdMatch = rest.match(/^([a-zA-Z0-9._/-]+)/);
        if (cmdMatch) { tokens.push({ type: "cmd", text: cmdMatch[1] }); rest = rest.slice(cmdMatch[1].length); }

        // parse flags, strings, and the rest
        while (rest.length > 0) {
            const flagMatch = rest.match(/^(\s+--?[a-zA-Z][\w-]*)/);
            const strMatch = rest.match(/^(\s+"[^"]*"|'[^']*')/);
            const plain = rest.match(/^([^\s]+|\s+)/);
            if (flagMatch) { tokens.push({ type: "flag", text: flagMatch[1] }); rest = rest.slice(flagMatch[1].length); }
            else if (strMatch) { tokens.push({ type: "string", text: strMatch[1] }); rest = rest.slice(strMatch[1].length); }
            else if (plain) { tokens.push({ type: "plain", text: plain[1] }); rest = rest.slice(plain[1].length); }
            else break;
        }
        return tokens;
    });
}

function BashLine({ line }: { line: Line }) {
    return (
        <span className="block">
            {line.map((tok, i) => {
                const cls =
                    tok.type === "comment" ? "text-neutral-600 italic" :
                        tok.type === "cmd" ? "text-cyan-400 font-semibold" :
                            tok.type === "flag" ? "text-amber-400" :
                                tok.type === "string" ? "text-green-400" :
                                    tok.type === "output" ? "text-neutral-500" :
                                        "text-neutral-300";
                return <span key={i} className={cls}>{tok.text}</span>;
            })}
        </span>
    );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
    const [copied, setCopied] = useState(false);
    const lines = tokenizeBash(code.trimStart());

    const handleCopy = () => {
        navigator.clipboard.writeText(code.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-2xl overflow-hidden border border-white/8 bg-[#07070d]">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/3 border-b border-white/8">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/50" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <span className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    {label && <span className="text-[10px] text-neutral-500 font-mono ml-2">{label}</span>}
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[10px] text-neutral-500 hover:text-white transition-colors px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                >
                    {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            {/* Code */}
            <div className="p-5">
                <pre className="text-sm font-mono leading-6 whitespace-pre-wrap wrap-break-word">
                    {lines.map((line, i) => <BashLine key={i} line={line} />)}
                </pre>
            </div>
        </div>
    );
}

/* ─── Data ───────────────────────────────────────────────── */
const steps = [
    {
        id: "find",
        number: "01",
        title: "Find the Right Project",
        icon: <Search className="w-5 h-5" />,
        color: "cyan",
        tagline: "Start with projects you already use",
        description:
            "The most common mistake beginners make is picking a repo just because it's popular. Instead, find something you genuinely care about — that motivation will carry you through the inevitable confusing parts. Filter GitHub by language and the label 'good first issue' to discover entry-level tasks.",
        tips: [
            "Search GitHub for label:\"good first issue\" in your favorite language",
            "Try goodfirstissue.dev — it curates beginner tasks across popular repos",
            "Check projects you already use: your editor plugins, CLI tools, frameworks",
            "Look for repos with an active community and recent commits",
            "Avoid projects with a last commit older than 6 months",
        ],
        code: {
            label: "bash — searching for issues",
            snippet: `# Search GitHub directly in the browser
# https://github.com/issues?q=is:open+label:"good+first+issue"+language:typescript

# Or use the GitHub CLI (gh) to search issues
gh issue list --repo vercel/next.js --label "good first issue" --limit 10

# See open issues in a specific language
gh search issues --label "good first issue" --language javascript --state open

# Inspect a project before diving in
gh repo view facebook/react
gh repo view torvalds/linux --web`,
        },
    },
    {
        id: "fork",
        number: "02",
        title: "Fork & Clone the Repository",
        icon: <GitFork className="w-5 h-5" />,
        color: "violet",
        tagline: "Your fork = your sandbox",
        description:
            "A fork is your personal copy of a repo under your GitHub account — you can push freely without affecting the original. After forking on GitHub, clone your fork locally. Always track the original repo as 'upstream' so you can keep in sync with the latest changes.",
        tips: [
            "Fork on GitHub first, then clone YOUR fork (not the original)",
            "Add 'upstream' remote immediately after cloning",
            "Always pull from upstream before starting new work",
            "Use SSH remotes if you plan to contribute regularly",
            "Check the repo's star count and contributors for project health",
        ],
        code: {
            label: "bash — fork, clone, set remotes",
            snippet: `# 1. Fork on GitHub (click the Fork button), then:

# 2. Clone YOUR fork locally
git clone git@github.com:YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME

# 3. Add the original repo as 'upstream'
git remote add upstream git@github.com:ORIGINAL_OWNER/REPO_NAME.git

# 4. Verify both remotes are set correctly
git remote -v
# origin    git@github.com:YOUR_USERNAME/REPO_NAME.git (fetch)
# origin    git@github.com:YOUR_USERNAME/REPO_NAME.git (push)
# upstream  git@github.com:ORIGINAL_OWNER/REPO_NAME.git (fetch)
# upstream  git@github.com:ORIGINAL_OWNER/REPO_NAME.git (push)

# 5. Fetch all branches from upstream
git fetch upstream`,
        },
    },
    {
        id: "setup",
        number: "03",
        title: "Set Up Your Environment",
        icon: <Terminal className="w-5 h-5" />,
        color: "green",
        tagline: "Read CONTRIBUTING.md first — always",
        description:
            "Every project has unique setup steps. The CONTRIBUTING.md file is the canonical source of truth — it explains how to install dependencies, run tests, and follow code style conventions. Don't skip it. Run the existing test suite before making any changes to ensure the baseline is green.",
        tips: [
            "Read CONTRIBUTING.md and CODE_OF_CONDUCT.md before anything else",
            "Install the exact Node/Python/Go version specified (use nvm, pyenv, etc.)",
            "Run existing tests FIRST to establish a green baseline",
            "Check if there's a .env.example file you need to copy",
            "Use the project's recommended editor extensions (check .vscode/extensions.json)",
        ],
        code: {
            label: "bash — environment setup",
            snippet: `# Read the contributing guide first
cat CONTRIBUTING.md | head -100

# Use correct Node version (if project uses .nvmrc)
nvm install && nvm use

# Install dependencies
npm install
# or: yarn install / pnpm install / bun install

# Copy environment variables
cp .env.example .env.local

# Run existing test suite — make sure it passes
npm test
# ✓ 142 tests passed | 0 failed | 0 skipped

# Start the dev server and verify it works
npm run dev
# → http://localhost:3000`,
        },
    },
    {
        id: "branch",
        number: "04",
        title: "Create a Feature Branch",
        icon: <Code2 className="w-5 h-5" />,
        color: "orange",
        tagline: "One branch = one logical change",
        description:
            "Never commit directly to main. Create a new branch for every change you work on. Use kebab-case names with a prefix matching the type of change: 'fix/', 'feat/', 'docs/', 'chore/'. Before branching, always sync with upstream to avoid conflicts later.",
        tips: [
            "Prefix branches: fix/, feat/, docs/, refactor/, chore/",
            "One branch = one PR = one logical, reviewable change",
            "Sync with upstream/main before creating your branch",
            "Keep branch names short but descriptive (< 50 chars)",
            "Never reuse old merged branches — always create fresh",
        ],
        code: {
            label: "bash — branching workflow",
            snippet: `# Always sync first — avoid merge conflicts later
git fetch upstream
git checkout main
git merge upstream/main --ff-only

# Push synced main to your fork too
git push origin main

# Create your feature branch from the freshest main
git checkout -b fix/navbar-mobile-overflow

# Verify you're on the right branch
git branch --show-current
# fix/navbar-mobile-overflow

# List all branches
git branch -a`,
        },
    },
    {
        id: "commits",
        number: "05",
        title: "Write Meaningful Commits",
        icon: <CheckCircle2 className="w-5 h-5" />,
        color: "pink",
        tagline: "Commits are permanent documentation",
        description:
            "A great commit message explains WHY a change was made, not just what changed — the diff already shows what changed. Follow the Conventional Commits specification: it makes your history scannable, enables automatic changelog generation, and signals professionalism to maintainers.",
        tips: [
            "Follow Conventional Commits: feat, fix, docs, style, refactor, test, chore",
            "Keep the subject line under 72 characters and in imperative mood",
            "Add a blank line + body to explain the 'why' for complex changes",
            "Reference the issue number: 'Closes #123' or 'Fixes #456'",
            "Commit early and often — small focused commits are easier to review",
        ],
        code: {
            label: "bash — conventional commits",
            snippet: `# Stage only the files related to your change
git add src/components/Navbar.tsx
git add src/styles/navbar.css

# Check what you're about to commit
git diff --staged

# Write a Conventional Commit message
git commit -m "fix(navbar): correct mobile overflow on screens < 768px

Previously, the hamburger menu was being clipped by overflow:hidden
on the parent container, making it inaccessible on small screens.

Closes #231"

# Check your commit looks right
git log --oneline -5
# a3f9c12 fix(navbar): correct mobile overflow on screens < 768px
# 7b2e041 feat(auth): add GitHub OAuth provider
# ...

# Oops, need to fix the last commit message?
git commit --amend --no-edit`,
        },
    },
    {
        id: "pr",
        number: "06",
        title: "Open a Pull Request",
        icon: <GitPullRequest className="w-5 h-5" />,
        color: "blue",
        tagline: "A great PR description gets merged faster",
        description:
            "Push your branch to your fork, then open a PR against the upstream repository. The quality of your PR description directly affects how quickly it gets reviewed. Include a summary, the problem being solved, how to test it, and screenshots for any UI changes. Link the issue it resolves.",
        tips: [
            "Use the repo's PR template if one exists (check .github/PULL_REQUEST_TEMPLATE.md)",
            "Keep your PR focused — avoid fixing unrelated things in the same PR",
            "Add screenshots or a screen recording for UI/UX changes",
            "Mark as 'Draft' if it's not ready for final review yet",
            "Ping the issue author or maintainer if no response after a week",
        ],
        code: {
            label: "bash — push & open PR",
            snippet: `# Push your branch to your fork
git push origin fix/navbar-mobile-overflow

# GitHub will show a banner to open a PR — click it, or use the CLI:
gh pr create \\
  --title "fix(navbar): correct mobile overflow on screens < 768px" \\
  --body "## What changed?
Navbar hamburger menu was clipped on mobile viewports.

## Why?
Fixes #231 — reported by @user on Chrome/Android

## How to test?
1. Run \`npm run dev\`
2. Open DevTools → toggle mobile view (< 768px)
3. Verify hamburger icon is fully visible and clickable

## Screenshots
[before/after screenshots attached]" \\
  --base main

# Check PR status
gh pr status
gh pr view --web`,
        },
    },
    {
        id: "review",
        number: "07",
        title: "Respond to Review Feedback",
        icon: <MessageSquare className="w-5 h-5" />,
        color: "teal",
        tagline: "Code review is collaboration, not criticism",
        description:
            "Getting review comments is normal — even senior engineers get feedback on every PR. Respond to every comment professionally, push fixes to the same branch (the PR auto-updates), and use 'resolve conversation' only after the reviewer acknowledges the fix. Never force-push to a branch under review.",
        tips: [
            "Reply to every review comment — even 'done, fixed in latest commit'",
            "Push new commits to the same branch; don't force-push mid-review",
            "If you disagree with feedback, explain your reasoning calmly",
            "After pushing fixes, leave a comment: 'Addressed in 3abc9f2'",
            "Ask for clarification if feedback is ambiguous — don't guess",
        ],
        code: {
            label: "bash — handling review feedback",
            snippet: `# After reading review comments, make the requested changes
# (edit files in your editor...)

# Stage and commit the review fixes
git add src/components/Navbar.tsx
git commit -m "fix(navbar): use z-index instead of overflow fix per review"

# Push to the SAME branch — PR auto-updates
git push origin fix/navbar-mobile-overflow

# Then leave a PR comment:
# "Addressed in latest commit (abc1234) — used z-index:50 approach
#  as suggested. PTAL when you get a chance."

# Check if CI is passing after your changes
gh pr checks

# View full diff of the PR vs base
gh pr diff`,
        },
    },
    {
        id: "merged",
        number: "08",
        title: "Merged! Clean Up & Keep Going",
        icon: <GitMerge className="w-5 h-5" />,
        color: "violet",
        tagline: "You're an open source contributor now 🎉",
        description:
            "Once your PR is merged, clean up the local and remote branches to keep your workspace tidy. Sync your main branch with upstream to reflect the merged commit. Then look for the next issue — the more you contribute, the more maintainers trust you with larger, more impactful tasks.",
        tips: [
            "Delete your feature branch locally and on your fork after merge",
            "Sync your fork's main so it reflects your merged commit",
            "Add the project to your GitHub profile README or portfolio",
            "Comment on the issue thanking the maintainers — build relationships",
            "Look for harder issues — maintainers will start assigning them to you",
        ],
        code: {
            label: "bash — post-merge cleanup",
            snippet: `# Pull merged commit into local main
git checkout main
git fetch upstream
git merge upstream/main --ff-only

# Push updated main to your fork
git push origin main

# Delete feature branch locally
git branch -d fix/navbar-mobile-overflow

# Delete feature branch on your fork
git push origin --delete fix/navbar-mobile-overflow

# Confirm all cleaned up
git branch -a
# * main
#   remotes/origin/main
#   remotes/upstream/main

# You are now a contributor! 🎉
# Your contribution is reflected on your GitHub profile graph.
echo "Congratulations! Go find your next issue."`,
        },
    },
];

const resources = [
    { icon: <BookOpen className="w-5 h-5" />, title: "First Timers Only", desc: "Friendly issues for first-time contributors.", url: "https://www.firsttimersonly.com", color: "cyan" },
    { icon: <Star className="w-5 h-5" />, title: "Good First Issue", desc: "Curated beginner issues across many languages.", url: "https://goodfirstissue.dev", color: "yellow" },
    { icon: <Globe className="w-5 h-5" />, title: "Up For Grabs", desc: "Projects actively welcoming new contributors.", url: "https://up-for-grabs.net", color: "green" },
    { icon: <Rocket className="w-5 h-5" />, title: "Open Source Guide", desc: "GitHub's official guide to open source.", url: "https://opensource.guide", color: "violet" },
];

const colorMap: Record<string, { bg: string; border: string; text: string; ring: string; dot: string }> = {
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", ring: "ring-cyan-500/30", dot: "bg-cyan-500" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", ring: "ring-violet-500/30", dot: "bg-violet-500" },
    green: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", ring: "ring-green-500/30", dot: "bg-green-500" },
    orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", ring: "ring-orange-500/30", dot: "bg-orange-500" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", ring: "ring-pink-500/30", dot: "bg-pink-500" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", ring: "ring-blue-500/30", dot: "bg-blue-500" },
    teal: { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-400", ring: "ring-teal-500/30", dot: "bg-teal-500" },
    yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", ring: "ring-yellow-500/30", dot: "bg-yellow-500" },
};

export default function OpenSourceDocsPage() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    // track which step is in view
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        const idx = stepRefs.current.findIndex((r) => r === e.target);
                        if (idx !== -1) setActiveStep(idx);
                    }
                });
            },
            { rootMargin: "-40% 0px -55% 0px" }
        );
        stepRefs.current.forEach((r) => r && obs.observe(r));
        return () => obs.disconnect();
    }, []);

    const scrollToStep = (i: number) => {
        stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <div className="min-h-screen bg-[#030307] text-white">
            {/* Ambient */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/4 rounded-full blur-[140px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/4 rounded-full blur-[140px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-32 flex gap-12">

                {/* ── Sticky Sidebar ── */}
                <aside className="hidden xl:flex flex-col gap-1 w-56 shrink-0 sticky top-28 self-start h-fit">

                    {/* Back to OS Tracker — top of sidebar */}
                    <button
                        onClick={() => router.push("/opensource")}
                        className="flex items-center gap-2 w-full px-3 py-2.5 mb-4 rounded-xl text-xs font-bold text-neutral-400 hover:text-white bg-white/3 hover:bg-white/6 border border-white/8 hover:border-white/15 transition-all group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform shrink-0" />
                        <span className="truncate uppercase tracking-widest">Back to OS Tracker</span>
                    </button>

                    <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-bold mb-3 px-2">On this page</p>
                    {steps.map((step, i) => {
                        const c = colorMap[step.color];
                        const isActive = activeStep === i;
                        return (
                            <button
                                key={step.id}
                                onClick={() => scrollToStep(i)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all text-sm group ${isActive ? "bg-white/5" : "hover:bg-white/3"
                                    }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full shrink-0 transition-all ${isActive ? `${c.dot} shadow-[0_0_8px_2px] shadow-current` : "bg-neutral-700"
                                        }`}
                                />
                                <span className={`transition-colors truncate ${isActive ? `${c.text} font-semibold` : "text-neutral-500 group-hover:text-neutral-300"}`}>
                                    {step.title}
                                </span>
                            </button>
                        );
                    })}

                    {/* Back to top button — premium style */}
                    <div className="mt-5 pt-5 border-t border-white/8">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="group flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-neutral-500 hover:text-white bg-transparent hover:bg-white/5 border border-transparent hover:border-white/8 transition-all"
                        >
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-white/5 border border-white/8 group-hover:bg-white/10 group-hover:border-white/15 transition-all group-hover:-translate-y-0.5">
                                <ArrowLeft className="w-3 h-3 rotate-90" />
                            </span>
                            <span className="uppercase tracking-widest">Back to top</span>
                        </button>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main className="flex-1 min-w-0">



                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-20">
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Rocket className="w-3 h-3" /> Getting Started
                            </span>
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-neutral-400 text-xs font-mono">8 steps · ~20 min read</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
                            Open Source<br />
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-400 via-cyan-400 to-green-400">
                                Contributor Guide
                            </span>
                        </h1>

                        <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed mb-8">
                            Everything you need to go from zero to your first merged pull request.
                            Real commands, real workflows, no fluff — just what actually works.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {[
                                { icon: <CheckCircle2 className="w-4 h-4 text-green-400" />, label: "8 steps with code examples" },
                                { icon: <Zap className="w-4 h-4 text-yellow-400" />, label: "Copy-paste bash commands" },
                                { icon: <Code2 className="w-4 h-4 text-blue-400" />, label: "Works for any language" },
                            ].map((badge) => (
                                <div key={badge.label} className="flex items-center gap-2 text-sm text-neutral-400 px-3 py-1.5 bg-white/3 border border-white/8 rounded-full">
                                    {badge.icon}
                                    {badge.label}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Steps */}
                    <div className="space-y-6">
                        {steps.map((step, index) => {
                            const c = colorMap[step.color];
                            const isActive = activeStep === index;

                            return (
                                <motion.div
                                    key={step.id}
                                    ref={(el: HTMLDivElement | null) => { stepRefs.current[index] = el; }}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04, duration: 0.4 }}
                                    id={step.id}
                                >
                                    <div className={`relative rounded-3xl border transition-all duration-500 overflow-hidden ${isActive ? `border-white/15 shadow-2xl` : "border-white/8"
                                        }`}>
                                        {/* Subtle top gradient bar */}
                                        {isActive && (
                                            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${step.color === "cyan" ? "from-cyan-500 to-blue-500" :
                                                step.color === "violet" ? "from-violet-500 to-purple-500" :
                                                    step.color === "green" ? "from-green-500 to-emerald-500" :
                                                        step.color === "orange" ? "from-orange-500 to-amber-500" :
                                                            step.color === "pink" ? "from-pink-500 to-rose-500" :
                                                                step.color === "blue" ? "from-blue-500 to-indigo-500" :
                                                                    step.color === "teal" ? "from-teal-500 to-cyan-500" :
                                                                        "from-violet-500 to-pink-500"
                                                }`} />
                                        )}

                                        <div className="bg-[#050508] p-8">
                                            {/* Header row */}
                                            <div className="flex items-start gap-5 mb-6">
                                                <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.border} border flex items-center justify-center ${c.text} shrink-0`}>
                                                    {step.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                        <span className={`text-xs font-black ${c.text} uppercase tracking-[0.2em]`}>{step.number}</span>
                                                        <span className="text-neutral-700 text-xs">·</span>
                                                        <span className="text-xs text-neutral-500 italic">{step.tagline}</span>
                                                    </div>
                                                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{step.title}</h2>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-neutral-300 leading-relaxed mb-6 text-[15px]">{step.description}</p>

                                            <div className="space-y-6">
                                                {/* Tips — displayed in a 2-col grid when space allows */}
                                                <div>
                                                    <p className={`text-[10px] uppercase tracking-widest font-black mb-3 flex items-center gap-2 ${c.text}`}>
                                                        <Lightbulb className="w-3 h-3" />
                                                        Key Tips
                                                    </p>
                                                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                                                        {step.tips.map((tip, i) => (
                                                            <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-400 leading-relaxed">
                                                                <ChevronRight className={`w-4 h-4 ${c.text} shrink-0 mt-0.5`} />
                                                                {tip}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Code — full width below tips */}
                                                <div>
                                                    <p className={`text-[10px] uppercase tracking-widest font-black mb-3 flex items-center gap-2 ${c.text}`}>
                                                        <Terminal className="w-3 h-3" />
                                                        Terminal
                                                    </p>
                                                    <CodeBlock code={step.code.snippet} label={step.code.label} />
                                                </div>
                                            </div>

                                            {/* Navigation */}
                                            {(index > 0 || index < steps.length - 1) && (
                                                <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
                                                    <button
                                                        onClick={() => index > 0 && scrollToStep(index - 1)}
                                                        disabled={index === 0}
                                                        className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                                                    >
                                                        <ArrowLeft className="w-3.5 h-3.5" />
                                                        Previous step
                                                    </button>
                                                    <span className="text-xs text-neutral-700 font-mono">{index + 1} / {steps.length}</span>
                                                    <button
                                                        onClick={() => index < steps.length - 1 && scrollToStep(index + 1)}
                                                        disabled={index === steps.length - 1}
                                                        className={`flex items-center gap-2 text-xs disabled:opacity-20 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 ${c.text}`}
                                                    >
                                                        Next step
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Resources */}
                    <div className="mt-24">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="flex-1 h-px bg-white/8" />
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/3 border border-white/8 rounded-full">
                                <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                                <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Helpful Resources</span>
                            </div>
                            <div className="flex-1 h-px bg-white/8" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {resources.map((res, i) => {
                                const c = colorMap[res.color];
                                return (
                                    <motion.a
                                        key={i}
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        className="group bg-[#050508] border border-white/8 rounded-2xl p-5 flex gap-4 hover:border-white/15 transition-all hover:shadow-xl"
                                    >
                                        <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center ${c.text} shrink-0 group-hover:scale-110 transition-transform`}>
                                            {res.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-white text-sm">{res.title}</h4>
                                                <ExternalLink className="w-3 h-3 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                                            </div>
                                            <p className="text-neutral-500 text-xs leading-relaxed">{res.desc}</p>
                                        </div>
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-20 relative"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-violet-600/15 to-cyan-600/15 rounded-3xl blur-xl" />
                        <div className="relative bg-[#050508] border border-white/10 rounded-3xl p-10 text-center overflow-hidden">
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <div className="absolute -top-8 -right-8 w-40 h-40 bg-violet-500 rounded-full blur-3xl" />
                                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-cyan-500 rounded-full blur-3xl" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-linear-to-br from-violet-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center border border-violet-500/20 mx-auto mb-6">
                                    <Rocket className="w-7 h-7 text-violet-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">
                                    Ready to make your first PR?
                                </h2>
                                <p className="text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed">
                                    Use DevTrack to analyze any GitHub profile and discover the impact of open source contributions in real time.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                        onClick={() => router.push("/opensource/track")}
                                        className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 justify-center text-sm"
                                    >
                                        <GitPullRequest className="w-4 h-4" />
                                        Track Contributions
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => router.push("/opensource")}
                                        className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-2xl hover:bg-white/10 active:scale-95 transition-all flex items-center gap-2 justify-center text-sm text-neutral-300"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Overview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
