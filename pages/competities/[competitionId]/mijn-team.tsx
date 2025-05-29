import CompetitieLayout from '@/components/competitieLayout';
import {
  fetchCompetitionById,
  updateCompetition,
  updateCompetitionPick,
  updateCompetitionStatus,
  updateCyclistCount,
  updateReserveCyclistCount,
} from '@/features/competition/competition.slice';
import { fetchCyclists } from '@/features/cyclists/cyclists.slice';
import {
  fetchUserTeam,
  postUpdateUserTeamMainCyclists,
  removeCyclistFromUserTeamCylists,
  setUserTeams,
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
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { countryAbbreviationMap } from '@/utils/country-abbreviation-map-lowercase';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { User } from '@/types/user';
import { fetchUsers, resetUsersStatus } from '@/features/users/users.slice';
import { confirmPopup } from 'primereact/confirmpopup';
import SelectingPhase from '@/components/SelectingPhase';
import SortingPhase from '@/components/SortingPhase';
import { container } from '@/const/containerStyle';
import StartedPhase from '@/components/StartedPhase';
import {
  fetchStagePointsForAllStages,
  setStagePointsPerCyclist,
  updateStagePointsPerCyclist,
} from '@/features/stage-points/stage-points.slice';
import { UserPlus, UserX } from 'lucide-react';
import { StagePointsPerCyclist } from '@/types/stage-points';
import { Button } from 'primereact/button';
import LoadingOverlay from '@/components/LoadingOverlay';

const index = () => {
  const router = useRouter();
  const { competitionId } = router.query;
  const [usersState, setUsersState] = useState<User[]>([]);
  const [cyclistsState, setCyclistsState] = useState<Cyclist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCyclist, setSelectedCyclist] = useState<Cyclist | null>(null);
  const [reserveCyclistCount, setReserveCyclistCount] = useState<number>(0);
  const [cyclistCount, setCyclistCount] = useState<number>(0);
  const [mainTeamPopupVisible, setMainTeamPopupVisible] =
    useState<boolean>(false);
  const [confirmTarget, setConfirmTarget] = useState<Element | null>(null);
  const [initialStagePoints, setInitialStagePoints] = useState<
    StagePointsPerCyclist[] | null
  >(null);
  const [initialUserTeams, setInitialUserTeams] = useState<UserTeam[] | null>(
    null,
  );
  const [teamChanged, setTeamChanged] = useState<boolean>(false);
  const usersStatus = useSelector((state: RootState) => state.users.status);
  const userTeamsStatus = useSelector(
    (state: RootState) => state.userTeams.status,
  );
  const cyclistsStatus = useSelector(
    (state: RootState) => state.cyclists.status,
  );
  const stagePointsStatus = useSelector(
    (state: RootState) => state.stagePoints.status,
  );
  const stagePoints = useSelector(
    (state: RootState) => state.stagePoints.stagePointsPerCyclist,
  );
  const cyclists: Cyclist[] = useSelector(
    (state: RootState) => state.cyclists.data,
  );
  const user: User | null = useSelector((state: RootState) => state.user.data);
  const users: User[] = useSelector((state: RootState) => state.users.data);
  const userTeams: UserTeam[] = useSelector(
    (state: any) => state.userTeams.data,
  );
  const competition: Competition = useSelector(
    (state: any) => state.competition.data,
  );
  const competitionRef = useRef<Competition | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  const email = sessionStorage.getItem('email');
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    competitionRef.current = competition;
  }, [competition]);

  useEffect(() => {
    // Only set once, when data is first fetched and initial copy is not set yet
    if (stagePoints && stagePoints.length > 0 && !initialStagePoints) {
      setInitialStagePoints(stagePoints);
    }
    if (userTeams && userTeams.length > 0 && !initialUserTeams) {
      setInitialUserTeams(userTeams);
    }
  }, [stagePoints, initialStagePoints, userTeams, initialUserTeams]);

  useEffect(() => {
    if (stagePoints.length === 0 || stagePointsStatus === 'idle') {
      if (!user || !user.id || !competition || !competition.id) {
        return;
      }
      dispatch(
        fetchStagePointsForAllStages({
          competitionId: competition.id,
          userId: user.id,
        }),
      );
    }
  }, [dispatch, stagePoints, stagePointsStatus, user, competition]);

  useEffect(() => {
    if (cyclistsStatus === 'succeeded' && cyclists) {
      const filteredCyclists = cyclists.filter((cyclist) => {
        return !userTeams.some(
          (userTeam: UserTeam) =>
            userTeam.mainCyclists.some(
              (teamCyclist) => teamCyclist.name.trim() === cyclist.name.trim(),
            ) ||
            userTeam.reserveCyclists?.some(
              (reserveCyclist) =>
                reserveCyclist.name.trim() === cyclist.name.trim(),
            ),
        );
      });
      setCyclistsState(filteredCyclists);
    }
  }, [cyclists, userTeams, cyclistsStatus]);

  useEffect(() => {
    if (
      competition &&
      competition.maxMainCyclists &&
      competition.maxReserveCyclists
    ) {
      setCyclistCount(competition.maxMainCyclists);
      setReserveCyclistCount(competition.maxReserveCyclists);
    }
  }, [competition]);

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
        competition.id !==
          Number(
            Array.isArray(competitionId) ? competitionId[0] : competitionId,
          ))
    ) {
      dispatch(fetchCompetitionById(competition.id));
    }
  }, [dispatch, competition, competitionId]);

  useEffect(() => {
    const socket = new SockJS(process.env.NEXT_PUBLIC_API_URL + '/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe('/topic/picks', (message) => {
          const pick: {
            cyclistName: string;
            email: string;
            currentPick: number;
            competitionId: number;
            maxCyclists: number;
          } = JSON.parse(message.body);

          if (!competitionRef.current) {
            return;
          }
          pick.competitionId = competitionRef.current.id;
          pick.maxCyclists = competitionRef.current.maxMainCyclists;
          dispatch(updateCompetitionPick(pick.currentPick));
          dispatch(updateUserTeamCyclists(pick));
        });
        stompClient.subscribe('/topic/order', (message) => {
          const order: {
            competitionPicks: CompetitionPick[];
            competitionId: number;
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

          if (!competitionRef.current) {
            return;
          }

          dispatch(updateCompetitionStatus(competitionStatus));
        });
        stompClient.subscribe('/topic/count', (message) => {
          const parsed = JSON.parse(message.body);

          if (!competitionRef.current) {
            return;
          }

          dispatch(updateCyclistCount(parsed.maxMainCyclists));
          dispatch(updateReserveCyclistCount(parsed.maxReserveCyclists));
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    const isEqual =
      JSON.stringify(initialStagePoints) === JSON.stringify(stagePoints);
    setTeamChanged(!isEqual);
  }, [initialStagePoints, stagePoints]);

  useEffect(() => {
    if (
      competition &&
      userTeams.every(
        (team: UserTeam) =>
          team.mainCyclists.length === competition.maxMainCyclists,
      )
    ) {
      setMainTeamPopupVisible(true);
    } else {
      setMainTeamPopupVisible(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCyclist && confirmTarget) {
      confirmPopup({
        target: confirmTarget as HTMLElement,
        message: `Ben je zeker dat je ${selectedCyclist.name} wilt kiezen?`,
        icon: 'pi pi-exclamation-triangle',
        defaultFocus: 'accept',
        accept: () => {
          if (stompClientRef.current === null) {
            return;
          }
          stompClientRef.current?.publish({
            destination: '/app/pick',
            body: JSON.stringify({
              cyclistId: selectedCyclist.id,
              email,
              competitionId: competition.id,
            }),
          });
          setSelectedCyclist(null);
          setConfirmTarget(null);
        },
        reject: () => {
          setSelectedCyclist(null);
          setConfirmTarget(null);
        },
      });
    }
  }, [selectedCyclist, confirmTarget]);

  const handleReserveCyclistCount = (count: number) => {
    setReserveCyclistCount(count);
    const client = stompClientRef.current;

    if (!client || !client.connected) {
      console.warn('STOMP client not connected yet.');
      return;
    }
    if (stompClientRef.current === null) {
      return;
    }
    stompClientRef.current?.publish({
      destination: '/app/count',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        maxMainCyclists: cyclistCount,
        maxReserveCyclists: count,
        competitionId: competition.id,
      }),
    });
  };

  const handleCyclistCount = (count: number) => {
    setCyclistCount(count);
    const client = stompClientRef.current;

    if (!client || !client.connected) {
      console.warn('STOMP client not connected yet.');
      return;
    }

    client.publish({
      destination: '/app/count',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        maxMainCyclists: count,
        maxReserveCyclists: reserveCyclistCount,
        competitionId: competition.id,
      }),
    });
  };

  const handleUsersChange = (users: User[]) => {
    setUsersState(users);
    if (stompClientRef.current === null) {
      return;
    }
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

  const handleDeactivateMain = (
    stagePointsPerCyclist: StagePointsPerCyclist,
  ) => {
    const filteredStagePoints = stagePoints.filter(
      (stagePoint) =>
        stagePoint.cyclistName.trim() !=
        stagePointsPerCyclist.cyclistName.trim(),
    );
    if (!email || !competition.id || !competition.maxMainCyclists) {
      return;
    }
    dispatch(updateStagePointsPerCyclist(filteredStagePoints));
    dispatch(
      updateUserTeamCyclists({
        cyclistName: stagePointsPerCyclist.cyclistName,
        email: email,
        competitionId: competition.id,
        maxCyclists: competition.maxMainCyclists,
        pointsScored: stagePointsPerCyclist.points,
      }),
    );
  };

  const handleActivateReserve = (name: string) => {
    const newStagePoints: StagePointsPerCyclist[] = [
      ...stagePoints,
      {
        cyclistName: name,
        cyclistId: 0,
        points: 0,
        isCyclistActive: false,
        userId: 0,
      },
    ];
    if (!email || !competition.id) {
      return;
    }
    dispatch(updateStagePointsPerCyclist(newStagePoints));
    dispatch(
      removeCyclistFromUserTeamCylists({
        cyclistName: name,
        email: email,
        competitionId: competition.id,
      }),
    );
  };

  const handleSubmitTeamChanges = () => {
    const mainCyclistIds = stagePoints.map(
      (stagePoint) => stagePoint.cyclistId,
    );
    const userTeam = userTeams.find(
      (team) =>
        team.user.email === email && team.competitionId === competition.id,
    );
    if (!userTeam) {
      return;
    }
    const reserveCyclistIds =
      userTeam.reserveCyclists.map((cyclist) => cyclist.id) || [];

    dispatch(
      postUpdateUserTeamMainCyclists({
        mainCyclistIds,
        reserveCyclistIds,
        userTeamId: userTeam.id,
      }),
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

  const handleResetChanges = () => {
    dispatch(setStagePointsPerCyclist(initialStagePoints || []));
    console.log(initialUserTeams);
    dispatch(setUserTeams(initialUserTeams || []));
  };

  const cyclistDeactivateTemplate = (rowData: StagePointsPerCyclist) => {
    if (!rowData.isCyclistActive) {
      return (
        <>
          <Button
            label="Deactiveer"
            severity="danger"
            icon={() => <UserX size={16} className="mr-2 stroke-[2.5]" />}
            raised
            onClick={() => handleDeactivateMain(rowData)}
          />
        </>
      );
    } else {
      return <div></div>;
    }
  };

  const activateCyclistTemplate = (rowData: Cyclist) => {
    const userTeam = userTeams.find((team) =>
      team.reserveCyclists.some((cyclist) => cyclist.name === rowData.name),
    );
    if (
      (userTeam?.reserveCyclists?.length ?? 0) >
        competition.maxReserveCyclists &&
      !initialStagePoints?.find(
        (stagePoint) => stagePoint.cyclistName.trim() === rowData.name.trim(),
      )
    ) {
      return (
        <>
          <Button
            label="Activeer"
            size="small"
            icon={() => <UserPlus size={16} className="mr-2 stroke-[2.5]" />}
            raised
            onClick={() => handleActivateReserve(rowData.name)}
          />
        </>
      );
    } else {
      return <></>;
    }
  };

  if (!competition || userTeams === null || userTeams.length === 0) {
    return <LoadingOverlay />;
  }

  if (competition.competitionStatus === CompetitionStatus.SORTING) {
    return (
      <>
        <SortingPhase
          reserveCyclistCount={reserveCyclistCount}
          cyclistCount={cyclistCount}
          handleReserveCyclistCount={handleReserveCyclistCount}
          handleCyclistCount={handleCyclistCount}
          competition={competition}
          usersState={usersState}
          handleUsersChange={handleUsersChange}
          stompClientRef={stompClientRef}
          itemTemplate={itemTemplate}
        />
      </>
    );
  }

  if (competition.competitionStatus === CompetitionStatus.SELECTING) {
    return (
      <>
        <SelectingPhase
          setMainTeamPopupVisible={setMainTeamPopupVisible}
          mainTeamPopupVisible={mainTeamPopupVisible}
          competition={competition}
          email={email}
          loading={loading}
          cyclistsState={cyclistsState}
          userTeams={userTeams}
          setSelectedCyclist={setSelectedCyclist}
          setConfirmTarget={setConfirmTarget}
          countryBodyTemplate={countryBodyTemplate}
          stompClientRef={stompClientRef}
          container={container}
        />
      </>
    );
  }

  if (competition.competitionStatus === CompetitionStatus.STARTED) {
    return (
      <>
        <StartedPhase
          handleSubmitTeamChanges={handleSubmitTeamChanges}
          cyclistDeactivateTemplate={cyclistDeactivateTemplate}
          resetChanges={() => handleResetChanges()}
          activateCyclistTemplate={activateCyclistTemplate}
          teamChanged={teamChanged}
          userTeams={userTeams}
          stagePoints={stagePoints}
          email={email}
          competition={competition}
        />
      </>
    );
  }
};

index.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);

export default index;
