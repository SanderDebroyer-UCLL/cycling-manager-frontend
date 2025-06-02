import React from 'react';
import {
  Award,
  Star,
  Trophy,
  Medal,
  Crown,
  Globe,
  Zap,
  Shield,
} from 'lucide-react';
import TableChip from './TableChip'; // Adjust the import path as needed

// Function to categorize and style cycling race classifications using Material Design 3 colors
const getCyclingRaceChipProps = (niveau: string) => {
  const upperNiveau = niveau.toUpperCase();

  // UCI World Tour (highest level) - Primary colors
  if (upperNiveau.includes('UWT')) {
    return {
      type: 'primary' as const,
      Icon: Crown,
    };
  }

  // UCI ProSeries - Secondary colors
  if (upperNiveau.includes('PRO')) {
    return {
      type: 'secondary' as const,
      Icon: Trophy,
    };
  }

  // World Championships - Tertiary colors (prestigious)
  if (upperNiveau.includes('WC') || upperNiveau.includes('WORLD')) {
    return {
      type: 'tertiary' as const,
      Icon: Globe,
    };
  }

  // Continental Championships - Secondary variant
  if (upperNiveau.includes('CC') || upperNiveau.includes('CONTINENTAL')) {
    return {
      type: 'secondary-variant' as const,
      Icon: Shield,
    };
  }

  // National Championships - Primary variant
  if (upperNiveau.includes('NC') || upperNiveau.includes('NATIONAL')) {
    return {
      type: 'primary-variant' as const,
      Icon: Star,
    };
  }

  // Category 1 races (1.1, 1.2, etc.) - Surface container high (better contrast)
  if (upperNiveau.match(/^1\.\d/)) {
    return {
      type: 'surface-container-high' as const,
      Icon: Medal,
    };
  }

  // Category 2 races (2.1, 2.2, etc.) - Surface variant (better contrast than surface)
  if (upperNiveau.match(/^2\.\d/)) {
    return {
      type: 'surface-variant' as const,
      Icon: Award,
    };
  }

  // Olympic Games - Tertiary (special event)
  if (upperNiveau.includes('OLYMPIC') || upperNiveau.includes('OG')) {
    return {
      type: 'tertiary' as const,
      Icon: Medal,
    };
  }

  // Grand Tours (specific handling) - Primary (highest prestige)
  if (
    upperNiveau.includes('GT') ||
    upperNiveau.includes('TOUR DE FRANCE') ||
    upperNiveau.includes('GIRO') ||
    upperNiveau.includes('VUELTA')
  ) {
    return {
      type: 'primary' as const,
      Icon: Crown,
    };
  }

  // Monuments/Classics - Primary with special icon
  if (upperNiveau.includes('MONUMENT') || upperNiveau.includes('CLASSIC')) {
    return {
      type: 'primary' as const,
      Icon: Zap,
    };
  }

  // Default fallback for unknown classifications - Use outline for good contrast
  return {
    type: 'outline' as const,
    Icon: Star,
  };
};

// PrimeReact body templates receive the entire row data object
const TableChipBodyTemplate = (rowData: any) => {
  // Extract the niveau field from the row data
  const niveau = rowData.niveau;

  if (!niveau) {
    return <span>-</span>;
  }

  const chipProps = getCyclingRaceChipProps(niveau);

  return (
    <TableChip label={niveau} Icon={chipProps.Icon} type={chipProps.type} />
  );
};

export default TableChipBodyTemplate;
