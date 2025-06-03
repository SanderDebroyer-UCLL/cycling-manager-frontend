import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { resetCompetitionStatus } from '@/features/competition/competition.slice';
import { resetCyclistsStatus } from '@/features/cyclists/cyclists.slice';
import { resetPointsStatus } from '@/features/points/points.slice';
import { resetRaceResultsStatus } from '@/features/race-results/race-results.slice';
import { resetRaceStatus } from '@/features/race/race.slice';
import { resetStageResultsStatus } from '@/features/stage-results/stage-results.slice';
import { resetUserTeamsStatus } from '@/features/user-teams/user-teams.slice';

// Extract competition ID from a route like /competities/1/mijn-team
const getCompetitionIdFromPath = (path: string) => {
  const match = path.match(/^\/competities\/(\d+)/);
  return match ? match[1] : null;
};

const isCompetitionRoute = (path: string) => {
  return /^\/competities(\/|$)/.test(path);
};

export function CompetitionRouteWatcher() {
  const router = useRouter();
  const dispatch = useDispatch();
  const lastCompetitionId = useRef<string | null>(null);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const currentCompetitionId = getCompetitionIdFromPath(url);

      // ONLY reset when switching from one competition to another
      if (
        lastCompetitionId.current &&
        currentCompetitionId &&
        lastCompetitionId.current !== currentCompetitionId
      ) {
        dispatch(resetPointsStatus());
        dispatch(resetStageResultsStatus());
        dispatch(resetRaceResultsStatus());
        dispatch(resetRaceStatus());
        dispatch(resetCompetitionStatus());
        dispatch(resetUserTeamsStatus());
        dispatch(resetCyclistsStatus());
      }

      // Update the last known competition ID (only when in a competition)
      if (currentCompetitionId) {
        lastCompetitionId.current = currentCompetitionId;
      }
    };

    // Initialize with current competition ID
    const initialCompetitionId = getCompetitionIdFromPath(router.asPath);
    if (initialCompetitionId) {
      lastCompetitionId.current = initialCompetitionId;
    }

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router, dispatch]);

  return null;
}
