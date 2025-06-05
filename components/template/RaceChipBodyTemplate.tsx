import React from 'react';
import {
  CalendarRange,
  Bike,
  Flag,
  Leaf,
  Mountain,
  Flower,
  CalendarCheck,
  LucideBike,
  LeafIcon,
  Crown,
} from 'lucide-react';
import TableChip from '../TableChip';

import type { TableChipProps } from '../TableChip';
import type { CompetitionDTO } from '@/types/competition';
import { parseISO } from 'date-fns';

type ChipType = TableChipProps['type'];

type RaceChip = {
  type: ChipType;
  Icon: React.ElementType;
  displayName: string;
};

// Main logic to return a single chip (priority-based)
const RaceChipBodyTemplate = (
  competition: CompetitionDTO,
): { type: ChipType; Icon: React.ElementType; label: string } | null => {
  for (const race of competition.races) {
    const startDate = parseISO(race.startDate);
    const month = startDate.getMonth() + 1;
    const lowerName = race.name.toLowerCase();
    const niveau = race.niveau?.toUpperCase() || '';

    // Grote Ronde (Grand Tour)
    if (
      lowerName.includes('tour de france') ||
      lowerName.includes('vuelta') ||
      lowerName.includes('giro')
    ) {
      return {
        type: 'tertiary-container',
        Icon: Crown, // Represents mountains & elevation (grand tours)
        label: 'Grote Ronde',
      };
    }

    // Voorjaarskoersen (Spring Classics)
    if ([3, 4, 5].includes(month)) {
      return {
        type: 'secondary-container',
        Icon: Flower, // Symbolizes springtime
        label: 'Voorjaarskoersen',
      };
    }

    // Eindjaarskoersen (End-of-year)
    if ([9, 10, 11].includes(month)) {
      return {
        type: 'surface-variant',
        Icon: Leaf, // Represents end-of-year planning or schedule
        label: 'Eindjaarskoersen',
      };
    }

    // Ronde (Stage race)
    if (niveau.startsWith('2')) {
      return {
        type: 'primary-container',
        Icon: LucideBike, // A cyclist, appropriate for stage races
        label: 'Ronde',
      };
    }
  }

  return null;
};

// PrimeReact body template
const TableChipBodyTemplate = (rowData: { competition: CompetitionDTO }) => {
  const chip = RaceChipBodyTemplate(rowData.competition);

  if (!chip) return <span>-</span>;

  return <TableChip label={chip.label} Icon={chip.Icon} type={chip.type} />;
};

export default TableChipBodyTemplate;
