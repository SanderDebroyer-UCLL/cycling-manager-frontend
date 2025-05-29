import React from 'react';
import { OrderList } from 'primereact/orderlist';
import { Button } from 'primereact/button';
import { CompetitionStatus } from '@/types/competition';
import { User } from '@/types/user';
import { InputNumber } from 'primereact/inputnumber';

interface SortingPhaseProps {
  competition: {
    id: number;
    competitionStatus: CompetitionStatus;
  };
  usersState: User[];
  handleUsersChange: (users: User[]) => void;
  stompClientRef: React.RefObject<any>;
  itemTemplate: (user: User, index: number) => React.ReactNode;
  handleReserveCyclistCount: (count: number) => void;
  handleCyclistCount: (count: number) => void;
  reserveCyclistCount: number;
  cyclistCount: number;
}

const SortingPhase: React.FC<SortingPhaseProps> = ({
  competition,
  usersState,
  handleUsersChange,
  stompClientRef,
  itemTemplate,
  handleReserveCyclistCount,
  handleCyclistCount,
  reserveCyclistCount,
  cyclistCount,
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
        <div className="flex flex-row gap-10">
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p>Aantal renners per deelnemer</p>
              <InputNumber
                min={1}
                max={50}
                value={cyclistCount}
                onValueChange={(e) =>
                  handleCyclistCount(e.value == null ? 0 : e.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>Aantal reserve renners per deelnemer</p>
              <InputNumber
                min={0}
                max={50}
                value={reserveCyclistCount}
                onValueChange={(e) =>
                  handleReserveCyclistCount(e.value == null ? 0 : e.value)
                }
              />
            </div>
          </div>
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
