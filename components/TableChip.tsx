import React from 'react';

type TableChipProps = {
  label: string;
  Icon: React.ElementType;
  type:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'primary-variant'
    | 'secondary-variant'
    | 'surface'
    | 'surface-high'
    | 'surface-variant'
    | 'surface-container'
    | 'surface-container-low'
    | 'surface-container-high'
    | 'surface-container-highest'
    | 'primary-container'
    | 'secondary-container'
    | 'tertiary-container'
    | 'outline'
    | 'error';
};

const TableChip: React.FC<TableChipProps> = ({ label, Icon, type }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'primary':
        return 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]';
      case 'secondary':
        return 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]';
      case 'tertiary':
        return 'bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)]';
      case 'primary-variant':
        return 'bg-[var(--color-primary-fixed-dim)] text-[var(--color-on-primary-fixed-variant)]';
      case 'secondary-variant':
        return 'bg-[var(--color-secondary-fixed-dim)] text-[var(--color-on-secondary-fixed-variant)]';
      case 'surface':
        return 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]';
      case 'surface-high':
        return 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)]';
      case 'surface-variant':
        return 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]';
      case 'surface-container':
        return 'bg-[var(--color-surface-container)] text-[var(--color-on-surface)]';
      case 'surface-container-low':
        return 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)]';
      case 'surface-container-high':
        return 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)]';
      case 'surface-container-highest':
        return 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)]';
      case 'primary-container':
        return 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]';
      case 'secondary-container':
        return 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]';
      case 'tertiary-container':
        return 'bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)]';
      case 'outline':
        return 'bg-transparent text-[var(--color-on-surface)] border border-[var(--color-outline)]';
      case 'error':
        return 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]';
      default:
        return 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]';
    }
  };
  const getIconStyles = () => {
    switch (type) {
      case 'primary':
        return 'stroke-[var(--color-primary)]';
      case 'secondary':
        return 'stroke-[var(--color-secondary)]';
      case 'tertiary':
        return 'stroke-[var(--color-tertiary)]';
      case 'primary-variant':
        return 'stroke-[var(--color-primary-fixed)]';
      case 'secondary-variant':
        return 'stroke-[var(--color-secondary-fixed)]';
      case 'surface':
        return 'stroke-[var(--color-on-surface-variant)]';
      case 'surface-high':
        return 'stroke-[var(--color-on-surface)]';
      case 'surface-variant':
        return 'stroke-[var(--color-on-surface-variant)]';
      case 'surface-container':
        return 'stroke-[var(--color-on-surface)]';
      case 'surface-container-low':
        return 'stroke-[var(--color-on-surface)]';
      case 'surface-container-high':
        return 'stroke-[var(--color-on-surface)]';
      case 'surface-container-highest':
        return 'stroke-[var(--color-on-surface)]';
      case 'primary-container':
        return 'stroke-[var(--color-primary)]';
      case 'secondary-container':
        return 'stroke-[var(--color-secondary)]';
      case 'tertiary-container':
        return 'stroke-[var(--color-tertiary)]';
      case 'outline':
        return 'stroke-[var(--color-outline)]';
      case 'error':
        return 'stroke-[var(--color-on-error-container)]';
      default:
        return 'stroke-[var(--color-on-primary-container)]';
    }
  };
  return (
    <div
      className={`
        font-semibold flex items-center select-none
        ${getTypeStyles()}
        px-4 py-2 rounded-xl duration-200 w-fit
      `}
    >
      <Icon className={`w-4 h-4 mr-2 ${getIconStyles()} stroke-2`} />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default TableChip;
