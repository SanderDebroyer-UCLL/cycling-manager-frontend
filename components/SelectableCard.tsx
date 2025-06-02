import React from 'react';
import { Flag, Calendar } from 'lucide-react';

type SelectableCardProps = {
  title: string;
  subtitle: string;
  date: string;
  selected: boolean;
  onClick: () => void;
};

const SelectableCard: React.FC<SelectableCardProps> = ({
  title,
  subtitle,
  date,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer font-medium
    bg-primary-fixed text-on-primary-fixed shrink-0 w-72 mb-4 rounded-xl p-5 transition-all
    before:absolute before:inset-0 before:bg-on-surface before:opacity-0 before:transition-opacity
    hover:before:opacity-[0.04]
    ${selected ? '!bg-primary-fixed-dim text-on-primary-fixed' : ''}
  `}
    >
      <p className="font-semibold text-lg flex items-center pb-1">{title}</p>
      <p className="flex items-center gap-2">
        <Flag className="shrink-0 w-4 h-4 stroke-3 stroke-on-primary-fixed-variant" />
        <span className="truncate overflow-hidden whitespace-nowrap">
          {subtitle}
        </span>
      </p>
      <p className="flex items-center gap-2">
        <Calendar className="w-4 h-4 stroke-3 stroke-on-primary-fixed-variant" />
        {date}
      </p>
    </div>
  );
};

export default SelectableCard;
