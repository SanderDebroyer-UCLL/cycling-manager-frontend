import React from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary';

type ChipProps = {
  label: string;
  Icon: React.ElementType;
  active: boolean;
  onClick: () => void;
  variant: Variant;
};

const variantStyles = {
  primary: {
    base: 'bg-primary-container text-on-primary-container hover:before:bg-on-primary-container',
    active: '!bg-primary !text-on-primary',
    icon: {
      base: 'stroke-primary',
      active: '!stroke-primary-container',
    },
  },
  secondary: {
    base: 'bg-secondary-container text-on-secondary-container hover:before:bg-on-secondary-container',
    active: '!bg-secondary !text-on-secondary',
    icon: {
      base: 'stroke-secondary',
      active: '!stroke-secondary-container',
    },
  },
  tertiary: {
    base: 'bg-tertiary-container text-on-tertiary-container hover:before:bg-on-tertiary-container',
    active: '!bg-tertiary !text-on-tertiary',
    icon: {
      base: 'stroke-tertiary',
      active: '!stroke-tertiary-container',
    },
  },
};

const Chip: React.FC<ChipProps> = ({
  label,
  Icon,
  active,
  onClick,
  variant = 'secondary',
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden group
        font-semibold flex items-center select-none
        px-4 py-2 cursor-pointer rounded-xl transition-all
        before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-200
        hover:before:opacity-[0.08]
        ${styles.base} ${active ? styles.active : ''}
      `}
    >
      <Icon
        className={`${active ? styles.icon.active : ''} w-4 h-4 mr-2 ${styles.icon.base} stroke-3`}
      />
      <span className="relative z-10">{label}</span>
    </div>
  );
};

export default Chip;
