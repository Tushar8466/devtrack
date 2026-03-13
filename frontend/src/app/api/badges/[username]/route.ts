import { NextResponse } from 'next/server';
import { DEVTRACK_BADGES, UserBadge, BadgeWithStatus, calculateDeveloperLevel } from '@/lib/badges/schema';
import { evaluateBadges, GitHubDataPayload } from '@/lib/badges/engine';

// Mock database for UserBadges since no actual DB is hooked up for badges yet
const mockDatabase: Record<string, UserBadge[]> = {};

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = await params;
    const userBadges = mockDatabase[username] || [];

    // Map unlocked badges to the full catalog
    const allBadges: BadgeWithStatus[] = DEVTRACK_BADGES.map((badge) => {
      const unlocked = userBadges.find((ub) => ub.badgeId === badge.id);
      return {
        ...badge,
        isUnlocked: !!unlocked,
        unlockedAt: unlocked ? unlocked.unlockedAt : undefined,
      };
    });

    // Calculate XP and level
    const totalXp = userBadges.reduce((acc, ub) => {
      const badgeConf = DEVTRACK_BADGES.find((b) => b.id === ub.badgeId);
      return acc + (badgeConf ? badgeConf.xpValue : 0);
    }, 0);

    const levelStats = calculateDeveloperLevel(totalXp);

    return NextResponse.json({
      badges: allBadges,
      levelStats: { ...levelStats, totalXp },
    });
  } catch (error) {
    console.error('[GET_BADGES_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = await params;
    
    // Parse the payload (e.g. sent by dashboard upon login or stat fetch)
    const body = await request.json();
    const githubData: GitHubDataPayload = {
      commits: body.commits || 0,
      streak: body.streak || 0,
      prs: body.prs || 0,
      issues: body.issues || 0,
      repos: body.repos || 0,
      stars: body.stars || 0,
      languages: body.languages || [],
    };

    const existingBadges = mockDatabase[username] || [];
    
    // Run Evaluation Engine
    const { newBadges, allUnlocked } = evaluateBadges(username, githubData, existingBadges);
    
    // Save to DB
    mockDatabase[username] = allUnlocked;

    // Output newly unlocked badges array so UI can show notifications
    return NextResponse.json({
      newlyUnlocked: newBadges.map((ub) => ({
        userBadge: ub,
        details: DEVTRACK_BADGES.find((b) => b.id === ub.badgeId),
      })),
      totalUnlockedCount: allUnlocked.length
    });
  } catch (error) {
    console.error('[POST_EVALUATE_BADGES_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
