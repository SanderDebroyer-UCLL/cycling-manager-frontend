import CompetitieLayout from '@/components/layout/competitieLayout';
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
  updateUserTeamCyclists,
} from '@/features/user-teams/user-teams.slice';
import { AppDispatch, RootState } from '@/store/store';
import {
  CompetitionDTO,
  CompetitionPick,
  CompetitionStatus,
} from '@/types/competition';
import { CyclistDTO } from '@/types/cyclist';
import { UserTeamDTO } from '@/types/user-team';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { UserDTO } from '@/types/user';
import { fetchUsers, resetUsersStatus } from '@/features/users/users.slice';
import { confirmPopup } from 'primereact/confirmpopup';
import SelectingPhase from '@/components/SelectingPhase';
import SortingPhase from '@/components/SortingPhase';
import { container } from '@/const/containerStyle';
import StartedPhase from '@/components/StartedPhase';
import { UserPlus, UserX } from 'lucide-react';
import { MainReservePointsCyclist, PointsPerCyclist } from '@/types/points';
import { Button } from 'primereact/button';
import LoadingOverlay from '@/components/LoadingOverlay';
import {
  fetchRacePointsForAllRaces,
  fetchStagePointsForAllStages,
  resetPointsStatus,
  updateMainReservePointsCyclist,
} from '@/features/points/points.slice';
import CountryBodyTemplate from '@/components/template/CountryBodyTemplate';
import ItemTemplate from '@/components/template/ItemTemplate';

const index = () => {
  const router = useRouter();
  const { competitionId } = router.query;
  const [usersState, setUsersState] = useState<UserDTO[]>([]);
  const [cyclistsState, setCyclistsState] = useState<CyclistDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCyclist, setSelectedCyclist] = useState<CyclistDTO | null>(
    null,
  );
  const [reserveCyclistCount, setReserveCyclistCount] = useState<number>(0);
  const [cyclistCount, setCyclistCount] = useState<number>(0);
  const [mainTeamPopupVisible, setMainTeamPopupVisible] =
    useState<boolean>(false);
  const [confirmTarget, setConfirmTarget] = useState<Element | null>(null);
  const [initialPoints, setInitialPoints] =
    useState<MainReservePointsCyclist | null>(null);
  const [teamChanged, setTeamChanged] = useState<boolean>(false);
  const usersStatus = useSelector((state: RootState) => state.users.status);
  const userTeamsStatus = useSelector(
    (state: RootState) => state.userTeams.status,
  );
  const cyclistsStatus = useSelector(
    (state: RootState) => state.cyclists.status,
  );
  const pointsStatus = useSelector((state: RootState) => state.points.status);
  const mainReservePointsCyclist = useSelector(
    (state: RootState) => state.points.mainReservePointsCyclist,
  );
  const cyclists: CyclistDTO[] = useSelector(
    (state: RootState) => state.cyclists.data,
  );
  const user: UserDTO | null = useSelector(
    (state: RootState) => state.user.userDTO,
  );
  const users: UserDTO[] = useSelector((state: RootState) => state.users.data);
  const userTeams: UserTeamDTO[] = useSelector(
    (state: any) => state.userTeams.data,
  );
  const competition: CompetitionDTO | null = useSelector(
    (state: any) => state.competition.competitionDTO,
  );
  const competitionRef = useRef<CompetitionDTO | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  const hasFetched = useRef(false);
  const email = sessionStorage.getItem('email');
  const dispatch = useDispatch<AppDispatch>();

  // Set competition ref when competition changes
  useEffect(() => {
    if (competition) {
      competitionRef.current = competition;
    }
  }, [competition]);

  useEffect(() => {
    if (!competition || !user || hasFetched.current) return;

    const fetchAction =
      competition?.races[0]?.stages.length === 0
        ? fetchRacePointsForAllRaces
        : fetchStagePointsForAllStages;

    dispatch(
      fetchAction({
        competitionId: competition.id,
        userId: user.id,
      }),
    );

    hasFetched.current = true;
  }, [competition, user, dispatch]);

  useEffect(() => {
    if (mainReservePointsCyclist && !initialPoints) {
      setInitialPoints(mainReservePointsCyclist);
    }
  }, [mainReservePointsCyclist, initialPoints]);

  // Reset when competition changes AND cleanup on unmount
  useEffect(() => {
    // Reset when competition ID changes
    setInitialPoints(null);
    setTeamChanged(false);

    // Also cleanup on unmount
    return () => {
      setInitialPoints(null);
      setTeamChanged(false);
    };
  }, [competitionId]);

  // Filter cyclists and set cyclist limits when data is available
  useEffect(() => {
    if (cyclistsStatus === 'succeeded' && cyclists && userTeams) {
      const filteredUserTeams = userTeams.filter(
        (userTeam: UserTeamDTO) => userTeam.competitionId === competition?.id,
      );
      const filteredCyclists = cyclists.filter((cyclist) => {
        return !filteredUserTeams.some((userTeam: UserTeamDTO) =>
          userTeam.cyclistAssignments
            .map((assignment) => assignment.cyclist)
            .some(
              (teamCyclist) => teamCyclist.name.trim() === cyclist.name.trim(),
            ),
        );
      });
      setCyclistsState(filteredCyclists);
    }
  }, [dispatch, cyclists, userTeams, cyclistsStatus]);

  // Set cyclist count limits when competition data is available
  useEffect(() => {
    if (competition?.maxMainCyclists && competition?.maxReserveCyclists) {
      setCyclistCount(competition.maxMainCyclists);
      setReserveCyclistCount(competition.maxReserveCyclists);
    }
  }, [competition?.maxMainCyclists, competition?.maxReserveCyclists]);

  // Sort users based on pick order when data is available
  useEffect(() => {
    if (usersStatus === 'succeeded' && competition?.competitionPicks) {
      const sortedUsers = competition.competitionPicks
        .slice() // clone the array to avoid mutating the original
        .sort((a, b) => a.pickOrder - b.pickOrder)
        .map((pick: CompetitionPick) =>
          users.find((user) => user.id === pick.userId),
        )
        .filter((user): user is UserDTO => user !== null);

      setUsersState(sortedUsers);
      resetUsersStatus();
    }
  }, [competition?.competitionPicks, usersStatus, users]);

  // Fetch all required data when missing - Combined fetch effects
  useEffect(() => {
    if (!users || usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
    if (!cyclists || cyclistsStatus === 'idle') {
      dispatch(fetchCyclists());
    }
    if (
      !mainReservePointsCyclist &&
      pointsStatus === 'idle' &&
      user &&
      competition
    ) {
      const fetchAction =
        competition?.races[0].stages.length === 0
          ? fetchRacePointsForAllRaces
          : fetchStagePointsForAllStages;
      dispatch(
        fetchAction({
          competitionId: competition.id,
          userId: user.id,
        }),
      );
    }
    if (userTeams.length === 0 || !userTeams || userTeamsStatus === 'idle') {
      dispatch(fetchUserTeam());
    }
  }, [
    users,
    usersStatus,
    cyclists,
    cyclistsStatus,
    userTeams,
    userTeamsStatus,
    pointsStatus,
    mainReservePointsCyclist,
    user,
    competition,
    dispatch,
  ]);

  // Set loading state based on cyclists status - Simplified
  useEffect(() => {
    setLoading(cyclistsStatus === 'loading');
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
      dispatch(
        fetchCompetitionById(
          Number(
            Array.isArray(competitionId) ? competitionId[0] : competitionId,
          ),
        ),
      );
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
            cyclistId: number;
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
          dispatch(resetPointsStatus());
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
    if (!initialPoints || !mainReservePointsCyclist) {
      return;
    }
    const isEqual =
      JSON.stringify(initialPoints) ===
      JSON.stringify(mainReservePointsCyclist);
    setTeamChanged(!isEqual);
  }, [initialPoints, mainReservePointsCyclist]);

  useEffect(() => {
    if (!competition || !userTeams) {
      return;
    }
    const mainCyclistsCount = userTeams
      .filter((userTeam) => userTeam.competitionId === competition.id)
      .reduce(
        (count: number, team: UserTeamDTO) =>
          count + team.cyclistAssignments.length,
        0,
      );
    if (mainCyclistsCount === 0) return;
    if (
      mainCyclistsCount ===
      competition.maxMainCyclists *
        userTeams.filter(
          (userTeam) => userTeam.competitionId === competition.id,
        ).length
    ) {
      setMainTeamPopupVisible(true);
    } else {
      setMainTeamPopupVisible(false);
    }
  }, [userTeams, competition]);

  useEffect(() => {
    if (selectedCyclist && confirmTarget) {
      confirmPopup({
        target: confirmTarget as HTMLElement,
        message: `Ben je zeker dat je ${selectedCyclist.name} wilt kiezen?`,
        icon: 'pi pi-exclamation-triangle',
        defaultFocus: 'accept',
        accept: () => {
          if (stompClientRef.current === null || !competition) {
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
    if (stompClientRef.current === null || !competition) {
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

    if (!client || !client.connected || !competition) {
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

  const handleUsersChange = (users: UserDTO[]) => {
    setUsersState(users);
    if (stompClientRef.current === null || !competition) {
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

  const handleDeactivateMain = (PointsPerCyclist: PointsPerCyclist) => {
    if (!mainReservePointsCyclist) {
      return;
    }

    const { cyclistId, cyclistName } = PointsPerCyclist;

    const updatedMainReservePointsCyclist: MainReservePointsCyclist = {
      mainCyclists: mainReservePointsCyclist.mainCyclists.filter(
        (cyclist) => cyclist.cyclistId !== cyclistId,
      ),
      reserveCyclists: [
        ...mainReservePointsCyclist.reserveCyclists,
        {
          cyclistName,
          cyclistId,
          points: 0,
          isCyclistActive: false,
          userId: 0,
        },
      ],
    };

    dispatch(updateMainReservePointsCyclist(updatedMainReservePointsCyclist));
  };

  const handleActivateReserve = (PointsPerCyclist: PointsPerCyclist) => {
    if (!mainReservePointsCyclist) {
      return;
    }

    const { cyclistId, cyclistName } = PointsPerCyclist;

    const updatedMainReservePointsCyclist: MainReservePointsCyclist = {
      mainCyclists: [
        ...mainReservePointsCyclist.mainCyclists,
        {
          cyclistName,
          cyclistId,
          points: 0,
          isCyclistActive: true,
          userId: 0,
        },
      ],
      reserveCyclists: mainReservePointsCyclist.reserveCyclists.filter(
        (cyclist) => cyclist.cyclistId !== cyclistId,
      ),
    };

    dispatch(updateMainReservePointsCyclist(updatedMainReservePointsCyclist));
  };

  const handleSubmitTeamChanges = () => {
    if (!mainReservePointsCyclist || !competition || !email) {
      return;
    }
    const mainCyclistIds = mainReservePointsCyclist?.mainCyclists.map(
      (Point: PointsPerCyclist) => Point.cyclistId,
    );
    const userTeam = userTeams.find(
      (team) =>
        team.user.email === email && team.competitionId === competition.id,
    );
    if (!userTeam) {
      return;
    }
    const reserveCyclistIds = mainReservePointsCyclist?.reserveCyclists.map(
      (Point: PointsPerCyclist) => Point.cyclistId,
    );

    dispatch(
      postUpdateUserTeamMainCyclists({
        mainCyclistIds,
        reserveCyclistIds,
        userTeamId: userTeam.id,
      }),
    );
  };

  const handleResetChanges = () => {
    if (!initialPoints) {
      return;
    }
    console.log('Resetting changes to initial points', initialPoints);
    dispatch(updateMainReservePointsCyclist(initialPoints));
  };

  const cyclistDeactivateTemplate = (rowData: PointsPerCyclist) => {
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

  const activateCyclistTemplate = (rowData: PointsPerCyclist) => {
    if (!mainReservePointsCyclist || !competition) {
      return;
    }
    if (
      mainReservePointsCyclist?.reserveCyclists.length >
        competition.maxReserveCyclists &&
      rowData.isCyclistActive === true
    ) {
      return (
        <>
          <Button
            label="Activeer"
            size="small"
            icon={() => <UserPlus size={16} className="mr-2 stroke-[2.5]" />}
            raised
            onClick={() => handleActivateReserve(rowData)}
          />
        </>
      );
    } else {
      return <></>;
    }
  };

  if (
    !competition ||
    userTeams === null ||
    (competition.competitionStatus === CompetitionStatus.STARTED &&
      cyclistsState.length === 0) ||
    (competition.competitionStatus === CompetitionStatus.STARTED &&
      !mainReservePointsCyclist) ||
    (competition.competitionStatus === CompetitionStatus.STARTED &&
      !initialPoints)
  ) {
    return (
      <>
        <LoadingOverlay />
      </>
    );
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
          itemTemplate={ItemTemplate}
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
          countryBodyTemplate={CountryBodyTemplate}
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
          competition={competition}
          handleSubmitTeamChanges={handleSubmitTeamChanges}
          cyclistDeactivateTemplate={cyclistDeactivateTemplate}
          resetChanges={() => handleResetChanges()}
          activateCyclistTemplate={activateCyclistTemplate}
          teamChanged={teamChanged}
          mainReservePointsCyclist={mainReservePointsCyclist}
        />
      </>
    );
  }
};

index.getLayout = (page: ReactNode) => (
  <CompetitieLayout>{page}</CompetitieLayout>
);

export default index;
