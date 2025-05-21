import CompetitieLayout from '@/components/competitieLayout';
import {
  fetchCompetitionById,
  updateCompetition,
  updateCompetitionStatus,
} from '@/features/competition/competition.slice';
import { fetchCyclists } from '@/features/cyclists/cyclists.slice';
import {
  fetchUserTeam,
  updateUserTeamCyclists,
} from '@/features/user-teams/user-teams.slice';
import { AppDispatch, RootState } from '@/store/store';
import {
  Competition,
  CompetitionPick,
  CompetitionStatus,
} from '@/types/competition';
import { Cyclist } from '@/types/cyclist';
import { UserTeam } from '@/types/user-team';
import { useRouter } from 'next/router';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, {
  ChangeEvent,
  CSSProperties,
  ReactNode,
  use,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { countryAbbreviationMap } from '@/utils/country-abbreviation-map-lowercase';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { OrderList } from 'primereact/orderlist';
import { User } from '@/types/user';
import { fetchUsers, resetUsersStatus } from '@/features/users/users.slice';
import { Button } from 'primereact/button';

const index = () => {
  const router = useRouter();
  const { competitionId } = router.query;
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    country: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const email = sessionStorage.getItem('email');
  const [usersState, setUsersState] = useState<User[]>([]);
  const [cyclistsState, setCyclistsState] = useState<Cyclist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const usersStatus = useSelector((state: RootState) => state.users.status);
  const userTeamsStatus = useSelector(
    (state: RootState) => state.userTeams.status,
  );
  const cyclistsStatus = useSelector(
    (state: RootState) => state.cyclists.status,
  );
  const cyclists: Cyclist[] = useSelector(
    (state: RootState) => state.cyclists.data,
  );
  const users: User[] = useSelector((state: RootState) => state.users.data);
  const userTeams: UserTeam[] = useSelector(
    (state: any) => state.userTeams.data,
  );
  const competition: Competition = useSelector(
    (state: any) => state.competition.data,
  );
  const competitionRef = useRef<Competition | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    competitionRef.current = competition;
  }, [competition]);

  useEffect(() => {
    if (cyclistsStatus === 'succeeded' && cyclists) {
      const filteredCyclists = cyclists.filter((cyclist) => {
        return !userTeams.some((userTeam: UserTeam) =>
          userTeam.cyclists.some(
            (teamCyclist) => teamCyclist.name.trim() === cyclist.name.trim(),
          ),
        );
      });
      setCyclistsState(filteredCyclists);
    }
  }, [cyclists, userTeams, cyclistsStatus]);

  useEffect(() => {
    if (usersStatus === 'succeeded' && competition) {
      const sortedUsers = competition.competitionPicks
        .slice() // clone the array to avoid mutating the original (which is read-only)
        .sort((a, b) => a.pickOrder - b.pickOrder)
        .map((pick: CompetitionPick) => {
          return users.find((user) => user.id === pick.userId) || null;
        })
        .filter((user): user is User => user !== null);

      setUsersState(sortedUsers);
      resetUsersStatus();
    }
  }, [competition && competition.competitionPicks, usersStatus, users]);

  useEffect(() => {
    if (!users || usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [users]);

  useEffect(() => {
    if (!cyclists || cyclistsStatus === 'idle') {
      dispatch(fetchCyclists());
    }
  }, [userTeams]);

  useEffect(() => {
    if (!userTeams || userTeamsStatus === 'idle') {
      dispatch(fetchUserTeam());
    }
  }, [userTeams]);

  useEffect(() => {
    if (cyclistsStatus === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [cyclistsStatus]);

  useEffect(() => {
    if (
      (!competition && competitionId) ||
      (competition &&
        competitionId &&
        competition.id.toString().trim() !== competitionId.toString().trim())
    ) {
      dispatch(fetchCompetitionById(competitionId.toString()));
    }
  }, [dispatch, competition, competitionId]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe('/topic/picks', (message) => {
          const pick: {
            cyclistName: string;
            email: string;
            competitionId: string;
          } = JSON.parse(message.body);

          if (!competitionRef.current) {
            return;
          }
          pick.competitionId = competitionRef.current.id;
          dispatch(updateUserTeamCyclists(pick));
        });
        stompClient.subscribe('/topic/order', (message) => {
          const order: {
            competitionPicks: CompetitionPick[];
            competitionId: string;
          } = JSON.parse(message.body);

          if (!competitionRef.current) {
            return;
          }
          order.competitionPicks = order.competitionPicks.map((pick) => ({
            ...pick,
            userId: pick.userId,
          }));
          order.competitionId = competitionRef.current.id;
          dispatch(updateCompetition(order));
        });
        stompClient.subscribe('/topic/status', (message) => {
          const parsed = JSON.parse(message.body);
          const competitionStatus: CompetitionStatus = parsed.status; // Extract the value
          console.log('Received competition status update:', competitionStatus);

          if (!competitionRef.current) {
            return;
          }

          dispatch(updateCompetitionStatus(competitionStatus));
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const container: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#e9eff5', // Equivalent to Tailwind's surface-200 (approximate)
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // shadow-md approximation
    borderRadius: '0.5rem', // rounded-lg
    padding: '1rem', // p-4
    gap: '0.5rem', // gap-2
  };

  const handleUsersChange = (users: User[]) => {
    setUsersState(users);
    stompClientRef.current?.publish({
      destination: '/app/order',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        users: users.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        })),
        competitionId: competition.id,
      }),
    });
  };

  const onGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    );
  };

  const itemTemplate = (user: User, index: number) => {
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

  const countryBodyTemplate = (rowData: Cyclist) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt="flag"
          src={`https://flagcdn.com/w40/${countryAbbreviationMap[rowData.country]}.png`}
          style={{ height: '20px', borderRadius: '2px' }}
        />
        <span>{rowData.country}</span>
      </div>
    );
  };

  const header = renderHeader();

  if (!competition || userTeams === null || userTeams.length === 0) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-surface-100 z-9999">
        <ProgressSpinner
          style={{ width: '100px', height: '100px' }}
          strokeWidth="8"
          className="stroke-primary-500"
          animationDuration=".5s"
        />
      </div>
    );
  }

  if (competition.competitionStatus === CompetitionStatus.SORTING) {
    return (
      <>
        <div className="flex flex-col gap-12 py-12 px-8 w-full">
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
              header="Users"
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
  }

  if (competition.competitionStatus === CompetitionStatus.SELECTING) {
    return (
      <div className="flex flex-col gap-12 py-12 px-8 w-full">
        <div style={container}>
          <DataTable
            header={header}
            paginator
            rows={5}
            selectionMode="single"
            onSelectionChange={(e) => {
              stompClientRef.current?.publish({
                destination: '/app/pick',
                body: JSON.stringify({
                  cyclistId: e.value.id,
                  email,
                  competitionId: competition.id,
                }),
              });
            }}
            dataKey="id"
            filters={filters}
            loading={loading}
            globalFilterFields={['name', 'country', 'team']}
            emptyMessage="No customers found."
            value={cyclistsState}
            tableStyle={{ width: '100%' }}
          >
            <Column header="Naam" field="name" />
            <Column
              header="Country"
              filterField="country.name"
              style={{ minWidth: '12rem' }}
              body={countryBodyTemplate}
            />
            <Column header="Ranking" field="ranking" />
          </DataTable>
        </div>
        <div className="flex gap-8">
          {userTeams.length > 0 &&
            userTeams
              .filter(
                (userTeam: UserTeam) =>
                  userTeam.competitionId === competition.id,
              )
              .map((userTeam: UserTeam) => (
                <div key={userTeam.id} style={container}>
                  <h2 className="text-xl font-bold">{userTeam.name}</h2>
                  {userTeam.cyclists.map((cyclist: Cyclist) => (
                    <div key={cyclist.name} className="flex items-center gap-2">
                      <span>{cyclist.name}</span>
                    </div>
                  ))}
                </div>
              ))}
        </div>
        <div className="flex justify-between">
          <Button
            label="Terug"
            severity="secondary"
            outlined
            onClick={() =>
              stompClientRef.current?.publish({
                destination: '/app/status',
                headers: {
                  'content-type': 'application/json',
                },
                body: JSON.stringify({
                  status: CompetitionStatus.SORTING,
                  competitionId: competition.id,
                }),
              })
            }
          />

          <Button
            label="Klaar"
            disabled={userTeams
              .filter(
                (userTeam: UserTeam) =>
                  userTeam.competitionId == competition.id,
              )
              .some((userTeam) => userTeam.cyclists.length < 20)}
            onClick={() =>
              stompClientRef.current?.publish({
                destination: '/app/status',
                headers: {
                  'content-type': 'application/json',
                },
                body: JSON.stringify({
                  status: CompetitionStatus.STARTED,
                  competitionId: competition.id,
                }),
              })
            }
          />
        </div>
      </div>
    );
  }

  if (competition.competitionStatus === CompetitionStatus.STARTED) {
    return (
      <>
        <div className="flex flex-col gap-12 py-12 px-8 w-full">
          <div className="flex flex-col gap-6">
            <h2 className=" text-xl font-bold">Mijn team</h2>
          </div>
        </div>
      </>
    );
  }
};

index.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);

export default index;
