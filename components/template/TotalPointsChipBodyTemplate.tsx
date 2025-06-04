import React from 'react';
import {
  Crown,
  Trophy,
  Medal,
  Award,
  Star,
  TrendingUp,
  Circle,
  Minus,
} from 'lucide-react';
import TableChip from '../TableChip'; // Adjust the import path as needed
import { CompetitionDTO } from '@/types/competition';

// Utility to calculate number of events in the competition
const getNumberOfEvents = (competition: any): number => {
  const hasStages = competition?.races?.[0]?.stages?.length > 0;
  return hasStages
    ? competition.races[0].stages.length
    : competition.races.length;
};

// Dynamic point-based categorization based on number of events
const getPointsChipProps = (points: number, competition: any) => {
  const eventCount = getNumberOfEvents(competition);
  const maxPoints = eventCount * 150;

  // Define dynamic thresholds
  const thresholds = {
    excellent: maxPoints * 0.9, // 90–100%
    veryGood: maxPoints * 0.75, // 75–90%
    good: maxPoints * 0.5, // 50–75%
    average: maxPoints * 0.25, // 25–50%
    belowAverage: maxPoints * 0.05, // 5–25%
    low: 1, // 1–5%
  };

  if (points >= thresholds.excellent) {
    return {
      type: 'primary' as const,
      Icon: Crown,
      displayName: `${points} pts`,
      category: 'Excellent',
    };
  }

  if (points >= thresholds.veryGood) {
    return {
      type: 'primary-container' as const,
      Icon: Trophy,
      displayName: `${points} pts`,
      category: 'Very Good',
    };
  }

  if (points >= thresholds.good) {
    return {
      type: 'secondary' as const,
      Icon: Medal,
      displayName: `${points} pts`,
      category: 'Good',
    };
  }

  if (points >= thresholds.average) {
    return {
      type: 'secondary-container' as const,
      Icon: Award,
      displayName: `${points} pts`,
      category: 'Average',
    };
  }

  if (points >= thresholds.belowAverage) {
    return {
      type: 'tertiary-container' as const,
      Icon: Star,
      displayName: `${points} pts`,
      category: 'Below Average',
    };
  }

  if (points >= thresholds.low) {
    return {
      type: 'surface-container-high' as const,
      Icon: TrendingUp,
      displayName: `${points} pts`,
      category: 'Low',
    };
  }

  if (points === 0) {
    return {
      type: 'surface-variant' as const,
      Icon: Circle,
      displayName: '0 pts',
      category: 'No Points',
    };
  }

  return {
    type: 'outline' as const,
    Icon: Minus,
    displayName: `${points} pts`,
    category: 'Negative',
  };
};

// Body template for points column with dynamic competition context
const PointsChipBodyTemplate =
  (competition: CompetitionDTO) => (rowData: any) => {
    const points = rowData.points;

    if (points === undefined || points === null) {
      return <span>-</span>;
    }

    const chipProps = getPointsChipProps(points, competition);

    return (
      <TableChip
        label={chipProps.displayName}
        Icon={chipProps.Icon}
        type={chipProps.type}
      />
    );
  };

export { PointsChipBodyTemplate };
export default PointsChipBodyTemplate;
