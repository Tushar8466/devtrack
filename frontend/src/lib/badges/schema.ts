export type BadgeCategory = 'STREAK' | 'COMMIT' | 'OPEN_SOURCE' | 'LANGUAGE' | 'SOCIAL' | 'SPECIAL';
export type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export const XP_VALUES: Record<BadgeTier, number> = {
  BRONZE: 50,
  SILVER: 150,
  GOLD: 300,
  PLATINUM: 500,
};

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Could be lucide icon name or emoji
  category: BadgeCategory;
  tier: BadgeTier;
  criteriaDescription: string;
  isSecret: boolean;
  xpValue: number;
  categoryImage?: string; // path to public image for the category
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  unlockedAt: string; // ISO Datestring for JSON
}

export interface BadgeWithStatus extends Badge {
  isUnlocked: boolean;
  unlockedAt?: string;
}

// Category → badge image from /public/badges/
export const BADGE_CATEGORY_IMAGES: Record<BadgeCategory, string> = {
  STREAK:       '/badges/badge_streak_1773437787689.png',
  COMMIT:       '/badges/badge_commit_1773437802345.png',
  OPEN_SOURCE:  '/badges/badge_open_source_1773437857491.png',
  LANGUAGE:     '/badges/badge_language_1773437871956.png',
  SOCIAL:       '/badges/badge_social_1773438015294.png',
  SPECIAL:      '/badges/badge_special_1773438070727.png',
};

// In-memory array defining all badges in the DevTrack ecosystem.
// In a real application, this might live in a database or be static config.
export const DEVTRACK_BADGES: Badge[] = [
  // STREAK
  { id: 'streak_3', name: 'Ignition', description: 'Complete your first 3-day coding streak', icon: 'Flame', category: 'STREAK', tier: 'BRONZE', criteriaDescription: '3 day streak', isSecret: false, xpValue: XP_VALUES.BRONZE },
  { id: 'streak_7', name: 'On Fire', description: 'Code for 7 days consecutively', icon: 'Flame', category: 'STREAK', tier: 'SILVER', criteriaDescription: '7 day streak', isSecret: false, xpValue: XP_VALUES.SILVER },
  { id: 'streak_30', name: 'Unstoppable', description: 'Code for 30 consecutive days', icon: 'Flame', category: 'STREAK', tier: 'GOLD', criteriaDescription: '30 day streak', isSecret: false, xpValue: XP_VALUES.GOLD },
  { id: 'streak_100', name: 'Legendary', description: 'Reach a legendary 100-day streak', icon: 'Flame', category: 'STREAK', tier: 'PLATINUM', criteriaDescription: '100 day streak', isSecret: false, xpValue: XP_VALUES.PLATINUM },

  // COMMIT
  { id: 'commit_first', name: 'First Blood', description: 'Make your first ever tracked commit', icon: 'Terminal', category: 'COMMIT', tier: 'BRONZE', criteriaDescription: '1 total commit', isSecret: false, xpValue: XP_VALUES.BRONZE },
  { id: 'commit_100', name: 'Centurion', description: 'Make 100 total commits', icon: 'Terminal', category: 'COMMIT', tier: 'SILVER', criteriaDescription: '100 total commits', isSecret: false, xpValue: XP_VALUES.SILVER },
  { id: 'commit_1000', name: 'Commit Lord', description: 'Make 1000 total commits', icon: 'Terminal', category: 'COMMIT', tier: 'GOLD', criteriaDescription: '1000 total commits', isSecret: false, xpValue: XP_VALUES.GOLD },
  { id: 'commit_monthly_30', name: 'Daily Driver', description: 'Make 30 commits in a single month', icon: 'Calendar', category: 'COMMIT', tier: 'GOLD', criteriaDescription: '30 commits in one month', isSecret: false, xpValue: XP_VALUES.GOLD },

  // OPEN SOURCE
  { id: 'oss_first', name: 'Open Sourcer', description: 'First ever Open Source contribution', icon: 'GitPullRequest', category: 'OPEN_SOURCE', tier: 'BRONZE', criteriaDescription: '1 OSS PR or Issue', isSecret: false, xpValue: XP_VALUES.BRONZE },
  { id: 'oss_pr_10', name: 'PR Hero', description: 'Get 10 pull requests merged', icon: 'GitMerge', category: 'OPEN_SOURCE', tier: 'SILVER', criteriaDescription: '10 merged PRs', isSecret: false, xpValue: XP_VALUES.SILVER },
  { id: 'oss_issue_25', name: 'Bug Slayer', description: 'Successfully close 25 repository issues', icon: 'Bug', category: 'OPEN_SOURCE', tier: 'GOLD', criteriaDescription: '25 issues closed', isSecret: false, xpValue: XP_VALUES.GOLD },
  { id: 'oss_core_contributor', name: 'Core Contributor', description: 'Merge 5 PRs into a single active repository', icon: 'Star', category: 'OPEN_SOURCE', tier: 'PLATINUM', criteriaDescription: '5 PRs merged in one repo', isSecret: false, xpValue: XP_VALUES.PLATINUM },

  // LANGUAGE
  { id: 'lang_polyglot', name: 'Polyglot', description: 'Code in 5+ different programming languages', icon: 'Code', category: 'LANGUAGE', tier: 'SILVER', criteriaDescription: '5+ languages used', isSecret: false, xpValue: XP_VALUES.SILVER },
  { id: 'lang_js_ninja', name: 'JavaScript Ninja', description: 'Make 100+ commits using JavaScript', icon: 'Zap', category: 'LANGUAGE', tier: 'GOLD', criteriaDescription: '100+ JS commits', isSecret: false, xpValue: XP_VALUES.GOLD },
  { id: 'lang_python_wizard', name: 'Python Wizard', description: 'Make 100+ commits using Python', icon: 'Zap', category: 'LANGUAGE', tier: 'GOLD', criteriaDescription: '100+ Python commits', isSecret: false, xpValue: XP_VALUES.GOLD },
  { id: 'lang_fullstack', name: 'Full Stack', description: 'Commits in both frontend and backend languages', icon: 'Layers', category: 'LANGUAGE', tier: 'GOLD', criteriaDescription: 'Frontend + Backend lang commits', isSecret: false, xpValue: XP_VALUES.GOLD },

  // SOCIAL
  { id: 'social_100_stars', name: 'Influencer', description: 'One of your repositories hits 100 stars', icon: 'Star', category: 'SOCIAL', tier: 'GOLD', criteriaDescription: '100+ stars on a repo', isSecret: false, xpValue: XP_VALUES.GOLD },
  { id: 'social_multi_repo', name: 'Team Player', description: 'Contribute to 10 different repositories', icon: 'Users', category: 'SOCIAL', tier: 'SILVER', criteriaDescription: 'Contributed to 10 repos', isSecret: false, xpValue: XP_VALUES.SILVER },
  { id: 'social_mentor', name: 'Mentor', description: 'Review 20+ pull requests', icon: 'ThumbsUp', category: 'SOCIAL', tier: 'GOLD', criteriaDescription: '20+ PR reviews', isSecret: false, xpValue: XP_VALUES.GOLD },

  // SPECIAL / RARE
  { id: 'special_night_owl', name: 'Night Owl', description: 'Make 50 commits between 12am–4am', icon: 'Moon', category: 'SPECIAL', tier: 'PLATINUM', criteriaDescription: '50 late night commits', isSecret: true, xpValue: XP_VALUES.PLATINUM },
  { id: 'special_weekend_warrior', name: 'Weekend Warrior', description: 'Make 30 commits on weekends', icon: 'Coffee', category: 'SPECIAL', tier: 'GOLD', criteriaDescription: '30 weekend commits', isSecret: false, xpValue: XP_VALUES.GOLD },
  { id: 'special_new_year', name: 'New Year Coder', description: 'Committed exactly on January 1st', icon: 'PartyPopper', category: 'SPECIAL', tier: 'SILVER', criteriaDescription: 'Commit on Jan 1', isSecret: true, xpValue: XP_VALUES.SILVER },
  { id: 'special_hacktoberfest', name: 'Open Source Day', description: 'Contributed during Hacktoberfest month', icon: 'TreePine', category: 'SPECIAL', tier: 'GOLD', criteriaDescription: 'Commit in October', isSecret: true, xpValue: XP_VALUES.GOLD },
];

export function calculateDeveloperLevel(xp: number): { level: number; progress: number; nextLevelXp: number } {
  // A simple scale: Each level requires 100 XP * level
  // Lvl 1: 0-100 XP, Lvl 2: 100-300 XP, Lvl 3: 300-600 XP etc.
  let level = 1;
  let remainingXp = xp;
  let nextLevelXp = 100;

  while (remainingXp >= nextLevelXp) {
    remainingXp -= nextLevelXp;
    level += 1;
    nextLevelXp = Math.floor(100 * Math.pow(1.5, level - 1)); // Exponential growth
    if (level >= 100) break; // Cap at 100
  }

  const progress = level >= 100 ? 100 : (remainingXp / nextLevelXp) * 100;

  return { level, progress, nextLevelXp };
}
