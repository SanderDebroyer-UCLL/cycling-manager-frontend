import { UserDTO } from '@/types/user';
import React from 'react';

const ItemTemplate = (user: UserDTO, index: number) => {
  return (
    <div className="flex flex-wrap p-2 align-items-center gap-3">
      <span className="w-6 text-right font-bold text-primary-500">
        {index + 1}.
      </span>
      <div className="flex-1 flex flex-column gap-2 xl:mr-8">
        <span className="font-bold">{user.firstName}</span>
        <span className="font-bold">{user.lastName}</span>
      </div>
    </div>
  );
};

export default ItemTemplate;
