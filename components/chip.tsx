import React from 'react';

type ChipProps = {
  label: string;
  Icon: React.ElementType;
  active: boolean;
  onClick: () => void;
};

const Chip: React.FC<ChipProps> = ({ label, Icon, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden group
    ${active ? '!bg-primary !text-on-primary' : ''}
    font-semibold flex items-center select-none
    bg-primary-container text-on-primary-container
    px-4 py-2 cursor-pointer rounded-xl transition-all
    before:absolute before:inset-0 before:bg-on-secondary-container before:opacity-0 before:transition-opacity before:duration-200
    hover:before:opacity-[0.08]
  `}
    >
      <Icon
        className={`${
          active ? '!stroke-primary-container' : ''
        } w-4 h-4 mr-2 stroke-primary stroke-3`}
      />
      <span className="relative z-10">{label}</span>
    </div>
  );
};

export default Chip;
