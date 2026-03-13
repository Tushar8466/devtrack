import { Badge, DEVTRACK_BADGES, UserBadge } from './schema';

export interface GitHubDataPayload {
  commits: number;
  streak: number;
  prs: number;
  issues: number;
  repos: number;
  stars: number;
  languages: string[];
  // Other specialized stats could be passed here
  isNewYear?: boolean;
  isHacktoberfest?: boolean;
}

export function evaluateBadges(
  userId: string,
  data: GitHubDataPayload,
  existingBadges: UserBadge[]
): { newBadges: UserBadge[]; allUnlocked: UserBadge[] } {
  const unlockedNow: UserBadge[] = [];
  const existingBadgeIds = new Set(existingBadges.map((b) => b.badgeId));

  const now = new Date().toISOString();

  DEVTRACK_BADGES.forEach((badge) => {
    // Skip if already unlocked
    if (existingBadgeIds.has(badge.id)) return;

    let qualifies = false;

    switch (badge.id) {
      // STREAK
      case 'streak_3': qualifies = data.streak >= 3; break;
      case 'streak_7': qualifies = data.streak >= 7; break;
      case 'streak_30': qualifies = data.streak >= 30; break;
      case 'streak_100': qualifies = data.streak >= 100; break;

      // COMMIT
      case 'commit_first': qualifies = data.commits >= 1; break;
      case 'commit_100': qualifies = data.commits >= 100; break;
      case 'commit_1000': qualifies = data.commits >= 1000; break;
      case 'commit_monthly_30': /* Complex: needs monthly data. Assuming basic stat for now */ 
        qualifies = data.commits >= 30; // Stubbed 
        break;

      // OPEN SOURCE
      case 'oss_first': qualifies = (data.prs + data.issues) > 0; break;
      case 'oss_pr_10': qualifies = data.prs >= 10; break;
      case 'oss_issue_25': qualifies = data.issues >= 25; break;
      case 'oss_core_contributor': /* Stubbed: requires repo-specific PR counts */ qualifies = data.prs >= 5; break;

      // LANGUAGE
      case 'lang_polyglot': qualifies = data.languages.length >= 5; break;
      case 'lang_js_ninja': qualifies = data.languages.includes('JavaScript') || data.languages.includes('TypeScript'); break;
      case 'lang_python_wizard': qualifies = data.languages.includes('Python'); break;
      case 'lang_fullstack': 
        const hasFrontend = data.languages.some(l => ['JavaScript', 'TypeScript', 'HTML', 'CSS'].includes(l));
        const hasBackend = data.languages.some(l => ['Python', 'Java', 'C#', 'Go', 'Rust', 'Ruby', 'PHP'].includes(l));
        qualifies = hasFrontend && hasBackend; 
        break;

      // SOCIAL
      case 'social_100_stars': qualifies = data.stars >= 100; break;
      case 'social_multi_repo': qualifies = data.repos >= 10; break;
      case 'social_mentor': qualifies = data.prs >= 20; /* Proxy for reviews */ break;

      // SPECIAL
      case 'special_weekend_warrior': qualifies = data.commits >= 30; /* Need specific weekend count */ break;
      case 'special_new_year': qualifies = !!data.isNewYear; break;
      case 'special_hacktoberfest': qualifies = !!data.isHacktoberfest; break;
      case 'special_night_owl': qualifies = data.commits >= 50; /* Need specific timezone count */ break;
    }

    if (qualifies) {
      const newBadge: UserBadge = {
        id: `ub_${Date.now()}_${badge.id}`, // Generate unique ID
        userId,
        badgeId: badge.id,
        unlockedAt: now,
      };
      unlockedNow.push(newBadge);
      existingBadgeIds.add(badge.id); // Add to set to prevent duplicate eval in same run
    }
  });

  return {
    newBadges: unlockedNow,
    allUnlocked: [...existingBadges, ...unlockedNow],
  };
}
