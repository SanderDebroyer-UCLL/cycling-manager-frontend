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

// Function to categorize and style points based on ranges
const getPointsChipProps = (points: number) => {
  // Excellent performance (top tier)
  if (points >= 100) {
    return {
      type: 'primary' as const,
      Icon: Crown,
      displayName: `${points} pts`,
      category: 'Excellent',
    };
  }

  // Very good performance
  if (points >= 75) {
    return {
      type: 'primary-container' as const,
      Icon: Trophy,
      displayName: `${points} pts`,
      category: 'Very Good',
    };
  }

  // Good performance
  if (points >= 50) {
    return {
      type: 'secondary' as const,
      Icon: Medal,
      displayName: `${points} pts`,
      category: 'Good',
    };
  }

  // Average performance
  if (points >= 25) {
    return {
      type: 'secondary-container' as const,
      Icon: Award,
      displayName: `${points} pts`,
      category: 'Average',
    };
  }

  // Below average performance
  if (points >= 10) {
    return {
      type: 'tertiary-container' as const,
      Icon: Star,
      displayName: `${points} pts`,
      category: 'Below Average',
    };
  }

  // Low performance
  if (points >= 1) {
    return {
      type: 'surface-container-high' as const,
      Icon: TrendingUp,
      displayName: `${points} pts`,
      category: 'Low',
    };
  }

  // No points
  if (points === 0) {
    return {
      type: 'surface-variant' as const,
      Icon: Circle,
      displayName: '0 pts',
      category: 'No Points',
    };
  }

  // Negative points (if applicable)
  return {
    type: 'outline' as const,
    Icon: Minus,
    displayName: `${points} pts`,
    category: 'Negative',
  };
};

// Alternative function with percentile-based categorization
const getPointsChipPropsPercentile = (points: number, allPoints: number[]) => {
  if (allPoints.length === 0) return getPointsChipProps(points);

  const sortedPoints = [...allPoints].sort((a, b) => b - a);
  const rank = sortedPoints.indexOf(points) + 1;
  const percentile = (rank / sortedPoints.length) * 100;

  // Top 10%
  if (percentile <= 10) {
    return {
      type: 'primary' as const,
      Icon: Crown,
      displayName: `${points} pts`,
      category: 'Top 10%',
    };
  }

  // Top 25%
  if (percentile <= 25) {
    return {
      type: 'primary-container' as const,
      Icon: Trophy,
      displayName: `${points} pts`,
      category: 'Top 25%',
    };
  }

  // Top 50%
  if (percentile <= 50) {
    return {
      type: 'secondary' as const,
      Icon: Medal,
      displayName: `${points} pts`,
      category: 'Top 50%',
    };
  }

  // Top 75%
  if (percentile <= 75) {
    return {
      type: 'secondary-container' as const,
      Icon: Award,
      displayName: `${points} pts`,
      category: 'Top 75%',
    };
  }

  // Bottom 25%
  return {
    type: 'surface-variant' as const,
    Icon: Star,
    displayName: `${points} pts`,
    category: 'Bottom 25%',
  };
};

// Body template for points column
const PointsChipBodyTemplate = (rowData: any) => {
  const points = rowData.totalPoints;

  if (points === undefined || points === null) {
    return <span>-</span>;
  }

  const chipProps = getPointsChipProps(points);

  return (
    <TableChip
      label={chipProps.displayName}
      Icon={chipProps.Icon}
      type={chipProps.type}
    />
  );
};

// Body template with percentile-based categorization (requires all data)
const PointsChipBodyTemplatePercentile = (allData: any[]) => (rowData: any) => {
  const points = rowData.points;

  if (points === undefined || points === null) {
    return <span>-</span>;
  }

  const allPoints = allData
    .map((item) => item.points)
    .filter((p) => p !== undefined && p !== null);
  const chipProps = getPointsChipPropsPercentile(points, allPoints);

  return (
    <TableChip
      label={chipProps.displayName}
      Icon={chipProps.Icon}
      type={chipProps.type}
    />
  );
};

// Export both functions
export { PointsChipBodyTemplate, PointsChipBodyTemplatePercentile };
export default PointsChipBodyTemplate;
