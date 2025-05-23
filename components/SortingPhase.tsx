import React from 'react';
import { OrderList } from 'primereact/orderlist';
import { Button } from 'primereact/button';
import { CompetitionStatus } from '@/types/competition';
import { User } from '@/types/user';

interface SortingPhaseProps {
  competition: {
    id: string;
    competitionStatus: CompetitionStatus;
  };
  usersState: User[];
  handleUsersChange: (users: User[]) => void;
  stompClientRef: React.RefObject<any>;
  itemTemplate: (user: User, index: number) => React.ReactNode;
}

const SortingPhase: React.FC<SortingPhaseProps> = ({
  competition,
  usersState,
  handleUsersChange,
  stompClientRef,
  itemTemplate,
}) => {
  if (competition.competitionStatus !== CompetitionStatus.SORTING) return null;

  return (
    <>
      <div className="flex flex-col gap-12 w-full">
        <div className="flex flex-col gap-6">
          <h2 className=" text-xl font-bold">
            Bepaal de volgorde van het kiezen van de renners
          </h2>
        </div>
        <div className="flex w-[400px]">
          <OrderList
            dataKey="id"
            value={usersState}
            onChange={(e) => handleUsersChange(e.value)}
            itemTemplate={(user) =>
              itemTemplate(
                user,
                usersState.findIndex((u) => u.id === user.id),
              )
            }
            header="Deelnemers"
            dragdrop
          ></OrderList>
        </div>
        <div className="flex justify-between">
          <div></div>
          <Button
            label="Volgende"
            onClick={() =>
              stompClientRef.current?.publish({
                destination: '/app/status',
                headers: {
                  'content-type': 'application/json',
                },
                body: JSON.stringify({
                  status: CompetitionStatus.SELECTING,
                  competitionId: competition.id,
                }),
              })
            }
          />
        </div>
      </div>
    </>
  );
};

export default SortingPhase;
