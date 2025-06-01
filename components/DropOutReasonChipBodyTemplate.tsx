import React from 'react';
import {
  UserX,
  Ban,
  Clock,
  Wrench,
  X,
  HelpCircle,
} from 'lucide-react';
import TableChip from './TableChip'; // Adjust the import path as needed
import { DropOutReason } from '@/types/cyclist';

const getDropOutReasonChipProps = (reason: string) => {
  const upperReason = reason?.toUpperCase();

  switch (upperReason) {
    case DropOutReason.DNS:
    case DropOutReason.NP:
      return {
        type: 'surface-variant' as const, // Light gray - neutral, didn't start
        Icon: UserX,
        displayName: 'Niet gestart',
      };

    case DropOutReason.DNF:
    case DropOutReason.AB:
      return {
        type: 'error' as const, // Red - stopped during race
        Icon: X,
        displayName: 'Opgegeven',
      };

    case DropOutReason.DSQ:
      return {
        type: 'error' as const, // Red - serious violation
        Icon: Ban,
        displayName: 'Gediskwalificeerd',
      };

    case DropOutReason.OTL:
    case DropOutReason.HD:
      return {
        type: 'tertiary-container' as const, // Light orange - time related
        Icon: Clock,
        displayName: 'Buiten tijd',
      };

    case DropOutReason.DF:
      return {
        type: 'secondary-container' as const, // Light blue - technical/health
        Icon: Wrench,
        displayName: 'Defect/Medisch',
      };

    default:
      return {
        type: 'outline' as const, // Neutral outline for unknown reasons
        Icon: HelpCircle,
        displayName: reason || 'Onbekend',
      };
  }
};

// PrimeReact body template for dropout reason column
const DropOutReasonChipBodyTemplate = (rowData: any) => {
  // Extract the dropout reason field from the row data
  const dropoutReason =
    rowData.dnsReason || rowData.dropoutReason || rowData.reason;

  if (!dropoutReason) {
    return <span>-</span>;
  }

  const chipProps = getDropOutReasonChipProps(dropoutReason);

  return (
    <TableChip
      label={chipProps.displayName}
      Icon={chipProps.Icon}
      type={chipProps.type}
    />
  );
};

export default DropOutReasonChipBodyTemplate;
