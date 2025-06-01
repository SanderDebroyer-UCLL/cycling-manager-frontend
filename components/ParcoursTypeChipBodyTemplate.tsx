import React from 'react';
import {
  Mountain,
  TrendingUp,
  Minus,
  TriangleAlert,
  Waves,
  ArrowUpRight,
} from 'lucide-react';
import TableChip from './TableChip'; // Adjust the import path as needed
import { ParcoursType } from '@/types/race';

// Function to categorize and style cycling stage types using Material Design 3 colors
const getStageTypeChipProps = (parcoursType: string) => {
  const upperType = parcoursType.toUpperCase();

  switch (upperType) {
    case ParcoursType.FLAT:
      return {
        type: 'surface-variant' as const, // Light gray background with good contrast
        Icon: Minus,
        displayName: 'Flat',
      };

    case ParcoursType.HILLY:
      return {
        type: 'secondary-container' as const, // Soft blue background
        Icon: TrendingUp,
        displayName: 'Hilly',
      };

    case ParcoursType.HILLY_HILL_FINISH:
      return {
        type: 'secondary' as const, // Darker blue for finish stages
        Icon: ArrowUpRight,
        displayName: 'Hilly Finish',
      };

    case ParcoursType.MOUNTAIN:
      return {
        type: 'primary-container' as const, // Light primary blue
        Icon: Mountain,
        displayName: 'Mountain',
      };

    case ParcoursType.MOUNTAIN_HILL_FINISH:
      return {
        type: 'primary' as const, // Strong primary blue for most challenging
        Icon: TriangleAlert,
        displayName: 'Mountain Finish',
      };

    default:
      return {
        type: 'outline' as const, // Neutral outline style for unknown types
        Icon: Minus,
        displayName: parcoursType,
      };
  }
};

// PrimeReact body template for stage type column
const StageTypeChipBodyTemplate = (rowData: any) => {
  // Extract the parcoursType field from the row data
  const parcoursType = rowData.parcoursType;

  if (!parcoursType) {
    return <span>-</span>;
  }

  const chipProps = getStageTypeChipProps(parcoursType);

  return (
    <TableChip
      label={chipProps.displayName}
      Icon={chipProps.Icon}
      type={chipProps.type}
    />
  );
};

export default StageTypeChipBodyTemplate;
