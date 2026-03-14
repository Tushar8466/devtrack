import { NextResponse } from 'next/server';
import { DEVTRACK_BADGES, UserBadge, BadgeWithStatus, calculateDeveloperLevel } from '@/lib/badges/schema';
import { evaluateBadges, GitHubDataPayload } from '@/lib/badges/engine';

// Mock in-memory database for UserBadges (per-process, resets on cold start)
const mockDatabase: Record<string, UserBadge[]> = {};

// Next.js 15: params is a Promise
type RouteContext = { params: Promise<{ username: string }> };

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { username } = await context.params;
    const userBadges = mockDatabase[username] || [];

    // Map unlocked badges against the full catalog
    const allBadges: BadgeWithStatus[] = DEVTRACK_BADGES.map((badge) => {
      const unlocked = userBadges.find((ub) => ub.badgeId === badge.id);
      return {
        ...badge,
        isUnlocked: !!unlocked,
        unlockedAt: unlocked ? unlocked.unlockedAt : undefined,
      };
    });

    // Calculate XP and developer level
    const totalXp = userBadges.reduce((acc, ub) => {
      const badgeConf = DEVTRACK_BADGES.find((b) => b.id === ub.badgeId);
      return acc + (badgeConf ? badgeConf.xpValue : 0);
    }, 0);

    const levelStats = calculateDeveloperLevel(totalXp);

    return NextResponse.json({
      badges: allBadges,
      totalXp,                              // top-level for BadgeShelf
      levelStats: { ...levelStats, totalXp },
    });
  } catch (error) {
    console.error('[GET_BADGES_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { username } = await context.params;

    const body = await request.json();
    const githubData: GitHubDataPayload = {
      commits:   body.commits   || 0,
      streak:    body.streak    || 0,
      prs:       body.prs       || 0,
      issues:    body.issues    || 0,
      repos:     body.repos     || 0,
      stars:     body.stars     || 0,
      languages: body.languages || [],
      isNewYear:         body.isNewYear         || false,
      isHacktoberfest:   body.isHacktoberfest   || false,
    };

    const existingBadges = mockDatabase[username] || [];

    // Run evaluation engine
    const { newBadges, allUnlocked } = evaluateBadges(username, githubData, existingBadges);

    // Persist
    mockDatabase[username] = allUnlocked;

    return NextResponse.json({
      newlyUnlocked: newBadges.map((ub) => ({
        userBadge: ub,
        details: DEVTRACK_BADGES.find((b) => b.id === ub.badgeId),
      })),
      totalUnlockedCount: allUnlocked.length,
    });
  } catch (error) {
    console.error('[POST_EVALUATE_BADGES_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
