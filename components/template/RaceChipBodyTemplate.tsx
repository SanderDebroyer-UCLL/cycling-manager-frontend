import React from 'react';
import {
  CalendarRange,
  Bike,
  Flag,
  Leaf,
  Flower,
  LucideBike,
  LeafIcon,
  Crown,
  Timer,
  Globe,
  MapIcon,
  CalendarDays,
  Landmark,
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
        Icon: Crown,
        label: 'Grote Ronde',
      };
    }

    // Klassiekers (Monuments & big one-day classics)
    if (
      lowerName.includes('paris-roubaix') ||
      lowerName.includes('ronde van vlaanderen') ||
      lowerName.includes('milan-san remo') ||
      lowerName.includes('milano-sanremo') ||
      lowerName.includes('liège-bastogne-liège') ||
      lowerName.includes('liege-bastogne-liege') ||
      lowerName.includes('il lombardia') ||
      lowerName.includes('lombardia')
    ) {
      return {
        type: 'surface-container-high',
        Icon: Landmark,
        label: 'Klassieker',
      };
    }

    // Wereldkampioenschap (World Championship)
    if (niveau === 'WC') {
      return {
        type: 'primary',
        Icon: Globe,
        label: 'Wereldkampioenschap',
      };
    }

    // Continentaal Kampioenschap (Continental Championship)
    if (niveau === 'CC') {
      return {
        type: 'secondary',
        Icon: MapIcon,
        label: 'Continentaal Kampioenschap',
      };
    }

    // Voorjaarskoersen (Spring Classics)
    if ([3, 4, 5].includes(month)) {
      return {
        type: 'surface-container-low',
        Icon: Flower,
        label: 'Voorjaarskoersen',
      };
    }

    // Eindjaarskoersen (End-of-year races)
    if ([9, 10, 11].includes(month)) {
      return {
        type: 'surface-variant',
        Icon: Leaf,
        label: 'Eindjaarskoersen',
      };
    }

    // Ronde (Stage race)
    if (niveau.startsWith('2')) {
      return {
        type: 'primary-container',
        Icon: LucideBike,
        label: 'Ronde',
      };
    }

    // Tijdrit (Time Trial)
    if (
      lowerName.includes('itt') ||
      lowerName.includes('chrono') ||
      lowerName.includes('time trial')
    ) {
      return {
        type: 'secondary-container',
        Icon: Timer,
        label: 'Tijdrit',
      };
    }
  }

  // Fallback for all other races (e.g., random one-day events)
  return {
    type: 'surface-container-low',
    Icon: CalendarDays, // Or any icon that fits "misc. race"
    label: 'Overige Wedstrijden',
  };
};

// PrimeReact body template
const TableChipBodyTemplate = (rowData: { competition: CompetitionDTO }) => {
  const chip = RaceChipBodyTemplate(rowData.competition);

  if (!chip) return <span>-</span>;

  return <TableChip label={chip.label} Icon={chip.Icon} type={chip.type} />;
};

export default TableChipBodyTemplate;
