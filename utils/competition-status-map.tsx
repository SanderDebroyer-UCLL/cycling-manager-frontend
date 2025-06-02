import { CompetitionStatus } from '@/types/competition';

export const getCompetitionStatusSubtext = (
  status: CompetitionStatus,
): string => {
  const subtexts: Record<CompetitionStatus, string> = {
    [CompetitionStatus.SORTING]: 'De kalme voor de storm',
    [CompetitionStatus.SELECTING]: 'Kies je droomteam samen',
    [CompetitionStatus.STARTED]: 'De wielen zijn in beweging!',
  };

  return subtexts[status] || '';
};
